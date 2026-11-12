import {
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  computed,
  inject,
  makeEnvironmentProviders,
  signal,
} from '@angular/core';
import { IM_GRID_TEXTS_EN, ImGridTexts } from './im-grid-texts';

/**
 * A text the host app hands to the grid (column titles, label, button titles, validator
 * messages): either a plain string, or one string per language, e.g.
 * `{ en: 'Code', ar: 'الرمز', de: 'Code' }`.
 */
export type ImText = string | { [language: string]: string };

/** Anything that returns the current value: a signal, a computed or a plain function. */
export type ImReactive<T> = () => T;

export interface ImGridConfig {
  /**
   * The app's current language, e.g. `'en'`, `'ar'`, `'de-AT'`. Pass a signal and the grid
   * follows language switches automatically. Default: `'en'`.
   */
  language?: ImReactive<string>;

  /**
   * Texts per language. Every language is merged over English, so a partial object is enough.
   * `'de-AT'` falls back to `'de'`, then English.
   *
   * @example { ar: arabicTexts, de: { new: 'Neu', save: 'Speichern' } }
   */
  texts?: { [language: string]: Partial<ImGridTexts> };

  /**
   * Locale for number formatting (must be registered with `registerLocaleData`).
   * Default: `'de-DE'`.
   */
  locale?: ImReactive<string>;

  /** Date format (Angular `DatePipe` syntax) for date filters. Default: `'dd.MM.y'`. */
  dateFormat?: ImReactive<string>;

  /**
   * Date-time format (Angular `DatePipe` syntax) for date cells and the edit form.
   * Default: `'dd.MM.y HH:mm:ss'`; columns with `showSeconds: false` drop `:ss`.
   */
  dateTimeFormat?: ImReactive<string>;
}

export const IM_GRID_CONFIG = new InjectionToken<ImGridConfig>('IM_GRID_CONFIG', {
  providedIn: 'root',
  factory: () => ({}),
});

/**
 * Configures every `im-grid` in the app. Pass a config object, or a factory function: the
 * factory runs in an injection context, so it can `inject()` the app's own services.
 *
 * @example
 * provideImGrid(() => {
 *   const settings = inject(SettingsService);
 *   return {
 *     language: settings.language, // Signal<string>
 *     texts: { ar: arabicTexts, de: germanTexts }, // Partial<ImGridTexts> each
 *   };
 * })
 */
export function provideImGrid(
  config: ImGridConfig | (() => ImGridConfig)
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: IM_GRID_CONFIG,
      useFactory: typeof config === 'function' ? config : () => config,
    },
  ]);
}

const DEFAULT_LOCALE = 'de-DE';
const DEFAULT_DATE_FORMAT = 'dd.MM.y';
const DEFAULT_DATE_TIME_FORMAT = 'dd.MM.y HH:mm:ss';

/**
 * Resolves texts, language and formats for one grid. Provided per `im-grid`, so a grid's
 * `[texts]` input only affects that grid.
 */
@Injectable()
export class ImGridI18n {
  private config = inject(IM_GRID_CONFIG);
  private overrides = signal<ImReactive<Partial<ImGridTexts> | undefined>>(() => undefined);

  readonly language = computed(() => this.config.language?.() || 'en');

  readonly locale = computed(() => this.config.locale?.() || DEFAULT_LOCALE);

  /** All texts for the current language: English ← base language ← language ← grid overrides. */
  readonly texts = computed<ImGridTexts>(() => {
    const language = this.language();
    const perLanguage = this.config.texts ?? {};
    return {
      ...IM_GRID_TEXTS_EN,
      ...perLanguage[baseLanguage(language)],
      ...perLanguage[language],
      ...this.overrides()(),
    };
  });

  readonly dateTimeFormat = computed(
    () => this.config.dateTimeFormat?.() || DEFAULT_DATE_TIME_FORMAT
  );

  readonly dateFormat = computed(() => this.config.dateFormat?.() || DEFAULT_DATE_FORMAT);

  /** Changes whenever formatting output may change; used to re-run pure format pipes. */
  readonly formatKey = computed(
    () => `${this.language()}|${this.locale()}|${this.dateTimeFormat()}`
  );

  /** Lets a single grid override some texts (its `[texts]` input). */
  useOverrides(source: ImReactive<Partial<ImGridTexts> | undefined>) {
    this.overrides.set(source);
  }

  /** Resolves a host-provided text (string or per-language object) for the current language. */
  translate(text: ImText | null | undefined): string {
    if (text == null) {
      return '';
    }
    if (typeof text === 'string') {
      return text;
    }
    const language = this.language();
    return (
      text[language] ??
      text[baseLanguage(language)] ??
      text['en'] ??
      Object.values(text)[0] ??
      ''
    );
  }

  /** Fills `{name}` placeholders, e.g. `format(texts.deletedSuccessfully, { count: 3 })`. */
  format(template: string, params: { [name: string]: string | number }): string {
    return template.replace(/\{(\w+)\}/g, (match, name) =>
      name in params ? String(params[name]) : match
    );
  }
}

function baseLanguage(language: string): string {
  return language.split(/[-_]/)[0];
}
