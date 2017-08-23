import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { ScenarioService } from './scenario-service/scenario.service';

@NgModule({
    imports: [
        HttpModule,
        CoreModule,
        SharedModule,
    ],
    providers: [
        ScenarioService
    ]
})
export class ComponentsModule {

    constructor() {
    }

}
