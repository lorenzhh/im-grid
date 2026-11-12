import { Directionality } from '@angular/cdk/bidi';
import { Clipboard } from '@angular/cdk/clipboard';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { formatNumber } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  TemplateRef,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ThemeType } from '@ant-design/icons-angular';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import {
  NzContextMenuService,
  NzDropdownModule,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzResizableModule, NzResizeEvent } from 'ng-zorro-antd/resizable';
import { NzTableComponent, NzTableModule, NzTableSortOrder } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { EMPTY, Observable, Subject, fromEvent, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  take,
  throttleTime,
} from 'rxjs/operators';
import { randomUuid } from '../../helpers/generator';
import { isListableColumn, isSearchableColumn, rowShouldBeFiltered, sortRows } from '../../helpers/table.helper';
import { highlightXml } from '../../helpers/xml.helper';
import {
  CellCoordinates,
  ChangeEvent,
  ChangesEvent,
  DynamicComponentConfig,
  EditMode,
  ImAction,
  ImButton,
  ImColumn,
  ImColumnType,
  ImFieldType,
  ImFilterType,
  ImTrack,
  SelectionMode,
  Size,
} from '../../models/column.model';
import { IM_GRID_ICONS, NgZorroAntdModule } from '../../modules/ng-zorro.module';
import { FormatPipe } from '../../pipes/format.pipe';
import { ImTextPipe } from '../../pipes/text.pipe';
import { FormatService } from '../../services/format.service';
import { ImGridI18n, ImText } from '../../i18n/im-grid-i18n';
import { ImGridTexts } from '../../i18n/im-grid-texts';
import { ImSummaryResult, ImSummaryValue } from '../../models/summary.model';
import { CellComponent, isCenteredColumn, isNumericColumn } from './cell/cell.component';
import { ImDrawerComponent } from './drawer/drawer.component';
import { EditFormComponent, formFieldsOf } from './edit-form/edit-form.component';
import { ImFilterCellComponent } from './filter-cell/filter-cell.component';
import { ImFooterComponent } from './footer/footer.component';
import { ImToolbarComponent } from './toolbar/toolbar.component';

/** Row heights (px) per density. Must match the rendered row height for virtual scrolling. */
const ROW_HEIGHTS: Record<Size, number> = {
  small: 32,
  middle: 38,
  default: 44,
};

const ACTION_BUTTON_SIZE = 28;
const ACTION_BUTTON_GAP = 2;
const ACTION_CELL_PADDING = 16;

export interface Edit<T> {
  [key: number]: {
    edit: boolean;
    row?: T;
    changed?: boolean;
    deleted?: boolean;
    new?: boolean;
  };
}

interface SortState {
  /** key of the column header showing the sort arrow */
  columnKey: string;
  /** row property the rows are sorted by */
  sortKey: string;
  ascending: boolean;
}

@Component({
  imports: [
    ImToolbarComponent,
    FormsModule,
    NzIconModule,
    NzButtonModule,
    ImFilterCellComponent,
    EditFormComponent,
    NzDropdownModule,
    NzInputModule,
    NzPopconfirmModule,
    NzTooltipModule,
    NzCheckboxModule,
    NzPopoverModule,
    NgZorroAntdModule,
    ImFooterComponent,
    ImDrawerComponent,
    FormatPipe,
    CellComponent,
    DragDropModule,
    NzTableModule,
    ImTextPipe,
    NzResizableModule,
  ],
  selector: 'im-grid',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ImGridI18n, FormatService],
  host: {
    '(document:click)': 'clickout()',
    '(document:keydown)': 'handleCellShortcuts($event)',
    '(document:keydown.ArrowUp)': 'handleEvent($event)',
    '(document:keydown.ArrowRight)': 'handleEvent($event)',
    '(document:keydown.ArrowDown)': 'handleEvent($event)',
    '(document:keydown.ArrowLeft)': 'handleEvent($event)',
  },
})
export class ImGridComponent<T extends { isNew?: boolean }> {
  private formBuilder = inject(FormBuilder);
  private modalService = inject(NzModalService);
  private formatService = inject(FormatService);
  private messageService = inject(NzMessageService);
  private destroyRef = inject(DestroyRef);
  readonly i18n = inject(ImGridI18n);
  /** Texts for the current language (app config + this grid's `[texts]`). */
  readonly texts = this.i18n.texts;
  private nzContextMenuService = inject(NzContextMenuService);
  private directionality = inject(Directionality, { optional: true });
  private clipboard = inject(Clipboard);

  readonly createEditModal = viewChild<TemplateRef<any>>('createEditModal');
  readonly modalFooter = viewChild<TemplateRef<any>>('modalFooter');
  readonly modalTitle = viewChild<TemplateRef<any>>('modalTitle');
  readonly valueTitle = viewChild<TemplateRef<any>>('valueTitle');
  readonly valueContent = viewChild<TemplateRef<any>>('valueContent');
  readonly valueFooter = viewChild<TemplateRef<any>>('valueFooter');
  readonly table = viewChild<NzTableComponent<T>>('virtualTable');

  /** Column configuration from the parent. Replacing it resets the grid's column state. */
  readonly columnsInput = input<ImColumn[]>(undefined, { alias: 'columns' });
  /** Emits the grid's working columns whenever it changes them (filters, widths, order, visibility). */
  readonly columnsChange = output<ImColumn[]>();
  readonly buttons = input<ImButton[]>(undefined);
  readonly editMode = input(EditMode.Direct);
  readonly selection = input(SelectionMode.Checkbox);
  readonly dataSource$ = input<Observable<T[]>>(undefined);
  readonly label = input<ImText>(undefined);
  readonly editIcon = input<string>(undefined);
  readonly editTheme = input<ThemeType>(undefined);
  readonly deleteIcon = input<string>(undefined);
  readonly deleteTheme = input<ThemeType>(undefined);
  readonly showToolbar = input(true);
  readonly loading = input(false);
  readonly showRowIndex = input(true);
  readonly allowDelete = input(true);
  readonly allowEdit = input(true);
  readonly customEdit = input(false);
  readonly disableSearch = input(true);
  readonly customCreate = input(false);
  readonly customDelete = input(false);
  readonly allowCreate = input(true);
  readonly clearSearchOnChanges = input(true);
  readonly enableNotifications = input(true);
  readonly childAllowCreate = input(true);
  readonly childAllowEdit = input(true);
  readonly childAllowDelete = input(true);
  readonly size = model<Size>('default');
  /** Overrides some texts for this grid only, e.g. `{ new: 'New coupon' }`. */
  readonly textOverrides = input<Partial<ImGridTexts>>(undefined, { alias: 'texts' });

