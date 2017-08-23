import {Component, Input, ViewChild, AfterViewInit, OnInit, ViewEncapsulation} from '@angular/core';
import {ViewerConfiguration, MapLayerProviderOptions, ViewersManagerService } from 'angular-cesium';

@Component({
    selector: 'anms-cesium',
    templateUrl: './cesium.component.html',
    styleUrls: ['./cesium.component.scss'],
    providers: [ViewerConfiguration],
    encapsulation: ViewEncapsulation.None
})
export class CesiumComponent implements AfterViewInit {
    @Input() tracksRealData: boolean;
    arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
    flyToOptions = {
        duration: 2,
        destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
    };

    constructor(private viewerConf: ViewerConfiguration, private viewersManager: ViewersManagerService) {
        viewerConf.viewerOptions = {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: true,
            geocoder: false,
            homeButton: false,
            infoBox: true,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            scene3Donly: true,
            sceneModePicker: true,
            sceneMode: Cesium.SceneMode.SCENE2D,
            selectionIndicator: true,
            timeline: false
        };


        viewerConf.viewerModifier = (viewer) => {
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            viewer.bottomContainer.remove();
            const screenSpaceCameraController = viewer.scene.screenSpaceCameraController;
            // screenSpaceCameraController.enableTilt = false;
            // screenSpaceCameraController.enableRotate = false;
        };

    }

    ngAfterViewInit(): void {
        // example for getting the viewer by Id outside of the ac-map hierarchy
        const viewer = this.viewersManager.getViewer('main-map');
    }
}

