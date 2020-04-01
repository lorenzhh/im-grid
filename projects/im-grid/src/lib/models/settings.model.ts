export interface Translation {
    en: string;
    de: string;
}

export enum Language {
    en = 'en',
    de = 'de'
}

export enum Locale {
    de = 'de-DE',
    us = 'en-US',
    gb = 'en-GB'
}

export enum TimeFormats {
    'de-DE' = 'dd.MM.y HH:mm:ss',
    'en-US' = `MM/dd/y h:mm:ss a`,
    'en-GB' = `dd/MM/y h:mm:ss a`
}

export enum DateFormats {
    'de-DE' = 'dd.MM.y',
    'en-US' = `MM/dd/y`,
    'en-GB' = `dd/MM/y`
}
