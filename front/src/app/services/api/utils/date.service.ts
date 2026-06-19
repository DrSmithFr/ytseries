import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  formatDate(date: Date) {
    return this.formatDateFromNumber(date.getFullYear(), date.getMonth(), date.getDate());
  }

  formatDateUTC(date: Date) {
    return this.formatDateFromNumber(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }

  private formatDateFromNumber(year: number, monthIndex: number, day: number) {
    const month = (monthIndex + 1);
    return `${year.toString()}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  formatTime(date: Date) {
    return this.formatTimeFromNumber(date.getHours(), date.getMinutes(), date.getSeconds());
  }

  formatTimeUTC(date: Date) {
    return this.formatTimeFromNumber(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  }

  private formatTimeFromNumber(hours: number, minutes: number, seconds: number) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  formatDateTime(date: Date, separator = ' ') {
    return `${this.formatDate(date)}${separator}${this.formatTime(date)}`;
  }

  formatDateTimeUTC(date: Date, separator = ' ') {
    return `${this.formatDateUTC(date)}${separator}${this.formatTimeUTC(date)}`;
  }

  formatDateTimeWithTimezone(date: Date) {
    const timezone = date.getTimezoneOffset()
    const timezoneAbs = Math.abs(timezone);

    const timezoneHours = Math.floor(timezoneAbs / 60);
    const timezoneMinutes = timezoneAbs % 60;

    const timezoneString = `${timezoneHours.toString().padStart(2, '0')}:${timezoneMinutes.toString().padStart(2, '0')}`;

    if (timezone >= 0) {
      return `${this.formatDateTimeUTC(date, 'T')}+${timezoneString}`;
    }

    return `${this.formatDateTimeUTC(date, 'T')}-${timezoneString}`;
  }

  makeDateFromString(str: string): Date {
    const [dateStr, timeStr] = str.split(' ');
    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const [hoursStr, minutesStr, secondsStr] = timeStr.split(':');

    const year = parseInt(yearStr || '0');
    const month = parseInt(monthStr || '1') - 1;
    const day = parseInt(dayStr || '0');

    const hours = parseInt(hoursStr || '0');
    const minutes = parseInt(minutesStr || '0');
    const seconds = parseInt(secondsStr || '0');

    return new Date(year, month, day, hours, minutes, seconds);
  }
}
