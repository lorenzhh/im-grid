import { ImColumn, ImColumnType, ImFilterType, ImSummary } from 'im-grid';

export interface Role {
  id: number;
  role: string;
}

export const columns: ImColumn[] = [
  {
    key: 'mandatorId',
    title: { en: 'Mandator Id', de: 'Mandanten-ID', ar: 'معرّف العميل' },
    isUnique: true,
    // ready-made: number of rows shown
    summary: ImSummary.count,
  },
  {
    key: 'color',
    title: { en: 'Color', de: 'Farbe', ar: 'اللون' },
    columnType: ImColumnType.Color,
    width: 50,
  },
  {
    key: 'shortName',
    title: { en: 'Short Name', de: 'Kurzname', ar: 'الاسم المختصر' },
    filter: {
      type: ImFilterType.Select,
    },
    // custom: distinct values, with a translated label
    summary: ({ values }) => ({
      label: { en: 'Unique', de: 'Eindeutig', ar: 'فريدة' },
      value: new Set(values.filter(Boolean)).size,
    }),
  },
  {
    key: 'no',
    title: { en: 'No', de: 'Nr.', ar: 'الرقم' },
    columnType: ImColumnType.Int,
    summary: ImSummary.sum,
  },
  {
    key: 'exportedAt',
    title: {
      en: 'Static Date Long Title exported At',
      de: 'Statisches Datum, lange Überschrift, exportiert am',
      ar: 'تاريخ التصدير الثابت بعنوان طويل',
    },
    columnType: ImColumnType.Date,
    // earliest date, formatted like the cells
    summary: ImSummary.min,
  },
  {
    key: 'active',
    title: { en: 'Active', de: 'Aktiv', ar: 'نشط' },
    columnType: ImColumnType.Boolean,
  },
  {
    key: 'created',
    title: { en: 'Created at', de: 'Erstellt am', ar: 'تاريخ الإنشاء' },
    columnType: ImColumnType.Date,
    summary: ImSummary.max,
  },
  {
    key: 'rating',
    title: { en: 'Rating', de: 'Bewertung', ar: 'التقييم' },
    columnType: ImColumnType.Rating,
    // custom: reuse a ready-made helper and shape its result
    summary: context => {
      const { value } = ImSummary.average(context) as { value: number | null };
      return value == null ? null : `Ø ${value.toFixed(1)} ★`;
    },
  },
  {
    key: 'website',
    title: { en: 'Website', de: 'Webseite', ar: 'الموقع الإلكتروني' },
    columnType: ImColumnType.Website,
  },
  {
    key: 'roles',
    title: { en: 'Roles', de: 'Rollen', ar: 'الأدوار' },
    columnType: ImColumnType.Array,
    selectValues: [
      { id: 1, role: 'admin' },
      { id: 2, role: 'user' },
    ],
    labelProperty: 'role',
    valueProperty: 'id',
    multiSelect: true,
    compareFn: (o1: Role, o2: Role) => (o1 && o2 ? o1.id === o2.id : o1 === o2),
    // custom: works on any row data, here the number of admins
    summary: ({ rows }) => ({
      label: { en: 'Admins', de: 'Admins', ar: 'المسؤولون' },
      value: rows.filter(row => (row.roles as Role[])?.some(role => role.id === 1))
        .length,
    }),
  },
];
