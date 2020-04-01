import { Column, ColumnType, FieldType } from 'im-grid';

export const columns: Column[] = [
    {
        key: 'id',
        title: 'ID',
        isUnique: true,
    },
    {
        key: 'isTest',
        title: 'Is Test',
        columnType: ColumnType.Boolean
    },
    {
        key: 'source',
        title: 'Source',
    },
    {
        key: 'value',
        title: 'Value',
        showModalOnClick: true,
        columnType: ColumnType.Xml
    },
    {
        key: 'datatype',
        title: 'Data Type'
    },
    {
        key: 'created',
        title: 'Created at',
        columnType: ColumnType.Date,
    },
    {
        key: 'processed',
        title: 'Processed at',
        columnType: ColumnType.Boolean,
    },
    {
        key: 'processingCode',
        title: 'Processing Code',
        columnType: ColumnType.Int,
    },
    {
        key: 'processingMessage',
        title: 'Processing Message',
        fieldType: FieldType.Textarea,
        showModalOnClick: true
    },
    {
        key: 'retries',
        title: 'Retries',
        columnType: ColumnType.Int,
    },
];
