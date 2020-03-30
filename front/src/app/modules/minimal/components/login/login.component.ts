import {Component, ElementRef, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StateService} from '../../../../services/state.service';
import {AuthService} from '../../../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';

@Component(
    {
        selector:    'app-login',
        templateUrl: './login.component.html',
        styleUrls:   ['./login.component.scss']
    }
)
export class LoginComponent {
    @ViewChild('password') passwordField: ElementRef<HTMLInputElement>;

    shaking            = false;
    showLoader         = false;
    showForgotPassword = false;

    loginForm = this.fb.group(
        {
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
        }
    );

    constructor(
        private auth: AuthService,
        private fb: FormBuilder,
        private router: Router,
        private snackBar: MatSnackBar,
        private state: StateService,
        public dialog: MatDialog
    ) {
    }

    getEmail(): AbstractControl {
        return this.loginForm.get('username');
    }

    getPassword(): AbstractControl {
        return this.loginForm.get('password');
    }

    /**
     * triggered when field invalid an edited
     */
    hasError(field: AbstractControl): boolean {
        return (field.dirty || field.touched) && !field.valid;
    }

    isFormValid() {
        // as it was programmatically called, form can be set as dirty
        this.getEmail().markAsDirty();
        this.getPassword().markAsDirty();

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
                this.getEmail().value,
                this.getPassword().value,
            )
            .subscribe(
                () => {
                    const redirect = this.state.REDIRECT_AFTER_LOGIN.getValue();
                    console.log(redirect);
                    this.router.navigateByUrl(redirect);
                },
                error => {
                    this.showLoader = false;

                    if (error.status === 401) {
                        this.snackBar.open('Les identifiants de connection sont incorrect');

                        this.passwordField.nativeElement.focus();
                        this.getPassword().setValue('');

                        this.shakeForm();
                        this.showForgotPassword = true;
                    } else {
                        console.error(error);
                        this.snackBar.open('Une erreur est survenue');
                    }
                }
            );
    }

    shakeForm() {
        this.shaking = true;
    }
}
