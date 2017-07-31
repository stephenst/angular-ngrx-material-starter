import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as d3 from 'd3';

@Component({
  selector: 'anms-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.scss']
})
export class D3Component implements OnInit {
    public barChartData: Array<any> = [];
    constructor(public router: Router) { };
    @Input('data') public data: Array<any>;

    public randomizeBarChart(): void {
        this.barChartData = [];
        for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
            this.barChartData.push([
                `Index ${i}`,
                Math.floor(Math.random() * 100)
            ]);
        }
    }

    ngOnInit() {
        this.barChartData = [];
        for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
            this.barChartData.push([
                `Index ${i}`,
                Math.floor(Math.random() * 100)
            ]);
        }
    }

}

