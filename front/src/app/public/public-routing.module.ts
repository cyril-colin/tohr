import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UnavailablePageComponent } from './unavailable-page/unavailable-page.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'unavailable', component: UnavailablePageComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],

  exports: [
    RouterModule,
  ]
})
export class PublicRoutingModule { }
