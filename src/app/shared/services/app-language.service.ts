import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { NzI18nService, ar_EG, de_DE, en_US } from 'ng-zorro-antd/i18n';

export type AppLanguage = 'en' | 'de' | 'ar';
export type AppLocale = 'de-DE' | 'en-US' | 'en-GB';

/** The app's own date formats per locale (the grid only knows a neutral default). */
const DATE_TIME_FORMATS: Record<AppLocale, string> = {
  'de-DE': 'dd.MM.y HH:mm:ss',
  'en-US': 'MM/dd/y h:mm:ss a',
  'en-GB': 'dd/MM/y h:mm:ss a',
};

const DATE_FORMATS: Record<AppLocale, string> = {
  'de-DE': 'dd.MM.y',
  'en-US': 'MM/dd/y',
  'en-GB': 'dd/MM/y',
};

/**
 * The demo app's language state. The grid reads it through `provideImGrid` (see main.ts);
 * ng-zorro's own locale is the app's job, so it is set here.
 */
@Injectable({ providedIn: 'root' })
export class AppLanguageService {
  private nzI18n = inject(NzI18nService);
  private nzLocales = { en: en_US, de: de_DE, ar: ar_EG };

  readonly language = signal<AppLanguage>('en');
  readonly locale = signal<AppLocale>('de-DE');
  readonly dateTimeFormat = computed(() => DATE_TIME_FORMATS[this.locale()]);
  readonly dateFormat = computed(() => DATE_FORMATS[this.locale()]);

  constructor() {
    effect(() => this.nzI18n.setLocale(this.nzLocales[this.language()]));
  }
}
