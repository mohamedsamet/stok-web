import { Routes } from '@angular/router';
import {LoginUserComponent} from "./login/login-user/login-user.component";
import {HomeComponent} from "./home/home.component";
import {TokenValidGuard} from "./route-guard/token-valid.guard";

export const routes: Routes = [
  {
    path: "login",
    component: LoginUserComponent
  },
  {
    path: "",
    component: HomeComponent,
    canActivate: [TokenValidGuard],
    children: [
      {
        path: '',
        redirectTo: 'product',
        pathMatch: 'full'
      },
//       {
//         path: "product",
//         component: ProductComponent
//       },
    ]
  }
];
