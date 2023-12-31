import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Locale, SettingsService } from 'im-grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSliderModule } from 'ng-zorro-antd/slider';

@Component({
  standalone: true,
  imports: [
    NzDividerModule,
    NzLayoutModule,
    NzSliderModule,
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
  isCollapsed = false;
  Locale = Locale;
  value: 0;

  constructor(private settingsService: SettingsService) {}

  changeLanguage(language: string) {
    this.settingsService.language = language;
  }

  changeLocale(locale: Locale) {
    this.settingsService.locale = locale;
  }

  changeTheme(value: number) {
    document.querySelector('html').style.filter = `hue-rotate(${value}deg)`;
  }
}
