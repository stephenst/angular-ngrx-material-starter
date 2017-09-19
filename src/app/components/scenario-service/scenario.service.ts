import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers} from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Scenario } from './scenario';

import 'rxjs/add/operator/toPromise';

interface TimeToFailure {
    scenario: string;
    key: string;
    data: string;
    x_axis_label: string;
    y_axis_label: string;
}

interface MapData {
    name: string;
    resources: object;
    assets: object;
    sites: object;
    risk_areas: object;
    routes: object;
}

interface Perspective {
    name: string;
    id: number;
}

interface ScenarioName {
    name: string;
}

@Injectable()
export class ScenarioService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private baseApi = 'http://127.0.0.1:8072/metal';
    private scenarioApi = 'http://127.0.0.1:8072/metal/scenarios';
    private mapApi = 'http://127.0.0.1:8072/metal/mapdata';
    private stockApi = 'http://127.0.0.1:8072/metal/stock';
    private perspectivesApi = 'http://127.0.0.1:8072/metal/perspectives';
    private timeToFailureApi = 'http://127.0.0.1:8072/metal/time_to_failure_distributions';
    private scenarioName;

    constructor(private http: Http) {
    }

    currentScenario(): Observable<any> {
        console.log('current scenario: ', this.scenarioName);
        return Observable.create(scenarioName => {
            scenarioName.next(this.scenarioName);
            scenarioName.complete();
        });
    }

    setScenario(name: string) {
        // this.scenarioName.next({ text: name });
        // this._scenario.name = name; // save your data

        this.scenarioName.next(name);
        console.log('set scenario: ', name);
    }

    getAllScenarios(): Promise<Scenario> {
        return this.http.get(this.scenarioApi)
            .toPromise()
            .then(response => response.json().data as Scenario)
            .catch(this.handleError);
    }

    getAllMaps(type: string): Promise<Scenario> {
        const apiUrl = `${this.baseApi}/${type}`;
        return this.http.get(apiUrl)
            .toPromise()
            .then(response => response.json().data as Scenario)
            .catch(this.handleError);
    }

    getScenario(id: string|number): Promise<Scenario> {
        const apiUrl = `${this.scenarioApi}/${id}`;
        return this.http.get(apiUrl)
            .toPromise()
            .then(response => response.json().data as Scenario)
            .catch(this.handleError);
    }

    getPerspective(id: number): Promise<Perspective> {
        const apiUrl = `${this.perspectivesApi}/${id}`;
        return this.http.get(apiUrl)
            .toPromise()
            .then(response => response.json().data as Perspective)
            .catch(this.handleError);
    }

    getTimeToFailure(id: string): Promise <TimeToFailure> {
        const apiUrl = `${this.timeToFailureApi}/${id}`;
        return this.http.get(apiUrl)
            .toPromise()
            .then(response => response.json() as TimeToFailure)
            .catch(this.handleError);
    }

    getMapData(id: string): Promise <MapData> {
        const apiUrl = `${this.mapApi}/${id}`;
        console.log('getMapData: ', apiUrl);
        return this.http.get(apiUrl)
            .toPromise()
            .then(response => response.json() as MapData)
            .catch(this.handleError);
    }

    delete(id: number): Promise<void> {
        const url = `${this.scenarioApi}/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    create(name: string): Promise<Scenario> {
        return this.http
            .post(this.scenarioApi, JSON.stringify({name: name}), {headers: this.headers})
            .toPromise()
            .then(res => res.json().data as Scenario)
            .catch(this.handleError);
    }

    update(scenario: Scenario): Promise<Scenario> {
        const url = `${this.scenarioApi}/${scenario.id}`;
        return this.http
            .put(url, JSON.stringify(scenario), {headers: this.headers})
            .toPromise()
            .then(() => scenario)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
