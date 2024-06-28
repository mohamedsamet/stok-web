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
import {Router, RouterLink} from "@angular/router";
import {AutoFocusModule} from "primeng/autofocus";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CardModule, ToastModule, InputTextModule, ReactiveFormsModule, ButtonModule, ImageModule, AutoFocusModule, RouterLink],
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

  constructor(private loginService: LoginService, private messageService: MessageService, private router: Router) {
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
        detail: `Bienvenue, dans Stok`,
        key: 't1',
        life: SUCCESS_LIFE});
      this.router.navigate(['../']);
      }, err => {
        this.loading = false;
        console.error(err);
        this.loginUserFormGroup.reset();

       this.messageService.add({severity: SeverityEnum.ERROR,
         summary: 'Erreur',
         detail: `Une erreur est survenue au moment du login`,
         key: 't1',
         life: ERROR_LIFE});
    })
  }
}
