import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FaqDialog } from '../../modals/faq/faq-dialog.component';

@Component(
  {
    selector: 'app-footer',
    imports: [],
    templateUrl: './footer.html',
    standalone: true,
    styleUrl: './footer.scss'
  }
)
export class Footer {
  constructor(
    public dialog: MatDialog,
  ) {
  }

  openFaqModal() {
    this.dialog.open(FaqDialog);
  }
}
