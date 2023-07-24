import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { AuthGuard } from './_guards/auth.guard';
// import { UserLoginComponent } from './pages/layout/authentication/login/login-user.component';
import { FolderCreationComponent } from './pages/layout/folder-creation/folder-creation.component';
import { UserLoginComponent } from './pages/layout/authentication/login/login-user.component';
import { RegisterComponent } from './pages/layout/authentication/registration/register.component';
import { RequestPasswordComponent } from './pages/layout/authentication/request-password/request-password.component';
import { resonsepasswordComponent } from './pages/layout/authentication/response-reset-password/response-reset-password.component';

export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule), canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: UserLoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: RequestPasswordComponent,
      },
      {
        path: 'reset-password/:token',
        component: resonsepasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
