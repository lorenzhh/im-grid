import { Type } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { SupportTimeOptions } from 'ng-zorro-antd/date-picker';
import { Subject } from 'rxjs';
import { Translation } from './settings.model';

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
  title: Translation | string;
  icon: string;
  func(row: any): void;
}

export interface ImColumn {
  title: Translation | string;
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
  drawerTitle?: (row: any) => string | Translation;
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
