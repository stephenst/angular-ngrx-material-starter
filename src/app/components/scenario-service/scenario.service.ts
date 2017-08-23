import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";

@Injectable()
export class ScenarioService {
    constructor(private http: Http) {}

    getScenarios(): Obserable<Scenario> {
        return this.http.get('').map(this.data);
    }

}
