import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { D3Component } from './d3.component';

const routes: Routes = [
    { path: '', component: D3Component }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class D3RoutingModule { }
