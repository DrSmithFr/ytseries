import { Pipe, PipeTransform } from '@angular/core';

@Pipe(
  {
    name: 'duration',
    standalone: true
  }
)
export class DurationPipe implements PipeTransform {

  transform(start: Date, end: Date): string {
    const duration = end.getTime() - start.getTime();
    const seconds  = Math.floor(duration / 1000);
    const minutes  = Math.floor(seconds / 60);
    const hours    = Math.floor(minutes / 60);
    const days     = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} days`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

}
