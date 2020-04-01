import { NgModule } from '@angular/core';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    WelcomeRoutingModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    WelcomeComponent
  ],
})
export class WelcomeModule { }
