import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent, AboutComponent } from './index';
import { AuthGuard } from '../widgets/auth';


/**
 * Application routes, some of the routes are lazy loaded.
 *
 * Reference to lazy loaded pages:
 * https://toddmotto.com/lazy-loading-angular-code-splitting-webpack
 */
const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'about', component: AboutComponent, canActivate: [AuthGuard]},
  {path: 'test', loadChildren: './demo/demo.module#DraalAppPagesDemoModule'},
  {path: 'auth', loadChildren: './auth/auth.module#DraalAppPagesAuthModule'},
  {path: '**', redirectTo: '/home'}
];

export const DraalAppRoutes = RouterModule.forRoot(routes, {
  useHash: true,

  // Once bootstrapped, fetch all the remaining module chunks
  preloadingStrategy: PreloadAllModules
});
