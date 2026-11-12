import { Pipe, PipeTransform, inject } from '@angular/core';
import { ImGridI18n, ImText } from '../i18n/im-grid-i18n';

/**
 * Resolves a host-provided text (string or `{ en, ar, ... }`) for the grid's current language.
 * Impure on purpose: it reads the language signal, so a language switch updates every label.
 */
@Pipe({
  name: 'imText',
  pure: false,
})
export class ImTextPipe implements PipeTransform {
  private i18n = inject(ImGridI18n);

  transform(text: ImText | null | undefined): string {
    return this.i18n.translate(text);
  }
}
