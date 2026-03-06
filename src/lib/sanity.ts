import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = (import.meta.env.SANITY_PROJECT_ID || 'cjtepxlw').trim();
const dataset = (import.meta.env.SANITY_DATASET || 'production').trim();
const apiVersion = (import.meta.env.SANITY_API_VERSION || '2026-03-01').trim();

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
