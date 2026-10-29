import { courses } from './courses';
import { categories } from './categories';
import { instructors } from './instructors';
import { paths } from './paths';

export { site } from './site';
export { theme } from './theme';
export { pages, homeSections } from './layout';
export { navigation, headerCta, footerColumns } from './navigation';
export { learning } from './learning';
export { categories, courses, instructors, paths };
export { plans, comparisonRows, annualSavingPercent, planFaqs } from './plans';
export { home, about, articles, articleCategories, testimonials, homeFaqs, contactFaqs } from './content';
export { images } from './images';

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);
export const getInstructor = (slug: string) => instructors.find((i) => i.slug === slug);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const getPath = (slug: string) => paths.find((p) => p.slug === slug);
export const coursesByInstructor = (slug: string) => courses.filter((c) => c.instructorId === slug);
