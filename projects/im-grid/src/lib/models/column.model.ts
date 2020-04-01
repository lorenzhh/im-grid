import { ValidatorFn } from '@angular/forms';
import { Type } from '@angular/core';
import { Subject } from 'rxjs';

export enum FieldType {
    None = 'None',
    Date = 'Date',
    Currency = 'Currency',
    Number = 'Number',
    Text = 'Text',
    Checkbox = 'Checkbox',
    Textarea = 'Textarea',
    Select = 'Select',
}

export enum ColumnType {
    Date = 'Date',
    Int = 'Int',
    Currency = 'Currency',
    Decimal = 'Decimal',
    Boolean = 'Boolean',
    Xml = 'Xml',
}

export enum FilterType {
    Boolean,
    Select,
    RangeDate,
    FreeText,
    RangeNumber
}

export interface Column {
    title: string;
    isUnique?: true;
    childrenConfig?: {
        columns: Column[];
        componentConfig: DynamicComponentConfig
    };
    key: string;
    showModalOnClick?: boolean;
    defaultValue?: number | string | boolean;
    validators?: ValidatorFn[];
    fieldType?: FieldType;
    selectValues?: string[] | number[] | boolean[];
    columnType?: ColumnType;
    notEditable?: boolean;
    notCreateable?: boolean;
    width?: number;
    visible?: boolean;
    filter?: Filter;
}

export interface Filter {
    values?: any;
    selectValues?: string[] | number[];
    multiSelect?: boolean;
    type?: FilterType;
}

export interface DynamicComponentConfig {
    inputs?: object;
    outputs?: object;
    componentToPort: Type<any>;
}

export enum EditMode {
    direct,
    cache
}

export enum SelectionMode {
    checkbox,
    radio
}

export interface ChangeEvent {
    row: any;
    track: Subject<boolean | any>;
}

export interface ChangesEvent {
    saved: any[];
    deletedIds: any[];
    new: any[];
    currentState: any[];
    track: Subject<boolean | any>;
}

export interface CellCordinates {
    rowIndex: number;
    key: string;
}
