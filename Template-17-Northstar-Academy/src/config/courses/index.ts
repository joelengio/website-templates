import type { Course } from '../types';
import { webFoundations, reactEssentials, pythonFirst } from './software';
import { visualHierarchy, uiDesignSystems } from './design';
import { contentStrategy, emailLifecycle } from './marketing';
import { productManagement, financialLiteracy } from './business';
import { spreadsheetAnalytics, sqlAnalysts } from './data';
import { promptEngineering, workflowAutomation } from './ai';
import { spanishConversations, businessEnglish } from './language';
import { presentingClarity, projectLeadership } from './skills';

/**
 * Course catalogue. To add a course, create it with `buildCourse` (see ./helpers.ts) and add it to this array.
 * Order here is the default "Recommended" order.
 */
export const courses: Course[] = [
  webFoundations,
  spreadsheetAnalytics,
  visualHierarchy,
  promptEngineering,
  reactEssentials,
  productManagement,
  spanishConversations,
  contentStrategy,
  presentingClarity,
  pythonFirst,
  uiDesignSystems,
  sqlAnalysts,
  emailLifecycle,
  financialLiteracy,
  workflowAutomation,
  businessEnglish,
  projectLeadership,
];
