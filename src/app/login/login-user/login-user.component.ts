import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginService} from "../login.service";
import {LoginRequest} from "../model/login-request.model";
import {TokenResponseModel} from "../model/token-response.model";
import {ERROR_LIFE, SeverityEnum, SUCCESS_LIFE} from "../../utils/message-notif.util";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.scss'
})
export class LoginUserComponent {

  public loginUserFormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  loading = false;

  constructor(private loginService: LoginService,  private router: Router) {
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
//       this.messageService.add({severity: SeverityEnum.INFO,
//         summary: 'Notification',
//         detail: `Bienvenue, dans Stok`,
//         key: 't1',
//         life: SUCCESS_LIFE});
      this.router.navigate(['../']);
      }, err => {
        this.loading = false;
        console.error(err);
        this.loginUserFormGroup.reset();

//        this.messageService.add({severity: SeverityEnum.ERROR,
//          summary: 'Erreur',
//          detail: `Une erreur est survenue au moment du login`,
//          key: 't1',
//          life: ERROR_LIFE});
    })
  }
}
