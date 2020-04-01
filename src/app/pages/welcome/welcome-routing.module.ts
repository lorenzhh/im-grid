import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { UnsavedChangesGuard } from 'src/app/shared/guards/unsaved-changes.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'invoice',
    pathMatch: 'full'
  },
  {
    path: ':section',
    component: WelcomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
