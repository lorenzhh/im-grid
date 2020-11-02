import { ChildTableComponent, ImColumn, ImColumnType } from 'im-grid';

export const columns: ImColumn[] = [
    {
        key: 'id',
        title: 'Id',
        isUnique: true,
    },
    {
        key: 'bookingYear',
        title: 'Booking Year',
        columnType: ImColumnType.Int,
    },
    {
        key: 'invoiceDate',
        title: 'Invoice Date',
        columnType: ImColumnType.Date,
    },
    {
        key: 'performanceDate',
        title: 'Performance Date',
        columnType: ImColumnType.Date,
    },
    {
        key: 'mandator',
        title: 'Mandator',
        columnType: ImColumnType.Int,
    },
    {
        key: 'formularNo',
        title: 'Formular No',
        columnType: ImColumnType.Int,
    },
    {
        key: 'imoNo',
        title: 'Imo No',
        columnType: ImColumnType.Int,
    },
    {
        key: 'vesselName',
        title: 'Vessel Name',
    },
    {
        key: 'ownerId',
        title: 'Owner Id',
    },
    {
        key: 'paymentDate',
        title: 'Payment Date',
        columnType: ImColumnType.Date,
    },
    {
        key: 'isoCode',
        title: 'Iso Code',
    },
    {
        key: 'tcoHire',
        title: 'Tco Hire',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'freight',
        title: 'Freight',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'startdate',
        title: 'Start date',
        columnType: ImColumnType.Date,
    },
    {
        key: 'enddate',
        title: 'End date',
        columnType: ImColumnType.Date,
    },
    {
        key: 'voyageNo',
        title: 'Voyage No',
    },
    {
        key: 'reference',
        title: 'Reference',
    },
    {
        key: 'username',
        title: 'Username',
    },
    {
        key: 'invoiceId',
        title: 'Invoice Id',
    },
    {
        key: 'errdescription',
        title: 'Err Description',
    },
    {
        key: 'demurrage',
        title: 'Demurrage',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'voyageCode',
        title: 'Voyage Code',
    },
    {
        key: 'tcoDays',
        title: 'Tco Days',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'tcoHirePerDay',
        title: 'Tco Hire Per Day',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'tcoOffhireDays',
        title: 'Tco Off hire Days',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'tcoOffhire',
        title: 'Tco Off hire',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'tcoOffhireComm',
        title: 'Tco Off hire Comm',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'quantity',
        title: 'Quantity',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'unit',
        title: 'Unit',
    },
    {
        key: 'freightType',
        title: 'Freight Type',
    },
    {
        key: 'lumpsum',
        title: 'Lump sum',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'exchangeRate',
        title: 'Exchange Rate',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'brokerRate',
        title: 'Broker Rate',
        columnType: ImColumnType.Decimal,
    },
    {
        key: 'chartererId',
        title: 'Charterer Id',
    },
    {
        key: 'invoiceFields',
        title: 'Invoice Fields',
        childrenConfig: {
            columns: [
                {
                    key: 'id',
                    title: 'Id',
                    isUnique: true,
                },
                {
                    key: 'invoiceId',
                    title: 'invoiceId',
                    visible: false,
                },
                {
                    key: 'caption',
                    title: 'Caption',
                },
                {
                    key: 'value',
                    title: 'Value',
                },
                {
                    key: 'bookingCode',
                    title: 'Booking Code',
                },
            ],
            componentConfig: {
                componentToPort: ChildTableComponent,
            },
        },
    },
];
