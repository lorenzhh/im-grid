import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'welcome',
    },
    {
        path: 'welcome',
        loadChildren: () =>
            import('./pages/welcome/welcome.module').then((m) => m.WelcomeModule),
    },
    {
        path: '**',
        redirectTo: 'welcome',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
