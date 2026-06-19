import { Component, Input } from '@angular/core';

type BlobColor = 'pink' | 'blue' | 'cyan' | 'green' | 'yellow' | 'orange' | 'red' | 'purple';
type BlobVertical = 'top' | 'bottom';
type BlobHorizontal = 'left' | 'right';

export type BlobConfig = {
  color: BlobColor,
  vertical: BlobVertical,
  horizontal: BlobHorizontal,
}

@Component(
  {
    selector: 'app-blob-background',
    imports: [],
    templateUrl: './blob-background.html',
    standalone: true,
    styleUrl: './blob-background.scss',
    host: {'class': 'blob-container'}
  }
)
export class BlobBackground {
  @Input() offset: boolean = false;

  @Input() blob_one: BlobConfig = {
    color: 'pink',
    vertical: 'bottom',
    horizontal: 'right',
  }

  @Input() blob_two: BlobConfig = {
    color: 'blue',
    vertical: 'top',
    horizontal: 'left',
  }
}