  readonly selectedIds = output<{
    [key: string]: boolean;
  }>();
  readonly save = output<ChangesEvent>();
  readonly deleted = output<ChangeEvent>();
  readonly created = output<ChangeEvent>();
  readonly updated = output<ChangeEvent>();
  readonly customUpdatedRow = output<T>();
  readonly customDeletedRow = output<T>();
  readonly customCreatedRow = output<void>();

  public ImFilterType = ImFilterType;
  public ImColumnType = ImColumnType;
  public ImFieldType = ImFieldType;
  public EditMode = EditMode;
  public SelectionMode = SelectionMode;
  public form: FormGroup;

  /* ------------------------------------------------------------------ */
  /* State                                                               */
  /* ------------------------------------------------------------------ */

  /** Rows as delivered by the data source (baseline for "discard changes"). */
  readonly originalRows = signal<T[]>([]);
  /** Rows including pending edits / additions / deletions. */
  readonly currentRows = signal<T[]>([]);
  /** Pending changes, keyed by the row's unique value. */
  readonly editCache = signal<Edit<T>>({});
  readonly mapOfCheckedId = signal<{ [key: string]: boolean }>({});

  /**
   * The grid's working copy of the columns. It follows the `columns` input, so a new input
   * replaces it, while the grid's own updates (filters, widths, order, visibility) are plain
   * writes that leave the input alone.
   */
  readonly columns = linkedSignal(() => this.normalizeConfig(this.columnsInput()));

  /** Global search text; two-way bound to the search box. */
  readonly searchTerm = signal('');
  /** The search text actually applied (debounced while typing). */
  readonly activeSearch = signal('');
  readonly notIncludedColumns = signal<ImColumn[]>([]);
  private readonly sortState = signal<SortState | null>(null);

  readonly allowSearch = signal(false);
  readonly scrollIndex = signal<number | null>(null);
  readonly resizing = signal(false);
  readonly drawerVisible = signal(false);
  readonly childrenTitle = signal<ImText>(null);
  readonly componentConfig = signal<DynamicComponentConfig>(undefined);
  readonly focusedCell = signal<CellCoordinates>({ rowIndex: -1, key: null });

  /* ------------------------------------------------------------------ */
  /* Derived state                                                       */
  /* ------------------------------------------------------------------ */

  readonly isRtl = computed(() => this.directionality?.valueSignal() === 'rtl');

  /** Width of the grid itself (not the window), so it also adapts inside narrow panels. */
  private readonly hostWidth = signal(Infinity);
  /** Narrow layout: row actions collapse into one menu. */
  readonly compact = computed(() => this.hostWidth() < 640);

  /**
   * Sticky sides for the lead (row number / checkbox) and actions columns. They stick to the
   * physical edge matching the reading direction, and not at all in the compact layout, where
   * pinned columns would take too much of the narrow width.
   */
  readonly stickyStart = computed(() => {
    const stick = this.compact() ? false : '0px';
    return this.isRtl() ? { left: false, right: stick } : { left: stick, right: false };
  });
  readonly stickyEnd = computed(() => {
    const stick = this.compact() ? false : '0px';
    return this.isRtl() ? { left: stick, right: false } : { left: false, right: stick };
  });

  readonly hasRowActions = computed(
    () =>
      this.allowEdit() ||
      this.allowDelete() ||
      !!this.buttons()?.length ||
      !!this.childrenKey()
  );
  readonly height = computed(() => ROW_HEIGHTS[this.size()] ?? ROW_HEIGHTS.default);

  readonly visibleColumns = computed(() =>
    (this.columns() ?? []).filter(column => column.visible && !column.hidden)
  );
  /** Columns the user may show/hide (programmatically hidden ones are excluded). */
  readonly chooserColumns = computed(() =>
    (this.columns() ?? []).filter(
      column =>
        !column.hidden &&
        !column.childrenConfig &&
        isListableColumn(column, !!this.i18n.translate(column.title))
    )
  );
  readonly visibleColumnsCount = computed(
    () => this.chooserColumns().filter(column => column.visible).length
  );
  readonly hiddenColumnsCount = computed(
    () => this.chooserColumns().length - this.visibleColumnsCount()
  );

  readonly uniqueKey = computed(() => this.columns()?.find(column => column.isUnique)?.key);
  private readonly childrenColumn = computed(() =>
    this.columns()?.find(column => column.childrenConfig)
  );
  readonly childrenKey = computed(() => this.childrenColumn()?.key ?? null);
  readonly childColumns = computed(
    () => this.childrenColumn()?.childrenConfig.columns ?? null
  );

  readonly activeFilterColumns = computed(() =>
    (this.columns() ?? []).filter(column =>
      column.filter?.values?.some((value: unknown) => value != null && value !== '')
    )
  );
  readonly hasActiveFilters = computed(() => this.activeFilterColumns().length > 0);
  /** Keys of columns with an active filter (marked in the header). */
  readonly filteredKeys = computed(
    () => new Set(this.activeFilterColumns().map(column => column.key))
  );

  /** There is data, but search / filters hide all of it. */
  readonly isFilteredEmpty = computed(
    () => this.currentRows().length > 0 && this.rows().length === 0
  );

  /* placeholder rows while the first data loads */
  readonly skeletonRows = Array.from({ length: 8 });
  readonly skeletonCells = [70, 45, 85, 55, 65, 40];

  /** Value shown in the cell-value dialog. */
  readonly valueDialog = signal<{ title: string; text: string; html: string | null } | null>(
    null
  );
  readonly valueCopied = signal(false);
  private valueCopiedTimeout: ReturnType<typeof setTimeout>;

