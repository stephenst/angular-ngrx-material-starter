import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { ExamplesComponent } from './examples/examples.component';
import { D3Component } from "@app/views/d3/d3.component"
import { TodosComponent } from './todos/todos.component';
import { StockMarketComponent } from './stock-market/stock-market.component';
import { ParentComponent } from './theming/parent/parent.component';

const routes: Routes = [
    {
        path: '',
        component: ExamplesComponent,
        children: [
            {
                path: '',
                redirectTo: 'todos',
                pathMatch: 'full'
            }, {
                path: 'todos',
                component: TodosComponent
            }, {
                path: 'stock-market',
                component: StockMarketComponent
            }, {
                path: 'theming',
                component: ParentComponent
            }
        ]
    },
    {
        path: 'd3',
        component: D3Component
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamplesRoutingModule {
}
