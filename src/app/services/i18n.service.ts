import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, Injectable, LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import en from '@angular/common/locales/en';
import de from '@angular/common/locales/en';

@Injectable({
  providedIn: 'root'
})
class I18nService {

  constructor() { }

  locale = 'en';

  async setLocale() {
    const userLocale = localStorage.getItem('locale');
    const browserLocale = navigator.language;
    console.log('browser lang', browserLocale)

    // If the user has a preferred language stored in localStorage, use it.
    if (userLocale) {
      this.locale = userLocale;
    }

    // Use web pack magic string to only include required locale data
    /*
    const localeModule = await import(
      `/node_modules/@angular/common/locales/${this.locale}.mjs`
    );
    */

    // Set locale for built in pipes, etc.
    if (this.locale.localeCompare('en') === 0) {
      registerLocaleData(en, 'en-US');
    } else {
      registerLocaleData(de, 'de')
    }

    // Load messages file
    const msgs = await import(
      `../../../src/assets/i18n/messages.${this.locale}.json`
    );
     // Load labels file
     const lbls = await import(
      `../../../src/assets/i18n/labels.${this.locale}.json`
    );
    const translation = Object.assign(lbls.default.translations, msgs.default.translations);
    // Load translations for the current locale at run-time
    loadTranslations(translation);
  }
}

// Load locale data at app start-up
export const setLocale = {
    provide: APP_INITIALIZER,
    useFactory: (i18n: I18nService) => () => i18n.setLocale(),
    deps: [I18nService],
    multi: true,
}

// Set the runtime locale for the app
export const setLocaleId = {
    provide: LOCALE_ID,
    useFactory: (i18n: I18nService) => i18n.locale,
    deps: [I18nService],
}