  /** Rows after search and column filters. */
  private readonly filteredRows = computed(() => {
    const rows = this.currentRows();
    const search = this.activeSearch();
    const filterColumns = this.activeFilterColumns();
    if (!search && filterColumns.length === 0) {
      return rows;
    }

    let result = rows;
    for (const column of filterColumns) {
      result = result.filter(row => rowShouldBeFiltered(row, column));
    }

    if (search) {
      const needle = search.toString().toLowerCase();
      const excluded = new Set(this.notIncludedColumns().map(column => column.key));
      const searchable = this.columns().filter(
        column => isSearchableColumn(column) && !excluded.has(column.key)
      );
      result = result.filter(row =>
        searchable.some(
          column =>
            row[column.key] != null &&
            row[column.key].toString().toLowerCase().includes(needle)
        )
      );
    }
    return result;
  });

  /** Rows as displayed: filtered, then sorted. */
  readonly rows = computed(() => {
    const sort = this.sortState();
    const rows = this.filteredRows();
    return sort ? sortRows(rows, sort.sortKey, sort.ascending) : rows;
  });

  readonly numberOfChecked = computed(() => {
    const checked = this.mapOfCheckedId();
    const key = this.uniqueKey();
    return this.rows().filter(row => checked[row[key]]).length;
  });
  readonly isAllDisplayDataChecked = computed(() => {
    const checked = this.mapOfCheckedId();
    const key = this.uniqueKey();
    const rows = this.rows();
    return rows.length !== 0 && rows.every(row => checked[row[key]]);
  });
  readonly isIndeterminate = computed(
    () => this.numberOfChecked() > 0 && !this.isAllDisplayDataChecked()
  );

  private readonly unsavedRows = computed(() =>
    Object.values(this.editCache())
      .filter(entry => entry.changed && !entry.deleted && !entry.new)
      .map(entry => entry.row)
  );
  private readonly deletedRowIds = computed(() => {
    const cache = this.editCache();
    return Object.keys(cache).filter(id => cache[id].deleted);
  });
  private readonly newRows = computed(() =>
    Object.values(this.editCache())
      .filter(entry => entry.new && !entry.deleted)
      .map(entry => entry.row)
  );
  readonly unsavedRowsLength = computed(() => this.unsavedRows().length);
  readonly deletedRowsLength = computed(() => this.deletedRowIds().length);
  readonly newRowsLength = computed(() => this.newRows().length);

  /** Width of the sticky lead column (row number / selection checkbox). */
  public readonly LEAD_WIDTH = 52;

  /** Row number and selection checkbox share one sticky column. */
  readonly hasLeadColumn = computed(
    () => this.showRowIndex() || this.selection() === SelectionMode.Checkbox
  );

  /** Width of the sticky actions column, sized to the number of row actions. */
  readonly actionsWidth = computed(() => {
    // narrow grids show a single "more" button that opens every action
    const count = this.compact()
      ? Number(this.hasRowActions())
      : (this.allowEdit() ? 1 : 0) +
        (this.allowDelete() ? 1 : 0) +
        (this.buttons()?.length ? 1 : 0) +
        (this.childrenKey() ? 1 : 0);
    // the header cell holds the column chooser (+ filter toggle without toolbar)
    const headerCount =
      1 + (!this.showToolbar() && this.disableSearch() === false ? 1 : 0);
    const buttonsWidth =
      count * ACTION_BUTTON_SIZE + Math.max(0, count - 1) * ACTION_BUTTON_GAP;
    const headerWidth =
      headerCount * ACTION_BUTTON_SIZE + (headerCount - 1) * ACTION_BUTTON_GAP;
    return Math.max(headerWidth, buttonsWidth) + ACTION_CELL_PADDING;
  });

  /** The summary row is shown as soon as one visible column defines a `summary`. */
  readonly hasSummary = computed(() => this.visibleColumns().some(column => !!column.summary));

  /** One entry per visible column, recomputed when rows, filters, columns or language change. */
  readonly summaryCells = computed(() => {
    if (!this.hasSummary()) {
      return [];
    }
    const rows = this.rows();
    const allRows = this.currentRows();
    const texts = this.texts();

    return this.visibleColumns().map(column => {
      if (!column.summary) {
        return { key: column.key, label: '', text: '' };
      }
      let result: ImSummaryResult;
      try {
        result = column.summary({
          rows,
          allRows,
          values: rows.map(row => row[column.key]),
          column,
          texts,
        });
      } catch (error) {
        console.error(`im-grid: summary of column "${column.key}" failed`, error);
        result = null;
      }
      return { key: column.key, ...this.renderSummary(result, column) };
    });
  });

  readonly columnsWidth = computed(() => {
    const fixedWidth = (this.hasLeadColumn() ? this.LEAD_WIDTH : 0) + this.actionsWidth();
    return this.visibleColumns()
      .filter(column => !column.childrenConfig)
      .reduce((total, column) => total + column.width, fixedWidth);
  });

  /* ------------------------------------------------------------------ */

  private modal: NzModalRef;
  private successSubject$: Subject<ImTrack> = new Subject<ImTrack>();
  private bodyFocused = false;
  private clickedInsideOfBody = false;
  private arrowKeys = new Subject<Event>();
  private resizeFrame = 0;

  /* context menu active row */
  public activeRow: T;

