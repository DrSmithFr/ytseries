import {TestBed} from '@angular/core/testing';

import {PasswordResetDialog} from './password-reset-dialog.component';
import {RouterTestingModule} from "@angular/router/testing";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../../api/services/api.service";

describe('PasswordResetDialog', () => {
  beforeEach(async () => {
    const ApiServiceMock = jasmine.createSpyObj('ApiService', ['']);

    const MatDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const MatDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    const MatSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatFormFieldModule,
        MatDialogModule
      ],
      declarations: [
        PasswordResetDialog,
      ],
      providers: [
        {provide: ApiService, useValue: ApiServiceMock},
        {provide: MatSnackBar, useValue: MatSnackBarSpy},
        {provide: MatDialog, useValue: MatDialogMock},
        {provide: MatDialogRef, useValue: MatDialogRefMock},
        {provide: MAT_DIALOG_DATA, useValue: {token: 'token'}},

      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PasswordResetDialog);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
