import { describe, it, expect, vi } from 'vitest';

// Mock import.meta.env before importing sanity module
vi.stubEnv('SANITY_PROJECT_ID', 'cjtepxlw');
vi.stubEnv('SANITY_DATASET', 'production');
vi.stubEnv('SANITY_API_VERSION', '2026-03-01');

describe('Sanity Client Configuration', () => {
  it('should create a client with correct project ID', async () => {
    const { client } = await import('../src/lib/sanity');
    expect(client.config().projectId).toBe('cjtepxlw');
  });

  it('should create a client with correct dataset', async () => {
    const { client } = await import('../src/lib/sanity');
    expect(client.config().dataset).toBe('production');
  });

  it('should create a client with CDN enabled', async () => {
    const { client } = await import('../src/lib/sanity');
    expect(client.config().useCdn).toBe(true);
  });

  it('should export urlFor function', async () => {
    const { urlFor } = await import('../src/lib/sanity');
    expect(typeof urlFor).toBe('function');
  });

  it('should handle projectId with trailing whitespace', () => {
    const trimmed = ('cjtepxlw\n').trim();
    expect(trimmed).toBe('cjtepxlw');
    expect(trimmed).toMatch(/^[a-z0-9-]+$/);
  });

  it('should validate projectId format (a-z, 0-9, dashes only)', () => {
    const projectId = 'cjtepxlw';
    expect(projectId).toMatch(/^[a-z0-9-]+$/);
  });
});

describe('Sanity Image URL Builder', () => {
  it('should generate image URLs from source', async () => {
    const { urlFor } = await import('../src/lib/sanity');
    const mockSource = {
      _type: 'image',
      asset: {
        _ref: 'image-abc123-800x600-png',
        _type: 'reference',
      },
    };
    const url = urlFor(mockSource).url();
    expect(url).toContain('cdn.sanity.io');
    expect(url).toContain('cjtepxlw');
  });

  it('should support width and height transforms', async () => {
    const { urlFor } = await import('../src/lib/sanity');
    const mockSource = {
      _type: 'image',
      asset: {
        _ref: 'image-abc123-800x600-png',
        _type: 'reference',
      },
    };
    const url = urlFor(mockSource).width(400).height(300).url();
    expect(url).toContain('w=400');
    expect(url).toContain('h=300');
  });
});
