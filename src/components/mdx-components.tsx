import type { MDXComponents } from 'mdx/types';
import styles from './mdx-components.module.css';

/**
 * The elements a post body renders through (ADR 0003), styled as the design's
 * article blocks: section headings, paragraphs and bordered code blocks. A
 * fenced block reaches `pre` with its `code` inside; inline code gets `code` alone.
 */
export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 {...props} className={styles.heading} />,
  p: (props) => <p {...props} className={styles.paragraph} />,
  pre: (props) => <pre {...props} className={styles.codeBlock} />,
  code: (props) => <code {...props} className={styles.code} />,
};
