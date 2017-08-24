import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CesiumRoutingModule } from './cesium-routing.module';
import { CesiumComponent } from './cesium.component';
import { AngularCesiumModule } from 'angular-cesium';
import { ScenarioService } from '@app/components/scenario-service/scenario.service';


@NgModule({
    imports: [
        HttpClientModule,
        CommonModule,
        AngularCesiumModule,
        CesiumRoutingModule
    ],
    declarations: [
        CesiumComponent
    ],
    providers: [
        ScenarioService
    ]
})
export class CesiumModule {
}
