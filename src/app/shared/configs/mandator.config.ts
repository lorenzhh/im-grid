import { Column, ColumnType } from 'im-grid';

export const columns: Column[] = [
    {
        key: 'mandatorId',
        title: 'Mandator Id',
        isUnique: true
    },
    {
        key: 'shortName',
        title: 'Short Name',
    },
    {
        key: 'no',
        title: 'No',
        columnType: ColumnType.Int
    },
    {
        key: 'exportedAt',
        title: 'Static Date Long Title exported At',
        columnType: ColumnType.Date,
    },
    {
        key: 'created',
        title: 'Created at',
        columnType: ColumnType.Date,
    },
];
