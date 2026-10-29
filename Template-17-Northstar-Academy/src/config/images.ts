/** Photography used by the public site. Replace files in /public/images (keep a 1600px master and an 800px thumbnail) and update alt text. */
export interface Photo { src: string; thumb: string; alt: string; width: number; height: number }

export const images: Record<'hero' | 'experience' | 'about', Photo> = {
  hero: { src: '/images/study-group.jpg', thumb: '/images/study-group-800.jpg', alt: 'Three learners laughing together around two laptops at a wooden table', width: 1600, height: 1067 },
  experience: { src: '/images/lecture-room.jpg', thumb: '/images/lecture-room-800.jpg', alt: 'A workshop room where an instructor presents to a seated group', width: 1600, height: 1067 },
  about: { src: '/images/workspace.jpg', thumb: '/images/workspace-800.jpg', alt: 'A laptop showing code on a clean white desk beside a green plant', width: 1600, height: 1067 },
};
