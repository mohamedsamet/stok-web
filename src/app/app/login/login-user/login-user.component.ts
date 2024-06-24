import {Component} from '@angular/core';
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonModule} from "primeng/button";
import {ImageModule} from "primeng/image";
import {LoginService} from "../login.service";
import {LoginRequest} from "../model/login-request.model";
import {TokenResponseModel} from "../model/token-response.model";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {ERROR_LIFE, SeverityEnum, SUCCESS_LIFE} from "../../utils/message-notif.util";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CardModule, ToastModule, InputTextModule, ReactiveFormsModule, ButtonModule, ImageModule, RouterLink],
  providers: [MessageService],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.scss'
})
export class LoginUserComponent {

  public loginUserFormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  loading = false;

  constructor(private loginService: LoginService, private messageService: MessageService) {
  }

  onSubmit() {
    this.loading = true;

    this.loginService.loginUser({
      login: this.loginUserFormGroup.get('username')?.value,
      password: this.loginUserFormGroup.get('password')?.value,
    } as LoginRequest).subscribe((response: TokenResponseModel) => {
      localStorage.setItem('Authorization', response.accessToken)
      this.loading = false;
      this.loginUserFormGroup.reset();
      this.messageService.add({severity: SeverityEnum.INFO,
        summary: 'Notification',
        detail: `Bienvenue, Ton accèes est effectuer dans Stok`,
        key: 't1',
        life: SUCCESS_LIFE})

      }, err => {
        this.loading = false;
        console.log(err)
        this.loginUserFormGroup.reset();

       this.messageService.add({severity: SeverityEnum.ERROR,
         summary: 'Erreur',
         detail: `Une erreur est survenue au moment du login`,
         key: 't1',
         life: ERROR_LIFE})

    })
  }
}
