import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CesiumOrigRoutingModule } from './cesium-routing.module';
import { CesiumOrigComponent } from './cesium.component';
import { AngularCesiumModule } from 'angular-cesium';
import { ScenarioService } from '@app/components/scenario-service/scenario.service';


@NgModule({
    imports: [
        HttpClientModule,
        CommonModule,
        AngularCesiumModule,
        CesiumOrigRoutingModule
    ],
    declarations: [
        CesiumOrigComponent
    ],
    providers: [
        ScenarioService
    ]
})
export class CesiumOrigModule {
}
