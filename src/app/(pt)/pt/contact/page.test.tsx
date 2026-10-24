import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { renderRoute } from '@/test/render-route';
import ContactPage from './page';

const ACCESS_KEY = 'test-access-key';

describe('Portuguese Contact screen', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('shows the Portuguese title, the mailto link and the profiles, with no form', () => {
    vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', '');
    renderRoute(<ContactPage />, '/pt/contact');

    expect(screen.getByRole('heading', { level: 1, name: 'Contato' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Tem um projeto, uma vaga, ou só quer conversar sobre engenharia? Minha caixa de entrada está aberta.',
      ),
    ).toBeInTheDocument();

    const main = screen.getByRole('main');
    expect(within(main).getByRole('link', { name: 'andersonbegossi@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:andersonbegossi@gmail.com',
    );
    expect(within(main).getByRole('link', { name: 'LinkedIn ↗' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/andersonbegossi',
    );
    expect(within(main).getByRole('link', { name: 'GitHub ↗' })).toHaveAttribute(
      'href',
      'https://github.com/andersonbegossi',
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Enviar mensagem/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mudar idioma' })).toHaveAttribute('href', '/contact');
  });

  it('renders the form in Portuguese once a key is configured', () => {
    renderConfigured();

    expect(screen.getByRole('textbox', { name: 'Nome' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Mensagem' })).toBeRequired();
    expect(screen.getByRole('button', { name: 'Enviar mensagem →' })).toBeEnabled();
  });

  it('replaces the form with the Portuguese confirmation card', async () => {
    const user = renderConfigured();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      }),
    );

    await fillAndSend(user);

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('Mensagem enviada!');
    expect(status).toHaveTextContent('Obrigado pelo contato — respondo em breve.');
    expect(screen.queryByRole('textbox', { name: 'Mensagem' })).not.toBeInTheDocument();
  });

  it('keeps the message and shows a Portuguese error when the submission fails', async () => {
    const user = renderConfigured();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    await fillAndSend(user);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível enviar — tente de novo, ou use o e-mail acima.',
    );
    expect(screen.getByRole('textbox', { name: 'Mensagem' })).toHaveValue('Olá, pelo formulário');
    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue('Ada Lovelace');
  });
});

function renderConfigured(): UserEvent {
  vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', ACCESS_KEY);
  renderRoute(<ContactPage />, '/pt/contact');
  return userEvent.setup();
}

async function fillAndSend(user: UserEvent) {
  await user.type(screen.getByRole('textbox', { name: 'Nome' }), 'Ada Lovelace');
  await user.type(screen.getByRole('textbox', { name: 'E-mail' }), 'ada@example.com');
  await user.type(screen.getByRole('textbox', { name: 'Mensagem' }), 'Olá, pelo formulário');
  await user.click(screen.getByRole('button', { name: 'Enviar mensagem →' }));
}
