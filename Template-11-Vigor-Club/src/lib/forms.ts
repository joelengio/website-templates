import { site } from '../config/site';

export type SubmitResult =
  | { status: 'demo' }
  | { status: 'sent' }
  | { status: 'error'; message: string };

/**
 * Sends a validated form. With no `site.forms.endpoint` configured this NEVER pretends to deliver:
 * it resolves to `demo` so the UI can say the message was not sent.
 */
export async function submitForm(payload: Record<string, unknown>, fetchImpl: typeof fetch = fetch): Promise<SubmitResult> {
  const endpoint = site.forms.endpoint.trim();
  if (!endpoint) return { status: 'demo' };
  try {
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return { status: 'error', message: `The server responded with status ${res.status}. Please try again or contact us by phone or email.` };
    return { status: 'sent' };
  } catch {
    return { status: 'error', message: 'We could not reach the server. Check your connection and try again, or contact us by phone or email.' };
  }
}
