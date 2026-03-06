import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Newsletter API Route', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createRequest(body: Record<string, unknown>): Request {
    return new Request('http://localhost/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  it('should reject requests without email', async () => {
    const { POST } = await import('../src/pages/api/newsletter');
    const request = createRequest({});
    const response = await POST({ request } as any);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Email is required');
  });

  it('should accept valid email subscriptions', async () => {
    const { POST } = await import('../src/pages/api/newsletter');
    const request = createRequest({ email: 'subscriber@example.com' });
    const response = await POST({ request } as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it('should handle malformed JSON gracefully', async () => {
    const { POST } = await import('../src/pages/api/newsletter');
    const request = new Request('http://localhost/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid',
    });
    const response = await POST({ request } as any);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Server error');
  });

  it('should return JSON content type', async () => {
    const { POST } = await import('../src/pages/api/newsletter');
    const request = createRequest({ email: 'test@test.com' });
    const response = await POST({ request } as any);
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });
});
