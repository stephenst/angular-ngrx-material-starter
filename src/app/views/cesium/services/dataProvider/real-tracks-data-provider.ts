import {Injectable} from '@angular/core';
import {ActionType} from '../../../../models/action-type.enum';
import {AcNotification} from '../../../../models/ac-notification';
import {Scenario} from '../../../../models/scenario';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ScenarioService} from '@app/components/scenario-service/scenario.service';
import {HttpClient} from '@angular/common/http';

const TracksDataQuery = {};

@Injectable()
export class RealTracksDataProvider {
    private readonly INTERPOLATION_RATE = 1000;
    private readonly POLLING_RATE = 10000;
    private readonly RECONNECT_MS = 5000;
    private readonly MAX_MOVEMENT_DISTANCE = 0.1;
    private tracksCache = new Map<string, AcNotification>();
    private lastIntervalStopper: Subject<any>;
    private scenarioService: ScenarioService;
    private http: HttpClient;
    public ares: any;
    public earthradius: number;
    public radians(deg: number) {
        return (deg * (Math.PI / 180));
    };

    constructor(public scenarios: object,
                public selectedScenario: object,
                scenarioService: ScenarioService,
                http: HttpClient) {
    }

    private convertToCesiumEntity(trackData): AcNotification {
        const track = Object.assign({}, trackData);
        track.scale = 0.2;
        track.image = '/assets/fighter-jet.png';
        track.alt = trackData.position.alt;
        track.position = Cesium.Cartesian3.fromDegrees(trackData.position.long, trackData.position.lat);
        track.futurePosition = this.getFuturePosition(trackData.position, trackData.heading);
        return {id: track.id, entity: track, actionType: ActionType.ADD_UPDATE};
    }

    private saveInCache(track: AcNotification) {
        this.tracksCache.set(track.id, track);
    }

    getFuturePosition(position, heading) {
        return Cesium.Cartesian3.fromDegrees(
            position.long - (Math.sin(heading) * this.MAX_MOVEMENT_DISTANCE),
            position.lat + (Math.cos(heading) * this.MAX_MOVEMENT_DISTANCE)
        );
    }

    getPositionDelta(startingPosition, finalPosition, legs: number) {
        return {
            x: (finalPosition.x - startingPosition.x) / legs,
            y: (finalPosition.y - startingPosition.y) / legs,
            z: (finalPosition.z - startingPosition.z) / legs,
        };
    }

    addPositionDelta(position, delta) {
        position.x += delta.x;
        position.y += delta.y;
        position.z += delta.z;
    }

    private createInterpolatedTracksObservable(serverDataObservable: Observable<any>) {
        const interpolationSubject = new Subject<AcNotification>();
        const interpolationLegs = this.POLLING_RATE / this.INTERPOLATION_RATE;
        serverDataObservable.subscribe(serverTracks => {
            if (this.lastIntervalStopper) {
                this.lastIntervalStopper.next(0);
            }
            const serverTrackNotifications = serverTracks.map(track => {
                const trackNotification = this.convertToCesiumEntity(track);
                if (!this.tracksCache.has(track.id)) {
                    this.saveInCache(trackNotification);
                }
                return trackNotification;
            });

            const stopper$ = new Subject();

            Observable.interval(this.INTERPOLATION_RATE)
                .timeInterval()
                .take(interpolationLegs - 1)
                .takeUntil(stopper$)
                .subscribe(() => {
                        serverTrackNotifications.forEach(notification => {
                            const serverTrack = notification.entity;
                            const cachedTrackNotification = this.tracksCache.get(serverTrack.id);
                            const cachedTrack = <any>cachedTrackNotification.entity;
                            if (!serverTrack.positionDelta) {
                                serverTrack.positionDelta =
                                    this.getPositionDelta(cachedTrack.position, serverTrack.position, interpolationLegs);
                            }

                            this.addPositionDelta(cachedTrack.position, serverTrack.positionDelta);
                            this.addPositionDelta(cachedTrack.futurePosition, serverTrack.positionDelta);
                            interpolationSubject.next(cachedTrackNotification);
                        });
                    },
                    () => {
                    },
                    () => {
                        serverTrackNotifications.forEach(notification => {
                            const serverTrack = notification.entity;
                            const cachedTrackNotification = this.tracksCache.get(serverTrack.id);
                            serverTrack.positionDelta = undefined;
                            cachedTrackNotification.entity = serverTrack;
                            interpolationSubject.next(cachedTrackNotification);
                            this.lastIntervalStopper = undefined;
                        });

                    });

            this.lastIntervalStopper = stopper$;
        });

        return interpolationSubject;
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

    public nmToLatLon(nmx: number, nmy: number): object {
        const lat = this.nmToDegLat(nmy);
        const lon = this.nmToDegLon(nmx, lat);
        return [lat, lon];
    };

    createCesiumMapEntities(data: any): object {
        const viewerData = [];
        console.log('createCesiumMapEntities', data);
        // add sites
        data.sites.forEach((e) => {
            const site = e;
            const ll = this.nmToLatLon(site.latitude, site.longitude);
            let assetresourcetable = 'none';
            if (site.asset.asset_resources.length > 0) {
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

    tryReconnect(err) {
        console.log(`Error connecting to Graphql: ${err}. Try to reconnect in ${this.RECONNECT_MS} ...`);
        // return Observable.timer(this.RECONNECT_MS)
        //     .flatMap(() =>
        //         this.apollo.watchQuery<any>({
        //             query: TracksDataQuery,
        //             pollInterval: this.POLLING_RATE,
        //             fetchPolicy: 'network-only'
        //         })
        //             .catch(error => this.tryReconnect(error)));
    }

    get() {
        // const watchQuery$ = this.apollo.watchQuery<any>({
        //     query: TracksDataQuery,
        //     pollInterval: this.POLLING_RATE, fetchPolicy: 'network-only'
        // });

        this.http.get<Scenario>('http://127.0.0.1:8072/metal/scenarios').subscribe(Scenario => {
            console.log('just got Scenario: ', Scenario);
            this.scenarios = Scenario;
            this.scenarioService.getTimeToFailure(Scenario[0].name)
                .then((data) => {
                    console.log('getTimeToFailure.', data);
                });
            this.scenarioService.getMapData(Scenario[0].name)
                .then((data) => {
                    console.log('getMapData', data);
                    this.selectedScenario = this.createCesiumMapEntities(data);
                    console.log(this.selectedScenario);
                });
            return this.selectedScenario;
        });

        const fromServerTracks$ = this.scenarioService.getMapData(this.selectedScenario[0].name)
            .catch(err => this.tryReconnect(err));
            // .map(({data}) => data.tracks);
        return fromServerTracks$;
        // return this.createInterpolatedTracksObservable(fromServerTracks$);
    }
}
