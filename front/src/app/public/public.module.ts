import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { ProxyAuthentService } from '../core/services/proxy/proxy-authent/proxy-authent.service';
import { UnavailablePageComponent } from './unavailable-page/unavailable-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';


@NgModule({
  declarations: [
    LoginComponent,
    UnavailablePageComponent,
    NotFoundPageComponent,
  ],
  imports: [
    PublicRoutingModule,
    CommonModule,
    SharedModule,
  ],

  exports: [
    LoginComponent,
  ],

  providers: [
    ProxyAuthentService,
  ]
})
export class PublicModule { }
