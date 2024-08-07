import { Routes } from '@angular/router';
import {CreateUserComponent} from "./login/create-user/create-user.component";
import {LoginUserComponent} from "./login/login-user/login-user.component";
import {HomeComponent} from "./home/home.component";
import {TokenValidGuard} from "./route-guard/token-valid.guard";
import {ProductComponent} from "./product/product.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginUserComponent
  },
  {
    path: "login/create",
    component: CreateUserComponent
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
      {
        path: "product",
        component: ProductComponent
      },
      {
        path: "login",
        component: LoginUserComponent
      }
    ]
  }
];
