import type { ImageAsset } from './types';

const scene = (file: string, alt: string, width = 1600, height = 1067): ImageAsset => ({
  src: `/images/${file}.jpg`,
  small: `/images/${file}-640.jpg`,
  smallWidth: 640,
  width,
  height,
  alt,
});

/** Central image registry. Swap files under public/images and update `alt` text here. */
export const images: Record<string, ImageAsset> = {
  hero: scene('hero-skyline', 'Glass office towers rising against a pale sky, photographed from street level'),
  office: scene('office-interior', 'Bright open-plan office with large windows and a shared meeting table', 1600, 1068),
  boardroom: scene('boardroom', 'Empty boardroom with a long table and leather chairs beside floor-to-ceiling windows'),
  planning: scene('planning-desk', 'Two people reviewing handwritten notes beside an open laptop', 1600, 1068),
  tax: scene('tax-documents', 'Tax paperwork, a calculator and a pen laid out on a white table', 1600, 918),
  growth: scene('seedling-coins', 'A young green seedling growing from a small pile of coins'),
  analytics: scene('analytics-laptop', 'Laptop showing a business analytics dashboard with charts', 1600, 1140),
  handshake: scene('handshake', 'Two professionals shaking hands across a table', 1600, 1068),
  signing: scene('signing-documents', 'A hand signing a document with a pen', 1600, 1068),
  consultation: scene('consultation', 'An adviser in conversation with a client at a desk with a laptop', 1600, 1067),
  startup: scene('ind-startup', 'A small team working together on laptops around a wooden table', 1600, 900),
  sme: scene('ind-sme', 'Two colleagues celebrating with a high five over paperwork and a laptop'),
  professional: scene('ind-professional', 'Colleagues discussing notes around a meeting table'),
  retail: scene('ind-retail', 'Shop assistant handling a card payment with a customer at a retail counter', 1600, 1068),
  tech: scene('ind-tech', 'Two engineers working side by side at computers in a bright studio', 1600, 1067),
  property: scene('ind-property', 'Modern white house with a swimming pool and landscaped terrace'),
  enterprise: scene('ind-enterprise', 'Large open-plan corporate office with a long shared table'),
  og: { src: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Folio Finance — glass towers and the brand name' },
};

export const portrait = (file: string, alt: string): ImageAsset => ({
  src: `/images/${file}.jpg`,
  small: `/images/${file}-480.jpg`,
  smallWidth: 480,
  width: 900,
  height: 1100,
  alt,
});
