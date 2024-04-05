import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { AppRouteReuseStrategy } from './app-route-reuse-strategy';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'toDoList',
    pathMatch: 'full',
    data: {
      reuseComponent: false
    }
  },
  {
    path: 'toDoList',
    component: ToDoListComponent,
    data: {
      reuseComponent: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: [
    {provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy}
  ],
})
export class AppRoutingModule { }
