import { images } from './images';

export const aboutContent = {
  hero: { eyebrow: 'About Serene House', title: 'A house built for rest', text: 'The story, the people and the principles behind the calm.' },
  story: {
    eyebrow: 'Our Story',
    title: 'It began with a single quiet room',
    paragraphs: [
      'Serene House started as a single treatment room above a garden, created by a therapist who wanted clients to leave feeling genuinely restored, not just relaxed.',
      'Today the house holds six private suites, a thermal suite, a herb garden and a small team who share one belief: that good care is attentive, unhurried and deeply personal.',
      'This is a fictional demonstration story provided with the OneStop Infinite template. Replace it with your own history.'
    ],
    image: images.aboutStory
  },
  philosophy: {
    eyebrow: 'Wellness Philosophy',
    title: 'Whole-person care',
    text: 'We look at the whole person — body, skin, breath and mind — and design time that supports all four.'
  },
  facilities: {
    eyebrow: 'The Facilities',
    title: 'Spaces designed to soften',
    image: images.aboutFacility,
    items: [
      { title: 'Private treatment suites', text: 'Six warm, quiet rooms with natural light and individual climate control.' },
      { title: 'Thermal suite', text: 'Heated loungers, a steam room and a cold plunge for guests on spa days.' },
      { title: 'Herb garden terrace', text: 'A sheltered garden for tea between treatments.' },
      { title: 'Relaxation room', text: 'A dimmed, silent room for reading, resting and returning slowly.' }
    ]
  },
  team: { eyebrow: 'The Team', title: 'Meet your therapists' },
  values: {
    eyebrow: 'Mission & Values',
    title: 'What we stand for',
    mission: 'To give every guest unhurried, personal, plant-based care in a space that helps them return to themselves.',
    items: [
      { title: 'Care before schedule', text: 'We build in time so you never feel hurried.' },
      { title: 'Honest products', text: 'Transparent ingredients and no exaggerated claims.' },
      { title: 'Respect for every body', text: 'Inclusive care, informed consent and clear communication.' },
      { title: 'Gentle on the planet', text: 'Refillable products, natural fibres and low-waste rituals.' }
    ]
  }
};
