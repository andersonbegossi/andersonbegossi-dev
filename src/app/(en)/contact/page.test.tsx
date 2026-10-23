import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import styles from '@/components/contact-screen.module.css';
import { renderRoute } from '@/test/render-route';
import ContactPage from './page';

const ACCESS_KEY = 'test-access-key';

describe('Contact screen', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('shows the title, the mailto link and the andersonbegossi profiles', () => {
    vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', '');
    renderRoute(<ContactPage />, '/contact');

    expect(screen.getByRole('heading', { level: 1, name: 'Contact' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Have a project, a role, or just want to talk engineering? My inbox is open.',
      ),
    ).toBeInTheDocument();

    const main = screen.getByRole('main');
    const email = within(main).getByRole('link', { name: 'andersonbegossi@gmail.com' });
    expect(email).toHaveAttribute('href', 'mailto:andersonbegossi@gmail.com');
    expect(email).not.toHaveAttribute('target');

    const linkedin = within(main).getByRole('link', { name: 'LinkedIn ↗' });
    expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/andersonbegossi');
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('rel', 'noopener');

    const github = within(main).getByRole('link', { name: 'GitHub ↗' });
    expect(github).toHaveAttribute('href', 'https://github.com/andersonbegossi');

    for (const link of within(main).getAllByRole('link')) {
      expect(link.getAttribute('href')).not.toMatch(/ambegossi|andersonbegossi-b5065a130/);
    }
    expect(screen.getByRole('link', { name: 'Switch language' })).toHaveAttribute(
      'href',
      '/pt/contact',
    );
  });

  it.each(['', 'placeholder', '   ', '  placeholder  '])(
    'renders no form while the access key is %j',
    (key) => {
      vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', key);
      renderRoute(<ContactPage />, '/contact');

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Send message/ })).not.toBeInTheDocument();
    },
  );

  it('renders the required fields once a key is configured', () => {
    renderConfigured();

    const name = screen.getByRole('textbox', { name: 'Name' });
    const email = screen.getByRole('textbox', { name: 'Email' });
    const message = screen.getByRole('textbox', { name: 'Message' });

    expect(name).toBeRequired();
    expect(email).toBeRequired();
    expect(email).toHaveAttribute('type', 'email');
    expect(message).toBeRequired();
    expect(screen.getByRole('button', { name: 'Send message →' })).toBeEnabled();
  });

  it('does not submit while a required field is empty', async () => {
    const user = renderConfigured();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada Lovelace');
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: 'Send message →' }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('');
  });

  it('replaces the form with the confirmation card when Web3Forms accepts it', async () => {
    const user = renderConfigured();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Email sent successfully!' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const href = window.location.href;

    await fillAndSend(user);

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('Message sent!');
    expect(status).toHaveTextContent('Thanks for reaching out — I’ll get back to you soon.');
    expect(screen.queryByRole('textbox', { name: 'Message' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Send message/ })).not.toBeInTheDocument();
    expect(window.location.href).toBe(href);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: 'Contact form — andersonbegossi.dev',
        from_name: 'andersonbegossi.dev',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        message: 'Hello from the form',
        botcheck: false,
      }),
    });
  });

  it('gives the success and error states different variants', async () => {
    const css = readFileSync(
      join(process.cwd(), 'src/components/contact-screen.module.css'),
      'utf8',
    );
    const successRule = cssBlock(css, '.success') + cssBlock(css, '.sentTitle');
    const errorRule = cssBlock(css, '.error');
    expect(successRule).not.toContain('--accent');
    expect(errorRule).toContain('--accent');

    const user = renderConfigured();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) }),
    );
    await fillAndSend(user);
    const status = await screen.findByRole('status');
    expect(status).toHaveAttribute('data-variant', 'success');
    expect(status).toHaveClass(styles.success);
    expect(status).not.toHaveClass(styles.error);

    cleanup();

    const again = renderConfigured();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ success: false }) }),
    );
    await fillAndSend(again);
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveAttribute('data-variant', 'error');
    expect(alert).toHaveClass(styles.error);
    expect(alert).not.toHaveClass(styles.success);
    expect(alert.getAttribute('data-variant')).not.toBe(status.getAttribute('data-variant'));
  });

  it('keeps the message and shows an error when Web3Forms rejects it', async () => {
    const user = renderConfigured();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ success: false, message: 'Invalid access key' }),
      }),
    );

    await fillAndSend(user);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Couldn’t send that — please try again, or use the email above.',
    );
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada Lovelace');
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('ada@example.com');
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('Hello from the form');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('keeps the message and shows an error when the request fails', async () => {
    const user = renderConfigured();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    await fillAndSend(user);

    expect(await screen.findByRole('alert')).toHaveTextContent(/Couldn’t send that/);
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('Hello from the form');
  });

  it('disables the button until the request settles, and does not send twice', async () => {
    const user = renderConfigured();
    let resolveFetch: (value: { ok: boolean; json: () => Promise<{ success: boolean }> }) => void =
      () => {};
    const pending = new Promise<{ ok: boolean; json: () => Promise<{ success: boolean }> }>(
      (resolve) => {
        resolveFetch = resolve;
      },
    );
    const fetchMock = vi.fn().mockReturnValue(pending);
    vi.stubGlobal('fetch', fetchMock);

    await fillAndSend(user);

    const button = screen.getByRole('button', { name: 'Send message →' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveFetch({ ok: true, json: async () => ({ success: true }) });
    expect(await screen.findByRole('status')).toBeInTheDocument();
  });
});

function cssBlock(css: string, selector: string): string {
  const escaped = selector.replace('.', '\\.');
  return css.match(new RegExp(`${escaped}\\s*\\{[^}]*\\}`))?.[0] ?? '';
}

function renderConfigured(): UserEvent {
  vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', ACCESS_KEY);
  renderRoute(<ContactPage />, '/contact');
  return userEvent.setup();
}

async function fillAndSend(user: UserEvent) {
  await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada Lovelace');
  await user.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@example.com');
  await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Hello from the form');
  await user.click(screen.getByRole('button', { name: 'Send message →' }));
}
