import {Component, HostBinding, OnDestroy, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { NgForOf } from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {OverlayContainer} from '@angular/material';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {Scenario} from './models/scenario';
import {ScenarioService} from './components/scenario-service/scenario.service';

import {login, logout, selectorAuth, routerTransition} from '@app/core';
import {environment as env} from '@env/environment';

import {selectorSettings} from './settings';


@Component({
    selector: 'anms-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [routerTransition],
})
export class AppComponent implements OnInit, OnDestroy {
    private unsubscribe$: Subject<void> = new Subject<void>();
    @Output() currentScenario = new EventEmitter();
    @HostBinding('class') componentCssClass;
    private scenarioName: Observable<string>;
    version = env.versions.app;
    year = new Date().getFullYear();
    logo = require('../assets/logo.png');
    navigation = [
        {link: 'd3', label: 'D3'},
        {link: 'cesium', label: 'Cesium'},
    ];
    navigationSideMenu = [
        ...this.navigation,
        {link: 'settings', label: 'Settings'}
    ];
    isAuthenticated;
    scenarios;

    constructor(public overlayContainer: OverlayContainer,
                private store: Store<any>,
                private http: HttpClient,
                public scenarioService: ScenarioService) {
    }

    getScenario(scenarioName: string): void {
        console.log('getScenario started: ', scenarioName);

        this.scenarioService.setScenario(scenarioName);
    };

    ngOnInit(): void {
        this.http.get('http://localhost:8072/metal/scenarios').subscribe(scenarios => {
            console.log('gotten scenarios, app component: ', scenarios);
            this.scenarios = scenarios;
        });

        this.store
            .select(selectorSettings)
            .takeUntil(this.unsubscribe$)
            .map(({theme}) => theme.toLowerCase())
            .subscribe(theme => {
                this.componentCssClass = theme;
                this.overlayContainer.themeClass = theme;
            });
        this.store
            .select(selectorAuth)
            .takeUntil(this.unsubscribe$)
            .subscribe(auth => this.isAuthenticated = auth.isAuthenticated);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onLoginClick() {
        this.store.dispatch(login());
    }

    onLogoutClick() {
        this.store.dispatch(logout());
    }

}