  constructor() {
    inject(NzIconService).addIcon(...IM_GRID_ICONS);

    // follow the grid's own width (no-op where ResizeObserver doesn't exist, e.g. SSR)
    if (typeof ResizeObserver !== 'undefined') {
      const host: HTMLElement = inject(ElementRef).nativeElement;
      const observer = new ResizeObserver(([entry]) => {
        this.hostWidth.set(entry.contentRect.width);
        this.measureScrollbarGutter(host);
      });
      observer.observe(host);
      inject(DestroyRef).onDestroy(() => observer.disconnect());
    }
    this.i18n.useOverrides(this.textOverrides);

    this.arrowKeys
      .pipe(throttleTime(50), takeUntilDestroyed())
      .subscribe((event: KeyboardEvent) => this.handleArrowKeyboardEvent(event));

    fromEvent(window, 'resize')
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe(() => {
        this.table()?.cdkVirtualScrollViewport?.checkViewportSize();
      });

    // typing is debounced; programmatic changes (see reset) are applied immediately
    toObservable(this.searchTerm)
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(term => this.activeSearch.set(term));

    // data source: follows the input, and re-subscribes when a new source is passed
    toObservable(this.dataSource$)
      .pipe(
        switchMap(source => source ?? EMPTY),
        takeUntilDestroyed()
      )
      .subscribe(rows => {
        this.originalRows.set([...rows]);
        this.currentRows.set([...rows]);
        this.reset();
      });

    // the parent passed new columns: drop everything that belonged to the old ones
    let firstColumns = true;
    effect(() => {
      this.columnsInput();
      untracked(() => {
        if (firstColumns) {
          firstColumns = false;
          return;
        }
        this.form = null;
        if (this.modal) {
          this.closeModal();
        }
        if (this.drawerVisible()) {
          this.closeDrawer();
        }
        this.sortState.set(null);
        this.notIncludedColumns.set([]);
      });
    });

    // report the grid's own column changes to the parent
    effect(() => {
      const columns = this.columns();
      untracked(() => {
        if (columns !== this.columnsInput()) {
          this.columnsChange.emit(columns);
        }
      });
    });

    effect(() => {
      const checked = this.mapOfCheckedId();
      untracked(() => this.selectedIds.emit(checked));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Keyboard navigation                                                 */
  /* ------------------------------------------------------------------ */

  private getNeighborColumn(key: string, forward: boolean): ImColumn {
    const columns = this.visibleColumns();
    const currentColumnIndex = columns.findIndex(column => column.key === key);
    return columns.find((_, index) =>
      forward ? index > currentColumnIndex : index === currentColumnIndex - 1
    );
  }

  private handleArrowKeyboardEvent(event: KeyboardEvent) {
    const { rowIndex, key } = this.focusedCell();
    if (rowIndex < 0) {
      return;
    }

    // in RTL the visual "previous" column is to the right
    const previousKey = this.isRtl() ? 'ArrowRight' : 'ArrowLeft';
    const nextKey = this.isRtl() ? 'ArrowLeft' : 'ArrowRight';

    let targetRow = rowIndex;
    let targetKey = key;

    switch (event.key) {
      case previousKey:
        targetKey = this.getNeighborColumn(key, false)?.key ?? key;
        break;
      case nextKey:
        targetKey = this.getNeighborColumn(key, true)?.key ?? key;
        break;
      case 'ArrowUp':
        targetRow = Math.max(0, rowIndex - 1);
        break;
      case 'ArrowDown':
        targetRow = Math.min(this.rows().length - 1, rowIndex + 1);
        break;
      default:
        return;
    }

    if (targetRow !== rowIndex || targetKey !== key) {
      this.updateFocusedCell(targetRow, targetKey);
      this.scrollCellIntoView(targetRow, targetKey);
    }
  }

  /**
   * Scrolls the viewport just enough to reveal a cell, and only if it isn't fully visible.
   * Works from row height / column widths (rows are virtual, so they may not be in the DOM)
   * and accounts for the sticky lead and actions columns covering the edges.
   */
  private scrollCellIntoView(rowIndex: number, key: string) {
    const element: HTMLElement =
      this.table().cdkVirtualScrollViewport.elementRef.nativeElement;
    const rowHeight = this.height();

    /* vertical */
    const rowTop = rowIndex * rowHeight;
    const rowBottom = rowTop + rowHeight;
    if (rowTop < element.scrollTop) {
      element.scrollTop = rowTop;
    } else if (rowBottom > element.scrollTop + element.clientHeight) {
      element.scrollTop = rowBottom - element.clientHeight;
    }

    /* horizontal – measured in the reading direction (start → end) */
    const leadWidth = this.hasLeadColumn() ? this.LEAD_WIDTH : 0;
    const visibleColumns = this.visibleColumns();
    const columnIndex = visibleColumns.findIndex(column => column.key === key);
    if (columnIndex < 0) {
      return;
    }

    const columnStart =
      leadWidth +
      visibleColumns
        .slice(0, columnIndex)
        .reduce((total, column) => total + column.width, 0);
    const columnEnd = columnStart + visibleColumns[columnIndex].width;

    // RTL scroll containers use negative scrollLeft values
    const rtl = this.isRtl();
    const scrolled = rtl ? -element.scrollLeft : element.scrollLeft;
    const visibleStart = scrolled + leadWidth;
    const visibleEnd = scrolled + element.clientWidth - this.actionsWidth();

    let nextScroll = scrolled;
    if (columnStart < visibleStart) {
      nextScroll = columnStart - leadWidth;
    } else if (columnEnd > visibleEnd) {
      nextScroll = columnEnd - (element.clientWidth - this.actionsWidth());
    }

    if (nextScroll !== scrolled) {
      nextScroll = Math.max(0, nextScroll);
      element.scrollLeft = rtl ? -nextScroll : nextScroll;
    }
  }

  updateFocusedCell(rowIndex: number, key: string) {
    this.focusedCell.set({ rowIndex, key });
  }

  scrollToIndex(index: number): void {
    this.table().cdkVirtualScrollViewport.scrollToIndex(+index);
  }

  /* ------------------------------------------------------------------ */
  /* Columns                                                             */
  /* ------------------------------------------------------------------ */

  resizeStart() {
    this.resizing.set(true);
  }

  resizeEnd() {
    setTimeout(() => this.resizing.set(false), 100);
  }

  onResize({ width }: NzResizeEvent, column: ImColumn): void {
    cancelAnimationFrame(this.resizeFrame);
    this.resizeFrame = requestAnimationFrame(() =>
      this.updateColumn(column.key, { width })
    );
  }

  toggleColumnVisibility(column: ImColumn, visible: boolean) {
    this.updateColumn(column.key, { visible });
  }

  /** Immutable column update, so every signal / OnPush consumer notices the change. */
  private updateColumn(key: string, changes: Partial<ImColumn>) {
    this.columns.update(columns =>
      columns.map(column => (column.key === key ? { ...column, ...changes } : column))
    );
  }

  public drop(event: CdkDragDrop<string[]>): void {
    this.columns.update(columns => [
      ...this.dragEndEvent(event, [...columns], this.visibleColumns()),
    ]);
  }

  toggleFilters() {
    this.allowSearch.update(open => !open);
  }

  isNumeric(column: ImColumn): boolean {
    return isNumericColumn(column);
  }

  isCentered(column: ImColumn): boolean {
    return isCenteredColumn(column);
  }

  /* ------------------------------------------------------------------ */
  /* Sorting & filtering                                                 */
  /* ------------------------------------------------------------------ */

  sortOrderOf(column: ImColumn): NzTableSortOrder {
    const sort = this.sortState();
    if (sort?.columnKey !== column.key) {
      return null;
    }
    return sort.ascending ? 'ascend' : 'descend';
  }

  public sort(column: ImColumn, order: NzTableSortOrder) {
    if (order) {
      this.sortState.set({
        columnKey: column.key,
        sortKey: column.sortKey ?? column.key,
        ascending: order === 'ascend',
      });
    } else if (this.sortState()?.columnKey === column.key) {
      this.sortState.set(null);
    }
  }

  setFilterValues(columnKey: string, values: unknown[]) {
    this.columns.update(columns =>
      columns.map(column =>
        column.key === columnKey
          ? { ...column, filter: { ...column.filter, values } }
          : column
      )
    );
  }

  public clearFilters() {
    this.clearColumnFilters();
    this.sortState.set(null);
  }

  /** "No matching rows" action: clears the search and every column filter (keeps the sort). */
  public clearSearchAndFilters() {
    this.searchTerm.set('');
    this.activeSearch.set('');
    this.clearColumnFilters();
  }

  private clearColumnFilters() {
    this.columns.update(columns =>
      columns.map(column => ({ ...column, filter: { ...column.filter, values: [] } }))
    );
  }

  /* ------------------------------------------------------------------ */
  /* Data & pending changes                                              */
  /* ------------------------------------------------------------------ */

  private reset() {
    this.editCache.set({});
    this.mapOfCheckedId.set({});

    if (this.clearSearchOnChanges()) {
      this.searchTerm.set('');
      this.activeSearch.set('');
    }

    this.setUniqueValues();
  }

  private setUniqueValues() {
    const hasSelectFilter = this.columns().some(
      column => column.filter?.type === ImFilterType.Select
    );
    if (!hasSelectFilter) {
      return;
    }
    this.columns.update(columns =>
      columns.map(column =>
        column.filter?.type === ImFilterType.Select
          ? {
              ...column,
              filter: {
                ...column.filter,
                selectValues: this.getUniqueSelectFilterValues(column),
              },
            }
          : column
      )
    );
  }

  private getUniqueSelectFilterValues(column: ImColumn): unknown[] {
    const rows = this.currentRows();
    if (column.columnType === ImColumnType.Array) {
      const uniques = [];
      rows.forEach(row => {
        row[column.key].forEach((item: unknown) => {
          const foundItem = uniques.find(unique =>
            unique && typeof unique === 'object'
              ? unique[column.valueProperty] === item[column.valueProperty]
              : unique === item
          );
          if (!foundItem) {
            uniques.push(item);
          }
        });
      });
      return uniques;
    }

    return rows
      .map(row => row[column.key])
      .filter((value, index, self) => value != null && self.indexOf(value) === index);
  }

  public resetRows() {
    this.currentRows.set([...this.originalRows()]);
    this.editCache.set({});
    this.createMessage('success', this.texts().discardedAllChanges);
  }

  public resetRow() {
    const key = this.uniqueKey();
    const id = this.form.getRawValue()[key];
    const originalRow = this.originalRows().find(row => row[key] === id);
    const exists = this.currentRows().some(row => row[key] === id);

    if (exists && originalRow) {
      this.currentRows.update(rows =>
        rows.map(row => (row[key] === id ? { ...originalRow } : row))
      );
      this.editCache.update(cache => ({
        ...cache,
        [id]: { row: { ...originalRow }, edit: false, changed: false },
      }));

      this.closeModal();
      this.createMessage('success', this.texts().discardedRow);
    }
  }

  public saveRows() {
    this.successSubject$
      .pipe(
        filter(success => success.action === ImAction.SaveAll),
        takeUntilDestroyed(this.destroyRef),
        take(1)
      )
      .subscribe(success => {
        if (success.data !== false) {
          this.originalRows.set([...success.data]);
          this.currentRows.set([...success.data]);
          this.reset();
        } else {
          this.showError();
        }
      });

    this.save.emit({
      saved: this.unsavedRows(),
      deletedIds: this.deletedRowIds(),
      new: this.newRows(),
      currentState: this.currentRows(),
      action: ImAction.SaveAll,
      track: this.successSubject$,
    });
  }

  public hasUnsavedChanges = () => {
    if (
      !this.form ||
      (this.unsavedRowsLength() + this.deletedRowsLength() + this.newRowsLength() === 0 &&
        !this.form.dirty)
    ) {
      return false;
    }
    return true;
  };

  /* ------------------------------------------------------------------ */
  /* Selection                                                           */
  /* ------------------------------------------------------------------ */

  public checkAll(value: boolean): void {
    const key = this.uniqueKey();
    this.mapOfCheckedId.update(checked => {
      const next = { ...checked };
      this.rows().forEach(row => (next[row[key]] = value));
      return next;
    });
  }

  public setChecked(row: T, value: boolean): void {
    this.mapOfCheckedId.update(checked => ({ ...checked, [row[this.uniqueKey()]]: value }));
  }

  /* ------------------------------------------------------------------ */
  /* Create / edit / delete                                              */
  /* ------------------------------------------------------------------ */

  public saveRow(event: Event, row: T) {
    event.preventDefault();
    this.validateAllFormFields(this.form);
    if (!this.form.valid) {
      return;
    }

    const key = this.uniqueKey();
    if (this.editMode() === EditMode.Direct) {
      this.successSubject$
        .pipe(
          filter(
            success =>
              success.action === ImAction.Update || success.action === ImAction.ADD
          ),
          takeUntilDestroyed(this.destroyRef),
          take(1)
        )
        .subscribe(success => {
          if (success.data !== false) {
            this.closeModal();
          } else {
            this.showError();
          }
        });

      row.isNew && row[key] == null
        ? this.created.emit({
            row: row,
            track: this.successSubject$,
            action: ImAction.ADD,
          })
        : this.updated.emit({
            row: row,
            track: this.successSubject$,
            action: ImAction.Update,
          });
    } else {
      row.isNew && row[key] == null ? this.addRow(row) : this.saveEdit(row);
      this.closeModal();
    }
  }

  private showError() {
    this.createMessage('error', this.texts().errorOccurred);
  }

  public resetForm(event: MouseEvent): void {
    event.preventDefault();
    this.resetAllFormFields(this.form);
  }

  private initForm(row?: T) {
    const form = this.formBuilder.group({});
    this.columns().forEach((column: ImColumn) => {
      const newControl = new FormControl(
        row
          ? { value: row[column.key], disabled: !column.editable }
          : { value: column.defaultValue, disabled: !column.creatable },
        column.validators,
        column.asyncValidators
      );
      form.addControl(column.key, newControl);

      if (column.columnType === ImColumnType.Date) {
        const formControl = form.get(column.key);
        formControl.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((value: Date) => {
            if (value && value instanceof Date && !isNaN(value.valueOf())) {
              formControl.setValue(value.toISOString(), { emitEvent: false });
            }
          });
      }
    });

    if (!row || row.isNew) {
      const isNewControl = new FormControl(true);
      form.addControl('isNew', isNewControl);
    }
    this.form = form;
  }

  /** Fills in defaults on the column configs (idempotent) and returns them. */
  private normalizeConfig(columns: ImColumn[]): ImColumn[] {
    (columns ?? []).forEach(column => {
      if (column.isUnique === true) {
        column.editable = false;
        column.creatable = false;
      }
      if (column.hidden === undefined) {
        column.hidden = false;
      }
      if (column.width === undefined) {
        switch (column.columnType) {
          case ImColumnType.Boolean:
            column.width = 130;
            break;
          case ImColumnType.Date:
            column.width = 260;
            break;
          default:
            column.width = 200;
        }
      }

      if (column.showSeconds === undefined) {
        column.showSeconds = true;
      }
      if (column.nzShowTime === undefined) {
        column.nzShowTime = true;
      }
      if (column.minWidth === undefined) {
        column.minWidth = 60;
      }
      if (column.maxWidth === undefined) {
        column.maxWidth = 500;
      }
      if (column.copy === undefined) {
        column.copy = true;
      }
      if (column.zoom === undefined) {
        column.zoom = true;
      }
      if (column.resizable === undefined) {
        column.resizable = true;
      }
      if (column.showModalOnClick === true) {
        column.zoom = false;
      }
      if (column.title === undefined) {
        column.title = column.key;
      }
      if (column.visible === undefined) {
        column.visible = true;
      }
      if (column.editable === undefined) {
        column.editable = true;
      }
      if (column.creatable === undefined) {
        column.creatable = true;
      }
      if (column.filter === undefined) {
        column.filter = {
          values: [],
        };
      }
      if (column.filter.multiSelect === undefined) {
        column.filter.multiSelect = true;
      }
      if (column.filter.values === undefined) {
        column.filter.values = [];
      }
      if (column.filter.type === undefined) {
        switch (column.columnType) {
          case ImColumnType.Array:
          case ImColumnType.Object:
            column.filter.type = ImFilterType.Select;
            break;
          case ImColumnType.Boolean:
            column.filter.type = ImFilterType.Boolean;
            break;
          case ImColumnType.Date:
            column.filter.type = ImFilterType.RangeDate;
            break;
          case ImColumnType.Decimal:
          case ImColumnType.Int:
            column.filter.type = ImFilterType.RangeNumber;
            break;
          case ImColumnType.Rating:
            column.filter.type = ImFilterType.Rating;
            break;
          default:
            column.filter.type = ImFilterType.FreeText;
        }
      }
      if (column.fieldType === undefined) {
        switch (column.columnType) {
          case ImColumnType.Boolean:
            column.fieldType = ImFieldType.Checkbox;
            break;
          case ImColumnType.Array:
          case ImColumnType.Object:
            column.fieldType = ImFieldType.Select;
            break;
          case ImColumnType.Date:
            column.fieldType = ImFieldType.Date;
            break;
          case ImColumnType.Rating:
            column.fieldType = ImFieldType.Rating;
            break;
          case ImColumnType.Website:
            column.fieldType = ImFieldType.Website;
            break;
          case ImColumnType.Decimal:
          case ImColumnType.Int:
            column.fieldType = ImFieldType.Number;
            break;
          case ImColumnType.Xml:
            column.fieldType = ImFieldType.Textarea;
            break;
          default:
            column.fieldType = ImFieldType.Text;
        }
      }

      if (
        column.fieldType === ImFieldType.Select &&
        column.filter.selectValues === undefined
      ) {
        column.filter.selectValues = [];
      }

      if (column.childrenConfig !== undefined) {
        column.visible = false;
        column.hidden = true;
        column.fieldType = ImFieldType.None;
        column.childrenConfig.columns.forEach(childColumn => {
          if (childColumn.title === undefined) {
            childColumn.title = childColumn.key;
          }
          if (childColumn.visible === undefined) {
            childColumn.visible = true;
          }
          if (childColumn.hidden === undefined) {
            childColumn.hidden = false;
          }
        });
      }
    });

    if (columns && !columns.some(column => column.isUnique)) {
      console.error(
        'Please consider adding a unique column or set isUnique property to true to an existing column'
      );
      console.error('Table will not work properly if unique column is missing.');
    }
    return columns;
  }

  private validateAllFormFields = (
    formGroup: FormGroup,
    opts: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ): void => {
    for (const control in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(control)) {
        const formControl = formGroup.controls[control];
        if (!formControl.valid) {
          formControl.markAsDirty(opts);
          formControl.markAsTouched(opts);
          formControl.updateValueAndValidity(opts);
        }
      }
    }
  };

  private resetAllFormFields = (
    formGroup: FormGroup,
    opts: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ): void => {
    for (const control in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(control)) {
        const formControl = formGroup.controls[control];
        const foundColumn = this.columns().find(column => column.key === control);
        if (!foundColumn) {
          return null;
        }
        const resetValue = foundColumn.isUnique
          ? formGroup.get(control).value
          : foundColumn.defaultValue;
        formControl.reset(resetValue);
        formControl.markAsPristine(opts);
        formControl.updateValueAndValidity(opts);
      }
    }
  };

  private orderColumnsUsingKeys(
    array: ImColumn[],
    previousKey: string,
    newKey: string
  ): ImColumn[] {
    const prevIndex = array.findIndex(element => element.key === previousKey);
    const newIndex = array.findIndex(element => element.key === newKey);

    if (newIndex > prevIndex) {
      const movedColumn = array[prevIndex];
      for (let i = prevIndex; i < newIndex; i++) {
        array[i] = array[i + 1];
      }
      array[newIndex] = movedColumn;
    } else if (newIndex < prevIndex) {
      const movedColumn = array[prevIndex];
      for (let i = prevIndex; i > newIndex; i--) {
        array[i] = array[i - 1];
      }
      array[newIndex] = movedColumn;
    }

    return array;
  }

  public dragEndEvent(
    event: CdkDragDrop<string[]>,
    columns: ImColumn[],
    columnsToGetKeyFrom: ImColumn[]
  ): any[] {
    return this.orderColumnsUsingKeys(
      columns,
      columnsToGetKeyFrom[event.previousIndex].key,
      columnsToGetKeyFrom[event.currentIndex].key
    );
  }

  public showValueInModal(row: T, column: ImColumn): void {
    const text = String(this.formatService.format(row[column.key], column, true) ?? '');
    this.valueDialog.set({
      title: this.i18n.translate(column.title),
      text,
      html: column.columnType === ImColumnType.Xml ? highlightXml(text) : null,
    });
    this.valueCopied.set(false);

    this.modal = this.modalService.create({
      nzTitle: this.valueTitle(),
      nzContent: this.valueContent(),
      nzFooter: this.valueFooter(),
      nzWidth: 760,
      nzClassName: 'im-grid-modal im-grid-value-modal',
      nzStyle: { 'max-width': 'calc(100vw - 32px)' },
    });
  }

  copyDialogValue(): void {
    const value = this.valueDialog();
    if (value && this.clipboard.copy(value.text)) {
      this.valueCopied.set(true);
      clearTimeout(this.valueCopiedTimeout);
      this.valueCopiedTimeout = setTimeout(() => this.valueCopied.set(false), 1500);
    }
  }

  public openCreateOrEditModal(row?: T): void {
    if (!row && this.customCreate()) {
      // TODO: The 'emit' function requires a mandatory void argument
      this.customCreatedRow.emit();
      return;
    }

    this.initForm(row);
    // a few fields read better in a narrow, single-column dialog
    const editableFields = formFieldsOf(this.columns()).filter(
      column => this.form.get(column.key)?.enabled
    ).length;
    this.modal = this.modalService.create({
      nzTitle: this.modalTitle(),
      nzWidth: editableFields <= 5 ? 560 : 880,
      nzClassName: 'im-grid-modal',
      nzStyle: { 'max-width': 'calc(100vw - 32px)' },
      nzContent: this.createEditModal(),
      nzFooter: this.modalFooter(),
    });
  }

  public closeModal(): void {
    this.modal.destroy();
  }

  public deleteRows(onlyFirst1000?: boolean) {
    const checked = this.mapOfCheckedId();
    const deletedRowIds = Object.keys(checked).filter(
      (key, index) => checked[key] && (onlyFirst1000 ? index < 1000 : true)
    );
    const key = this.uniqueKey();

    this.currentRows.update(rows =>
      rows.filter(row => deletedRowIds.indexOf(row[key].toString()) === -1)
    );
    this.mapOfCheckedId.update(map => {
      const next = { ...map };
      deletedRowIds.forEach(id => delete next[id]);
      return next;
    });
    this.editCache.update(cache => {
      const next = { ...cache };
      deletedRowIds.forEach(id => (next[id] = { edit: false, changed: true, deleted: true }));
      return next;
    });

    this.createMessage(
      'success',
      this.i18n.format(this.texts().deletedSuccessfully, { count: deletedRowIds.length })
    );
  }

  public deleteRow(value: T): void {
    if (this.editMode() === EditMode.Direct) {
      this.successSubject$
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          filter(success => success.action === ImAction.Delete),
          take(1)
        )
        .subscribe(success => {
          if (success.data === false) {
            this.showError();
          }
        });
      this.deleted.emit({
        row: value,
        track: this.successSubject$,
        action: ImAction.Delete,
      });
    } else {
      this.saveDelete(value);
    }
  }

