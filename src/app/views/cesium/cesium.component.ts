import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcNotification, AcLayerComponent, ActionType } from 'angular-cesium';

@Component({
  selector: 'anms-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss']
})
export class CesiumComponent implements OnInit, AfterViewInit {
    @ViewChild(AcLayerComponent) layer: AcLayerComponent;

    bases$: Observable<AcNotification>;
    show = true;

    constructor() {
        const base1: AcNotification = {
            id: <any>'0',
            actionType: <any>ActionType.ADD_UPDATE,
            entity: {
                name: <string>'base haifa',
                position: <number>Cesium.Cartesian3.fromRadians(1.5, 1.5),
                show: <boolean>true
            }
        };
        const base2 = {
            id: <any>'1',
            actionType: <any>ActionType.ADD_UPDATE,
            entity: {
                name: <string>'base yafo',
                position: <number>Cesium.Cartesian3.fromRadians(1.9, 1.9),
                show: <boolean>true
            }
        };
        const baseArray = [base1, base2];
        this.bases$ = Observable.from(baseArray);

        setTimeout(() => {
            base2.entity.name = 'base tel aviv';
            this.layer.updateNotification(base2);
        }, 5000);
        setTimeout(() => {
            this.layer.refreshAll(baseArray);
        }, 10000);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {

    }

    removeAll() {
        this.layer.removeAll();
    }

    setShow($event) {
        this.show = $event;
    }

}
