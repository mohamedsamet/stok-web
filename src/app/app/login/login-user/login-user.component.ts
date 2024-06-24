import {Component} from '@angular/core';
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from "primeng/button";
import {ImageModule} from "primeng/image";
import {LoginService} from "../login.service";
import {LoginRequest} from "../model/login-request.model";
import {TokenResponseModel} from "../model/token-response.model";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CardModule, InputTextModule, ReactiveFormsModule, ButtonModule, ImageModule],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.scss'
})
export class LoginUserComponent {

  public loginUserFormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  loading = false;

  constructor(private loginService: LoginService) {
  }

  onSubmit() {
    this.loading = true;


    this.loginService.loginUser({
      login: this.loginUserFormGroup.get('username')?.value,
      password: this.loginUserFormGroup.get('password')?.value,
    } as LoginRequest).subscribe((response: TokenResponseModel) => {
      localStorage.setItem('Authorization', response.accessToken)
      this.loading = false;
      console.log(response)
    }, err => {
      this.loading = false;
    })
  }
}
