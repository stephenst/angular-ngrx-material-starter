import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

interface Scenario {
    id: string;
    name: string;
    login: string;
    bio: string;
    company: string;
}

@Injectable()
export class ScenarioService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private baseApi = 'http://127.0.0.1:8072/metal';
    private scenarioApi = 'http://127.0.0.1:8072/metal/scenarios';
    private mapdataApi = 'http://127.0.0.1:8072/metal/mapdata';
    private stockApi = 'http://127.0.0.1:8072/metal/stock';
    private perspectivesApi = 'http://127.0.0.1:8072/metal/perspectives';

    constructor(private http: Http) {
    }

    getAll(type: string): Promise<Scenario[]> {
        const apiUrl = `${this.baseApi}/${type}`;
        return this.http.get(this.scenarioApi)
            .toPromise()
            .then(response => response.json().data as Scenario[])
            .catch(this.handleError);
    }

    getItem(type: string, id: any): Promise<Scenario> {
        const url = `${this.baseApi}/${type}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as Scenario)
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
