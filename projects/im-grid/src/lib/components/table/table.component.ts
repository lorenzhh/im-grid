import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { BehaviorSubject, fromEvent, Observable, of, ReplaySubject, Subject } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    take,
    takeUntil,
    throttleTime,
} from 'rxjs/operators';
import { randomUuid } from '../../helpers/generator';
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
    ImDirection,
    ImFieldType,
    ImFilterType,
    ImTrack,
    SelectionMode,
} from '../../models/column.model';
import { Translation } from '../../models/settings.model';
import { ExcelService } from '../../services/excel.service';
import { FilterService } from '../../services/filter.service';
import { FormatService } from '../../services/format.service';
import { SettingsService } from '../../services/settings.service';
import { translations } from './translations/default-translations';
import { dynamicTranslations } from './translations/dynamic-translations';

export interface Edit {
    [key: number]: {
        edit: boolean;
        row?: any;
        changed?: boolean;
        deleted?: boolean;
        new?: boolean;
    };
}

@Component({
    selector: 'im-grid',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImGridComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('createEditModal') createEditModal: TemplateRef<any>;
    @ViewChild('modalFooter') modalFooter: TemplateRef<any>;
    @ViewChild('virtualTable') table: NzTableComponent<any>;

    @Input() columns: ImColumn[];
    @Input() buttons: ImButton[];
    @Input() editMode = EditMode.Direct;
    @Input() selection = SelectionMode.Checkbox;
    @Input() dataSource$: Observable<any[]>;
    @Input() label: string;
    @Input() loading = false;
    @Input() showRowIndex = true;
    @Input() allowDelete = true;
    @Input() allowEdit = true;
    @Input() allowCreate = true;

    @Output() selectedIds = new EventEmitter<{ [key: string]: boolean }>();
    @Output() save = new EventEmitter<ChangesEvent>();
    @Output() deleted = new EventEmitter<ChangeEvent>();
    @Output() created = new EventEmitter<ChangeEvent>();
    @Output() updated = new EventEmitter<ChangeEvent>();

    public childColumns: ImColumn[];
    public rows: any[] = [];
    public ImFilterType = ImFilterType;
    public ImColumnType = ImColumnType;
    public ImFieldType = ImFieldType;
    public EditMode = EditMode;
    public SelectionMode = SelectionMode;
    public translations = translations;
    public originalRows: any[] = [];
    public currentRows: any[] = [];
    public form: FormGroup;
    public size = 'default';
    public height = 54;
    public editCache: Edit = {};
    public isAllDisplayDataChecked = false;
    public isIndeterminate = false;
    public mapOfCheckedId: { [key: string]: boolean } = {};
    public mapOfSort: { [key: string]: boolean } = {};
    public numberOfChecked = 0;
    public unsavedRowsLength = 0;
    public deletedRowsLength = 0;
    public newRowsLength = 0;
    public filterForm: FormGroup;
    public notIncludedColumns: ImColumn[] = [];
    public uniqueKey: string;
    public scrollIndex: number;
    public allowSearch: boolean;
    private modal: NzModalRef;
    private componentDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public objectKeys = Object.keys;
    public childrenKey: string;
    public childrenTitle: Translation | string;
    public componentConfig: DynamicComponentConfig;
    public drawerVisible = false;
    public columnsWidth: number;

    private successSubject: Subject<ImTrack> = new Subject<ImTrack>();
    public focusedCellSubject: BehaviorSubject<CellCoordinates> = new BehaviorSubject<CellCoordinates>(
        {
            rowIndex: -1,
            key: null,
        }
    );

    private stillClickedInsideBodySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    private clickedInsideOfBody = false;
    private arrowKeys = new Subject<KeyboardEvent>();
    public resizing = false;

    /* context menu active row */
    public activeRow: any;
    public activeRowIndex = -1;

    constructor(
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private formatService: FormatService,
        private excelService: ExcelService,
        private messageService: NzMessageService,
        private filterService: FilterService,
        private cd: ChangeDetectorRef,
        public settingsService: SettingsService,
        private nzContextMenuService: NzContextMenuService
    ) {
        this.arrowKeys
            .pipe(throttleTime(50), takeUntil(this.componentDestroyed$))
            .subscribe((event: KeyboardEvent) => this.handleArrowKeyboardEvent(event));

        fromEvent(window, 'resize')
            .pipe(debounceTime(500), takeUntil(this.componentDestroyed$))
            .subscribe(() => {
                this.table.cdkVirtualScrollViewport.checkViewportSize();
            });

        this.filterForm = this.formBuilder.group({
            search: null,
        });

        this.filterForm
            .get('search')
            .valueChanges.pipe(
                takeUntil(this.componentDestroyed$),
                debounceTime(400),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.filterRows();
            });
    }

    private getNeighborColumn(key: string, forward: boolean): ImColumn {
        const columns = this.columns.filter((column) => column.visible && !column.hidden);
        const currentColumnIndex = columns.findIndex((column) => column.key === key);
        return columns.find((_, index) =>
            forward ? index > currentColumnIndex : index === currentColumnIndex - 1
        );
    }

    private handleArrowKeyboardEvent(event: KeyboardEvent) {
        const index = this.focusedCellSubject.value.rowIndex;
        const key = this.focusedCellSubject.value.key;
        if (index > -1) {
            if (event.key === 'ArrowLeft') {
                const neighborColumn = this.getNeighborColumn(key, false);

                if (neighborColumn) {
                    this.scrollToRowElement(index, ImDirection.LEFT, neighborColumn.key);
                    this.updateFocusedCell(index, neighborColumn.key);
                }
            }
            if (event.key === 'ArrowRight') {
                const neighborColumn = this.getNeighborColumn(key, true);
                if (neighborColumn) {
                    this.updateFocusedCell(index, neighborColumn.key);
                    this.scrollToRowElement(index, ImDirection.RIGHT, neighborColumn.key);
                }
            }
            if (event.key === 'ArrowUp') {
                if (index - 1 > -1) {
                    this.updateFocusedCell(index - 1, key);
                    this.scrollToRowElement(index - 1, ImDirection.TOP);
                }
            }
            if (event.key === 'ArrowDown') {
                if (index + 1 < this.rows.length) {
                    this.scrollToRowElement(index + 1, ImDirection.Bottom);
                    this.updateFocusedCell(index + 1, key);
                }
            }
        }
    }

    private scrollToRowElement(
        targetIndex: number,
        direction: ImDirection,
        key?: string
    ) {
        const allRows = Array.from<HTMLElement>(
            this.table.cdkVirtualScrollViewport._contentWrapper.nativeElement.firstChild[
                'rows'
            ]
        );
        const targetRow: HTMLElement = allRows.find(
            (row: HTMLElement) => row.getAttribute('index') === targetIndex.toString()
        );
        if (targetRow != null) {
            if (direction === ImDirection.TOP || direction === ImDirection.Bottom) {
                const cdkScrollEelemnt = this.table.cdkVirtualScrollViewport.elementRef;
                const cdkScrollEelemntTop = cdkScrollEelemnt.nativeElement.getBoundingClientRect()
                    .top;
                const cdkScrollOffsetTop = cdkScrollEelemntTop;
                const rowElementTopWidthOffset = targetRow.getBoundingClientRect().top;
                const rowElementTop = rowElementTopWidthOffset - cdkScrollOffsetTop;

                const rowBottom =
                    rowElementTopWidthOffset - cdkScrollEelemntTop + this.height;
                const tableHeight = cdkScrollEelemnt.nativeElement.clientHeight;
                const currentScroll = cdkScrollEelemnt.nativeElement.scrollTop;
                if (direction === ImDirection.TOP && rowElementTop < 0) {
                    cdkScrollEelemnt.nativeElement.scrollTop =
                        currentScroll + rowElementTop;
                } else if (direction === ImDirection.Bottom && rowBottom > tableHeight) {
                    const scrollAmount = rowBottom - tableHeight;
                    cdkScrollEelemnt.nativeElement.scrollTop =
                        currentScroll + scrollAmount;
                }
            } else {
                const cdkScrollEelemnt = this.table.cdkVirtualScrollViewport.elementRef;
                const nextColumnIndex = this.columns.findIndex(
                    (column) => column.key === key
                );

                const width = this.columns
                    .filter(
                        (column, index) =>
                            column.visible && !column.hidden && index < nextColumnIndex
                    )
                    .reduce((acc, curr) => acc + curr.width, 0);

                cdkScrollEelemnt.nativeElement.scrollLeft = width;
            }
        } else {
            this.scrollToIndex(targetIndex);
        }
    }

    updateFocusedCell(rowIndex: number, key: string) {
        this.focusedCellSubject.next({ rowIndex, key });
    }

    scrollToIndex(index: number): void {
        this.table.cdkVirtualScrollViewport.scrollToIndex(+index);
    }

    ngOnInit() {
        this.normalizeConfig();
        this.calculateColumnsWidth();
        this.mapOfSort = {};
        this.dataSource$.pipe(takeUntil(this.componentDestroyed$)).subscribe((data) => {
            this.originalRows = [...data];
            this.currentRows = [...data];
            this.reset();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.columns && !changes.columns.isFirstChange()) {
            this.form = null;
            if (this.modal) {
                this.closeModal();
            }
            if (this.drawerVisible) {
                this.closeDrawer();
            }
            this.normalizeConfig();
            this.calculateColumnsWidth();
            this.mapOfSort = {};
            this.notIncludedColumns = [];
        }
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }

    resizeStart() {
        this.resizing = true;
    }
    resizeEnd() {
        this.resizing = false;
        this.calculateColumnsWidth();
    }
    public calculateColumnsWidth() {
        this.columnsWidth = this.columns
            .filter(
                (column) => column.visible && !column.hidden && !column.childrenConfig
            )
            .reduce(
                (accumulator, currentValue) => accumulator + currentValue.width,
                this.childrenKey ? 210 : 175
            );
    }

    public resetRows() {
        this.currentRows = [...this.originalRows];
        this.resetEditCache();
        this.filterRows();
        this.updateCounters();
        this.createMessage('success', translations.discardedAllChanges);
    }

    public resetRow() {
        const foundIndex = this.currentRows.findIndex(
            (row) => row[this.uniqueKey] === this.form.getRawValue()[this.uniqueKey]
        );
        const originalRow = this.originalRows.find(
            (row) => row[this.uniqueKey] === this.form.getRawValue()[this.uniqueKey]
        );

        if (foundIndex > -1 && originalRow) {
            this.currentRows[foundIndex] = { ...originalRow };

            this.editCache[originalRow[this.uniqueKey]] = {
                row: { ...originalRow },
                edit: false,
                changed: false,
            };

            this.updateCounters();
            this.closeModal();
            this.createMessage('success', translations.discardedRow);
            this.filterRows();
        }
    }

    public drop(event: CdkDragDrop<string[]>): void {
        this.columns = [
            ...this.dragEndEvent(
                event,
                this.columns,
                this.columns.filter((column) => column.visible && !column.hidden)
            ),
        ];
    }

    onResize({ width }: NzResizeEvent, column: ImColumn): void {
        let id = 0;
        cancelAnimationFrame(id);
        id = requestAnimationFrame(() => {
            column.width = width;
        });
    }

    public saveRows() {
        this.successSubject
            .pipe(
                filter((success) => success.action === ImAction.SaveAll),
                takeUntil(this.componentDestroyed$),
                take(1)
            )
            .subscribe((success) => {
                if (success.data !== false) {
                    this.originalRows = [...success.data];
                    this.currentRows = [...success.data];
                    this.reset();
                } else {
                    this.showError();
                }
            });

        this.save.emit({
            saved: this.getUnsavedRows(),
            deletedIds: this.getDeletedRowsId(),
            new: this.getNewRows(),
            currentState: this.currentRows,
            action: ImAction.SaveAll,
            track: this.successSubject,
        });
    }

    private getUnsavedRows() {
        return Object.keys(this.editCache)
            .filter(
                (uniqueKey) =>
                    this.editCache[uniqueKey].changed &&
                    !this.editCache[uniqueKey].deleted &&
                    !this.editCache[uniqueKey].new
            )
            .map((uniqueKey) => this.editCache[uniqueKey].row);
    }

    private getDeletedRowsId() {
        return Object.keys(this.editCache).filter(
            (uniqueKey) => this.editCache[uniqueKey].deleted
        );
    }

    private getNewRows() {
        return Object.keys(this.editCache)
            .filter((id) => this.editCache[id].new && !this.editCache[id].deleted)
            .map((id) => this.editCache[id].row);
    }

    private reset() {
        this.resetEditCache();
        this.mapOfCheckedId = {};
        this.filterForm.get('search').setValue('');
        this.filterRows();
        this.updateCounters();
        this.setUniqueValues();
    }

    private setUniqueValues() {
        this.columns.forEach((column) => {
            if (column.filter && column.filter.type === ImFilterType.Select) {
                column.filter.selectValues = this.getUniqueSelectFilterValues(column);
            }
        });
    }

    private getUniqueSelectFilterValues(column: ImColumn): any[] {
        if (column.columnType === ImColumnType.Array) {
            const uniques = [];
            this.currentRows.forEach((row) => {
                row[column.key].forEach((item) => {
                    const foundItem = uniques.find((unique) =>
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

        return this.currentRows
            .map((row) => row[column.key])
            .filter(
                (value, index, self) => value != null && self.indexOf(value) === index
            );
    }

    public checkAll(value: boolean): void {
        this.rows
            .filter((item) => !item.disabled)
            .forEach((item) => (this.mapOfCheckedId[item[this.uniqueKey]] = value));
        this.refreshStatus();
    }

    public refreshStatus(): void {
        this.isAllDisplayDataChecked =
            this.rows.length !== 0 &&
            this.rows
                .filter((item) => !item.disabled)
                .every((item) => this.mapOfCheckedId[item[this.uniqueKey]]);
        this.isIndeterminate =
            this.rows
                .filter((item) => !item.disabled)
                .some((item) => this.mapOfCheckedId[item[this.uniqueKey]]) &&
            !this.isAllDisplayDataChecked;

        this.numberOfChecked = this.rows.filter(
            (item) => this.mapOfCheckedId[item[this.uniqueKey]]
        ).length;
        this.selectedIds.emit(this.mapOfCheckedId);
    }

    public saveRow(event: any, value: any) {
        event.preventDefault();
        this.validateAllFormFields(this.form);
        if (!this.form.valid) {
            return;
        }

        if (this.editMode === EditMode.Direct) {
            this.successSubject
                .pipe(
                    filter(
                        (success) =>
                            success.action === ImAction.Update ||
                            success.action === ImAction.ADD
                    ),
                    takeUntil(this.componentDestroyed$),
                    take(1)
                )
                .subscribe((success) => {
                    if (success.data !== false) {
                        this.closeModal();
                    } else {
                        this.showError();
                    }
                });

            value.isNew && value[this.uniqueKey] == null
                ? this.created.emit({
                      row: value,
                      track: this.successSubject,
                      action: ImAction.ADD,
                  })
                : this.updated.emit({
                      row: value,
                      track: this.successSubject,
                      action: ImAction.Update,
                  });
        } else {
            value.isNew && value[this.uniqueKey] == null
                ? this.addRow(value)
                : this.saveEdit(value);
            this.closeModal();
        }
    }

    private showError() {
        this.createMessage('error', translations.errorOccurred);
    }

    public resetForm(event: MouseEvent): void {
        event.preventDefault();
        this.resetAllFormFields(this.form);
    }

    private updateCounters() {
        this.updateUnsavedRowsLength();
        this.updateDeletedRowsLength();
        this.updateNewRowsLength();
        this.refreshStatus();
    }

    private initForm(row?: any) {
        const form = this.formBuilder.group({});
        this.columns.forEach((column: ImColumn) => {
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
                formControl.valueChanges.subscribe((value: Date) => {
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

    private normalizeConfig() {
        this.columns.forEach((column) => {
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
                this.childColumns = column.childrenConfig.columns;
                this.childrenKey = column.key;
                this.childrenTitle = column.title;
                column.fieldType = ImFieldType.None;
                this.childColumns.forEach((childColumn) => {
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

        const uniqueColumn = this.columns.find((column) => column.isUnique);
        const childrenColumn = this.columns.find((column) => column.childrenConfig);
        if (uniqueColumn) {
            this.uniqueKey = uniqueColumn.key;
        } else {
            console.error(
                'Please consider adding a unique column or set isUnique property to true to an existing column'
            );
            console.error('Table will not work properly if unique column is missing.');
        }
        if (!childrenColumn) {
            this.childrenKey = null;
            this.childrenTitle = null;
            this.childColumns = null;
        }
    }

    public sort(sortKey: string, event: string) {
        const isSortAscending = event === 'ascend';
        if (event) {
            this.rows = [
                ...this.rows.sort((a, b) => {
                    const firstValue = a[sortKey];
                    const secondValue = b[sortKey];

                    if (firstValue === secondValue) {
                        return 0;
                    }
                    if (
                        firstValue === null ||
                        firstValue === '' ||
                        firstValue === undefined
                    ) {
                        return isSortAscending ? -1 : 1;
                    } else if (
                        secondValue === null ||
                        secondValue === '' ||
                        secondValue === undefined
                    ) {
                        return isSortAscending ? 1 : -1;
                    } else if (
                        typeof firstValue === 'string' &&
                        typeof secondValue === 'string'
                    ) {
                        return isSortAscending
                            ? firstValue.localeCompare(secondValue)
                            : secondValue.localeCompare(firstValue);
                    } else if (
                        typeof firstValue === 'number' ||
                        typeof firstValue === 'boolean'
                    ) {
                        if (firstValue < secondValue) {
                            return isSortAscending ? -1 : 1;
                        }
                        if (firstValue > secondValue) {
                            return isSortAscending ? 1 : -1;
                        }
                    }
                    return 0;
                }),
            ];
        } else {
            this.filterRows();
        }
    }

    public showValueInModal(row: any, column: ImColumn): void {
        const content: string = this.formatService.format(row[column.key], column, true);
        const viewMode = String(content)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

        this.modal = this.modalService.create({
            nzTitle: column.title[this.settingsService.language],
            nzWidth: 1000,
            nzStyle: { 'max-width': '100%' },
            nzContent: `<pre>${viewMode}</pre>`,
            nzFooter: null,
            nzBodyStyle: { overflow: 'auto' },
        });
    }

    public openCreateOrEditModal(row?: any): void {
        this.initForm(row);
        this.modal = this.modalService.create({
            nzTitle: !row
                ? translations.createNew[this.settingsService.language]
                : translations.edit[this.settingsService.language],
            nzWidth: 1000,
            nzStyle: { 'max-width': '100%' },
            nzContent: this.createEditModal,
            nzFooter: this.modalFooter,
        });
    }

    public closeModal(): void {
        this.modal.destroy();
    }

    public deleteRows(onlyFirst1000?: boolean) {
        const deletedRowIds = Object.keys(this.mapOfCheckedId).filter(
            (key, index) =>
                this.mapOfCheckedId[key] && (onlyFirst1000 ? index < 1000 : true)
        );

        this.currentRows = this.currentRows.filter(
            (row) => deletedRowIds.indexOf(row[this.uniqueKey].toString()) === -1
        );

        deletedRowIds.forEach((deletedRowId) => {
            delete this.mapOfCheckedId[deletedRowId];

            this.editCache[deletedRowId] = {
                edit: false,
                changed: true,
                deleted: true,
            };
        });

        this.updateCounters();
        this.createMessage(
            'success',
            this.settingsService.dynamicTranslate(
                dynamicTranslations.deletedSuccessfully,
                { '{count}': deletedRowIds.length }
            )
        );
        this.filterRows();
    }

    public deleteRow(value: any): void {
        if (this.editMode === EditMode.Direct) {
            this.successSubject
                .pipe(
                    takeUntil(this.componentDestroyed$),
                    filter((success) => success.action === ImAction.Delete),
                    take(1)
                )
                .subscribe((success) => {
                    if (success.data === false) {
                        this.showError();
                    }
                });
            this.deleted.emit({
                row: value,
                track: this.successSubject,
                action: ImAction.Delete,
            });
        } else {
            this.saveDelete(value);
        }
    }

    private addRow(newObject: any): void {
        if (newObject[this.uniqueKey] == null) {
            newObject[this.uniqueKey] = randomUuid();
        }

        this.currentRows = [...this.currentRows, newObject];
        this.editCache[newObject[this.uniqueKey]] = {
            edit: false,
            row: { ...newObject },
            new: true,
        };

        this.updateCounters();
        this.filterRows();
        this.createMessage('success', translations.addedNewRow);
    }

    private saveDelete(deletedRow: any): void {
        this.currentRows = this.currentRows.filter(
            (row) => row[this.uniqueKey] !== deletedRow[this.uniqueKey]
        );
        this.editCache[deletedRow[this.uniqueKey]] = {
            edit: false,
            changed: true,
            deleted: true,
        };

        this.updateCounters();
        this.filterRows();
        this.createMessage(
            'success',
            this.settingsService.dynamicTranslate(
                dynamicTranslations.deletedSuccessfully,
                { '{count}': 1 }
            )
        );
    }

    private saveEdit(editedRow: any): void {
        const foundCurrentRowIndex = this.currentRows.findIndex(
            (row) => row[this.uniqueKey] === editedRow[this.uniqueKey]
        );

        this.currentRows[foundCurrentRowIndex] = editedRow;

        this.editCache[editedRow[this.uniqueKey]] = {
            row: { ...editedRow },
            edit: false,
            changed: true,
        };

        this.updateUnsavedRowsLength();
        this.createMessage('success', translations.savedRow);
        this.filterRows();
    }

    private updateUnsavedRowsLength() {
        this.unsavedRowsLength = this.getUnsavedRows().length;
    }

    private updateDeletedRowsLength() {
        this.deletedRowsLength = this.getDeletedRowsId().length;
    }

    private updateNewRowsLength() {
        this.newRowsLength = this.getNewRows().length;
    }

    private resetEditCache(): void {
        this.editCache = {};
        this.currentRows.forEach((row) => {
            this.editCache[row[this.uniqueKey]] = {
                edit: false,
            };
        });
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
                const foundColumn = this.columns.find((column) => column.key === control);
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

    public trackById = (_: number, item: any): number => {
        return item[this.uniqueKey];
    };

    private orderElementsInArrayUsingKeys(
        array: any[],
        previousKey: string,
        newKey: string
    ): any[] {
        const prevIndex = array.findIndex((element) => element.key === previousKey);
        const newIndex = array.findIndex((element) => element.key === newKey);

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
        return this.orderElementsInArrayUsingKeys(
            columns,
            columnsToGetKeyFrom[event.previousIndex].key,
            columnsToGetKeyFrom[event.currentIndex].key
        );
    }

    public updateRowHeight(size: string) {
        this.size = size;
        switch (size) {
            case 'small':
                this.height = 37;
                break;
            case 'middle':
                this.height = 46;
                break;
            default:
                this.height = 54;
                break;
        }
    }

    filterRows(excludedColumns?: ImColumn[]) {
        if (excludedColumns) {
            this.notIncludedColumns = excludedColumns;
        }
        this.filter(this.filterForm.get('search').value);
        this.refreshStatus();
        this.cd.markForCheck();
    }

    public filter(globalValue: string) {
        const filterColumns = this.getColumnsWithFilter(this.columns);

        if (globalValue || filterColumns.length > 0) {
            let filteredData = [...this.currentRows];

            for (const column of filterColumns) {
                filteredData = filteredData.filter((row) =>
                    this.filterService.rowShouldBeFiltered(row, column)
                );
            }
            if (globalValue) {
                filteredData = filteredData.filter((row) => {
                    return this.columns.find((column) => {
                        const isExcluded = this.notIncludedColumns.find(
                            (notIncludedColumn) => notIncludedColumn.key === column.key
                        );
                        if (isExcluded || row[column.key] == null) {
                            return false;
                        }
                        return row[column.key].toString().includes(globalValue);
                    });
                });
            }

            this.rows = filteredData;
        } else {
            this.rows = [...this.currentRows];
        }
    }

    public exportAsExcel() {
        this.excelService.exportAsExcelFile(
            this.rows,
            'file',
            this.columns.filter(
                (column) => column.visible && !column.hidden && !column.childrenConfig
            )
        );
    }

    private createMessage(type: string, message: Translation): void {
        this.messageService.create(type, message[this.settingsService.language]);
    }

    public hasUnsavedChanges = () => {
        if (
            !this.form ||
            (this.unsavedRowsLength + this.deletedRowsLength + this.newRowsLength === 0 &&
                !this.form.dirty)
        ) {
            return false;
        }
        return true;
    };

    public clearFilters() {
        this.columns.forEach(
            (column) =>
                (column.filter = {
                    ...column.filter,
                    values: [],
                })
        );
        this.mapOfSort = {};
        this.filterRows();
    }

    private getColumnsWithFilter(columns: ImColumn[]): ImColumn[] {
        columns.forEach((column) => {
            const values = column.filter.values;
            if (
                values.length > 0 &&
                values.every(
                    (value: Date | string | number) => value == null || value === ''
                )
            ) {
                column.filter.values = [];
            }
        });

        return columns.filter(
            (column) => column.filter && column.filter.values.length > 0
        );
    }

    openDrawer(row: any): void {
        const foundColumn = this.columns.find(
            (column) => column.key === this.childrenKey
        );
        if (foundColumn) {
            foundColumn.childrenConfig.componentConfig.inputs = {
                dataSource$: of(row[this.childrenKey]),
                columns: this.childColumns,
            };
            const event = new EventEmitter<ChangesEvent>();
            foundColumn.childrenConfig.componentConfig.outputs = {
                changes: event,
            };

            event.subscribe((changes: ChangesEvent) => {
                const updatedRow = {
                    ...row,
                    [this.childrenKey]: changes.currentState,
                };

                if (this.editMode === EditMode.Direct) {
                    this.successSubject
                        .pipe(
                            takeUntil(this.componentDestroyed$),
                            filter((success) => success.action === ImAction.Update),
                            take(1)
                        )
                        .subscribe((success) => {
                            changes.track.next({
                                data: success.data[this.childrenKey],
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
                        track: this.successSubject,
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

            this.componentConfig = foundColumn.childrenConfig.componentConfig;
            this.drawerVisible = true;
        } else {
            this.childrenKey = null;
            this.drawerVisible = false;
        }
    }

    closeDrawer(): void {
        this.drawerVisible = false;
    }

    handleClick(column: ImColumn, row: any, index: number) {
        this.clickInside();

        this.updateFocusedCell(index, column.key);

        if (column.showModalOnClick) {
            this.showValueInModal(row, column);
        }
    }

    @HostListener('document:click') clickout() {
        if (!this.clickedInsideOfBody) {
            this.stillClickedInsideBodySubject.next(false);
        }
        this.clickedInsideOfBody = false;
    }

    @HostListener('document:keydown.ArrowUp', ['$event'])
    @HostListener('document:keydown.ArrowRight', ['$event'])
    @HostListener('document:keydown.ArrowDown', ['$event'])
    @HostListener('document:keydown.ArrowLeft', ['$event'])
    handleEvent(event: KeyboardEvent) {
        if (this.stillClickedInsideBodySubject.value) {
            event.preventDefault();
            this.arrowKeys.next(event);
        }
    }

    public clickInside() {
        this.stillClickedInsideBodySubject.next(true);
        this.clickedInsideOfBody = true;
    }

    contextMenu(event: MouseEvent, menu: NzDropdownMenuComponent, row: any): void {
        if (this.buttons && this.buttons.length > 0 && !event.shiftKey) {
            this.activeRow = row;
            this.nzContextMenuService.create(event, menu);
        }
    }
}
