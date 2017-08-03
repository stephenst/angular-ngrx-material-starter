import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@app/shared';

import {D3Component} from './d3.component';
import {D3RoutingModule} from './d3-routing.module';
import {BarChartComponent} from './barchart/barchart.component';
import {MultilineComponent} from './multiline/multiline.component';

describe('D3Component', () => {
    let component: D3Component;
    let fixture: ComponentFixture<D3Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [
                    CommonModule,
                    D3RoutingModule,
                    SharedModule
                ],
                declarations: [
                    D3Component,
                    BarChartComponent,
                    MultilineComponent
                ]
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(D3Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
