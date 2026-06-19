import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { PasswordResetRequestDialog } from '../../modals/password-reset-request/password-reset-request.dialog';
import { PasswordResetDialog } from '../../modals/password-reset/password-reset-dialog.component';
import { AuthService } from '../../services/api/auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component(
  {
    selector: 'app-login-form',
    templateUrl: './login-form.html',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatInputModule,
      MatIconModule,
      MatProgressSpinnerModule,
      MatButtonModule,
    ],
    styleUrls: ['./login-form.scss']
  }
)
export class LoginForm {
  @Input() autoRedirect = true;
  @Output() login       = new EventEmitter<void>();

  @ViewChild('password') passwordField: ElementRef<HTMLInputElement> | undefined;

  hidePassword = true;
  shaking      = false;
  showLoader   = false;

  loginForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    }
  );

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this
      .route
      .queryParams
      .pipe(takeUntilDestroyed())
      .subscribe(
        {
          next: params => {
            if (params['username'] !== undefined) {
              // this.getUsername()?.setValue(params['username']);
            }

            if (params['token'] !== undefined) {
              this.openPasswordResetDialog(params['token']);
            }
          }
        }
      )
  }

  getUsername(): AbstractControl | null {
    return this.loginForm.get('username');
  }

  getPassword(): AbstractControl | null {
    return this.loginForm.get('password');
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
    this.getUsername()?.markAsDirty();
    this.getPassword()?.markAsDirty();

    // trigger form validation
    this.loginForm.updateValueAndValidity();

    return this.loginForm.valid;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.shaking    = false;
    this.showLoader = true;

    this
      .auth
      .connect(
        this.getUsername()?.value,
        this.getPassword()?.value,
        this.autoRedirect
      )
      .subscribe(
        {
          next: () => {
            this.showLoader = false;
            this.login.emit();
          },
          error: (err: HttpErrorResponse) => {
            this.showLoader = false;
            this.shakeForm();

            console.log(err);

            if (err.status === 401) {
              this.snackBar.open('Les identifiants de connexion sont incorrects', 'OK');

              if (this.passwordField !== undefined) {
                this.passwordField.nativeElement.focus();
              }
              this.getPassword()?.setValue('');

              this.shakeForm();
            } else if (err.status === 0) {
              this.snackBar.open('Impossible de se connecter au serveur. ', 'OK');
            } else {
              this.snackBar.open(`[${err.status}] Une erreur est survenue`, 'OK');
            }
          }
        }
      );
  }

  shakeForm() {
    this.shaking = true;
  }

  openPasswordResetRequestDialog() {
    this.dialog.open(
      PasswordResetRequestDialog,
      {
        width: '500px',
        data: {
          email: this.getUsername()?.value,
        }
      }
    );
  }

  openPasswordResetDialog(token: string) {
    this.dialog.open(
      PasswordResetDialog,
      {
        height: '680px',
        width: '600px',
        data: {
          token: token,
        }
      }
    );
  }
}
