import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-password-forgot',
  templateUrl: './password-forgot.component.html',
  styleUrls: ['./password-forgot.component.css']
})
export class PasswordForgotComponent {

  initialize: boolean = false;
  mailSend: boolean = false;

  form = this.fb.group({
    username: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
  }

  requestResetPassword() {
    const username = this.form.get('username').value;

    this
      .userService
      .requestPasswordReset(username)
      .subscribe(mailSend => {
        this.initialize = true;
        this.mailSend = mailSend;
      });
  }

}
