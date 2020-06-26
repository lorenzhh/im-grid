import { NgModule } from '@angular/core';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    WelcomeRoutingModule,
    SharedModule
  ],
  declarations: [
    WelcomeComponent
  ],
})
export class WelcomeModule { }
