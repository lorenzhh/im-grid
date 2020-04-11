import { ValidatorFn } from '@angular/forms';
import { Type } from '@angular/core';
import { Subject } from 'rxjs';

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
    Website = 'Website'
}

export enum ImColumnType {
    Date = 'Date',
    Int = 'Int',
    Currency = 'Currency',
    Decimal = 'Decimal',
    Boolean = 'Boolean',
    Xml = 'Xml',
    Rating = 'Rating',
    Website = 'Website'
}

export enum ImFilterType {
    Boolean,
    Select,
    RangeDate,
    FreeText,
    RangeNumber,
    Rating
}

export interface ImColumn {
    title: string;
    isUnique?: true;
    childrenConfig?: {
        columns: ImColumn[];
        componentConfig: DynamicComponentConfig
    };
    key: string;
    showModalOnClick?: boolean;
    defaultValue?: number | string | boolean;
    validators?: ValidatorFn[];
    fieldType?: ImFieldType;
    selectValues?: string[] | number[] | boolean[];
    columnType?: ImColumnType;
    notEditable?: boolean;
    notCreateable?: boolean;
    width?: number;
    visible?: boolean;
    filter?: ImFilter;
}

export interface ImFilter {
    values?: any[];
    selectValues?: string[] | number[];
    multiSelect?: boolean;
    type?: ImFilterType;
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
