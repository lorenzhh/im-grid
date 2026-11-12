import { Type } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { SupportTimeOptions } from 'ng-zorro-antd/date-picker';
import { Subject } from 'rxjs';
import { ImText } from '../i18n/im-grid-i18n';
import { ImSummaryFn } from './summary.model';

export enum ImFieldType {
  None = 'None',
  Date = 'Date',
  Currency = 'Currency',
  Number = 'Number',
  Text = 'Text',
  Checkbox = 'Checkbox',
  Textarea = 'Textarea',
  Select = 'Select',
  Rating = 'Rating',
  Website = 'Website',
}

export enum ImColumnType {
  Date = 'Date',
  Int = 'Int',
  Currency = 'Currency',
  Decimal = 'Decimal',
  Boolean = 'Boolean',
  Xml = 'Xml',
  Rating = 'Rating',
  Website = 'Website',
  Array = 'Array',
  Object = 'Object',
  Avatar = 'Avatar',
  Color = 'Color',
}

export enum ImFilterType {
  Boolean,
  Select,
  RangeDate,
  FreeText,
  RangeNumber,
  Rating,
}

export interface ImButton {
  title: ImText;
  icon: string;
  /** Shows the action in red (e.g. destructive actions). */
  danger?: boolean;
  func(row: any): void;
}

export interface ImColumn {
  title: ImText;
  isUnique?: true;
  childrenConfig?: {
    columns: ImColumn[];
    componentConfig: DynamicComponentConfig;
  };
  key: string;
  showModalOnClick?: boolean;
  defaultValue?: number | string | boolean;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  fieldType?: ImFieldType;
  selectValues?: unknown[];
  multiSelect?: boolean;
  labelProperty?: string;
  valueProperty?: string;
  compareFn?: (option1: any, option2: any) => boolean;
  columnType?: ImColumnType;
  editable?: boolean;
  creatable?: boolean;
  width?: number;
  sortKey?: string;
  hiddenForm?: boolean;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
  hidden?: boolean;
  ngStyle?: object;
  filter?: ImFilter;
  zoom?: boolean;
  resizable?: boolean;
  copy?: boolean;
  showSeconds?: boolean;
  nzShowTime?: BooleanInput | SupportTimeOptions | null | undefined;
  avatarShape?: 'circle' | 'square';
  drawerTitle?: (row: any) => ImText;
  /**
   * Value for this column in the summary row pinned to the bottom of the grid.
   * Use a ready-made one (`ImSummary.sum`, `average`, `count`, `min`, `max`) or your own:
   * `({ rows, values }) => ...`. The row is shown as soon as one visible column has a summary.
   */
  summary?: ImSummaryFn;
}

export interface ImSelectOption {
  id: number | string;
  [label: string]: string | number;
}

export interface ImFilter {
  values?: any[];
  selectValues?: unknown[];
  multiSelect?: boolean;
  type?: ImFilterType;
}

export interface DynamicComponentConfig {
  inputs?: object;
  outputs?: object;
  componentToPort: Type<any>;
}

export enum EditMode {
  Direct = 'Direct',
  Cache = 'Cache',
}

export enum SelectionMode {
  Checkbox = 'Checkbox',
}

export interface ChangeEvent {
  row: any;
  track: Subject<ImTrack>;
  action: ImAction;
}

export interface ChangesEvent {
  saved: any[];
  deletedIds: any[];
  new: any[];
  currentState: any[];
  action: ImAction;
  track: Subject<ImTrack>;
}

export interface ImTrack {
  data: boolean | any;
  action: ImAction;
}

export interface CellCoordinates {
  rowIndex: number;
  key: string;
}

export enum ImDirection {
  LEFT,
  RIGHT,
  TOP,
  Bottom,
}

export enum ImAction {
  CREATE,
  ADD,
  Update,
  Delete,
  SaveAll,
}

export type Size = 'small' | 'middle' | 'default';
