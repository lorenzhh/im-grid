import { NgModule, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N, en_US } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData, DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import en from '@angular/common/locales/en';
import de from '@angular/common/locales/de';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DefaultInterceptor } from './shared/interceptors/default-interceptor';
import { GlobalErrorHandler } from './shared/handlers/error.handler';
import { UnsavedChangesGuard } from './shared/guards/unsaved-changes.guard';

registerLocaleData(en);
registerLocaleData(de);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SharedModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
    UnsavedChangesGuard,
    {
      provide: NZ_I18N,
      useValue: en_US
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
