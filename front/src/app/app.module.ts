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
import { OverlayModule } from '@angular/cdk/overlay';
import { ModalService } from './shared/modal/modal.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UnavailabletInterceptor } from './shared/unavailable-interceptor';


@NgModule({
  declarations: [
    AppComponent,
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
  }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthentInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UnavailabletInterceptor, multi: true },
    ModalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
