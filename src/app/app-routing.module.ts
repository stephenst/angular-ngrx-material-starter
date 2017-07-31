import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SettingsComponent} from './settings';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'about',
        pathMatch: 'full'
    }, {
        path: 'settings',
        component: SettingsComponent
    }, {
        path: 'examples',
        loadChildren: 'app/views/views.module#ExamplesModule',
    }, {
        path: 'd3',
        loadChildren: 'app/views/d3/d3.module#D3Module',
    }, {
        path: '**',
        redirectTo: 'about'
    }
];

@NgModule({
    // useHash supports github.io demo page, remove in your app
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
