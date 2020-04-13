import {Component, Inject} from '@angular/core';
import {AssetModel} from '../../../../models/search/asset.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {GoogleAnalyticsService} from '../../../../services/google-analytics.service';

@Component(
    {
        selector:    'app-quick-view',
        templateUrl: './quick-view.component.html',
        styleUrls:   ['./quick-view.component.scss']
    }
)
export class QuickViewComponent {

    constructor(
        public dialogRef: MatDialogRef<QuickViewComponent>,
        @Inject(MAT_DIALOG_DATA) public item: AssetModel,
        private auth: AuthService,
        private snackBar: MatSnackBar,
        private router: Router,
        private ga: GoogleAnalyticsService
    ) {
    }

    close() {
        this.dialogRef.close();
    }

    save() {
      if (this.auth.hasSession()) {
        this.ga.eventEmitter(
          'save',
          'series',
          this.item.name,
          'Saving ' + this.item.name
        );
        this
          .snackBar
          .open(
            'Cette fonction n\'est pas encore développée...'
          );
      } else {
        this
          .snackBar
          .open(
            'Créé un compte pour sauvgarder des series à regarder plus tard !',
            'Créer',
            {
              duration: 5000
            }
          )
          .onAction()
          .subscribe(() => {
            this.router.navigateByUrl('/users/register');
          });
      }
    }
}
