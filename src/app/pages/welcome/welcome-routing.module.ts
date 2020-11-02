import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
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

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WelcomeRoutingModule {}
