import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlreadyLoggedinGuard } from './core/services/guards/already-loggedin/already-loggedin.guard';
import { IsAuthorizedGuard } from './core/services/guards/is-authorized/is-authorized.guard';
import { NotFoundPageComponent } from './public/not-found-page/not-found-page.component';


const routes: Routes = [
  { path: '', loadChildren: () => import('./public/public.module').then(m => m.PublicModule), canActivate: [AlreadyLoggedinGuard] },
  { path: 'private', loadChildren: () => import('./private/private.module').then(m => m.PrivateModule), canActivate: [IsAuthorizedGuard] },
  { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
