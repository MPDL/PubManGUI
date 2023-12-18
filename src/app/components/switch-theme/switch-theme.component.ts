import { Component } from '@angular/core';

@Component({
  selector: 'pure-switch-theme',
  standalone: true,
  imports: [],
  templateUrl: './switch-theme.component.html',
  styleUrl: './switch-theme.component.scss'
})
export class SwitchThemeComponent {
  getStoredTheme = () => localStorage.getItem('theme');
  setStoredTheme = (theme: string) => localStorage.setItem('theme', theme);

  getPreferredTheme = () => {
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme = (theme: string) => {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
  }

  switch_theme() {
    if (document.documentElement.getAttribute('data-bs-theme')?.includes('dark')) {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
  }
}
