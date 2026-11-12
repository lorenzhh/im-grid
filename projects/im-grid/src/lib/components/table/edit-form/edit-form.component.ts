import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ImGridI18n } from '../../../i18n/im-grid-i18n';
import { ImColumn, ImColumnType, ImFieldType } from '../../../models/column.model';
import { FirstPropertyPipe } from '../../../pipes/first-property.pipe';
import { FormatPipe } from '../../../pipes/format.pipe';
import { ImTextPipe } from '../../../pipes/text.pipe';
import { TypeofPipe } from '../../../pipes/typeof.pipe';

/** Form fields of a column, as far as the edit form is concerned. */
export function formFieldsOf(columns: ImColumn[] | undefined): ImColumn[] {
  return (columns ?? []).filter(
    column => column.fieldType !== ImFieldType.None && !column.hiddenForm
  );
}

@Component({
  imports: [
    NzInputModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzFormModule,
    NzIconModule,
    NzSwitchModule,
    ImTextPipe,
    FirstPropertyPipe,
    TypeofPipe,
    NzDatePickerModule,
    FormatPipe,
    NzRateModule,
    NzInputNumberComponent,
  ],
  selector: 'im-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFormComponent {
  readonly form = input<FormGroup>();
  readonly columns = input<ImColumn[]>();
  /** Ctrl/⌘ + Enter inside the form. */
  readonly submitted = output<KeyboardEvent>();

  readonly i18n = inject(ImGridI18n);
  ImColumnType = ImColumnType;
  ImFieldType = ImFieldType;

  private readonly fields = computed(() => formFieldsOf(this.columns()));

  /** Fields that can't be edited here (e.g. the id): shown as a summary when they have a value. */
  readonly readonlyFields = computed(() =>
    this.fields().filter(column => {
      const control = this.form()?.get(column.key);
      return control?.disabled && control.value != null && control.value !== '';
    })
  );

  /** Editable booleans, shown as a list of switches. */
  readonly toggleFields = computed(() =>
    this.fields().filter(
      column =>
        column.fieldType === ImFieldType.Checkbox && this.form()?.get(column.key)?.enabled
    )
  );

  /** Every other editable field; long text last so it can span the full width. */
  readonly inputFields = computed(() => {
    const editable = this.fields().filter(
      column =>
        column.fieldType !== ImFieldType.Checkbox && this.form()?.get(column.key)?.enabled
    );
    return [
      ...editable.filter(column => column.fieldType !== ImFieldType.Textarea),
      ...editable.filter(column => column.fieldType === ImFieldType.Textarea),
    ];
  });

  defaultCompareWith = (o1: any, o2: any) => o1 === o2;

  constructor() {
    // focus the first editable field when the dialog opens
    const host: HTMLElement = inject(ElementRef).nativeElement;
    afterNextRender(() => {
      const first = host.querySelector<HTMLElement>(
        'input:not([disabled]):not([type="hidden"]), textarea:not([disabled])'
      );
      first?.focus({ preventScroll: true });
    });
  }

  isRequired(key: string): boolean {
    return !!this.form()?.get(key)?.hasValidator(Validators.required);
  }
}
