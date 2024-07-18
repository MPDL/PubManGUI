import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, Injectable, LOCALE_ID, signal } from '@angular/core';
import { loadTranslations } from '@angular/localize';
// no need 4 default
// import en from '@angular/common/locales/en';
import de from '@angular/common/locales/de';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  locale = signal('en');

  constructor() { }

  async setLocale() {
    const userLocale = localStorage.getItem('locale');
    const browserLocale = navigator.language.slice(0, 2);

    // If the user has a preferred language stored in localStorage, use it.
    if (userLocale) {
      this.locale.set(userLocale);
    } else {
      this.locale.set(browserLocale);
    }

    // Use web pack magic string to only include required locale data
    /*
    const localeModule = await import(
      `/node_modules/@angular/common/locales/${this.locale}.mjs`
    );
    */

    // Set locale for built in pipes, etc.
    if (this.locale().localeCompare('de') === 0) {
      registerLocaleData(de);
      // Load messages file
      const msgs = await import(
        `../../../assets/i18n/messages.${this.locale()}.json`
      );
      // Load labels file
      const lbls = await import(
        `../../../assets/i18n/labels.${this.locale()}.json`
      );
      const translation = Object.assign(lbls.default.translations, msgs.default.translations);
      // Load translations for the current locale at run-time
      loadTranslations(translation);
    }

  }

}

// Load locale data at app start-up
export const provideLocale = () => {
  return {
    provide: APP_INITIALIZER,
    useFactory: (i18n: I18nService) => () => i18n.setLocale(),
    deps: [I18nService],
    multi: true,
  };
}

// Set the runtime locale for the app
export const provideLocaleId = () => {
  return {
    provide: LOCALE_ID,
    useFactory: (i18n: I18nService) => i18n.locale(),
    deps: [I18nService],
  };
}
