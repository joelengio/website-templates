import { homeSections, type HomeSectionId } from '../config/layout';

/** Visible home sections in configured order. Exposed for tests and the Home page. */
export function visibleSections(list: { id: HomeSectionId; visible: boolean }[] = homeSections): HomeSectionId[] {
  return list.filter((s) => s.visible).map((s) => s.id);
}
