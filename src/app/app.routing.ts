import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DemoComponent } from './demo';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'test', component: DemoComponent},

  {path: '**', redirectTo: '/'}
];

export const routing = RouterModule.forRoot(routes, {useHash: true});
