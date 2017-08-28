import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AcNotification} from '../../../../models/ac-notification';
import {AcLayerComponent} from 'angular-cesium';
import {TracksDataProvider} from '@app/views/cesium/services/dataProvider/tracksDataProvider.service';

@Component({
    selector: 'anms-dynamic-polyline-layer',
    templateUrl: 'dynamic-polyline-layer.component.html',
    styleUrls: ['dynamic-polyline-layer.component.css'],
    providers: [TracksDataProvider]
})
export class DynamicPolylineLayerComponent implements OnInit {
    @ViewChild(AcLayerComponent) layer: AcLayerComponent;

    polylines$: Observable<AcNotification>;
    Cesium = Cesium;
    show = true;

    constructor(private tracksDataProvider: TracksDataProvider) {
    }

    ngOnInit() {
        // this.polylines$ = this.tracksDataProvider.get();
    }

    removeAll() {
        this.layer.removeAll();
    }

    setShow($event) {
        this.show = $event;
    }

}
