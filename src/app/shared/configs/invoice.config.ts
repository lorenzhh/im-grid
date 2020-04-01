import { ChildTableComponent, ColumnType, Column } from 'im-grid';

export const columns: Column[] = [
    {
        key: 'id',
        title: 'Id',
        isUnique: true,
    },
    {
        key: 'bookingYear',
        title: 'Booking Year',
        columnType: ColumnType.Int
    },
    {
        key: 'invoiceDate',
        title: 'Invoice Date',
        columnType: ColumnType.Date,
    },
    {
        key: 'performanceDate',
        title: 'Performance Date',
        columnType: ColumnType.Date,
    },
    {
        key: 'mandator',
        title: 'Mandator',
        columnType: ColumnType.Int
    },
    {
        key: 'formularNo',
        title: 'Formular No',
        columnType: ColumnType.Int
    },
    {
        key: 'imoNo',
        title: 'Imo No',
        columnType: ColumnType.Int
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
        columnType: ColumnType.Date,
    },
    {
        key: 'isoCode',
        title: 'Iso Code',
    },
    {
        key: 'tcoHire',
        title: 'Tco Hire',
        columnType: ColumnType.Decimal
    },
    {
        key: 'freight',
        title: 'Freight',
        columnType: ColumnType.Decimal
    },
    {
        key: 'startdate',
        title: 'Start date',
        columnType: ColumnType.Date,
    },
    {
        key: 'enddate',
        title: 'End date',
        columnType: ColumnType.Date,
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
        columnType: ColumnType.Decimal
    },
    {
        key: 'voyageCode',
        title: 'Voyage Code',
    },
    {
        key: 'tcoDays',
        title: 'Tco Days',
        columnType: ColumnType.Decimal
    },
    {
        key: 'tcoHirePerDay',
        title: 'Tco Hire Per Day',
        columnType: ColumnType.Decimal
    },
    {
        key: 'tcoOffhireDays',
        title: 'Tco Off hire Days',
        columnType: ColumnType.Decimal
    },
    {
        key: 'tcoOffhire',
        title: 'Tco Off hire',
        columnType: ColumnType.Decimal
    },
    {
        key: 'tcoOffhireComm',
        title: 'Tco Off hire Comm',
        columnType: ColumnType.Decimal
    },
    {
        key: 'quantity',
        title: 'Quantity',
        columnType: ColumnType.Decimal
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
        columnType: ColumnType.Decimal
    },
    {
        key: 'exchangeRate',
        title: 'Exchange Rate',
        columnType: ColumnType.Decimal
    },
    {
        key: 'brokerRate',
        title: 'Broker Rate',
        columnType: ColumnType.Decimal
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
                    isUnique: true
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
                componentToPort: ChildTableComponent
            }
        }
    },
];
