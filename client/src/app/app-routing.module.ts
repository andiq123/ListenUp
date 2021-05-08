import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavSongsComponent } from './fav-songs/fav-songs.component';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { PresenceComponent } from './presence/presence.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'signout',
    component: SignOutComponent,
  },
  {
    path: 'presence',
    component: PresenceComponent,
  },
  { path: 'mysongs', component: FavSongsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
