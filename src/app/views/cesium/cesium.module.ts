import 'hammerjs';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './cesium.component';
import {AngularCesiumModule} from 'angular-cesium';
import {SettingsFormComponent} from './shared/settings-form/settings-form.component';
import {TracksLayerComponent} from './components/tracks-layer/tracks-layer.component';
import {EllipseLayerComponent} from './components/ellipse-layer/ellipse-layer.component';
import {BaseLayerComponent} from './components/base-layer/base-layer.component';
import {DynamicEllipseLayerComponent} from './components/dynamic-ellipse-layer/dynamic-ellipse-layer.component';
import {DynamicPolylineLayerComponent} from './components/dynamic-polyline-layer/dynamic-polyline-layer.component';
import {PolygonLayerComponent} from './components/polygon-layer/polygon-layer.component';
import {EventTestLayerComponent} from './components/event-test-layer/event-test-layer.component';
import {ArcLayerComponent} from './components/arc-layer/arc-layer.component';
import {DynamicCircleLayerComponent} from './components/dynamic-circle-layer/dynamic-circle-layer.component';
import {PointLayerComponent} from './components/point-layer/point-layer.component';
import {TracksDialogComponent} from './components/tracks-layer/track-dialog/track-dialog.component';
import {DrawOnMapComponent} from './components/draw-on-map-layer/draw-on-map-layer.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppMaterialModule} from './cesium.material.module';
import {DemoMapComponent} from './components/demo-map/demo-map.component';
import {MaxValidatorDirective} from './shared/settings-form/max-validtor.directive';
import {MinValidatorDirective} from './shared/settings-form/min-validator.directive';
import {MapsLayerComponent} from './components/maps-layer/maps-layer.component';
import {ModelsLayerComponent} from './components/models-layer/models-layer.component';


@NgModule({
    declarations: [
        AppComponent,
        SettingsFormComponent,
        TracksLayerComponent,
        TracksDialogComponent,
        BaseLayerComponent,
        DynamicEllipseLayerComponent,
        DynamicCircleLayerComponent,
        EllipseLayerComponent,
        DynamicPolylineLayerComponent,
        PolygonLayerComponent,
        EventTestLayerComponent,
        ArcLayerComponent,
        PointLayerComponent,
        TracksDialogComponent,
        DrawOnMapComponent,
        DemoMapComponent,
        MapsLayerComponent,
        ModelsLayerComponent,
        MaxValidatorDirective,
        MinValidatorDirective,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AngularCesiumModule,
        BrowserAnimationsModule,
        AppMaterialModule
    ],
    entryComponents: [TracksDialogComponent],
    bootstrap: [AppComponent]
})
export class CesiumModule {
}
