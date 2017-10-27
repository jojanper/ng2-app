import { RouterModule, Routes } from '@angular/router';

// import { AppEmptyViewComponent } from '../widgets';
import { HomeComponent, AboutComponent, DemoComponent } from './index';
import { AuthGuard /*, LoginComponent, LogoutComponent, RegisterComponent*/ } from '../widgets/auth';


const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'about', component: AboutComponent, canActivate: [AuthGuard]},
  {path: 'test', component: DemoComponent},
  {path: 'auth', loadChildren: './auth/auth.module#DraalAppPagesAuthModule'},
  /*
  {
    path: 'auth', component: AppEmptyViewComponent,
    children: [
      {path: 'register', component: RegisterComponent},
      {path: 'login', component: LoginComponent},
      {path: 'logout', component: LogoutComponent}
    ]
  },
  */

  {path: '**', redirectTo: '/home'}
];

export const DraalAppRoutes = RouterModule.forRoot(routes, {useHash: true});
