import {
  enableProdMode,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(AppModule),
    provideBrowserGlobalErrorListeners(),
  ],
});
