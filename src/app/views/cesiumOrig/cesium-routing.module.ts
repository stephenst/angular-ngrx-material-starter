import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CesiumOrigComponent } from './cesium.component';

const routes: Routes = [
    { path: '', component: CesiumOrigComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CesiumOrigRoutingModule { }
