import { useState } from 'react';
import type { Img as ImgT } from '../config/types';
import Icon from './Icon';
import Img from './Img';
import Lightbox from './Lightbox';

/** Responsive gallery: large image + thumbnails, opens a keyboard-accessible lightbox. */
export default function RoomGallery({ images, name }: { images: ImgT[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lb, setLb] = useState<number | null>(null);
  return (
    <div className="room-gallery">
      <button type="button" className="room-gallery__main" onClick={() => setLb(active)} aria-label={`View fullscreen: ${name} image ${active + 1} of ${images.length}`}>
        <Img src={images[active].src} alt={images[active].alt} priority ratio={[16, 10]} />
        <span className="room-gallery__zoom"><Icon name="expand" size={18} /> View fullscreen</span>
      </button>
      <ul className="room-gallery__thumbs" aria-label={`${name} photos`}>
        {images.map((im, i) => (
          <li key={im.src}>
            <button type="button" aria-label={`Show image ${i + 1}: ${im.alt}`} aria-current={i === active} onClick={() => setActive(i)}>
              <Img src={im.src} alt="" ratio={[4, 3]} />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={lb} onIndex={(i) => { setLb(i); if (i !== null) setActive(i); }} label={`${name} image viewer`} />
    </div>
  );
}
