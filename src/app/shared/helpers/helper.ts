import { ImColumn, ImColumnType } from 'im-grid';

export const generate = (times: number, columns: ImColumn[]) => {
    const array: any[] = [];

    for (let index = 0; index < times; index++) {
        const generatedRow = {};
        columns.forEach((column) => {
            if (column.isUnique) {
                generatedRow[column.key] = randomUuid();
            } else {
                if (column.childrenConfig) {
                    generatedRow[column.key] = [
                        { id: randomUuid() },
                        { id: randomUuid() },
                    ];
                } else {
                    switch (column.columnType) {
                        case ImColumnType.Boolean:
                            generatedRow[column.key] = randomBoolean();
                            break;
                        case ImColumnType.Rating:
                            generatedRow[column.key] = randomNumber(1, 5, true);
                            break;
                        case ImColumnType.Array:
                            generatedRow[column.key] = [{ id: 1, role: 'admin' }];
                            break;
                        case ImColumnType.Object:
                            generatedRow[column.key] = { id: 1, role: 'admin' };
                            break;
                        case ImColumnType.Currency:
                            generatedRow[column.key] = randomNumber(1, 1000);
                            break;
                        case ImColumnType.Website:
                            generatedRow[column.key] = randomUrl();
                            break;
                        case ImColumnType.Date:
                            generatedRow[column.key] = randomDate(
                                new Date(0),
                                new Date()
                            ).toISOString();
                            break;
                        case ImColumnType.Decimal:
                        case ImColumnType.Int:
                            generatedRow[column.key] = randomNumber(123, 8432);
                            break;
                        case ImColumnType.Xml:
                            generatedRow[column.key] = randomXml(randomNumber(10, 30));
                            break;
                        default:
                            generatedRow[column.key] = randomText(randomNumber(90, 330));
                    }
                }
            }
        });
        array.push(generatedRow);
    }
    return array;
};

export const randomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const randomUrl = (): string => {
    // TODO: create an url generator
    return 'https://www.google.com';
};

export const randomBoolean = (): boolean => {
    return Math.random() >= 0.5;
};

export const randomNumber = (min: number, max: number, allowHalf = false): number => {
    return allowHalf
        ? Math.floor(Math.random() * (max - min + 1) + min) - (randomBoolean() ? 0.5 : 0)
        : Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomText = (length: number, possibleLetters?: string): string => {
    let text = '';
    const possible =
        possibleLetters ||
        'ABCD E F GH  IJ KLM NOabcdefghijklnopqrstuvwxyz PQRSTUVWXYZ1234567890,./;[]=-)(*&^%$#@!~`';

    for (let index = 0; index < length; index++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

export const randomUuid = (): string => {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && performance.now() * 1000) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let random = Math.random() * 16;
        /* tslint:disable:no-bitwise */
        if (d > 0) {
            random = (d + random) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            random = (d2 + random) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16);
        /* tslint:enable:no-bitwise */
    });
};

export const randomXml = (keysLength: number): string => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?><generated>';
    const end = '</generated>';

    for (let index = 0; index < keysLength; index++) {
        const key = randomText(10, 'abcdefghijklmnopqrstuvwxyz');
        const value = randomText(20);
        xml += '<' + key + '>' + value + '</' + key + '>';
    }
    xml += end;
    return xml;
};
