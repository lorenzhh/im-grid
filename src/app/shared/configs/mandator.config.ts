import { ImColumn, ImColumnType } from 'im-grid';

export const columns: ImColumn[] = [
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
        columnType: ImColumnType.Int
    },
    {
        key: 'exportedAt',
        title: 'Static Date Long Title exported At',
        columnType: ImColumnType.Date,
    },
    {
        key: 'created',
        title: 'Created at',
        columnType: ImColumnType.Date,
    },
];
