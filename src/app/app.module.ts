import { CurrencyPipe, DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import ar from '@angular/common/locales/ar';
import de from '@angular/common/locales/de';
import en from '@angular/common/locales/en';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NgZorroAntdModule } from 'im-grid';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { routes } from './app-routing.module';
import { UnsavedChangesGuard } from './shared/guards/unsaved-changes.guard';
import { GlobalErrorHandler } from './shared/handlers/error.handler';
import { DefaultInterceptor } from './shared/interceptors/default-interceptor';

registerLocaleData(en);
registerLocaleData(de);
registerLocaleData(ar);

@NgModule({
  imports: [
    NgZorroAntdModule,
    NzModalModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [
    provideRouter(routes),
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
    UnsavedChangesGuard,
    {
      provide: NZ_I18N,
      useValue: en_US,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
})
export class AppModule {}
