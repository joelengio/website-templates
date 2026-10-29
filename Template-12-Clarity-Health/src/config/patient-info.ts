import type { Faq } from './types';

export const patientInfo = {
  hero: {
    eyebrow: 'Patient information',
    title: 'Everything you would want to know before a visit',
    lead: 'This page shows the kind of practical information a clinic publishes. It is demonstration content for a fictional clinic and is not medical advice.'
  },
  firstVisit: {
    title: 'Your first visit',
    steps: [
      { title: 'Before you arrive', text: 'Choose a service and a time using the booking demo. A real clinic would send a confirmation and preparation notes.' },
      { title: 'On arrival', text: 'Check in at the reception. Plan to arrive about ten minutes early for your first visit.' },
      { title: 'During the appointment', text: 'Your clinician will take time to listen, explain and agree next steps with you.' },
      { title: 'Afterwards', text: 'A real clinic would share a written summary and any follow-up arrangements.' }
    ]
  },
  preparation: {
    title: 'Appointment preparation',
    items: [
      'Bring a photo ID and your insurance details if applicable (a real clinic would specify exactly what is needed).',
      'Write down your questions so you do not forget them.',
      'Bring a list of any medicines you take, if your clinic asks for it.',
      'Wear comfortable clothing for physiotherapy or movement-related appointments.',
      'If you need an interpreter or accessibility support, tell the clinic in advance.'
    ]
  },
  hours: { title: 'Opening hours', note: 'Demonstration hours for the Riverside Centre. The Garden Annex has its own hours on the contact page.' },
  payment: {
    title: 'Insurance & payment',
    intro: 'Placeholder information that a real clinic would replace with its own details.',
    items: [
      { title: 'Insurance', text: 'Add the insurers you work with, how to check cover and what to bring. No insurers are listed in this demo.' },
      { title: 'Self-pay', text: 'Demo prices are shown on each service page and can be hidden in the configuration.' },
      { title: 'Payment methods', text: 'List accepted payment methods here. No payments are taken on this website.' },
      { title: 'Invoices & receipts', text: 'Explain how patients receive invoices and who to contact with billing questions.' }
    ]
  },
  policies: {
    title: 'General appointment policies',
    items: [
      { title: 'Cancellations & rescheduling', text: 'Placeholder policy: please give at least 24 hours’ notice. In this demo you can cancel or reschedule at any time.' },
      { title: 'Late arrivals', text: 'Placeholder policy: if you are running late, call the clinic so the team can try to accommodate you.' },
      { title: 'Accompanying persons', text: 'Placeholder policy: friends and family are welcome in consultation rooms where appropriate.' },
      { title: 'Feedback', text: 'Placeholder policy: tell us how we did through the patient-experience contact on the contact page.' }
    ]
  },
  emergency: {
    title: 'Emergency information',
    text: 'If you or someone else needs urgent medical help, call your local emergency number (for example 911, 112 or 999) or go to the nearest emergency department immediately. CLARITY HEALTH is a fictional demonstration clinic and cannot respond to emergencies, phone calls, messages or booking requests.'
  },
  disclaimer: {
    title: 'A demonstration clinic — not medical advice',
    text: 'CLARITY HEALTH does not exist. Nothing on this website is medical advice, diagnosis or treatment, and the website does not provide a real appointment service. If you have a health concern, contact a qualified healthcare professional in your area.'
  }
};

export const faqs: Faq[] = [
  { id: 'f1', group: 'This demonstration', question: 'Is CLARITY HEALTH a real clinic?', answer: 'No. CLARITY HEALTH is a fictional clinic created to demonstrate a website template. The clinic, its doctors, prices, testimonials and addresses are all invented.' },
  { id: 'f2', group: 'This demonstration', question: 'Will my demo appointment be seen by anyone?', answer: 'No. Demo appointments are stored only in this browser using localStorage. No server receives them and no real clinic is notified.' },
  { id: 'f3', group: 'This demonstration', question: 'What happens to the details I enter?', answer: 'Name, e-mail and optional phone number are saved in your browser so you can view, reschedule or cancel the appointment. You can delete them at any time from the My demo appointments page, and by clearing your browser data.' },
  { id: 'f4', group: 'This demonstration', question: 'Should I enter medical information?', answer: 'No. This demo never asks for medical history, symptoms, insurance numbers or identity numbers and you should never type them into any field.' },
  { id: 'f5', group: 'Appointments', question: 'How long do appointments last?', answer: 'Every service lists a duration. Initial consultations are usually 30–45 minutes in this demo.' },
  { id: 'f6', group: 'Appointments', question: 'Can I choose my doctor?', answer: 'Yes. In the booking demo you can choose a specific doctor or select "no preference" and the first available doctor will be assigned.' },
  { id: 'f7', group: 'Appointments', question: 'Can I reschedule or cancel?', answer: 'Yes. Open My demo appointments to reschedule to another time or cancel. Changes are applied immediately in your browser.' },
  { id: 'f8', group: 'Appointments', question: 'Do you offer video consultations?', answer: 'Some services and doctors are marked as available by video. In this demo no video call takes place.' },
  { id: 'f9', group: 'Visiting', question: 'Is the clinic accessible?', answer: 'The demonstration Riverside Centre is described as step-free, and the website is designed to be keyboard-operable and screen-reader friendly. A real clinic should publish its own accessibility information.' },
  { id: 'f10', group: 'Visiting', question: 'What if I have an emergency?', answer: 'Call your local emergency number or go to the nearest emergency department. Do not use this website.' },
  { id: 'f11', group: 'Payments', question: 'Are the prices real?', answer: 'No. Prices are configurable demonstration values. They can be hidden entirely in the booking configuration.' },
  { id: 'f12', group: 'Payments', question: 'Do you accept insurance?', answer: 'This is placeholder content. A real clinic would list the insurers it works with and explain how to check cover.' }
];
