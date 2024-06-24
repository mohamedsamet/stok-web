import {Component} from '@angular/core';
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from "primeng/button";
import {ImageModule} from "primeng/image";
import {LoginService} from "../login.service";
import {LoginRequest} from "../model/login-request.model";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CardModule, InputTextModule, ReactiveFormsModule, ButtonModule, ImageModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {

  public createUserFormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  loading = false;

  constructor(private loginService: LoginService) {
  }

  onSubmit() {
    this.loading = true;


    this.loginService.createUser({
      login: this.createUserFormGroup.get('username')?.value,
      password: this.createUserFormGroup.get('password')?.value,
    } as LoginRequest).subscribe(response => {
      this.loading = false;

      console.log(response)
    }, err => {
      console.log(err)
      this.loading = false;


    })
  }
}
