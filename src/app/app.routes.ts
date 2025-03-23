import { Routes } from '@angular/router';
import {LoginUserComponent} from "./login/login-user/login-user.component";
import {HomeComponent} from "./home/home.component";
import {TokenValidGuard} from "./route-guard/token-valid.guard";
import {ProductComponent} from "./home/product/product.component";
import {StationComponent} from "./home/station/station.component";
import {ProviderComponent} from "./home/provider/provider.component";
import {GoodsInwardComponent} from "./home/goods-inward/goods-inward.component";

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
        path: "provider",
        component: ProviderComponent
      },
      {
        path: "goods-inward",
        component: GoodsInwardComponent
      },
      {
        path: "station",
        component: StationComponent
      },
    ]
  }
];
