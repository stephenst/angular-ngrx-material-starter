import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CesiumRoutingModule } from './cesium-routing.module';
import { CesiumComponent } from './cesium.component';
import { AngularCesiumModule } from 'angular-cesium';


@NgModule({
    imports: [
        CommonModule,
        AngularCesiumModule,
        CesiumRoutingModule
    ],
    declarations: [
        CesiumComponent
    ]
})
export class CesiumModule {
}
