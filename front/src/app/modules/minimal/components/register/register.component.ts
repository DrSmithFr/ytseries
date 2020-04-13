import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from '@angular/forms';
import {AuthService} from '../../../../services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService} from '../../../../services/api.service';
import {Observable} from 'rxjs';
import {GoogleAnalyticsService} from '../../../../services/google-analytics.service';

@Component(
  {
    selector:    'app-register',
    templateUrl: './register.component.html',
    styleUrls:   ['./register.component.scss']
  }
)
export class RegisterComponent {
  showLoader = false;
  shaking    = false;

  registerForm = this.fb.group(
    {
      username:  ['', [Validators.required], this.validateUsernameAvailable.bind(this)],
      password:  ['', [Validators.required]],
      password2: ['', [Validators.required, this.validateSamePassword.bind(this)]],
    }
  );

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private api: ApiService,
    private ga: GoogleAnalyticsService
  ) {
  }

  validateUsernameAvailable(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable<ValidationErrors | null>(subscriber => {
      this
        .api
        .checkAccountExist(control.value)
        .subscribe(
          () => {
            subscriber.next(null);
            subscriber.complete();
          },
          () => {
            subscriber.next({used: true});
            subscriber.complete();
          },
        );
    });
  }

  validateSamePassword(control: AbstractControl): ValidationErrors | null {
    if (control.value === '' || control.value === null) {
      return {
        ['invalid']: 'invalid format'
      };
    }

    if (this.getPassword().value !== control.value) {
      return {
        ['different']: 'password different'
      };
    }

    return null;
  }

  getUsername(): AbstractControl {
    return this.registerForm.get('username');
  }

  getPassword(): AbstractControl {
    return this.registerForm.get('password');
  }

  getPassword2(): AbstractControl {
    return this.registerForm.get('password2');
  }

  /**
   * triggered when field invalid an edited
   */
  hasError(field: AbstractControl): boolean {
    return (field.dirty || field.touched) && !field.valid;
  }

  hasErrorInForm() {
    return this.hasError(this.getUsername()) ||
           this.hasError(this.getPassword2());
  }

  isFormValid() {
    // as it was programmatically called, form can be set as dirty
    this.getUsername().markAsDirty();
    this.getPassword().markAsDirty();
    this.getPassword2().markAsDirty();

    // trigger form validation
    this.registerForm.updateValueAndValidity();

    return this.registerForm.valid;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.showLoader = true;

    this
      .auth
      .register(
        this.getUsername().value,
        this.getPassword().value
      )
      .subscribe(
        () => {
          this
            .auth
            .connect(
              this.getUsername().value,
              this.getPassword().value
            )
            .subscribe(() => {
              this.ga.eventEmitter(
                'register',
                'users',
                'valid',
                'New user ' + this.getUsername().value
              );

              this.router.navigateByUrl('/series/search');
            });
        },
        () => {
          this.showLoader = false;
          this.shaking    = true;
          this.snackBar.open('Une erreur est survenue');
        }
      );
  }

}
