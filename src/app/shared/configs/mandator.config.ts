import { ImColumn, ImColumnType, ImFieldType, ImFilterType } from 'im-grid';

export interface Role {
    id: number,
    role: string
}

export const columns: ImColumn[] = [
    {
        key: 'mandatorId',
        title: 'Mandator Id',
        isUnique: true
    },
    {
        key: 'shortName',
        title: 'Short Name',
        filter: {
            type: ImFilterType.Select
        }
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
    {
        key: 'roles',
        title: 'Roles',
        fieldType: ImFieldType.Select,
        columnType: ImColumnType.Array,
        selectValues: [
            { id: 1, role: 'admin' },
            { id: 2, role: 'user' }
        ],
        labelProperty: 'role',
        valueProperty: 'id',
        multiSelect: true,
        compareFn: (o1: Role, o2: Role) => o1 && o2 ? o1.id === o2.id : o1 === o2,
    }
];
