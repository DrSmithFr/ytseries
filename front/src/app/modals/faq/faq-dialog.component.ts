import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component(
  {
    selector: 'app-faq',
    imports: [
      MatDialogModule,
      MatButtonModule,
      MatIconModule,
    ],
    templateUrl: './faq-dialog.component.html',
    standalone: true,
    styleUrl: './faq-dialog.component.scss'
  }
)
export class FaqDialog {
  constructor(
    public dialogRef: MatDialogRef<FaqDialog>,
  ) {
    this.dialogRef.updateSize("600px", "auto")
  }

  close() {
    this.dialogRef.close();
  }
}
