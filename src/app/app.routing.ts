import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DemoComponent } from './demo';
import { AuthGuard, LoginComponent, LogoutComponent } from './auth';

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'about', component: AboutComponent, canActivate: [AuthGuard]},
  {path: 'test', component: DemoComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},

  {path: '**', redirectTo: '/home'}
];

export const routing = RouterModule.forRoot(routes, {useHash: true});
