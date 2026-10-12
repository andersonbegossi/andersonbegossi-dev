import { describe, expect, it } from 'vitest';
import {
  LOCALE_STORAGE_KEY,
  localeFromPathname,
  localePath,
  screenFromPathname,
  storeLocale,
} from './locale';

describe('locale URLs', () => {
  it('serves English at the root and Portuguese under /pt (ADR 0002)', () => {
    expect(localePath('/', 'en')).toBe('/');
    expect(localePath('/about', 'en')).toBe('/about');
    expect(localePath('/', 'pt')).toBe('/pt');
    expect(localePath('/about', 'pt')).toBe('/pt/about');
  });

  it('reads the locale back off a pathname', () => {
    expect(localeFromPathname('/')).toBe('en');
    expect(localeFromPathname('/about')).toBe('en');
    expect(localeFromPathname('/pt')).toBe('pt');
    expect(localeFromPathname('/pt/')).toBe('pt');
    expect(localeFromPathname('/pt/about')).toBe('pt');
  });

  it('does not mistake a screen that merely starts with pt for the locale', () => {
    expect(localeFromPathname('/ptolemy')).toBe('en');
    expect(screenFromPathname('/ptolemy')).toBe('/ptolemy');
  });

  it('reduces any URL to the screen both locales share', () => {
    expect(screenFromPathname('/')).toBe('/');
    expect(screenFromPathname('/pt')).toBe('/');
    expect(screenFromPathname('/pt/')).toBe('/');
    expect(screenFromPathname('/about')).toBe('/about');
    expect(screenFromPathname('/pt/about')).toBe('/about');
  });

  it('ignores the trailing slash the deployed URLs carry (ADR 0006)', () => {
    expect(screenFromPathname('/about/')).toBe('/about');
    expect(screenFromPathname('/pt/about/')).toBe('/about');
  });

  it('round-trips every screen through both locales', () => {
    for (const screen of ['/', '/about', '/projects', '/blog', '/contact']) {
      expect(screenFromPathname(localePath(screen, 'en'))).toBe(screen);
      expect(screenFromPathname(localePath(screen, 'pt'))).toBe(screen);
    }
  });
});

describe('locale preference', () => {
  it('persists under the key the design used', () => {
    storeLocale('pt');

    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('pt');
    expect(LOCALE_STORAGE_KEY).toBe('ab-lang');
  });
});
