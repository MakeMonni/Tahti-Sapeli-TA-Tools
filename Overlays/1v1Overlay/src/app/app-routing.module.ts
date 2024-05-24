import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PickbanscreenComponent } from './pickbanscreen/pickbanscreen.component';

const routes: Routes = [
  { path: 'pickban', component: PickbanscreenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
