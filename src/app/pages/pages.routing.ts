import { RouterModule, Routes } from '@angular/router';

import { AppEmptyViewComponent } from '../base';
import { HomeComponent, AboutComponent, DemoComponent } from './index';
import { AuthGuard, LoginComponent, LogoutComponent, RegisterComponent } from '../auth';


const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'about', component: AboutComponent, canActivate: [AuthGuard]},
  {path: 'test', component: DemoComponent, canActivate: [AuthGuard]},
  {
    path: 'auth', component: AppEmptyViewComponent,
    children: [
      {path: 'register', component: RegisterComponent},
      {path: 'login', component: LoginComponent},
      {path: 'logout', component: LogoutComponent}
    ]
  },

  {path: '**', redirectTo: '/home'}
];

export const DraalAppRoutes = RouterModule.forRoot(routes, {useHash: true});
