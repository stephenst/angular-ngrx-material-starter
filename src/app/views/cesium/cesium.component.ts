import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {WebSocketSupplier} from 'cesium';
import {MapLayerProviderOptions} from 'angular-cesium';
import {DomSanitizer} from '@angular/platform-browser';
import {MdDialog, MdIconRegistry} from '@angular/material';
import {AppSettingsService} from './services/app-settings-service/app-settings-service';
import {ViewersManagerService} from 'angular-cesium';

@Component({
    selector: 'anms-root',
    templateUrl: 'cesium.component.html',
    styleUrls: ['cesium.component.css'],
    providers: [WebSocketSupplier, AppSettingsService],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent implements AfterViewInit {
    arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
    flyToOptions = {
        duration: 2,
        destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
    };

    constructor(public appSettingsService: AppSettingsService,
                iconRegistry: MdIconRegistry,
                sanitizer: DomSanitizer,
                private dialog: MdDialog,
                private viewersManager: ViewersManagerService) {
        iconRegistry.addSvgIcon(
            'settings',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/settings.svg'));
        this.appSettingsService.showTracksLayer = true;
    }

    settingsClick(sidenav) {
        this.dialog.closeAll();
        sidenav.open();
    }

    ngAfterViewInit(): void {
        // example for getting the viewer by Id outside of the ac-map hierarchy
        const viewer = this.viewersManager.getViewer('main-map');
    }
}
