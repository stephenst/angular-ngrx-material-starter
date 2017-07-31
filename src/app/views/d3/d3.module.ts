import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { D3Component } from './d3.component';
import { D3RoutingModule } from './d3-routing.module';
import { BarChartComponent } from './barchart/barchart.component';
import { MultilineComponent } from './multiline/multiline.component';

@NgModule({
  imports: [
      CommonModule,
      D3RoutingModule
  ],
  declarations: [
      D3Component,
      BarChartComponent,
      MultilineComponent
  ]
})
export class D3Module { }

