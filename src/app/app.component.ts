import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Language, Locale, SettingsService } from 'im-grid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  isCollapsed = false;
  Language = Language;
  Locale = Locale;
  value: 0;
  constructor(private settingsService: SettingsService) { }

  changeLanguage(language: Language) {
    this.settingsService.language = language;
  }

  changeLocale(locale: Locale) {
    this.settingsService.locale = locale;
  }

  changeTheme(value: number) {
    document.querySelector('html').style.filter = `hue-rotate(${value}deg)`;
  }
}
