'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/locale';
import { web3formsAccessKey, web3formsEndpoint } from '@/lib/site-config';
import styles from './contact-screen.module.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Posts the contact form to Web3Forms from the browser. The site is a static
 * export (ADR 0001), so there is no server action to receive it — the request
 * is a client `fetch`, and a success replaces this form with the designed card
 * instead of navigating. Rendered only once a real access key is configured.
 */
export function ContactForm({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [status, setStatus] = useState<Status>('idle');
  const sending = useRef(false);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'success') confirmationRef.current?.focus();
  }, [status]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (sending.current) return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const accessKey = web3formsAccessKey();
    if (!accessKey) return;

    const data = new FormData(form);
    sending.current = true;
    setStatus('submitting');

    void postToWeb3forms({
      accessKey,
      name: field(data, 'name'),
      email: field(data, 'email'),
      message: field(data, 'message'),
      botcheck: data.get('botcheck') === 'on',
    }).then((delivered) => {
      if (delivered) {
        setStatus('success');
        return;
      }
      sending.current = false;
      setStatus('error');
    });
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        data-variant="success"
        tabIndex={-1}
        ref={confirmationRef}
        className={styles.success}
      >
        <p className={styles.sentTitle}>{t.contact.sentTitle}</p>
        <p className={styles.sentBody}>{t.contact.sentBody}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} aria-busy={status === 'submitting'}>
      <div className={styles.row}>
        <label className={styles.field}>
          {t.contact.formName}
          <input className={styles.control} name="name" autoComplete="name" required />
        </label>
        <label className={styles.field}>
          {t.contact.formEmail}
          <input
            className={styles.control}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
      </div>
      <label className={styles.field}>
        {t.contact.formMessage}
        <textarea className={styles.control} name="message" rows={5} required />
      </label>
      {/* Web3Forms drops the submission when this hidden box is checked. */}
      <input
        className={styles.botcheck}
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {status === 'error' ? (
        <p role="alert" data-variant="error" className={styles.error}>
          {t.contact.error}
        </p>
      ) : null}
      <button className={styles.submit} type="submit" disabled={status === 'submitting'}>
        {t.contact.send} →
      </button>
    </form>
  );
}

function field(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === 'string' ? value : '';
}

/** `true` only when Web3Forms accepted the message. Anything else is a failure. */
async function postToWeb3forms(fields: {
  accessKey: string;
  name: string;
  email: string;
  message: string;
  botcheck: boolean;
}): Promise<boolean> {
  try {
    const response = await fetch(web3formsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: fields.accessKey,
        subject: 'Contact form — andersonbegossi.dev',
        from_name: 'andersonbegossi.dev',
        name: fields.name,
        email: fields.email,
        message: fields.message,
        botcheck: fields.botcheck,
      }),
    });
    const result = (await response.json()) as { success?: unknown };
    return response.ok && result.success === true;
  } catch {
    return false;
  }
}
