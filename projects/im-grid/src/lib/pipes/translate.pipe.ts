import { Pipe, PipeTransform } from '@angular/core';
import { Translation } from '../models/settings.model';
import { SettingsService } from '../services/settings.service';

@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {
    constructor(private settingsService: SettingsService) { }

    transform(object: Translation): string {
        return object[this.settingsService.language];
    }
}
