import { BidiModule } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  BgColorsOutline,
  CalendarOutline,
  CheckOutline,
  DownOutline,
  GlobalOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  MoonOutline,
  SunOutline,
} from '@ant-design/icons-angular/icons';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { filter, map } from 'rxjs';
import {
  AppLanguage,
  AppLanguageService,
  AppLocale,
} from './shared/services/app-language.service';
import { DirectionService } from './shared/services/direction.service';
import { ThemeService } from './shared/services/theme.service';

/** Breadcrumb per demo page (mirrors the sidebar menu). */
const PAGES: Record<string, { group: string; title: string }> = {
  mandator: { group: 'Export', title: 'Mandator' },
  queue: { group: 'Import', title: 'Queue' },
  invoice: { group: 'System', title: 'Invoice' },
};

@Component({
  imports: [
    BidiModule,
    NzLayoutModule,
    NzSliderModule,
    NzDropdownModule,
    NzPopoverModule,
    RouterModule,
    NzIconModule,
    NzMenuModule,
    FormsModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private router = inject(Router);
  readonly appLanguage = inject(AppLanguageService);
  readonly themeService = inject(ThemeService);
  readonly directionService = inject(DirectionService);

  isCollapsed = false;

  readonly languages: { value: AppLanguage; label: string; hint: string }[] = [
    { value: 'en', label: 'English', hint: 'English' },
    { value: 'de', label: 'Deutsch', hint: 'German' },
    { value: 'ar', label: 'العربية', hint: 'Arabic' },
  ];

  readonly locales: { value: AppLocale; sample: string }[] = [
    { value: 'de-DE', sample: '31.12.2025 14:30:00' },
    { value: 'en-US', sample: '12/31/2025 2:30:00 PM' },
    { value: 'en-GB', sample: '31/12/2025 2:30:00 PM' },
  ];

  readonly currentLanguage = computed(
    () =>
      this.languages.find(language => language.value === this.appLanguage.language()) ??
      this.languages[0]
  );

  private readonly url = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  /** Breadcrumb for the current page, e.g. "System / Invoice". */
  readonly page = computed(() => PAGES[this.url().split('/').pop()?.split('?')[0] ?? '']);

  readonly hue = signal(0);

  constructor() {
    inject(NzIconService).addIcon(
      SunOutline,
      MoonOutline,
      BgColorsOutline,
      CalendarOutline,
      CheckOutline,
      DownOutline,
      GlobalOutline,
      MenuFoldOutline,
      MenuUnfoldOutline
    );
  }

  changeLanguage(language: AppLanguage) {
    this.appLanguage.language.set(language);
  }

  changeLocale(locale: AppLocale) {
    this.appLanguage.locale.set(locale);
  }

  changeTheme(value: number) {
    this.hue.set(value);
    document.documentElement.style.filter = value ? `hue-rotate(${value}deg)` : '';
  }
}
