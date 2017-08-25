import {Component, Input, ViewChild, AfterViewInit, OnInit, ViewEncapsulation} from '@angular/core';
import {ViewerConfiguration, MapLayerProviderOptions, ViewersManagerService} from 'angular-cesium';
import {ScenarioService} from '@app/components/scenario-service/scenario.service';
import {HttpClient} from '@angular/common/http';

interface Scenario {
    id: string;
    name: string;
    file_name: string;
    json_file: string;
    date_modified: number;
    resources: object;
    sites: object;
}

interface MapData {
    name: string;
    resources: object;
    assets: object;
    sites: object;
    risk_areas: object;
    routes: object;
}

@Component({
    selector: 'anms-cesium',
    templateUrl: './cesium.component.html',
    styleUrls: ['./cesium.component.scss'],
    providers: [ViewerConfiguration],
    encapsulation: ViewEncapsulation.None
})
export class CesiumComponent implements OnInit, AfterViewInit {
    private viewerConf: ViewerConfiguration;
    private viewersManager: ViewersManagerService;
    private scenarioService: ScenarioService;
    private http: HttpClient;

    @Input() allScenarios: any;
    @Input() mapData: object;
    @Input() scenarios: object;
    @Input() scenario: object;
    @Input() perspective: any;
    @Input() modelsRun: any;
    @Input() ares: any;
    @Input() chartKey: any;
    @Input() chartDataStr: any;

    arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
    flyToOptions = {
        duration: 2,
        destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
    };
    earthradius = 3440.2769;
    sqrt3 = Math.sqrt(3);

    static radians(deg: number) {
        return (deg * (Math.PI / 180));
    };

    constructor(viewerConf: ViewerConfiguration,
                viewersManager: ViewersManagerService,
                scenarioService: ScenarioService,
                http: HttpClient) {
        this.viewerConf = viewerConf;
        this.viewersManager = viewersManager;
        this.scenarioService = scenarioService;
        this.http = http;
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
            timeline: true
        };

