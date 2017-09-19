import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AngularCesiumModule} from 'angular-cesium';

import {SharedModule} from '@app/shared';
import {CoreModule} from '@app/core';
import {ComponentsModule} from './components/components.module';

import {SettingsModule} from './settings';
import {StaticModule} from './static';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

@NgModule({
    imports: [
        // angular
        BrowserAnimationsModule,
        BrowserModule,

        // libs
        AngularCesiumModule,

        // core & shared
        CoreModule,
        SharedModule,
        ComponentsModule,
        AngularCesiumModule,
        HttpClientModule,

        // features
        StaticModule,
        SettingsModule,

        // app
        AppRoutingModule,
    ],
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
