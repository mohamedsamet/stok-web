import { Routes } from '@angular/router';
import {LoginUserComponent} from "./login/login-user/login-user.component";
import {HomeComponent} from "./home/home.component";
import {TokenValidGuard} from "./route-guard/token-valid.guard";
import {ProductComponent} from "./home/product/product.component";
import {StationComponent} from "./home/station/station.component";

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
      {
        path: "product",
        component: ProductComponent
      },
      {
        path: "station",
        component: StationComponent
      },
    ]
  }
];
