import {Component} from '@angular/core';
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonModule} from "primeng/button";
import {ImageModule} from "primeng/image";
import {LoginService} from "../login.service";
import {LoginRequest} from "../model/login-request.model";
import {ERROR_LIFE, SeverityEnum, SUCCESS_LIFE} from "../../utils/message-notif.util";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CardModule, ToastModule, InputTextModule, ReactiveFormsModule, ButtonModule, ImageModule],
  providers: [MessageService],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  public showPwdAlert: boolean = false;

  public createUserFormGroup = new FormGroup({
    username: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(32),
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(127),
    ]))
  });
  loading = false;

  constructor(private loginService: LoginService, private messageService: MessageService) {
  }

  onSubmit() {

    if (this.checkPassword()) {
      this.showPwdAlert = false;
      this.loading = true;
      this.loginService.createUser({
        login: this.createUserFormGroup.get('username')?.value,
        password: this.createUserFormGroup.get('password')?.value,
      } as LoginRequest).subscribe(response => {
        this.loading = false;
        this.createUserFormGroup.reset();
        this.messageService.add({severity: SeverityEnum.SUCCESS,
          summary: 'Notification',
          detail: `L'utilisteur ${response.login} est Créé avec Succès` ,
          key: 't2',
          life: SUCCESS_LIFE})
      }, err => {
        console.log(err)
        this.loading = false;
        this.messageService.add({severity: SeverityEnum.ERROR,
          summary: 'Notification',
          detail: `Une Erreur est Survenue Lors de la Création d'un Nouveau Utilisateur` ,
          key: 't2',
          life: ERROR_LIFE})
        this.createUserFormGroup.reset();

      })
    } else {
      this.showPwdAlert = true;
    }


  }

  private checkPassword(): boolean {
    const userName = this.createUserFormGroup.controls.username?.value;
    const password = this.createUserFormGroup.controls.password?.value;

    if (!userName || !password) {
      return false;
    }

    return !(userName.includes(' ') || password.includes(' '));
  }
}
