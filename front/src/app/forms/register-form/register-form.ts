import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/api/auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api/api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { first, Observable } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';

@Component(
  {
    selector: 'app-register-form',
    templateUrl: './register-form.html',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatInputModule,
      MatIconModule,
      MatProgressSpinnerModule,
      MatButtonModule,
      RouterLink,
      NgxMaskDirective,
    ],
    styleUrls: ['./register-form.scss']
  }
)
export class RegisterForm {
  @Input() autoRedirect  = true;
  @Output() registration = new EventEmitter<void>();

  showLoader = false;
  shaking    = false;

  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email], this.validateUsernameAvailable.bind(this)),
      phone: new FormControl('', [Validators.required, this.validatePhoneDontStartWithZero.bind(this)]),
    }
  );

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private api: ApiService,
    private snackBar: MatSnackBar,
  ) {
    this
      .route
      .queryParams
      .pipe(takeUntilDestroyed())
      .subscribe(
        {
          next: params => {
            if (params['username'] !== undefined) {
              this.getEmail()?.setValue(params['username']);
            }
          }
        }
      );
  }

  validateUsernameAvailable(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable<ValidationErrors | null>(subscriber => {
      const s = this
        .api
        .users()
        .checkAccountExist(control.value)
        .pipe(first())
        .subscribe(
          {
            next: () => {
              subscriber.next(null);
              subscriber.complete();
            },
            error: () => {
              subscriber.next({used: true});
              subscriber.complete();
            },
          }
        );
    });
  }

  validatePhoneDontStartWithZero(control: AbstractControl): ValidationErrors | null {
    const phone = control.value;

    if (phone === null || phone === '' || phone.length < 3) {
      return null;
    }

    if (phone[2] === '0') {
      return {invalid: true};
    }

    return null;
  }

  getName(): AbstractControl | null {
    return this.registerForm.get('name');
  }

  getEmail(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  getPhone(): AbstractControl | null {
    return this.registerForm.get('phone');
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

  hasErrorInForm() {
    return this.hasError(this.getName()) ||
           this.hasError(this.getEmail()) ||
           this.hasError(this.getPhone());
  }

  isFormValid() {
    // as it was programmatically called, form can be set as dirty
    this.getName()?.markAsDirty();
    this.getEmail()?.markAsDirty();
    this.getPhone()?.markAsDirty();

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
        this.getName()?.value,
        this.getEmail()?.value,
        '+' + this.getPhone()?.value,
        this.autoRedirect
      )
      .subscribe(
        {
          next: () => {
            this.showLoader = false;
            this.registration.emit();
          },
          error: (err: HttpErrorResponse) => {
            this.showLoader = false;
            this.shaking    = true;
            this.snackBar.open(`[${err.status}] Une erreur est survenue lors de l'inscription`, 'OK');
          }
        }
      );
  }
}
