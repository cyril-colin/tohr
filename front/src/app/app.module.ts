import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthentInterceptor } from './shared/authent-interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PublicModule } from './public/public.module';
import { SharedModule } from './shared/shared.module';
import { PrivateModule } from './private/private.module';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { SideMenuService } from './shared/side-menu/side-menu.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { MainToolbarComponent } from './shared/main-toolbar/main-toolbar.component';
import { ModalService } from './shared/modal/modal.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    MainToolbarComponent,
  ],

  imports: [
    AppRoutingModule,
    PublicModule,
    PrivateModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    OverlayModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  entryComponents: [
    SideMenuComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthentInterceptor, multi: true },
    SideMenuService,
    ModalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
