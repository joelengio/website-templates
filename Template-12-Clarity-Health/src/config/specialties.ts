import type { Specialty } from './types';

export const specialtyCategories = ['Primary care', 'Specialist care', 'Family health', 'Rehabilitation'];

/** Demonstration specialties. Services and doctors are linked through their specialty ids. */
export const specialties: Specialty[] = [
  {
    id: 'general-medicine', slug: 'general-medicine', name: 'General Medicine', category: 'Primary care', icon: 'stethoscope', image: 'spec-general',
    summary: 'A first point of contact for everyday health questions, check-ups and coordinated care.',
    description: [
      'General Medicine is the foundation of the clinic: a longer-than-usual conversation, a clear plan and one clinician who knows your context.',
      'In this demonstration, general physicians show how a clinic can describe preventive reviews, routine consultations and referrals to other specialties in plain language.'
    ],
    commonTopics: ['Routine health reviews', 'Ongoing care coordination', 'Preventive health planning', 'Lifestyle conversations', 'Referrals to specialists'],
    keywords: ['gp', 'family doctor', 'primary', 'check-up', 'physician', 'annual']
  },
  {
    id: 'cardiology', slug: 'cardiology', name: 'Cardiology', category: 'Specialist care', icon: 'heart', image: 'spec-cardiology',
    summary: 'Heart and circulation health reviews, supported by on-site diagnostics.',
    description: [
      'Cardiology at CLARITY HEALTH is presented as a calm, well-explained pathway: consultation, relevant tests and a written summary of next steps.',
      'This demo specialty shows how diagnostic services such as an ECG or echocardiogram can be linked to a consultation without implying any real clinical result.'
    ],
    commonTopics: ['Heart health reviews', 'Blood pressure discussions', 'Cardiac diagnostics', 'Lifestyle and risk-factor conversations', 'Rehabilitation education'],
    keywords: ['heart', 'ecg', 'blood pressure', 'cardiac', 'circulation']
  },
  {
    id: 'dermatology', slug: 'dermatology', name: 'Dermatology', category: 'Specialist care', icon: 'droplet', image: 'spec-dermatology',
    summary: 'Skin, hair and nail consultations with a focus on clear explanations and routine skin checks.',
    description: [
      'Dermatology consultations in this demonstration cover routine skin checks, ongoing skin concerns and plans for everyday skin care.',
      'The page illustrates how a clinic can describe a specialty without promising outcomes or claiming results.'
    ],
    commonTopics: ['Routine skin checks', 'Skin-care planning', 'Hair and scalp questions', 'Sun-safety guidance', 'Follow-up reviews'],
    keywords: ['skin', 'acne', 'hair', 'mole', 'eczema', 'rash']
  },
  {
    id: 'orthopedics', slug: 'orthopedics', name: 'Orthopedics', category: 'Specialist care', icon: 'bone', image: 'spec-orthopedics',
    summary: 'Bones, joints and movement — assessments and rehabilitation planning.',
    description: [
      'Orthopedic consultations focus on how you move: understanding joint and muscle concerns, discussing imaging and planning rehabilitation with the physiotherapy team.',
      'This demo specialty shows how imaging and rehabilitation services can be connected to a single care pathway.'
    ],
    commonTopics: ['Joint and muscle concerns', 'Imaging discussions', 'Sports-related questions', 'Rehabilitation planning', 'Mobility reviews'],
    keywords: ['bone', 'joint', 'knee', 'back', 'sports', 'fracture', 'spine']
  },
  {
    id: 'pediatrics', slug: 'pediatrics', name: 'Pediatrics', category: 'Family health', icon: 'baby', image: 'spec-pediatrics',
    summary: 'Friendly, family-centred care for babies, children and teenagers.',
    description: [
      'Pediatrics is shown as a warm, family-centred service: longer appointments, child-friendly rooms and clear conversations with parents and carers.',
      'The demo includes growth, development and routine immunisation visits as examples of how a clinic can describe paediatric services.'
    ],
    commonTopics: ['Growth and development reviews', 'Routine immunisation visits', 'Everyday childhood health questions', 'School and nursery health forms', 'Parent guidance'],
    keywords: ['child', 'children', 'baby', 'kids', 'infant', 'vaccination', 'teen']
  },
  {
    id: 'dentistry', slug: 'dentistry', name: 'Dentistry', category: 'Family health', icon: 'tooth', image: 'spec-dentistry',
    summary: 'Preventive and restorative dental care in a relaxed, unhurried setting.',
    description: [
      'The dental team is presented around prevention first: check-ups, hygiene visits and clear conversations about options.',
      'This demo specialty shows how a dental practice can be part of a multispecialty clinic, with its own services and appointment lengths.'
    ],
    commonTopics: ['Routine check-ups', 'Hygiene appointments', 'Dental X-rays', 'Restorative consultations', 'Children’s dental habits'],
    keywords: ['dental', 'teeth', 'tooth', 'hygiene', 'dentist', 'oral']
  },
  {
    id: 'physiotherapy', slug: 'physiotherapy', name: 'Physiotherapy', category: 'Rehabilitation', icon: 'activity', image: 'spec-physio',
    summary: 'Movement-focused rehabilitation and posture guidance in our rehabilitation studio.',
    description: [
      'Physiotherapy sessions combine hands-on assessment, guided exercise and practical home routines presented in clear, plain language.',
      'In this demonstration the rehabilitation studio is a configurable facility, and services show typical session lengths.'
    ],
    commonTopics: ['Movement assessments', 'Exercise-based rehabilitation', 'Posture and ergonomics', 'Return-to-activity planning', 'Home exercise guidance'],
    keywords: ['rehab', 'exercise', 'posture', 'physio', 'movement', 'sports', 'recovery']
  },
  {
    id: 'womens-health', slug: 'womens-health', name: 'Women’s Health', category: 'Family health', icon: 'flower', image: 'spec-womens',
    summary: 'Respectful, confidential-style care across life stages — reviews, screening visits and guidance.',
    description: [
      'Women’s Health is presented as a private, respectful service with unhurried appointments and clear explanations at each step.',
      'The demo shows how a clinic can list wellness reviews, screening visits and prenatal care visits without any medical claims.'
    ],
    commonTopics: ['Wellness reviews', 'Screening visits', 'Prenatal care visits', 'Life-stage conversations', 'Contraception and planning discussions'],
    keywords: ['women', 'prenatal', 'pregnancy', 'gynaecology', 'screening', 'menopause', 'maternity']
  }
];