  private addRow(newObject: T): void {
    const key = this.uniqueKey();
    if (newObject[key] == null) {
      newObject[key] = randomUuid();
    }

    this.currentRows.update(rows => [...rows, newObject]);
    this.editCache.update(cache => ({
      ...cache,
      [newObject[key]]: { edit: false, row: { ...newObject }, new: true },
    }));
    this.createMessage('success', this.texts().addedNewRow);
  }

  private saveDelete(deletedRow: T): void {
    const key = this.uniqueKey();
    this.currentRows.update(rows => rows.filter(row => row[key] !== deletedRow[key]));
    this.editCache.update(cache => ({
      ...cache,
      [deletedRow[key]]: { edit: false, changed: true, deleted: true },
    }));

    this.createMessage(
      'success',
      this.i18n.format(this.texts().deletedSuccessfully, { count: 1 })
    );
  }

  private saveEdit(editedRow: T): void {
    const key = this.uniqueKey();
    this.currentRows.update(rows =>
      rows.map(row => (row[key] === editedRow[key] ? editedRow : row))
    );
    this.editCache.update(cache => ({
      ...cache,
      [editedRow[key]]: { row: { ...editedRow }, edit: false, changed: true },
    }));
    this.createMessage('success', this.texts().savedRow);
  }

  public trackByUnique = (_: number, row: T): number | string => {
    return row[this.uniqueKey()];
  };

