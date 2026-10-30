import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import type { Metadata } from 'next';
import { describe, expect, it, vi } from 'vitest';

/** Layouts render the document, which loads next/font. The metadata under test does not. */
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));
import { en } from '@/lib/i18n/en';
import { type Locale, localePath, type ScreenPath } from '@/lib/i18n/locale';
import { pt } from '@/lib/i18n/pt';
import { siteConfig } from '@/lib/site-config';
import { metadata as enLayout } from './(en)/layout';
import { metadata as enHome } from './(en)/page';
import { metadata as enAbout } from './(en)/about/page';
import { metadata as enBlog } from './(en)/blog/page';
import { metadata as enContact } from './(en)/contact/page';
import { metadata as enProjects } from './(en)/projects/page';
import { metadata as ptLayout } from './(pt)/layout';
import { metadata as ptAbout } from './(pt)/pt/about/page';
import { metadata as ptBlog } from './(pt)/pt/blog/page';
import { metadata as ptContact } from './(pt)/pt/contact/page';
import { metadata as ptHome } from './(pt)/pt/page';
import { metadata as ptProjects } from './(pt)/pt/projects/page';
import { metadata as notFound } from './global-not-found';
import robots from './robots';
import sitemap from './sitemap';

/**
 * What a visitor's tab and a crawler read for one screen. Titles and
 * descriptions are the dictionary's own sentences, so the test fails if a
 * page invents copy or forgets to export `screenMetadata`.
 */
const pages: {
  locale: Locale;
  screen: ScreenPath;
  metadata: Metadata;
  title: string;
  description: string;
}[] = [
  {
    locale: 'en',
    screen: '/',
    metadata: enHome,
    title: `${siteConfig.author} — ${en.home.role}`,
    description: en.home.bio,
  },
  {
    locale: 'en',
    screen: '/about',
    metadata: enAbout,
    title: `${en.about.title} — ${siteConfig.author}`,
    description: en.about.p1,
  },
  {
    locale: 'en',
    screen: '/projects',
    metadata: enProjects,
    title: `${en.projects.title} — ${siteConfig.author}`,
    description: en.projects.subtitle,
  },
  {
    locale: 'en',
    screen: '/blog',
    metadata: enBlog,
    title: `${en.blog.title} — ${siteConfig.author}`,
    description: en.blog.subtitle,
  },
  {
    locale: 'en',
    screen: '/contact',
    metadata: enContact,
    title: `${en.contact.title} — ${siteConfig.author}`,
    description: en.contact.subtitle,
  },
  {
    locale: 'pt',
    screen: '/',
    metadata: ptHome,
    title: `${siteConfig.author} — ${pt.home.role}`,
    description: pt.home.bio,
  },
  {
    locale: 'pt',
    screen: '/about',
    metadata: ptAbout,
    title: `${pt.about.title} — ${siteConfig.author}`,
    description: pt.about.p1,
  },
  {
    locale: 'pt',
    screen: '/projects',
    metadata: ptProjects,
    title: `${pt.projects.title} — ${siteConfig.author}`,
    description: pt.projects.subtitle,
  },
  {
    locale: 'pt',
    screen: '/blog',
    metadata: ptBlog,
    title: `${pt.blog.title} — ${siteConfig.author}`,
    description: pt.blog.subtitle,
  },
  {
    locale: 'pt',
    screen: '/contact',
    metadata: ptContact,
    title: `${pt.contact.title} — ${siteConfig.author}`,
    description: pt.contact.subtitle,
  },
];

/** Directory URLs (ADR 0006). `localePath` is the prefix rule; the slash is the assertion. */
function canonical(screen: ScreenPath, locale: Locale): string {
  const path = localePath(screen, locale);
  return path.endsWith('/') ? path : `${path}/`;
}

describe('screen metadata', () => {
  it('gives every screen its own title and description, in both locales', () => {
    for (const page of pages) {
      expect(page.metadata.title, `${page.locale} ${page.screen}`).toBe(page.title);
      expect(page.metadata.description, `${page.locale} ${page.screen}`).toBe(page.description);
    }

    for (const locale of ['en', 'pt'] as const) {
      const group = pages.filter((page) => page.locale === locale);
      expect(new Set(group.map((page) => page.metadata.title)).size).toBe(group.length);
      expect(new Set(group.map((page) => page.metadata.description)).size).toBe(group.length);
    }
  });

  it('derives canonical and hreflang from the locale paths, with no host of their own', () => {
    for (const page of pages) {
      expect(page.metadata.alternates, `${page.locale} ${page.screen}`).toEqual({
        canonical: canonical(page.screen, page.locale),
        languages: {
          en: canonical(page.screen, 'en'),
          'pt-BR': canonical(page.screen, 'pt'),
          'x-default': canonical(page.screen, 'en'),
        },
      });
      expect(JSON.stringify(page.metadata), `${page.locale} ${page.screen}`).not.toMatch(/https?:/);
    }
  });

  it('points both layouts at the single base URL (ADR 0005)', () => {
    expect(enLayout.metadataBase).toEqual(new URL(siteConfig.baseUrl));
    expect(ptLayout.metadataBase).toEqual(new URL(siteConfig.baseUrl));
  });
});

