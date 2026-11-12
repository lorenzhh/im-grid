import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'im-theme';
const LINK_ID = 'im-theme';

/**
 * Swaps the ng-zorro theme stylesheet at runtime.
 * Both themes are built as separate, non-injected bundles (see angular.json);
 * the initial one is attached by the inline script in index.html.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);

  readonly theme = signal<Theme>(
    this.document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  );

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    if (theme === this.theme()) {
      return;
    }

    const current = this.document.getElementById(LINK_ID) as HTMLLinkElement | null;
    const next = this.document.createElement('link');
    next.rel = 'stylesheet';
    next.href = `theme-${theme}.css`;

    // Swap only once the new sheet has loaded, to avoid a flash of unstyled content.
    next.onload = () => {
      current?.remove();
      next.id = LINK_ID;
      this.applyRootAttributes(theme);
    };

    if (current) {
      current.after(next);
    } else {
      this.document.head.prepend(next);
    }

    this.theme.set(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage unavailable (private mode etc.) – theme still applies for this session
    }
  }

  private applyRootAttributes(theme: Theme): void {
    const root = this.document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  }
}
