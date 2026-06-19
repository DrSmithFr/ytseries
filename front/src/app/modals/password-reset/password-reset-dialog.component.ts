import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PasswordResetRequestDialog } from '../password-reset-request/password-reset-request.dialog';
import { ApiService } from '../../services/api/api.service';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component(
  {
    selector: 'app-password-reset-dialog',
    templateUrl: './password-reset-dialog.component.html',
    standalone: true,
    imports: [
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule
],
    styleUrls: ['./password-reset-dialog.component.scss']
  }
)
export class PasswordResetDialog implements OnInit {
  @ViewChild('password') passwordField: ElementRef<HTMLInputElement> | undefined;

  form = new FormGroup(
    {
      token: new FormControl(['', [Validators.required], this.validateResetToken.bind(this)]),
      password: new FormControl(['', [Validators.required]]),
      password2: new FormControl(['', [Validators.required, this.validateSamePassword.bind(this)]]),
    }
  );

  hidePassword  = true;
  hidePassword2 = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { token: string },
    private fb: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PasswordResetDialog>,
  ) {
    this.getToken()?.setValue(data.token);
  }

  ngOnInit() {
    // force validation of token
    this.getToken()?.markAsDirty();
    this.getToken()?.markAsTouched()
    this.form.updateValueAndValidity();
  }

  validateResetToken(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable<ValidationErrors | null>(subscriber => {
      const s = this
        .api
        .users()
        .checkPasswordResetTokenValidity(control.value)
        .subscribe({
                     next: () => {
                       subscriber.next(null);
                       subscriber.complete();
                     },
                     error: () => {
                       subscriber.next({invalid: true});
                       subscriber.complete();
                     },
                   });
    });
  }

  validateSamePassword(control: AbstractControl): ValidationErrors | null {
    if (control.value === '' || control.value === null) {
      return {
        ['invalid']: 'invalid format'
      };
    }

    if (this.getPassword()?.value !== control.value) {
      return {
        ['different']: 'password different'
      };
    }

    return null;
  }

  getToken(): AbstractControl | null {
    return this.form.get('token');
  }

  getPassword(): AbstractControl | null {
    return this.form.get('password');
  }

  getPassword2(): AbstractControl | null {
    return this.form.get('password2');
  }

  /**
   * triggered when field invalid an edited
   */
  hasError(field: AbstractControl | null): boolean {
    if (field === null) {
      return false;
    }

    return (field.dirty || field.touched) && !field.valid;
  }

  isFormValid() {
    // as it was programmatically called, form can be set as dirty
    this.getToken()?.markAsDirty();

    // trigger form validation
    this.form.updateValueAndValidity();

    return this.form.valid;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this
      .api
      .users()
      .resetPassword(this.getToken()?.value, this.getPassword()?.value)
      .subscribe({
                   next: () => {
                     this.snackBar.open('Le mot de passe à été changer', 'Close', {duration: 5000});
                     this.dialogRef.close();
                   }
                   ,
                   error: () => {
                     this.snackBar.open('Une erreur est survenue lors de la réinitialisation de votre mot de passe', 'Close', {duration: 5000});
                   }
                 });
  }

  openRequestResetPasswordDialog() {
    this.dialogRef.close();

    this.dialog.open(
      PasswordResetRequestDialog,
      {
        height: '480px',
        width: '600px',
        data: {
          email: '',
        }
      }
    )
  }
}
