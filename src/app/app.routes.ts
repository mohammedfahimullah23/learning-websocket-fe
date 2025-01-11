import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SessionComponent } from './components/session/session.component';

export const routes: Routes = [
  {
    path: 'main-page/:sessionId',
    component: MainPageComponent,
  },
  {
    path: 'create-session',
    component: SessionComponent,
  },
  {
    path:'',
    component: SessionComponent
  }
];
