import type { Doctor } from './types';

/**
 * FICTIONAL demonstration clinicians. Names, biographies, photographs and qualifications are invented;
 * any resemblance to a real person or institution is coincidental. Never present these as real professionals.
 */
export const doctors: Doctor[] = [
  {
    id: 'amara-okafor', slug: 'dr-amara-okafor', name: 'Dr. Amara Okafor', title: 'Lead General Physician', specialtyId: 'general-medicine', image: 'doc-1',
    languages: ['English', 'French'], yearsExperience: 14, acceptingNewPatients: true, workingDays: [1, 2, 3, 4], modes: ['in-person', 'video'],
    summary: 'Leads the general medicine team with a focus on unhurried consultations and preventive planning.',
    bio: [
      'Dr. Okafor is a fictional physician created for this demonstration. Her profile shows how a clinic can introduce a lead clinician in a warm, plain-spoken way.',
      'In this story she believes a good first appointment is mostly listening, and that every visit should end with a clear written summary of what happens next.'
    ],
    qualifications: ['MBBS — Northvale University School of Medicine (fictional)', 'Diploma in Preventive Care — Meridian Institute (fictional)', 'Member, Demonstration Association of Family Physicians (fictional)'],
    interests: ['Preventive health planning', 'Care coordination', 'Patient education']
  },
  {
    id: 'julian-reyes', slug: 'dr-julian-reyes', name: 'Dr. Julian Reyes', title: 'General Physician', specialtyId: 'general-medicine', image: 'doc-2',
    languages: ['English', 'Spanish', 'Portuguese'], yearsExperience: 9, acceptingNewPatients: true, workingDays: [2, 4, 5, 6], modes: ['in-person', 'video'],
    summary: 'Offers weekday and Saturday general appointments, including video follow-ups.',
    bio: [
      'Dr. Reyes is a fictional demonstration profile. He represents the flexible-hours physician a modern clinic might feature for patients with busy schedules.',
      'In this story he enjoys explaining things with simple diagrams and keeping follow-up appointments short and practical.'
    ],
    qualifications: ['MD — Harbour City Medical College (fictional)', 'Certificate in Digital Health — Meridian Institute (fictional)'],
    interests: ['Video follow-ups', 'Workplace wellbeing', 'Health literacy']
  },
  {
    id: 'mateo-lindqvist', slug: 'dr-mateo-lindqvist', name: 'Dr. Mateo Lindqvist', title: 'Consultant Cardiologist', specialtyId: 'cardiology', image: 'doc-3',
    languages: ['English', 'Swedish', 'German'], yearsExperience: 19, acceptingNewPatients: true, workingDays: [1, 3, 5], modes: ['in-person'],
    summary: 'Heart health reviews with on-site diagnostics and clear written summaries.',
    bio: [
      'Dr. Lindqvist is a fictional cardiologist. His profile demonstrates a specialist biography that stays factual and avoids outcome promises.',
      'In this story his team uses the on-site diagnostics floor so that consultation and tests can happen in one visit where possible.'
    ],
    qualifications: ['MD — Fjordvik University (fictional)', 'Fellowship in Cardiology — Meridian Heart Institute (fictional)'],
    interests: ['Preventive cardiology', 'Cardiac imaging', 'Patient-friendly explanations']
  },
  {
    id: 'priya-raman', slug: 'dr-priya-raman', name: 'Dr. Priya Raman', title: 'Consultant Dermatologist', specialtyId: 'dermatology', image: 'doc-4',
    languages: ['English', 'Tamil', 'Hindi'], yearsExperience: 12, acceptingNewPatients: true, workingDays: [2, 3, 4, 6], modes: ['in-person', 'video'],
    summary: 'Routine skin checks and skin-care planning with an emphasis on sun safety.',
    bio: [
      'Dr. Raman is a fictional dermatologist created for this template. Her profile shows how a clinic can describe a specialty with calm, careful language.',
      'In this story she keeps appointments structured: a thorough look, a clear explanation and a simple plan to follow.'
    ],
    qualifications: ['MBBS — Coastal Peninsula Medical University (fictional)', 'MD Dermatology — Meridian Institute (fictional)'],
    interests: ['Routine skin checks', 'Sun safety', 'Skin-care planning']
  },
  {
    id: 'yuki-tanaka', slug: 'dr-yuki-tanaka', name: 'Dr. Yuki Tanaka', title: 'Dermatology Specialist', specialtyId: 'dermatology', image: 'doc-5',
    languages: ['English', 'Japanese'], yearsExperience: 7, acceptingNewPatients: false, workingDays: [1, 4, 5], modes: ['in-person'],
    summary: 'Currently seeing existing patients only — a sample of a profile that is not accepting new patients.',
    bio: [
      'Dr. Tanaka is a fictional demonstration profile marked as not accepting new patients, so you can see how that state appears in filters and on booking.',
      'In this story her clinic days focus on follow-up reviews for existing patients.'
    ],
    qualifications: ['MD — Kitamura Medical School (fictional)', 'Postgraduate Certificate in Clinical Dermatology — Meridian Institute (fictional)'],
    interests: ['Follow-up care', 'Skin-health education']
  },
  {
    id: 'tobias-nakamura', slug: 'dr-tobias-nakamura', name: 'Dr. Tobias Nakamura', title: 'Orthopedic Specialist', specialtyId: 'orthopedics', image: 'doc-6',
    languages: ['English', 'Japanese'], yearsExperience: 16, acceptingNewPatients: true, workingDays: [1, 2, 4], modes: ['in-person'],
    summary: 'Assessments for bone, joint and movement concerns, linked to imaging and rehabilitation.',
    bio: [
      'Dr. Nakamura is a fictional orthopedic specialist. His profile demonstrates how imaging and rehabilitation can be presented as a single pathway.',
      'In this story he works closely with the physiotherapy team so patients leave with a plan they understand.'
    ],
    qualifications: ['MD — Harbour City Medical College (fictional)', 'Fellowship in Sports Medicine — Meridian Institute (fictional)'],
    interests: ['Sports-related questions', 'Mobility planning', 'Rehabilitation coordination']
  },
  {
    id: 'leila-haddad', slug: 'dr-leila-haddad', name: 'Dr. Leila Haddad', title: 'Consultant Pediatrician', specialtyId: 'pediatrics', image: 'doc-7',
    languages: ['English', 'Arabic', 'French'], yearsExperience: 13, acceptingNewPatients: true, workingDays: [1, 2, 3, 5, 6], modes: ['in-person', 'video'],
    summary: 'Family-centred paediatric care with longer, child-friendly appointments.',
    bio: [
      'Dr. Haddad is a fictional pediatrician created for the demonstration. Her profile shows a family-friendly tone suited to a paediatric practice.',
      'In this story she talks to children directly, explains what she is doing and invites parents to ask as many questions as they like.'
    ],
    qualifications: ['MBBS — Nile Delta University (fictional)', 'DCH Paediatrics — Meridian Children’s Institute (fictional)'],
    interests: ['Growth and development', 'Family communication', 'Immunisation visits']
  },
  {
    id: 'sofia-marchetti', slug: 'dr-sofia-marchetti', name: 'Dr. Sofia Marchetti', title: 'Lead Dentist', specialtyId: 'dentistry', image: 'doc-8',
    languages: ['English', 'Italian'], yearsExperience: 11, acceptingNewPatients: true, workingDays: [1, 2, 3, 4, 5], modes: ['in-person'],
    summary: 'Leads the dental team, with an emphasis on prevention and clear treatment options.',
    bio: [
      'Dr. Marchetti is a fictional dentist. Her profile demonstrates a practical, reassuring tone for dental services.',
      'In this story she starts every visit by asking what matters most to the patient, then walks through options without pressure.'
    ],
    qualifications: ['DDS — Lagoa University School of Dentistry (fictional)', 'Certificate in Restorative Dentistry — Meridian Institute (fictional)'],
    interests: ['Preventive dentistry', 'Restorative planning', 'Anxious-patient care']
  },
  {
    id: 'daniel-osei', slug: 'daniel-osei-physiotherapist', name: 'Daniel Osei', title: 'Senior Physiotherapist', specialtyId: 'physiotherapy', image: 'doc-9',
    languages: ['English', 'Twi'], yearsExperience: 10, acceptingNewPatients: true, workingDays: [1, 2, 3, 4, 5, 6], modes: ['in-person', 'video'],
    summary: 'Guided exercise, movement assessments and practical home routines.',
    bio: [
      'Daniel Osei is a fictional physiotherapist. His profile shows how non-physician clinicians can be featured alongside doctors.',
      'In this story he gives every patient a short, realistic home routine and checks in over video between visits.'
    ],
    qualifications: ['BSc Physiotherapy — Northvale University (fictional)', 'MSc Sports Rehabilitation — Meridian Institute (fictional)'],
    interests: ['Movement assessment', 'Posture and ergonomics', 'Return-to-activity planning']
  },
  {
    id: 'hannah-vogel', slug: 'dr-hannah-vogel', name: 'Dr. Hannah Vogel', title: 'Women’s Health Physician', specialtyId: 'womens-health', image: 'doc-10',
    languages: ['English', 'German', 'Dutch'], yearsExperience: 15, acceptingNewPatients: true, workingDays: [2, 3, 4, 5], modes: ['in-person', 'video'],
    summary: 'Respectful, unhurried women’s health consultations and screening visits.',
    bio: [
      'Dr. Vogel is a fictional physician created for this demonstration. Her profile shows a respectful tone for sensitive services.',
      'In this story she believes in giving patients time, privacy and plain explanations at every step.'
    ],
    qualifications: ['MD — Rhinevale University (fictional)', 'Membership, Demonstration College of Women’s Health (fictional)'],
    interests: ['Wellness reviews', 'Screening visits', 'Prenatal care visits']
  }
];
