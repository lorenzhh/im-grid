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
    Website = 'Website',
    Array = 'Array',
    Object = 'Object',
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
    selectValues?: string[] | number[] | boolean[] | ImSelectOption[];
    multiSelect?: boolean,
    labelProperty?: string,
    valueProperty?: string,
    compareFn?: (option1: any, option2: any) => boolean
    columnType?: ImColumnType;
    editable?: boolean;
    creatable?: boolean;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    visible?: boolean;
    hidden?: boolean;
    filter?: ImFilter;
    zoom?: boolean;
    copy?: boolean;
}

export interface ImSelectOption {
    id: number,
    [label: string]: string | number,
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
    Direct = 'Direct',
    Cache = 'Cache'
}

export enum SelectionMode {
    Checkbox = 'Checkbox'
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

export interface CellCoordinates {
    rowIndex: number;
    key: string;
}

export enum ImDirection {
    LEFT,
    RIGHT,
    TOP,
    Bottom
}