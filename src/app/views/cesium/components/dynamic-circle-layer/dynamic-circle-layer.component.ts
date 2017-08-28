import {Component, OnInit, ViewChild} from '@angular/core';
import {AcNotification} from '../../../../models/ac-notification';
import {Observable} from 'rxjs/observable';
import {AcLayerComponent} from 'angular-cesium';
import {TracksDataProvider} from '@app/views/cesium/services/dataProvider/tracksDataProvider.service';

@Component({
    selector: 'anms-dynamic-circle-layer',
    templateUrl: 'dynamic-circle-layer.component.html',
    styleUrls: ['dynamic-circle-layer.component.css'],
    providers: [TracksDataProvider]
})
export class DynamicCircleLayerComponent implements OnInit {
    @ViewChild(AcLayerComponent) layer: AcLayerComponent;

    circles$: Observable<AcNotification>;
    Cesium = Cesium;
    show = true;

    constructor(private tracksDataProvider: TracksDataProvider) {
    }

    ngOnInit() {
        // this.circles$ = this.tracksDataProvider.get();
    }

    removeAll() {
        this.layer.removeAll();
    }

    setShow($event) {
        this.show = $event
    }
}
