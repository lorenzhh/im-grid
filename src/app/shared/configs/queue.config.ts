import { ImColumn, ImColumnType, ImFieldType } from 'im-grid';

export const columns: ImColumn[] = [
    {
        key: 'id',
        title: 'ID',
        isUnique: true,
    },
    {
        key: 'isTest',
        title: 'Is Test',
        columnType: ImColumnType.Boolean
    },
    {
        key: 'source',
        title: 'Source',
    },
    {
        key: 'value',
        title: 'Value',
        showModalOnClick: true,
        columnType: ImColumnType.Xml
    },
    {
        key: 'datatype',
        title: 'Data Type'
    },
    {
        key: 'created',
        title: 'Created at',
        columnType: ImColumnType.Date,
    },
    {
        key: 'processed',
        title: 'Processed',
        columnType: ImColumnType.Boolean,
    },
    {
        key: 'processingCode',
        title: 'Processing Code',
        columnType: ImColumnType.Int,
    },
    {
        key: 'processingMessage',
        title: 'Processing Message',
        fieldType: ImFieldType.Textarea,
        showModalOnClick: true
    },
    {
        key: 'retries',
        title: 'Retries',
        columnType: ImColumnType.Int,
    },
];
