import { Component } from '@angular/core';
import { Language, Locale, SettingsService } from 'im-grid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  Language = Language;
  Locale = Locale;

  constructor(private settingsService: SettingsService) { }

  changeLanguage(language: Language) {
    this.settingsService.language = language;
  }

  changeLocale(locale: Locale) {
    this.settingsService.locale = locale;
  }
}