  private renderSummary(
    result: ImSummaryResult,
    column: ImColumn
  ): { label: string; text: string } {
    if (result == null || result === '') {
      return { label: '', text: '' };
    }
    if (typeof result === 'object' && !(result instanceof Date)) {
      if ('value' in result) {
        const { label, value } = result as ImSummaryValue;
        return { label: this.i18n.translate(label), text: this.formatSummaryValue(value, column) };
      }
      // per-language text, e.g. { en: 'Total', ar: 'المجموع' }
      return { label: '', text: this.i18n.translate(result as ImText) };
    }
    return { label: '', text: this.formatSummaryValue(result, column) };
  }

  /** Formats like the column's cells; plain numbers get locale-aware grouping. */
  private formatSummaryValue(value: unknown, column: ImColumn): string {
    if (value == null || value === '') {
      return '';
    }
    if (typeof value === 'number') {
      if (
        column.columnType === ImColumnType.Decimal ||
        column.columnType === ImColumnType.Currency
      ) {
        return String(this.formatService.format(value, column) ?? '');
      }
      return formatNumber(value, this.i18n.locale(), '1.0-2');
    }
    if (value instanceof Date) {
      value = value.toISOString();
    }
    return String(this.formatService.format(value, column) ?? '');
  }

  public updateRowHeight(size: Size) {
    this.size.set(size);
  }

