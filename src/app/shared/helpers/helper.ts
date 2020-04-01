import { Column, ColumnType } from 'im-grid';

export const generate = (times: number, columns: Column[]) => {
    const array: any[] = [];

    for (let index = 0; index < times; index++) {
        const generatedRow = {};
        columns.forEach(column => {
            if (column.isUnique) {
                generatedRow[column.key] = randomUuid();
            } else if (column.childrenConfig) {
                generatedRow[column.key] = [
                    { id: randomUuid() },
                    { id: randomUuid() },
                ];
            } else {
                switch (column.columnType) {
                    case ColumnType.Boolean:
                        generatedRow[column.key] = randomBoolean();
                        break;
                    case ColumnType.Date:
                        generatedRow[column.key] = randomDate(new Date(0), new Date()).toISOString();
                        break;
                    case ColumnType.Decimal:
                    case ColumnType.Int:
                        generatedRow[column.key] = randomNumber(123, 8432);
                        break;
                    case ColumnType.Xml:
                        generatedRow[column.key] = randomXml(randomNumber(10, 30));
                        break;
                    default:
                        generatedRow[column.key] = randomText(randomNumber(90, 330));
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

export const randomBoolean = (): boolean => {
    return Math.random() >= 0.5;
};

export const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + 0);
};

export const randomText = (length: number, possibleLetters?: string): string => {
    let text = '';
    const possible = possibleLetters || 'ABCD E F GH  IJ KLM NOabcdefghijklnopqrstuvwxyz PQRSTUVWXYZ1234567890,./;[]\=-)(*&^%$#@!~`';

    for (let index = 0; index < length; index++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

export const randomUuid = (): string => {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
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
        return (c === 'x' ? random : (random & 0x3 | 0x8)).toString(16);
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
