import type { Category, Treatment, TreatmentCategoryId } from './types';
import { images } from './images';

/**
 * ─── TREATMENTS ────────────────────────────────────────────────────────────
 * Add, remove or edit treatments here. Prices are per guest and in the currency set in site.ts.
 * `slug` becomes the URL (/treatments/<slug>) — keep it lowercase with hyphens and unique.
 */
export const treatmentCategories: Category<TreatmentCategoryId>[] = [
  { id: 'massage', name: 'Massage', description: 'Hands-on therapies to release tension and restore ease.' },
  { id: 'facial', name: 'Facials', description: 'Skin-first rituals using botanical, results-led formulas.' },
  { id: 'body', name: 'Body Treatments', description: 'Wraps, scrubs and soaks that nourish from head to toe.' },
  { id: 'wellness', name: 'Wellness Therapies', description: 'Breath, sound and mindful practices for deeper balance.' }
];

export const treatments: Treatment[] = [
  {
    slug: 'signature-serene-massage',
    name: 'Signature Serene Massage',
    category: 'massage',
    summary: 'Our house ritual: long, flowing strokes with warm botanical oil.',
    description: [
      'The Signature Serene Massage is where every visit begins. Slow, rhythmic strokes soften the shoulders, back and legs while warm botanical oil carries the scent of cedar and neroli through the room.',
      'Your therapist tailors pressure and pace to you, so the treatment can be as gentle or as grounding as the day requires.'
    ],
    options: [{ minutes: 60, price: 145 }, { minutes: 90, price: 205 }],
    image: images.treatMassage,
    benefits: ['Eases muscular tension', 'Calms the nervous system', 'Supports restful sleep'],
    includes: ['Consultation and pressure check-in', 'Warm botanical oil blend', 'Herbal tea in the garden lounge'],
    suitableFor: 'Anyone seeking deep relaxation. Pressure is adjusted to suit you.',
    featured: true,
    maxGuests: 2,
    tags: ['relaxing', 'oil', 'full body']
  },
  {
    slug: 'deep-tissue-restore',
    name: 'Deep Tissue Restore',
    category: 'massage',
    summary: 'Focused, firm work to release stubborn knots and desk-bound shoulders.',
    description: [
      'A targeted treatment using slower, deeper pressure to reach layers of tension that lighter massage cannot. Warm compresses prepare the muscles and stretching closes the session.',
      'Ideal for athletes, desk workers and anyone carrying tension in the neck, shoulders or lower back.'
    ],
    options: [{ minutes: 60, price: 160 }, { minutes: 90, price: 225 }],
    image: images.treatStone,
    benefits: ['Releases chronic tension', 'Improves mobility', 'Targets problem areas'],
    includes: ['Warm compress preparation', 'Focused area work', 'Gentle stretching'],
    suitableFor: 'Those who prefer firm pressure. Please mention any injuries when booking.',
    maxGuests: 2,
    tags: ['firm', 'sport', 'back and shoulders']
  },
  {
    slug: 'hot-stone-ritual',
    name: 'Hot Stone Ritual',
    category: 'massage',
    summary: 'Smooth basalt stones warmed to melt tension from the inside out.',
    description: [
      'Heated river stones are placed along the spine and glide over the body with massage oil, bringing penetrating warmth that allows muscles to let go.',
      'A deeply grounding treatment, especially welcome in the colder months.'
    ],
    options: [{ minutes: 75, price: 185 }],
    image: images.treatStone,
    benefits: ['Penetrating warmth', 'Deep muscular release', 'Grounding and calming'],
    includes: ['Heated basalt stones', 'Aromatic oil', 'Scalp massage finish'],
    suitableFor: 'Not recommended during pregnancy. Please tell us about any heat sensitivities.',
    maxGuests: 2,
    tags: ['warm', 'stones', 'winter']
  },
  {
    slug: 'prenatal-comfort-massage',
    name: 'Prenatal Comfort Massage',
    category: 'massage',
    summary: 'Supportive side-lying massage designed for expectant mothers.',
    description: [
      'Specially cushioned positioning and gentle, safe techniques ease the back, hips and legs during pregnancy.',
      'Created for the second and third trimesters, with unhurried time to simply rest.'
    ],
    options: [{ minutes: 60, price: 150 }],
    image: images.treatBody,
    benefits: ['Relieves lower-back strain', 'Soothes swollen legs', 'Quiet time to rest'],
    includes: ['Supportive bolster positioning', 'Pregnancy-safe oils', 'Warm herbal tea'],
    suitableFor: 'Second and third trimester. Please confirm with your care provider.',
    maxGuests: 1,
    tags: ['pregnancy', 'gentle']
  },
  {
    slug: 'luminous-botanical-facial',
    name: 'Luminous Botanical Facial',
    category: 'facial',
    summary: 'A glow-restoring facial with plant enzymes, massage and a hydrating mask.',
    description: [
      'Skin is cleansed, gently exfoliated with fruit enzymes and treated to a lifting facial massage before a botanical mask restores softness and radiance.',
      'Your esthetician selects formulas to suit your skin that day, from dry and dull to sensitive or congested.'
    ],
    options: [{ minutes: 60, price: 135 }, { minutes: 75, price: 170 }],
    image: images.treatFacial,
    benefits: ['Brighter, more even tone', 'Deep hydration', 'Relaxing facial massage'],
    includes: ['Skin analysis', 'Enzyme exfoliation', 'Facial and shoulder massage', 'Botanical mask'],
    suitableFor: 'All skin types.',
    featured: true,
    maxGuests: 2,
    tags: ['glow', 'hydrating', 'all skin types']
  },
  {
    slug: 'renewal-collagen-facial',
    name: 'Renewal Collagen Facial',
    category: 'facial',
    summary: 'Firming, plumping care using sculpting massage and peptide serums.',
    description: [
      'A results-focused facial that combines gua sha sculpting, peptide serums and a cooling mask to support firmness and refine fine lines.',
      'Skin looks smoother and feels visibly more supple.'
    ],
    options: [{ minutes: 75, price: 190 }],
    image: images.treatSkincare,
    benefits: ['Supports firmness', 'Softens fine lines', 'Sculpting massage'],
    includes: ['Gua sha sculpting', 'Peptide serum infusion', 'Cooling mask', 'Eye treatment'],
    suitableFor: 'Mature or tired-looking skin seeking renewal.',
    maxGuests: 1,
    tags: ['anti-ageing', 'firming']
  },
  {
    slug: 'calm-skin-sensitive-facial',
    name: 'Calm Skin Sensitive Facial',
    category: 'facial',
    summary: 'A fragrance-free, soothing facial for reactive or easily flushed skin.',
    description: [
      'Gentle cleansing, cooling stones and a barrier-supporting mask help calm redness and tightness.',
      'Every product is free of synthetic fragrance and chosen for sensitivity.'
    ],
    options: [{ minutes: 50, price: 120 }],
    image: images.treatBotanical,
    benefits: ['Calms redness', 'Supports skin barrier', 'Fragrance-free'],
    includes: ['Gentle cleanse', 'Cooling stone massage', 'Barrier-repair mask'],
    suitableFor: 'Sensitive, reactive or rosacea-prone skin.',
    maxGuests: 2,
    tags: ['sensitive', 'fragrance-free']
  },
  {
    slug: 'sage-and-sea-salt-scrub',
    name: 'Sage & Sea Salt Scrub',
    category: 'body',
    summary: 'A polishing full-body scrub that leaves skin silky and glowing.',
    description: [
      'Mineral-rich sea salt blended with sage and sweet almond oil buffs away dullness. A warm shower and a light body oil leave skin velvety.',
      'Often paired with a massage for a complete body ritual.'
    ],
    options: [{ minutes: 45, price: 110 }],
    image: images.treatBotanical,
    benefits: ['Smoother skin', 'Improved circulation', 'Natural glow'],
    includes: ['Full-body exfoliation', 'Warm rinse', 'Body oil finish'],
    suitableFor: 'Most skin types. Not for freshly shaved or sunburnt skin.',
    maxGuests: 2,
    tags: ['scrub', 'glow']
  },
  {
    slug: 'warm-clay-body-wrap',
    name: 'Warm Clay Body Wrap',
    category: 'body',
    summary: 'A mineral clay wrap that detoxifies, softens and deeply relaxes.',
    description: [
      'Warm mineral clay is smoothed over the body and wrapped in heated blankets while you receive a calming scalp and foot massage.',
      'Skin emerges refined and deeply nourished.'
    ],
    options: [{ minutes: 75, price: 175 }],
    image: images.treatBody,
    benefits: ['Mineral nourishment', 'Softer skin', 'Deep relaxation'],
    includes: ['Warm clay application', 'Heated wrap', 'Scalp and foot massage'],
    suitableFor: 'Most people. Please share any allergies when booking.',
    featured: true,
    maxGuests: 2,
    tags: ['wrap', 'clay', 'detox']
  },
  {
    slug: 'rose-milk-bath-soak',
    name: 'Rose Milk Bath Soak',
    category: 'body',
    summary: 'A private soak in warm rose-infused milk with petals and quiet music.',
    description: [
      'Sink into a deep bath scented with rose and soothing oats, finished with a chilled towel and a glass of sparkling water.',
      'A restorative stand-alone indulgence or a perfect prelude to massage.'
    ],
    options: [{ minutes: 45, price: 95 }],
    image: images.treatMassage,
    benefits: ['Softens skin', 'Soothes mind and body', 'Private and unhurried'],
    includes: ['Private bath suite', 'Rose and oat soak', 'Chilled towel and sparkling water'],
    suitableFor: 'Everyone. Couples can share a suite.',
    maxGuests: 2,
    tags: ['bath', 'rose', 'couples']
  },
  {
    slug: 'scalp-and-foot-reset',
    name: 'Scalp & Foot Reset',
    category: 'body',
    summary: 'A short, deeply soothing treatment for tired feet and a busy mind.',
    description: [
      'A warm foot soak, reflexology-inspired pressure and a slow scalp massage bring the whole body into calm.',
      'A perfect lunchtime restorative.'
    ],
    options: [{ minutes: 30, price: 75 }],
    image: images.treatRitual,
    benefits: ['Relieves tired feet', 'Quiets the mind', 'Quick restoration'],
    includes: ['Warm foot soak', 'Reflexology-inspired massage', 'Scalp massage'],
    suitableFor: 'Everyone, especially those short on time.',
    maxGuests: 2,
    tags: ['express', 'feet', 'scalp']
  },
  {
    slug: 'guided-breathwork-session',
    name: 'Guided Breathwork Session',
    category: 'wellness',
    summary: 'A one-to-one guided practice to slow the breath and settle the mind.',
    description: [
      'Gentle, guided breathing exercises with soft music help release stress and bring clarity. No experience required.',
      'You will leave with simple practices to use at home.'
    ],
    options: [{ minutes: 45, price: 80 }],
    image: images.treatWellness,
    benefits: ['Reduces stress', 'Improves focus', 'Simple tools to take home'],
    includes: ['Guided session', 'Take-home practice notes', 'Herbal tea'],
    suitableFor: 'Beginners welcome. Not suitable during pregnancy without medical advice.',
    maxGuests: 2,
    tags: ['breath', 'mindfulness']
  },
  {
    slug: 'sound-bath-immersion',
    name: 'Sound Bath Immersion',
    category: 'wellness',
    summary: 'Lie back as crystal bowls and chimes wash over you in a dimmed room.',
    description: [
      'Resonant bowls, chimes and gentle gongs create an enveloping soundscape, guiding you into a deeply restful state.',
      'Mats, bolsters and blankets are provided.'
    ],
    options: [{ minutes: 60, price: 65 }],
    image: images.treatWellness,
    benefits: ['Deep rest', 'Eases racing thoughts', 'Restorative in groups or solo'],
    includes: ['Mat, bolster and blanket', 'Crystal bowl and chime soundscape'],
    suitableFor: 'Everyone. Group sessions may be shared with other guests.',
    maxGuests: 4,
    tags: ['sound', 'meditation']
  },
  {
    slug: 'restorative-yoga-nidra',
    name: 'Restorative Yoga Nidra',
    category: 'wellness',
    summary: 'A guided deep-rest practice often described as "sleep with awareness".',
    description: [
      'Supported in comfortable positions, you are guided through a body scan and visualisation that encourages profound relaxation.',
      'No movement experience is needed.'
    ],
    options: [{ minutes: 50, price: 60 }],
    image: images.treatRitual,
    benefits: ['Deep relaxation', 'Supports better sleep', 'Gentle and accessible'],
    includes: ['Bolsters and blankets', 'Guided practice'],
    suitableFor: 'All levels.',
    maxGuests: 4,
    tags: ['yoga', 'sleep']
  },
  {
    slug: 'aromatherapy-consultation',
    name: 'Aromatherapy Consultation',
    category: 'wellness',
    summary: 'Create your own calming blend with our aromatherapist.',
    description: [
      'Discover essential oils for sleep, focus or mood, then blend a personal roll-on to take home.',
      'Includes a short hand and arm massage with your chosen blend.'
    ],
    options: [{ minutes: 40, price: 70 }],
    image: images.treatSkincare,
    benefits: ['Personalised blend', 'Learn scent and wellbeing basics', 'Take-home keepsake'],
    includes: ['Scent consultation', 'Custom roll-on blend', 'Hand and arm massage'],
    suitableFor: 'Everyone. Please mention any fragrance sensitivities.',
    maxGuests: 2,
    tags: ['aroma', 'blend']
  }
];

export const getTreatment = (slug: string) => treatments.find((t) => t.slug === slug);
