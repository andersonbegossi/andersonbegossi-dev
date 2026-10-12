import { evaluateSync } from '@mdx-js/mdx';
import Link from 'next/link';
import * as runtime from 'react/jsx-runtime';
import { formatPostMeta } from '@/lib/blog/format';
import { loadPosts, type Post } from '@/lib/blog/posts';
import { getDictionary } from '@/lib/i18n';
import { localePath, type Locale } from '@/lib/i18n/locale';
import { mdxComponents } from './mdx-components';
import styles from './article-screen.module.css';

/**
 * Stands in for the posts of a locale that has none. `output: 'export'` fails
 * the build on an empty `generateStaticParams`, and the site launches with no
 * posts (ADR 0003), so the route generates this one slug instead. No post has
 * it, so its page is the site's 404, marked `noindex`, at an address nothing
 * links to.
 */
const NO_POSTS_SLUG = '_';

/** `generateStaticParams` for a locale's article route: one page per post published in it. */
export function articleParams(locale: Locale): { slug: string }[] {
  const params = loadPosts(locale).map(({ slug }) => ({ slug }));
  return params.length > 0 ? params : [{ slug: NO_POSTS_SLUG }];
}

/** The post an article route renders — none only for `NO_POSTS_SLUG`, as `dynamicParams` is off. */
export function findPost(locale: Locale, slug: string): Post | undefined {
  return loadPosts(locale).find((post) => post.slug === slug);
}

/**
 * The Article screen: back link, category, title, date and reading time, the
 * MDX body, then the tags. The body compiles here, at build time — the static
 * export ships only the HTML it renders to (ADR 0001).
 */
export function ArticleScreen({ post }: { post: Post }) {
  const t = getDictionary(post.locale);
  const { default: Body } = evaluateSync(post.body, runtime);

  return (
    <article className={styles.screen}>
      <Link href={localePath('/blog', post.locale)} className={styles.back}>
        ← {t.nav.blog}
      </Link>
      <p className={styles.category}>{post.category}</p>
      <h1 className={styles.title}>{post.title}</h1>
      <p className={styles.meta}>{formatPostMeta(post, post.locale)}</p>
      <div className={styles.body}>
        <Body components={mdxComponents} />
      </div>
      <ul aria-label={t.a11y.tags} className={styles.tags}>
        {post.tags.map((tag) => (
          <li key={tag} className={styles.tag}>
            #{tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
