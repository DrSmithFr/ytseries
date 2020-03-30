import {Component, Inject} from '@angular/core';
import {AssetModel} from '../../../../models/search/asset.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

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
        @Inject(MAT_DIALOG_DATA) public item: AssetModel
    ) {
    }

    close() {
        this.dialogRef.close();
    }
}
