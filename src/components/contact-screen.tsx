import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/locale';
import { siteConfig, web3formsAccessKey } from '@/lib/site-config';
import { ContactForm } from './contact-form';
import styles from './contact-screen.module.css';

/**
 * The Contact screen body, rendered by the routed page of each locale.
 * The form is omitted while the Web3Forms key is unset or blank
 * (ADR 0009); the mailto link is the fallback that always works.
 */
export function ContactScreen({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>{t.contact.title}</h1>
      <p className={styles.subtitle}>{t.contact.subtitle}</p>
      <a href={`mailto:${siteConfig.email}`} className={styles.email}>
        {siteConfig.email}
      </a>
      <div className={styles.social}>
        <a href={siteConfig.linkedin} target="_blank" rel="noopener" className={styles.socialLink}>
          LinkedIn ↗
        </a>
        <a href={siteConfig.github} target="_blank" rel="noopener" className={styles.socialLink}>
          GitHub ↗
        </a>
      </div>
      {web3formsAccessKey() ? <ContactForm locale={locale} /> : null}
    </div>
  );
}
