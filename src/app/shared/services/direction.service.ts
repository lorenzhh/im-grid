import { Direction, Directionality } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

const STORAGE_KEY = 'im-dir';

/**
 * Holds the layout direction. The app root binds it to the CDK `[dir]` directive,
 * so ng-zorro components and im-grid (which inject `Directionality`) follow it.
 * It's also mirrored on <html> so overlays (modals, dropdowns) render in the same direction.
 */
@Injectable({ providedIn: 'root' })
export class DirectionService {
  private document = inject(DOCUMENT);
  /** App-wide instance, used by overlays (modals, dropdowns, drawers) rendered outside the layout. */
  private rootDirectionality = inject(Directionality);

  readonly dir = signal<Direction>(
    this.document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'
  );

  toggle(): void {
    this.set(this.dir() === 'rtl' ? 'ltr' : 'rtl');
  }

  set(dir: Direction): void {
    this.dir.set(dir);
    this.document.documentElement.setAttribute('dir', dir);

    // The root Directionality only reads <html dir> once at startup; keep its signal in sync
    // (ng-zorro modals/dropdowns read it when they open).
    this.rootDirectionality.valueSignal.set(dir);
    this.rootDirectionality.change.emit(dir);
    try {
      localStorage.setItem(STORAGE_KEY, dir);
    } catch {
      // storage unavailable – direction still applies for this session
    }
  }
}
