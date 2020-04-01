import { CurrencyPipe, DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import de from '@angular/common/locales/de';
import en from '@angular/common/locales/en';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { en_US, NZ_I18N } from 'ng-zorro-antd';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UnsavedChangesGuard } from './shared/guards/unsaved-changes.guard';
import { GlobalErrorHandler } from './shared/handlers/error.handler';
import { DefaultInterceptor } from './shared/interceptors/default-interceptor';
import { SharedModule } from './shared/shared.module';


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
