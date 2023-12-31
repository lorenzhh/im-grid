import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'invoice',
    pathMatch: 'full',
  },
  {
    path: ':section',
    component: WelcomeComponent,
  },
];
