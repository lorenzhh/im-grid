import { Pipe, PipeTransform } from '@angular/core';
import { Translation } from '../models/settings.model';
import { SettingsService } from '../services/settings.service';

@Pipe({
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {
  constructor(private settingsService: SettingsService) {}

  transform(translation: Translation | string): string {
    if (!translation) {
      return '';
    }

    if (typeof translation === 'string') {
      return translation;
    }

    console.log('here', translation);
    return translation[this.settingsService.language];
  }
}
