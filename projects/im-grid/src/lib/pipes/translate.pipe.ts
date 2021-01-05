import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Translation } from '../models/settings.model';
import { SettingsService } from '../services/settings.service';

@Pipe({
    name: 'translate',
})
export class TranslatePipe implements PipeTransform {
    constructor(private settingsService: SettingsService) {}

    transform(object: Translation): Observable<string> {
        return this.settingsService.settings.pipe(
            map((settings) =>
                typeof object === 'string' ? object : object[settings.language]
            )
        );
    }
}
