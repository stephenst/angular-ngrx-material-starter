import {Component, OnInit, ViewChild} from '@angular/core';
import {AcNotification} from '../../../../models/ac-notification';
import {AcLayerComponent} from 'angular-cesium';
import {Observable} from 'rxjs/Observable';
import {TracksDataProvider} from '@app/views/cesium/services/dataProvider/tracksDataProvider.service';

@Component({
    selector: 'anms-point-layer',
    templateUrl: 'point-layer.component.html',
    styleUrls: [],
    providers: [TracksDataProvider]
})
export class PointLayerComponent implements OnInit {
    @ViewChild(AcLayerComponent) layer: AcLayerComponent;

    points$: Observable<AcNotification>;
    Cesium = Cesium;
    show = true;

    constructor(private tracksDataProvider: TracksDataProvider) {
    }

    ngOnInit() {
        // this.points$ = this.tracksDataProvider.get();
    }

    removeAll() {
        this.layer.removeAll();
    }

    setShow($event) {
        this.show = $event
    }

}
