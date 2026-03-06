import { describe, it, expect, vi, beforeEach } from 'vitest';

// We test the API handler logic directly since Astro API routes
// are just functions that take Request and return Response

describe('Contact API Route', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createRequest(body: Record<string, unknown>): Request {
    return new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  it('should reject requests missing required fields', async () => {
    const { POST } = await import('../src/pages/api/contact');
    const request = createRequest({ name: 'Test' });
    const response = await POST({ request } as any);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Missing required fields');
  });

  it('should reject requests with no email', async () => {
    const { POST } = await import('../src/pages/api/contact');
    const request = createRequest({ name: 'Test', message: 'Hello' });
    const response = await POST({ request } as any);
    expect(response.status).toBe(400);
  });

  it('should reject requests with no message', async () => {
    const { POST } = await import('../src/pages/api/contact');
    const request = createRequest({ name: 'Test', email: 'test@test.com' });
    const response = await POST({ request } as any);
    expect(response.status).toBe(400);
  });

  it('should accept valid submissions without RESEND_API_KEY', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const { POST } = await import('../src/pages/api/contact');
    const request = createRequest({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, interested in PR services',
    });
    const response = await POST({ request } as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it('should accept submissions with optional organization field', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const { POST } = await import('../src/pages/api/contact');
    const request = createRequest({
      name: 'Jane Smith',
      email: 'jane@corp.com',
      organization: 'Corp Inc',
      message: 'Partnership inquiry',
    });
    const response = await POST({ request } as any);
    expect(response.status).toBe(200);
  });

  it('should handle malformed JSON gracefully', async () => {
    const { POST } = await import('../src/pages/api/contact');
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-valid-json',
    });
    const response = await POST({ request } as any);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Server error');
  });

  it('should return JSON content type in all responses', async () => {
    const { POST } = await import('../src/pages/api/contact');
    const request = createRequest({ name: 'Test' });
    const response = await POST({ request } as any);
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });
});
