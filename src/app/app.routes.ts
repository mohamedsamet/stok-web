import { Routes } from '@angular/router';
import {CreateUserComponent} from "./app/login/create-user/create-user.component";
import {LoginUserComponent} from "./app/login/login-user/login-user.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginUserComponent
  },
  {
    path: "login/create",
    component: CreateUserComponent
  }
];
