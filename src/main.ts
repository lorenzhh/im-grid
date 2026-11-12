import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  enableProdMode,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';
import { inject } from '@angular/core';
import { provideImGrid } from 'im-grid';
import { gridTextsAr, gridTextsDe } from './app/shared/i18n/grid-texts';
import { AppLanguageService } from './app/shared/services/app-language.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(AppModule),
    provideBrowserGlobalErrorListeners(),
    provideNzDateFnsAdapter(),
    provideImGrid(() => {
      const app = inject(AppLanguageService);
      return {
        language: app.language,
        locale: app.locale,
        dateTimeFormat: app.dateTimeFormat,
        dateFormat: app.dateFormat,
        texts: { de: gridTextsDe, ar: gridTextsAr },
      };
    }),
  ],
});