  private createMessage(type: string, message: string): void {
    if (this.enableNotifications()) {
      this.messageService.create(type, message);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Child rows drawer                                                   */
  /* ------------------------------------------------------------------ */

  openDrawer(row: T): void {
    const childrenKey = this.childrenKey();
    const foundColumn = this.columns().find(column => column.key === childrenKey);
    if (foundColumn) {
      this.childrenTitle.set(
        foundColumn.drawerTitle ? foundColumn.drawerTitle(row) : foundColumn.title
      );

      foundColumn.childrenConfig.componentConfig.inputs = {
        dataSource$: of(row[childrenKey]),
        columns: this.childColumns(),
        enableNotifications: this.enableNotifications(),
        allowCreate: this.childAllowCreate(),
        allowEdit: this.childAllowEdit(),
        allowDelete: this.childAllowDelete(),
      };
      const event = new EventEmitter<ChangesEvent>();
      foundColumn.childrenConfig.componentConfig.outputs = {
        changes: event,
      };

      event.pipe(take(1)).subscribe((changes: ChangesEvent) => {
        const updatedRow = {
          ...row,
          [childrenKey]: changes.currentState,
        };

        if (this.editMode() === EditMode.Direct) {
          this.successSubject$
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              filter(success => success.action === ImAction.Update),
              take(1)
            )
            .subscribe(success => {
              changes.track.next({
                data: success.data[childrenKey],
                action: ImAction.SaveAll,
              });

              if (success.data !== false) {
                this.saveEdit(success.data);
              } else {
                this.showError();
              }
            });
          this.updated.emit({
            row: updatedRow,
            track: this.successSubject$,
            action: ImAction.Update,
          });
        } else {
          this.saveEdit(updatedRow);
          changes.track.next({
            data: changes.currentState,
            action: changes.action,
          });
        }
      });

      this.componentConfig.set(foundColumn.childrenConfig.componentConfig);
      this.drawerVisible.set(true);
    } else {
      this.childrenTitle.set(null);
      this.drawerVisible.set(false);
    }
  }

  closeDrawer(): void {
    this.drawerVisible.set(false);
  }

  /* ------------------------------------------------------------------ */
  /* Cell interaction                                                    */
  /* ------------------------------------------------------------------ */

  handleClick(column: ImColumn, row: T, index: number) {
    this.clickInside();

    this.updateFocusedCell(index, column.key);

    if (column.showModalOnClick) {
      this.showValueInModal(row, column);
    }
  }

  clickout() {
    if (!this.clickedInsideOfBody) {
      this.bodyFocused = false;
    }
    this.clickedInsideOfBody = false;
  }

  /** Opens the full value of a cell in a dialog (double-click / Enter). */
  openCellValue(column: ImColumn, row: T) {
    if (column.zoom && row[column.key] != null && row[column.key] !== '') {
      this.showValueInModal(row, column);
    }
  }

  private getFocusedCell(): { column: ImColumn; row: T } | null {
    const { rowIndex, key } = this.focusedCell();
    const column = this.columns().find(col => col.key === key);
    const row = this.rows()[rowIndex];
    return column && row ? { column, row } : null;
  }

  /** Ctrl/⌘ + C copies the focused cell's value; Enter opens it. */
  handleCellShortcuts(event: KeyboardEvent) {
    if (!this.bodyFocused || event.altKey || event.shiftKey) {
      return;
    }
    const cell = this.getFocusedCell();
    if (!cell) {
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
      // leave native copy alone when the user selected text
      if (window.getSelection()?.toString()) {
        return;
      }
      const value = cell.row[cell.column.key];
      if (cell.column.copy && value != null && value !== '') {
        event.preventDefault();
        this.clipboard.copy(this.formatService.format(value, cell.column, true));
        this.createMessage('success', this.texts().copied);
      }
    } else if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.openCellValue(cell.column, cell.row);
    }
  }