describe('sitemap and robots', () => {
  it('lists every static route in both locales and no placeholder article', () => {
    const origin = siteConfig.baseUrl;

    expect(sitemap().map((entry) => entry.url)).toEqual([
      `${origin}/`,
      `${origin}/about/`,
      `${origin}/projects/`,
      `${origin}/blog/`,
      `${origin}/contact/`,
      `${origin}/pt/`,
      `${origin}/pt/about/`,
      `${origin}/pt/projects/`,
      `${origin}/pt/blog/`,
      `${origin}/pt/contact/`,
    ]);
  });

  it('allows indexing and points at the sitemap on the base URL', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
    });
  });
});

describe('404 metadata', () => {
  it('names the missing page from the dictionary', () => {
    expect(notFound.title).toBe(`${en.notFound.title} — ${siteConfig.author}`);
    expect(notFound.description).toBe(en.notFound.subtitle);
    expect(notFound.metadataBase).toEqual(new URL(siteConfig.baseUrl));
    expect(notFound.robots).toBeUndefined();
  });
});

/**
 * App Router icon files at the root of `src/app`. Next emits
 * `<link rel="icon">` and `<link rel="apple-touch-icon">` from them for both
 * root layouts and the global 404. The build is what prints the tags — this
 * checks the images they point at.
 */
describe('favicon', () => {
  const appDir = join(process.cwd(), 'src/app');

  it('publishes a circular icon and a transparent apple touch icon', () => {
    const icon = decodePng(readFileSync(join(appDir, 'icon.png')));
    expect(icon).toMatchObject({ width: 32, height: 32, channels: 4 });
    expect(icon.pixel(0, 0)[3]).toBe(0);
    expect(icon.pixel(16, 16)[3]).toBe(255);

    const apple = decodePng(readFileSync(join(appDir, 'apple-icon.png')));
    expect(apple).toMatchObject({ width: 180, height: 180, channels: 4 });
    expect(apple.pixel(0, 0)[3]).toBe(0);
    expect(apple.pixel(90, 90)[3]).toBe(255);

    const frames = decodeIco(readFileSync(join(appDir, 'favicon.ico')));
    expect(frames.map((frame) => frame.width)).toEqual([16, 32, 48]);
    for (const frame of frames) {
      expect(frame.height).toBe(frame.width);
      expect(frame.channels).toBe(4);
      expect(frame.pixel(0, 0)[3]).toBe(0);
      expect(frame.pixel(frame.width >> 1, frame.height >> 1)[3]).toBe(255);
    }
  });
});

type Raster = {
  width: number;
  height: number;
  channels: 3 | 4;
  pixel: (x: number, y: number) => number[];
};

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

/** Enough of a PNG to read the size, the colour type, and one pixel. */
function decodePng(bytes: Buffer): Raster {
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('not a png');
  }

  let width = 0;
  let height = 0;
  let channels: 3 | 4 = 3;
  const idat: Buffer[] = [];
  let offset = 8;

  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const bitDepth = data[8];
      const colorType = data[9];
      const interlace = data[12];
      if (bitDepth !== 8 || interlace !== 0 || (colorType !== 2 && colorType !== 6)) {
        throw new Error(`unsupported png ${bitDepth} ${colorType} ${interlace}`);
      }
      channels = colorType === 6 ? 4 : 3;
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  const stride = width * channels;
  const raw = inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(height * stride);
  let source = 0;
  let previous = Buffer.alloc(stride);

  for (let y = 0; y < height; y++) {
    const filter = raw[source++];
    const row = Buffer.alloc(stride);
    for (let index = 0; index < stride; index++) {
      const left = index >= channels ? row[index - channels] : 0;
      const up = previous[index];
      const upLeft = index >= channels ? previous[index - channels] : 0;
      row[index] = unfilter(filter, raw[source++], left, up, upLeft);
    }
    row.copy(pixels, y * stride);
    previous = row;
  }

  return {
    width,
    height,
    channels,
    pixel(x, y) {
      const start = (y * width + x) * channels;
      return [...pixels.subarray(start, start + channels)];
    },
  };
}

function unfilter(filter: number, value: number, left: number, up: number, upLeft: number): number {
  if (filter === 0) return value;
  if (filter === 1) return (value + left) & 255;
  if (filter === 2) return (value + up) & 255;
  if (filter === 3) return (value + Math.floor((left + up) / 2)) & 255;
  if (filter === 4) return (value + paeth(left, up, upLeft)) & 255;
  throw new Error(`unsupported png filter ${filter}`);
}

function paeth(left: number, up: number, upLeft: number): number {
  const estimate = left + up - upLeft;
  const distanceLeft = Math.abs(estimate - left);
  const distanceUp = Math.abs(estimate - up);
  const distanceUpLeft = Math.abs(estimate - upLeft);
  if (distanceLeft <= distanceUp && distanceLeft <= distanceUpLeft) return left;
  if (distanceUp <= distanceUpLeft) return up;
  return upLeft;
}

/** Vista-style ICO: a directory of PNG frames, 16 then 32 then 48. */
function decodeIco(bytes: Buffer): Raster[] {
  if (bytes.readUInt16LE(0) !== 0 || bytes.readUInt16LE(2) !== 1) {
    throw new Error('not an ico');
  }
  const count = bytes.readUInt16LE(4);
  const frames: Raster[] = [];
  for (let index = 0; index < count; index++) {
    const entry = 6 + index * 16;
    const width = bytes[entry] || 256;
    const height = bytes[entry + 1] || 256;
    const size = bytes.readUInt32LE(entry + 8);
    const offset = bytes.readUInt32LE(entry + 12);
    const frame = decodePng(bytes.subarray(offset, offset + size));
    expect(frame.width).toBe(width);
    expect(frame.height).toBe(height);
    frames.push(frame);
  }
  return frames;
}
