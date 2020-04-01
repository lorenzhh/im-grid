import { Injectable } from '@angular/core';
import { Language, Locale, Translation } from '../models/settings.model';
import { BehaviorSubject } from 'rxjs';
import { NzI18nService, de_DE, en_US, en_GB } from 'ng-zorro-antd';

export interface Settings {
    language: Language;
    locale: Locale;
}
@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    settings = new BehaviorSubject<Settings>({ language: Language.en, locale: Locale.de });
    private languages = { de: de_DE, en: en_US };

    constructor(private nzI18n: NzI18nService) {
        this.settings.subscribe(settings => {
            this.nzI18n.setLocale(this.languages[settings.language]);
        });
    }

    set language(language: Language) {
        this.settings.next({ ...this.settings.value, language });
    }

    get language() {
        return this.settings.value.language;
    }

    set locale(locale: Locale) {
        this.settings.next({ ...this.settings.value, locale });
    }

    get locale() {
        return this.settings.value.locale;
    }

    dynamicTranslate(
        translation: Translation,
        subjects: { [key: string]: Translation | string | number }
    ): Translation {
        const newWording: Translation = { ...translation };

        return Object.keys(subjects).reduce((result: Translation, key: string) => {
            const subjectValue = subjects[key];
            const type = typeof subjectValue;

            if (type === 'string' || type === 'number' || subjectValue === null) {
                const value = subjectValue || subjectValue === 0 ? subjectValue : '';
                Object.keys(newWording).forEach(language =>
                    result[language] = result.de.split(key).join(value.toString())
                );
            } else if (type === 'object') {
                const value = subjectValue as Translation;
                Object.keys(newWording).forEach(language =>
                    result[language] = result.en.split(key).join(value.en)
                );
            }
            return result;
        }, newWording);
    }
}
