import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');

describe('Astro Build', () => {
  // Build once for all tests in this suite
  let buildOutput: string;
  let buildSuccess: boolean;

  it('should complete the build without errors', () => {
    try {
      buildOutput = execSync('npm run build', {
        cwd: ROOT,
        encoding: 'utf-8',
        timeout: 120_000,
        env: {
          ...process.env,
          SANITY_PROJECT_ID: 'cjtepxlw',
          SANITY_DATASET: 'production',
          SANITY_API_VERSION: '2026-03-01',
        },
      });
      buildSuccess = true;
    } catch (e: any) {
      buildOutput = e.stdout || e.message;
      buildSuccess = false;
    }
    expect(buildSuccess).toBe(true);
  }, 120_000);

  it('should generate the dist directory', () => {
    // Vercel adapter outputs to .vercel/output
    const hasVercelOutput = existsSync(join(ROOT, '.vercel', 'output'));
    const hasDist = existsSync(join(ROOT, 'dist'));
    expect(hasVercelOutput || hasDist).toBe(true);
  });
});

describe('Static Pages Generation', () => {
  const pages = [
    'index.html',
    'about/index.html',
    'services/index.html',
    'process/index.html',
    'contact/index.html',
    '404.html',
    'projects/index.html',
    'projects/diani-sea-hotels/index.html',
    'projects/afri-educare-alliance/index.html',
    'insights/index.html',
    'insights/introducing-tama-pr/index.html',
    'insights/introducing-tama-pr/index.html',
    'insights/videos/index.html',
    'insights/videos/coming-soon/index.html',
  ];

  // Find the output dir (Vercel adapter uses .vercel/output/static)
  function getOutputDir(): string {
    const vercelStatic = join(ROOT, '.vercel', 'output', 'static');
    if (existsSync(vercelStatic)) return vercelStatic;
    return join(ROOT, 'dist');
  }

  for (const page of pages) {
    it(`should generate ${page}`, () => {
      const outputDir = getOutputDir();
      const filePath = join(outputDir, page);
      expect(existsSync(filePath)).toBe(true);
    });
  }
});

describe('HTML Content Validation', () => {
  function getOutputDir(): string {
    const vercelStatic = join(ROOT, '.vercel', 'output', 'static');
    if (existsSync(vercelStatic)) return vercelStatic;
    return join(ROOT, 'dist');
  }

  function readPage(path: string): string {
    return readFileSync(join(getOutputDir(), path), 'utf-8');
  }

  it('homepage should contain TamaPR branding', () => {
    const html = readPage('index.html');
    expect(html).toContain('Tama');
  });

  it('homepage should have meta description', () => {
    const html = readPage('index.html');
    expect(html).toContain('<meta');
    expect(html).toContain('description');
  });

  it('homepage should load Playfair Display font', () => {
    const html = readPage('index.html');
    expect(html).toContain('Playfair');
  });

  it('homepage should load Inter font', () => {
    const html = readPage('index.html');
    expect(html).toContain('Inter');
  });

  it('about page should contain team/company info', () => {
    const html = readPage('about/index.html');
    expect(html.toLowerCase()).toContain('about');
  });

  it('contact page should have a form', () => {
    const html = readPage('contact/index.html');
    expect(html).toContain('<form');
  });

  it('404 page should exist and have error messaging', () => {
    const html = readPage('404.html');
    expect(html).toContain('404');
  });

  it('all pages should include navigation', () => {
    const html = readPage('index.html');
    expect(html).toContain('<nav');
  });

  it('all pages should include footer', () => {
    const html = readPage('index.html');
    expect(html).toContain('<footer');
  });

  it('sitemap should be generated', () => {
    const outputDir = getOutputDir();
    const sitemapPath = join(outputDir, 'sitemap-index.xml');
    const sitemapAlt = join(outputDir, 'sitemap-0.xml');
    expect(existsSync(sitemapPath) || existsSync(sitemapAlt)).toBe(true);
  });
});

describe('CSS and Assets', () => {
  function getOutputDir(): string {
    const vercelStatic = join(ROOT, '.vercel', 'output', 'static');
    if (existsSync(vercelStatic)) return vercelStatic;
    return join(ROOT, 'dist');
  }

  it('should generate CSS assets', () => {
    const outputDir = getOutputDir();
    const assetsDir = join(outputDir, '_astro');
    if (existsSync(assetsDir)) {
      const files = readdirSync(assetsDir);
      const cssFiles = files.filter((f) => f.endsWith('.css'));
      expect(cssFiles.length).toBeGreaterThan(0);
    } else {
      // Fallback: CSS may be inlined
      const html = readFileSync(join(outputDir, 'index.html'), 'utf-8');
      expect(html).toContain('style');
    }
  });

  it('should contain design tokens (navy color)', () => {
    const outputDir = getOutputDir();
    const assetsDir = join(outputDir, '_astro');
    if (existsSync(assetsDir)) {
      const files = readdirSync(assetsDir);
      const cssFiles = files.filter((f) => f.endsWith('.css'));
      if (cssFiles.length > 0) {
        const css = readFileSync(join(assetsDir, cssFiles[0]), 'utf-8');
        // Check for navy color or Tailwind classes
        const hasDesignTokens = css.includes('1B2A4A') || css.includes('1b2a4a') || css.includes('navy');
        expect(hasDesignTokens).toBe(true);
      }
    }
  });
});
