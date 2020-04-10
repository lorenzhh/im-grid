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
        key: 'active',
        title: 'Active',
        columnType: ImColumnType.Boolean,
        width: 95
    },
    {
        key: 'created',
        title: 'Created at',
        columnType: ImColumnType.Date,
    },
    {
        key: 'rating',
        title: 'Rating',
        columnType: ImColumnType.Rating
    },
    {
        key: 'website',
        title: 'Website',
        columnType: ImColumnType.Website
    },
];
