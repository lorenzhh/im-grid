import { Injectable, OnDestroy } from '@angular/core';
import { de_DE, en_US, NzI18nInterface, NzI18nService } from 'ng-zorro-antd/i18n';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { Locale, Translation } from '../models/settings.model';

export interface Settings {
  language: string;
  locale: Locale;
}
@Injectable({
  providedIn: 'root',
})
export class SettingsService implements OnDestroy {
  destroyed$ = new Subject<void>();

  private settingsSubject$ = new BehaviorSubject<Settings>({
    language: 'en',
    locale: Locale.de,
  });

  public settings$ = this.settingsSubject$.asObservable();

  set settings(settings: Settings) {
    this.settingsSubject$.next(settings);
  }

  get settings() {
    return this.settingsSubject$.value;
  }

  private languagesSubject$ = new BehaviorSubject<{
    [language: string]: NzI18nInterface;
  }>({
    de: de_DE,
    en: en_US,
  });

  public languages$ = this.languagesSubject$.asObservable();

  constructor(private nzI18n: NzI18nService) {
    combineLatest([this.settings$, this.languages$])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([settings, languages]) => {
        this.nzI18n.setLocale(languages[settings.language]);
      });
  }

  set languages(languages: { [language: string]: NzI18nInterface }) {
    this.languagesSubject$.next(languages);
  }

  set language(language: string) {
    this.settings = { ...this.settings, language };
  }

  get language() {
    return this.settings.language;
  }

  set locale(locale: Locale) {
    this.settings = { ...this.settings, locale };
  }

  get locale() {
    return this.settings.locale;
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
        Object.keys(newWording).forEach(
          (language) => (result[language] = result.de.split(key).join(value.toString()))
        );
      } else if (type === 'object') {
        const value = subjectValue as Translation;
        Object.keys(newWording).forEach(
          (language) => (result[language] = result.en.split(key).join(value.en))
        );
      }
      return result;
    }, newWording);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