        viewerConf.viewerModifier = (viewer) => {
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            viewer.bottomContainer.remove();
            const screenSpaceCameraController = viewer.scene.screenSpaceCameraController;
            // screenSpaceCameraController.enableTilt = false;
            // screenSpaceCameraController.enableRotate = false;
        };
    }

    degLatToNm(degLat: number) {
        return ((Math.PI * this.earthradius * 2 / 360) * degLat);
    };

    nmToDegLat(nm) {
        return (nm / this.degLatToNm(1));
    };

    degLonToNm(degLon: number, lat: number) {
        const latradius = Math.cos(this.radians(lat)) * this.earthradius;
        return ((Math.PI * latradius * 2 / 360) * degLon);
    };

    nmToDegLon(nm: number, lat: number) {
        return (nm / this.degLonToNm(1, lat));
    };

    nmToLatLon(nmx: number, nmy: number) {
        const lat = this.nmToDegLat(nmy);
        const lon = this.nmToDegLon(nmx, lat);
        return [lat, lon];
    };

    getScenarios(): void {
        this.scenarioService
            .getAllMaps('mapdata')
            .then(mapData => this.mapData = mapData);
    };

    export(eventData: any): void {
        console.log('Export button clicked');
        // const jsondatastr = $('#docking').jqxDocking('exportLayout');
        // console.log(jsondatastr);

        // this.perspective.jsondata = jsondatastr;
        // PerspectiveFactory.update( $scope.perspective, function() {
        //     console.log('saved');
        // });
    };

    import(eventData: any): void {
        console.log('Import button clicked');
        // let jsondata = '{'panel0': {'window3':{'collapsed':false}},'floating':{'window1':{'x':'1320px','y':'55px',
        //                  'width':'265','height':'571','collapsed':false},'window2':{'x':'330px','y':'347px',
        //                  'width':'870','height':'537','collapsed':false}},'orientation': 'horizontal'}';

        this.scenarioService.getPerspective(1)
            .then(perspectives => this.perspective = perspectives);
    };

    run_model(scenarioName: string | number): void {
        this.scenarioService.getScenario(scenarioName)
            .then(modelsRun => this.modelsRun = modelsRun);
    };

    getScenario(scenarioName: string): void {
        console.log('getScenario started: ', scenarioName);
        // $scope.run_model(scenarioName);
        // $scope.getRoutes(scenarioName);
        // $scope.data = [{ key: 'Some key', values:[{'label':'77', 'value':'22.0'}]}];

        // this.scenarioService.getScenario(1)
        //    .then(scenario => this.scenario = scenario);

        this.scenarioService.getTimeToFailure(scenarioName)
            .then(function (data) {
                console.log('getTimeToFailure.', data);
                /**
                 this.chartKey  = data.key;
                 this.chartDataStr = data.data;
                 this.jsonChartData = JSON.parse(this.chartDataStr);
                 this.data = [
                 {
                     key: this.chartKey,
                     values : this.jsonChartData
                 }
                 ];
                 **/
            });
            this.scenarioService.getMapData(scenarioName)
                .then(function (data) {
                    console.log('getMapData', data);
                    // clear the existing map
                    this.viewerConf.entities.removeAll();
                    // create entities from the map data
                    this.selectedScenario = this.createCesiumMapEntities(data);
                    console.log(this.selectedScenario);
                    // add entities to the map
                    // this.selectedScenario.forEach(function (e) {
                    //    this.viewerConf.entities.add(e);
                    // });
                    // zoom into entity location
                    this.viewerConf.zoomTo(this.viewerConf.entities);
                });
        /**
         LineFactory.get({id:scenarioName}).$promise.then( function(data){
            console.log('In Line Factory');
            let chartKey  = data.key;
            //console.log(chartKey);
            let chartDataStr = data.data;
            let jsonChartData = angular.fromJson(chartDataStr);
            $scope.data = [
                {
                    key: chartKey,
                    values : jsonChartData
                }
            ];
        }).then(function(){
            CesiumFactory.get({id:scenarioName}).$promise.then( function(data){
                console.log('Cesium Factory');
                // clear the existing map
                $rootScope.viewer.entities.removeAll();
                // create entities from the map data
                $scope.selectedScenario = createCesiumMapEntities(data);
                // add entities to the map
                $scope.selectedScenario.forEach(function(e){
                    $rootScope.viewer.entities.add(e);
                });
                // zoom into entity location
                $rootScope.viewer.zoomTo($rootScope.viewer.entities);
            });
        });
         **/

    };

    createCesiumMapEntities(data: MapData): object {
        const viewerData = [];
        console.log('createCesiumMapEntities', data);
        // add sites
        data.sites.forEach(function (e) {
            const site = e;
            const ll = this.nmToLatLon(site.latitude, site.longitude);
            let assetresourcetable = 'none';
            if (e.asset.asset_resources.length > 0) {
                assetresourcetable = '<br><table><tr><td>Resource</td><td>Congested Consumption</td><td>Uncongested Consumption</td></tr>';
                for (let ar = 0; ar < e.asset.asset_resources.length; ar++) {
                    this.ares = e.asset.asset_resources[ar];
                    assetresourcetable = assetresourcetable + '<tr><td>' + this.ares.resource.name + '</td><td>' +
                        this.ares.contested_consumption + '</td><td>' + this.ares.uncontested_consumption + '</td></tr>';
                }
                assetresourcetable = assetresourcetable + '</table>';
            }
            viewerData.push({
                id: site.name,
                name: site.name,
                description: 'Location: ' + site.latitude + ', ' + site.longitude + '<br>' +
                'Asset Type: ' + site.asset.name + '<br>Asset Resources: ' + assetresourcetable,
                position: Cesium.Cartesian3.fromDegrees(ll[1], ll[0]),
                point: {
                    pixelSize: 6,
                    color: Cesium.Color.fromCssColorString(site.asset.htmlcolor),
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2
                },
                label: {
                    text: site.name,
                    font: '14pt monospace',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -9)
                }
            });
        });
        // add threat areas
        const riskareas = data.risk_areas;
        for (let i = 0; i < riskareas.length; i++) {
            const area = riskareas[i];
            const degarray = [];
            for (let j = 0; j < area.risk_area_verteces.length; j++) {
                const vertex = area.risk_area_verteces[j];
                const ll = this.nmToLatLon(vertex.latitude, vertex.longitude);
                degarray.push(ll[1]);
                degarray.push(ll[0]);
            }
            const rcolor = Cesium.Color.fromCssColorString(area.risktype.htmlcolor);
            viewerData.push({
                id: area.name,
                name: area.name,
                description: 'Risk Type: ' + area.risktype.name,
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(degarray),
                    material: rcolor.withAlpha(0.5),
                    fill: true,
                    height: 0,
                    outline: true,
                    outlineColor: rcolor,
                    outlineWidth: 5
                }
            });
        }
        // add routes
        const routedata = data.routes;
        for (let i = 0; i < routedata.length; i++) {
            const route = routedata[i];
            if (route.asset_route_assignments.length === 0) {
                // no assignments to this route
                continue;
            }
            const degarray = [];
            for (let j = 0; j < route.route_segments.length; j++) {
                const seg = route.route_segments[j];
                if (j === 0) {
                    const ll0 = this.nmToLatLon(seg.start_latitude, seg.start_longitude);
                    degarray.push(ll0[1]);
                    degarray.push(ll0[0]);
                }
                const ll1 = this.nmToLatLon(seg.end_latitude, seg.end_longitude);
                degarray.push(ll1[1]);
                degarray.push(ll1[0]);
            }
            let asset_assignments = '<table>';
            asset_assignments = asset_assignments + '<tr><td>Asset</td><td>Quantity</td>';
            for (let r = 0; r < data.resources.length; r++) {
                asset_assignments = asset_assignments + '<td>' + data.resources[r].name + '</td>';
            }
            asset_assignments = asset_assignments + '</tr>';
            for (let j = 0; j < route.asset_route_assignments.length; j++) {
                const assetinv = route.asset_route_assignments[j];
                const asset = assetinv.asset;
                asset_assignments = asset_assignments + '<tr><td>' + asset.name + '</td><td>' + assetinv.count + '</td>';
                for (let r = 0; r < data.resources.length; r++) {
                    const res = data.resources[r];
                    let found = false;
                    for (let ar = 0; ar < asset.asset_resources.length; ar++) {
                        this.ares = asset.asset_resources[ar];
                        if (this.ares.resource.id === res.id) {
                            asset_assignments = asset_assignments + '<td>' + this.ares.transport_capacity + '</td>';
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        asset_assignments = asset_assignments + '<td>0</td>';
                    }
                }
                asset_assignments = asset_assignments + '</tr>';
            }
            asset_assignments = asset_assignments + '</table>';
            viewerData.push({
                id: route.name,
                name: route.name,
                description: 'length: ' + route.distance + '<br>Asset Assignments:<br>' + asset_assignments,
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArray(degarray),
                    width: 5,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        glowPower: 0.2,
                        color: Cesium.Color.BLUE
                    })
                }
            });
        }
        console.log('returning viewer data', viewerData);
        return viewerData;
    };

    ngOnInit(): void {
        this.http.get<Scenario>('http://127.0.0.1:8072/metal/scenarios').subscribe(Scenario => {
            console.log(Scenario);
            this.scenarios = Scenario;
            console.log('Scenario name: ', Scenario[0].name);
            this.getScenario(Scenario[0].name);
        });

        // this.getScenarios();

        //  this.scenarioService.getAllScenarios().then(function (data) {
        //      console.log('Scenario Controller query', data);
        //      this.scenario = data;
        //  });
    }

    ngAfterViewInit(): void {
        // example for getting the viewer by Id outside of the ac-map hierarchy
        const viewer = this.viewersManager.getViewer('main-map');
    }
}

