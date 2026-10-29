import type { ImageKey } from './images';

/**
 * Photograph credits. Every photograph in /public/images was downloaded from Wikimedia Commons; the licence shown is the one
 * recorded on its Commons file page when it was retrieved (2026-10-29). Attribution is displayed on the /credits page.
 * If you replace a photograph, update (or delete) its entry here and in ASSET_LICENSES.md.
 */
export interface PhotoCredit {
  file: ImageKey | 'og-image';
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export const photoCredits: PhotoCredit[] = [
  {
    file: 'algarve-cliffs',
    title: 'Portugal - Algarve - cliffs near Lagos (25151424773)',
    author: 'muffinn from Worcester, UK',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Portugal_-_Algarve_-_cliffs_near_Lagos_(25151424773).jpg'
  },
  {
    file: 'algarve-coast',
    title: 'Portugal - Algarve - coast west of Lagos (25657164162)',
    author: 'muffinn from Worcester, UK',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Portugal_-_Algarve_-_coast_west_of_Lagos_(25657164162).jpg'
  },
  {
    file: 'algarve-cove',
    title: 'Portugal - Algarve - cliffs near Lagos (25151629713)',
    author: 'muffinn from Worcester, UK',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Portugal_-_Algarve_-_cliffs_near_Lagos_(25151629713).jpg'
  },
  {
    file: 'algarve-rock',
    title: 'Portugal - Algarve - cliffs near Lagos (25477583120)',
    author: 'muffinn from Worcester, UK',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Portugal_-_Algarve_-_cliffs_near_Lagos_(25477583120).jpg'
  },
  {
    file: 'alps-lake',
    title: 'Alps of Switzerland Sunset over Lake Sils (23506913123)',
    author: 'kuhnmi',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Alps_of_Switzerland_Sunset_over_Lake_Sils_(23506913123).jpg'
  },
  {
    file: 'alps-maloja',
    title: 'Alps of Switzerland Lake Sils (23783810673)',
    author: 'kuhnmi',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Alps_of_Switzerland_Lake_Sils_(23783810673).jpg'
  },
  {
    file: 'alps-reflection',
    title: 'Alps of Switzerland Lake Sils (25685804388)',
    author: 'kuhnmi',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Alps_of_Switzerland_Lake_Sils_(25685804388).jpg'
  },
  {
    file: 'alps-sunset',
    title: 'Alps of Switzerland Sunset at Lake Sils (24556764055)',
    author: 'kuhnmi',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Alps_of_Switzerland_Sunset_at_Lake_Sils_(24556764055).jpg'
  },
  {
    file: 'alps-tree',
    title: 'Alps of Switzerland Lone Tree at Lake Sils (24035088642)',
    author: 'kuhnmi',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Alps_of_Switzerland_Lone_Tree_at_Lake_Sils_(24035088642).jpg'
  },
  {
    file: 'amalfi-atrani',
    title: 'Atrani (Costiera Amalfitana, 23-8-2011)',
    author: 'Paolo Costa Baldi',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Atrani_(Costiera_Amalfitana,_23-8-2011).jpg'
  },
  {
    file: 'amalfi-coast',
    title: '阿瑪爾菲海岸 Amalfi Coast - panoramio',
    author: 'lienyuan lee',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:%E9%98%BF%E7%91%AA%E7%88%BE%E8%8F%B2%E6%B5%B7%E5%B2%B8_Amalfi_Coast_-_panoramio.jpg'
  },
  {
    file: 'amalfi-town',
    title: 'Amalfi (Italy)',
    author: 'Bernard Gagnon',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Amalfi_(Italy).jpg'
  },
  {
    file: 'arch-lakeside',
    title: 'Kinsmen Golf Course a (43951202521)',
    author: 'Lucky Lynda',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Kinsmen_Golf_Course_a_(43951202521).jpg'
  },
  {
    file: 'bali-fields',
    title: 'Rice fields, Rice terraces, Tirta Gangga, Bali, Indonesia',
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Rice_fields,_Rice_terraces,_Tirta_Gangga,_Bali,_Indonesia.jpg'
  },
  {
    file: 'bali-terrace',
    title: 'Tegallalang Rice Terraces Bali 1',
    author: 'Philip Nalangan',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Tegallalang_Rice_Terraces_Bali_1.jpg'
  },
  {
    file: 'bali-terrace-2',
    title: 'Rice terrace in Bali',
    author: 'ZiemowitJ',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Rice_terrace_in_Bali.jpg'
  },
  {
    file: 'ballroom-gold',
    title: 'Gold Ceiling Of The Commerce Court (109974853)',
    author: 'Muhammad Ali',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Gold_Ceiling_Of_The_Commerce_Court_(109974853).jpeg'
  },
  {
    file: 'ballroom-hall',
    title: 'Grand Palace Ballroom Interior (55256687864)',
    author: 'Michael Gaylard from Horsham, UK',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Grand_Palace_Ballroom_Interior_(55256687864).jpg'
  },
  {
    file: 'bouquet-blush',
    title: 'Flowers 2 (Unsplash)',
    author: 'Orio Nguyen orionguyen',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Flowers_2_(Unsplash).jpg'
  },
  {
    file: 'bouquet-bridal',
    title: 'Bridal bouquet (Unsplash)',
    author: 'Tamara Menzi itstamaramenzi',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Bridal_bouquet_(Unsplash).jpg'
  },
  {
    file: 'bouquet-burgundy',
    title: 'Artsy Vibes 2017-05-15 (Unsplash HtjOSg50YnQ)',
    author: 'Artsy Vibes artsyvibes',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Artsy_Vibes_2017-05-15_(Unsplash_HtjOSg50YnQ).jpg'
  },
  {
    file: 'bouquet-ivory',
    title: 'Los Dinamos II, Ciudad de México, Mexico (Unsplash)',
    author: 'Jose Alfredo Lerma Contreras josealfredolc',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Los_Dinamos_II,_Ciudad_de_M%C3%A9xico,_Mexico_(Unsplash).jpg'
  },
  {
    file: 'bouquet-pink',
    title: 'Gorgeous bouquet on purple background (Unsplash)',
    author: 'Mira Bozhko miroslava',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Gorgeous_bouquet_on_purple_background_(Unsplash).jpg'
  },
  {
    file: 'bouquet-roses',
    title: 'Brautstrauß IMG 7868 edit',
    author: 'Christoph Braun',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Brautstrau%C3%9F_IMG_7868_edit.jpg'
  },
  {
    file: 'bouquet-sweet',
    title: 'Sweet-scented bouquet (Unsplash)',
    author: 'chuttersnap chuttersnap',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Sweet-scented_bouquet_(Unsplash).jpg'
  },
  {
    file: 'bouquet-wild',
    title: 'Pro Image Photography 2016 (Unsplash)',
    author: 'Pro Image Photography idphotog',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Pro_Image_Photography_2016_(Unsplash).jpg'
  },
  {
    file: 'como-gardens',
    title: 'Villa Melzi, Bellagio, Lake Como',
    author: 'Ray in Manila',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Villa_Melzi,_Bellagio,_Lake_Como.jpg'
  },
  {
    file: 'como-hall',
    title: 'Villa Carlotta, Tremezzo, Lake Como',
    author: 'Ray in Manila',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Villa_Carlotta,_Tremezzo,_Lake_Como.jpg'
  },
  {
    file: 'como-villa',
    title: 'Villa Balbianello on Como Lake 8',
    author: 'Scott Thompson',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Villa_Balbianello_on_Como_Lake_8.jpg'
  },
  {
    file: 'conservatory-glass',
    title: 'Orangery interior - Royal Castle of Laeken - Brussels, Belgium - DSC07568',
    author: 'Daderot',
    license: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain',
    source: 'https://commons.wikimedia.org/wiki/File:Orangery_interior_-_Royal_Castle_of_Laeken_-_Brussels,_Belgium_-_DSC07568.jpg'
  },
  {
    file: 'conservatory-hall',
    title: 'Orangery interior - Royal Castle of Laeken - Brussels, Belgium - DSC07564',
    author: 'Daderot',
    license: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain',
    source: 'https://commons.wikimedia.org/wiki/File:Orangery_interior_-_Royal_Castle_of_Laeken_-_Brussels,_Belgium_-_DSC07564.jpg'
  },
  {
    file: 'detail-bands',
    title: '3 unieke strakke witgouden trouwringen met elkaars vingerafdruk',
    author: 'Jvdbragt15',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:3_unieke_strakke_witgouden_trouwringen_met_elkaars_vingerafdruk.jpg'
  },
  {
    file: 'detail-candle',
    title: 'BethsWeddingReception-3307 (8299512082)',
    author: 'John Trainor from Roswell, GA, USA',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:BethsWeddingReception-3307_(8299512082).jpg'
  },
  {
    file: 'detail-champagne',
    title: 'Champagne glasses used by President Ford',
    author: 'Unknown authorUnknown author',
    license: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain',
    source: 'https://commons.wikimedia.org/wiki/File:Champagne_glasses_used_by_President_Ford.JPG'
  },
  {
    file: 'detail-dress',
    title: 'Bride stands with daisies (Unsplash)',
    author: 'Scott Webb scottwebb',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Bride_stands_with_daisies_(Unsplash).jpg'
  },
  {
    file: 'detail-glasses',
    title: 'Wedding decorations (9231746279)',
    author: 'teodorpk',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Wedding_decorations_(9231746279).jpg'
  },
  {
    file: 'detail-rings',
    title: 'Wedding rings (Unsplash)',
    author: 'Glen McCallum glen_mccallum',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Wedding_rings_(Unsplash).jpg'
  },
  {
    file: 'dubrovnik-harbour',
    title: 'Dubrovnik Old Town (5778380042)',
    author: 'Sean MacEntee from Monaghan, Ireland',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Dubrovnik_Old_Town_(5778380042).jpg'
  },
  {
    file: 'dubrovnik-roofs',
    title: 'Dubrovnik old town (4) (30005780721)',
    author: 'Richard Mortel from Riyadh, Saudi Arabia',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Dubrovnik_old_town_(4)_(30005780721).jpg'
  },
  {
    file: 'dubrovnik-walls',
    title: 'Old Town Of Dubrovnik (229775963)',
    author: 'Quentin Schulz',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Old_Town_Of_Dubrovnik_(229775963).jpeg'
  },
  {
    file: 'florals-dahlia',
    title: 'Flowers and rowan berries (Unsplash)',
    author: 'Kelly Jean kellyjean',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Flowers_and_rowan_berries_(Unsplash).jpg'
  },
  {
    file: 'florals-lilac',
    title: 'Emma Mulvad Lilacs and peonies',
    author: 'Emma Mulvad',
    license: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain',
    source: 'https://commons.wikimedia.org/wiki/File:Emma_Mulvad_Lilacs_and_peonies.jpg'
  },
  {
    file: 'gallery-hall',
    title: 'Hol Stara Oranżeria - widok w stronę zachodnią',
    author: 'Michał Serdyński',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Hol_Stara_Oran%C5%BCeria_-_widok_w_stron%C4%99_zachodni%C4%85.jpg'
  },
  {
    file: 'garda-sunset',
    title: 'Sirmione Sunset (75523941)',
    author: 'Giovanni Cioli',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Sirmione_Sunset_(75523941).jpeg'
  },
  {
    file: 'hero-arch',
    title: 'DSCN0136 - Flickr - Shward',
    author: 'Josh Ward from Eugene, Oregon, USA',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:DSCN0136_-_Flickr_-_Shward.jpg'
  },
  {
    file: 'highland-castle',
    title: 'Eilean Donan castle - 95mm',
    author: 'Eusebius',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Eilean_Donan_castle_-_95mm.jpg'
  },
  {
    file: 'highland-castle-2',
    title: 'Eilean Donan castle - 140mm',
    author: 'Eusebius',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Eilean_Donan_castle_-_140mm.jpg'
  },
  {
    file: 'highland-loch',
    title: 'Aldourie Castle - on the shore of Loch Ness Inverness Scotland',
    author: 'dave conner',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Aldourie_Castle_-_on_the_shore_of_Loch_Ness_Inverness_Scotland.jpg'
  },
  {
    file: 'island-sunset',
    title: 'Koh Mak (island), Thailand, Sunset on the beach with palms',
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Koh_Mak_(island),_Thailand,_Sunset_on_the_beach_with_palms.jpg'
  },
  {
    file: 'orangery-blossom',
    title: 'The Orangery at Blickling Hall (4601798757)',
    author: 'Elliott Brown from Birmingham, United Kingdom',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:The_Orangery_at_Blickling_Hall_(4601798757).jpg'
  },
  {
    file: 'orangery-exterior',
    title: 'The Orangery at Blickling Hall (4601803657)',
    author: 'Elliott Brown from Birmingham, United Kingdom',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:The_Orangery_at_Blickling_Hall_(4601803657).jpg'
  },
  {
    file: 'paris-evening',
    title: 'Paris 2016 09 06 (9) (34206154342)',
    author: 'Carl Campbell from Santiago de Querétaro, México',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Paris_2016_09_06_(9)_(34206154342).jpg'
  },
  {
    file: 'paris-seine',
    title: 'Sunset over the Seine River in 2016',
    author: 'Bruno Abatti brunoabatti',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Sunset_over_the_Seine_River_in_2016.jpg'
  },
  {
    file: 'peony-wild',
    title: 'Peony and wildflowers, Ehrenbach',
    author: 'Gerda Arendt',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Peony_and_wildflowers,_Ehrenbach.jpg'
  },
  {
    file: 'provence-field',
    title: 'Lavender field at the foot of the Alps, Provence, France (51695209778)',
    author: 'dronepicr',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Lavender_field_at_the_foot_of_the_Alps,_Provence,_France_(51695209778).jpg'
  },
  {
    file: 'provence-lavender',
    title: 'Lavendel in Südfrankreich - lavender fields (17997759143)',
    author: 'dronepicr',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Lavendel_in_S%C3%BCdfrankreich_-_lavender_fields_(17997759143).jpg'
  },
  {
    file: 'provence-rows',
    title: 'Lavendel in Südfrankreich - lavender fields (17997792473)',
    author: 'dronepicr',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Lavendel_in_S%C3%BCdfrankreich_-_lavender_fields_(17997792473).jpg'
  },
  {
    file: 'provence-sunset',
    title: 'Sunset in Provence (22343701493)',
    author: 'Luis Ascenso from Lisbon, Portugal',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Sunset_in_Provence_(22343701493).jpg'
  },
  {
    file: 'riad-arches',
    title: 'Palais Bahia (The Bahia Palace) (7346099180)',
    author: 'Jorge Láscar from Australia',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Palais_Bahia_(The_Bahia_Palace)_(7346099180).jpg'
  },
  {
    file: 'rose-arch',
    title: 'Owen Memorial Rose Garden - 046',
    author: 'Rick Obst',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Owen_Memorial_Rose_Garden_-_046.jpg'
  },
  {
    file: 'rose-fete',
    title: 'Owen Memorial Rose Garden - 023',
    author: 'Rick Obst',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Owen_Memorial_Rose_Garden_-_023.jpg'
  },
  {
    file: 'rose-gazebo',
    title: 'Rose garden - Descanso Gardens - La Cañada Flintridge, CA - DSC00723',
    author: 'Daderot',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Rose_garden_-_Descanso_Gardens_-_La_Ca%C3%B1ada_Flintridge,_CA_-_DSC00723.jpg'
  },
  {
    file: 'rose-path',
    title: 'Owen Memorial Rose Garden - 045',
    author: 'Rick Obst',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Owen_Memorial_Rose_Garden_-_045.jpg'
  },
  {
    file: 'table-banquet',
    title: 'Wedding Banquet setting',
    author: 'Tracy Hunter',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Wedding_Banquet_setting.jpeg'
  },
  {
    file: 'table-tulips',
    title: '2016 Dare to Dream IMG 4296 (26192235762)',
    author: 'Pan Pacific',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:2016_Dare_to_Dream_IMG_4296_(26192235762).jpg'
  },
  {
    file: 'table-white',
    title: '2016 Dare to Dream IMG 4330 (26011704320)',
    author: 'Pan Pacific',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:2016_Dare_to_Dream_IMG_4330_(26011704320).jpg'
  },
  {
    file: 'tuscany-harvest',
    title: 'Chianti vineyard with harvest activity',
    author: 'dog4aday',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Chianti_vineyard_with_harvest_activity.jpg'
  },
  {
    file: 'tuscany-hills',
    title: 'Siena vineyards',
    author: 'Pug girl',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Siena_vineyards.jpg'
  },
  {
    file: 'tuscany-road',
    title: 'Chianti road in Tuscany',
    author: 'Jason Parrish from Memphis, USA',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Chianti_road_in_Tuscany.jpg'
  },
  {
    file: 'tuscany-vineyard',
    title: 'Tuscan Wine Country Vineyard (53593605746)',
    author: 'Nan Palmero from San Antonio, TX, USA',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Tuscan_Wine_Country_Vineyard_(53593605746).jpg'
  },
  {
    file: 'vineyard-autumn',
    title: 'Tualatin Estate Vineyard, Forest Grove - DPLA - 25a9515aa17a6d0c0c6d589ac212c1e2',
    author: 'Gary Halvorson, Oregon State Archives',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Tualatin_Estate_Vineyard,_Forest_Grove_-_DPLA_-_25a9515aa17a6d0c0c6d589ac212c1e2.jpg'
  },
  {
    file: 'vineyard-estate',
    title: 'Tualatin Estate Vineyards - DPLA - 2f23a58de7bd2a1a13ae8f93e7742baa',
    author: 'Gary Halvorson, Oregon State Archives',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Tualatin_Estate_Vineyards_-_DPLA_-_2f23a58de7bd2a1a13ae8f93e7742baa.jpg'
  },
  {
    file: 'vineyard-gold',
    title: 'Tualatin Estate Vineyard, Forest Grove - DPLA - ddfd002568ad5d42f82e1ebbc9a49dbe',
    author: 'Gary Halvorson, Oregon State Archives',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Tualatin_Estate_Vineyard,_Forest_Grove_-_DPLA_-_ddfd002568ad5d42f82e1ebbc9a49dbe.jpg'
  },
  {
    file: 'vineyard-rows',
    title: 'Tualatin Estate Vineyard, Forest Grove - DPLA - da4e5d4db06a9e3e33b82dae074d0ed7',
    author: 'Gary Halvorson, Oregon State Archives',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Tualatin_Estate_Vineyard,_Forest_Grove_-_DPLA_-_da4e5d4db06a9e3e33b82dae074d0ed7.jpg'
  }
];