  handleEvent(event: Event) {
    if (this.bodyFocused) {
      event.preventDefault();
      this.arrowKeys.next(event);
    }
  }

  public clickInside() {
    this.bodyFocused = true;
    this.clickedInsideOfBody = true;
  }

  /**
   * Header and summary reserve the body's vertical scrollbar width so columns and sticky cells
   * line up. Measured instead of assumed, because host apps style scrollbars differently.
   */
  private measureScrollbarGutter(host: HTMLElement): void {
    const body: HTMLElement = this.table()?.cdkVirtualScrollViewport?.elementRef.nativeElement;
    if (body) {
      host.style.setProperty(
        '--im-grid-scrollbar-width',
        `${Math.max(0, body.offsetWidth - body.clientWidth)}px`
      );
    }
  }

  /** Edit action (custom handler or the built-in dialog). */
  editRow(row: T): void {
    if (this.customEdit()) {
      this.customUpdatedRow.emit(row);
    } else {
      this.openCreateOrEditModal(row);
    }
  }

  /** Delete from the compact menu: a confirm dialog instead of the inline popconfirm. */
  confirmDeleteRow(row: T): void {
    if (this.customDelete()) {
      this.customDeletedRow.emit(row);
      return;
    }
    this.modalService.confirm({
      nzTitle: this.texts().areYouSure,
      nzOkText: this.texts().delete,
      nzOkDanger: true,
      nzCancelText: this.texts().cancel,
      nzOnOk: () => this.deleteRow(row),
    });
  }

  openRowMenu(event: MouseEvent, menu: NzDropdownMenuComponent, row: T): void {
    event.stopPropagation();
    this.activeRow = row;
    this.nzContextMenuService.create(event, menu);
  }

  contextMenu(event: MouseEvent, menu: NzDropdownMenuComponent, row: T): void {
    const buttons = this.buttons();
    if (buttons && buttons.length > 0 && !event.shiftKey) {
      this.activeRow = row;
      this.nzContextMenuService.create(event, menu);
    }
  }
}
