import { ImageSourcePropType } from 'react-native';

export type FurnitureItem = {
  id: string;
  name: string;
  brand: string;
  category: 'sofa' | 'armchair' | 'ottoman' | 'sectional' | 'sofa-bed' | 'bench';
  style: string;
  material: string[];
  colors: string[];
  price: string;
  dimensions: string;
  imageUrl: string;
  productUrl: string;
  description: string;
  tags: string[];
};

// West Elm Sofas Collection
export const WESTELM_SOFAS: FurnitureItem[] = [
  {
    id: 'westelm-haven-sofa',
    name: 'Haven Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Contemporary',
    material: ['Fabric', 'Wood'],
    colors: ['Tawny', 'White', 'Silver', 'Storm Gray'],
    price: '£1,899 - £2,399',
    dimensions: '213 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=127903227&c=3572911&h=O6PId25bFdPVpdvbzNZltxB37KnkMfpBDYLzqQzXXGRiGjFD',
    productUrl: 'https://www.westelm.co.uk/haven-sofa-84-h3421',
    description: 'Best seller. Commercial grade sofa with clean lines and comfortable cushions.',
    tags: ['best seller', 'commercial grade', 'new colours'],
  },
  {
    id: 'westelm-harmony-modular-sofa',
    name: 'Harmony Modular Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Modern',
    material: ['Fabric', 'Wood'],
    colors: ['Mauve', 'Dove', 'White', 'Petrol'],
    price: '£2,199 - £2,899',
    dimensions: '208 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=111686760&c=3572911&h=LuT8q9TKoIu8lS2ZgDFuGYiIYmO7lFBCBXWmyiCkn5TekyMs',
    productUrl: 'https://www.westelm.co.uk/harmony-modular-sofa-82-h6237',
    description: 'Best seller. Modular design allows for flexible configurations.',
    tags: ['best seller', 'commercial grade', 'modular'],
  },
  {
    id: 'westelm-andes-sofa',
    name: 'Andes Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Mid-Century Modern',
    material: ['Fabric', 'Metal Legs'],
    colors: ['Mauve', 'White', 'Petrol', 'Silver'],
    price: '£1,799 - £2,149',
    dimensions: '197 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=107252544&c=3572911&h=6xTUwS5hq5l38_CEWYsd3YQtTU71-ZVV7-Pntna27e0neJ8j',
    productUrl: 'https://www.westelm.co.uk/andes-sofa-h1844',
    description: 'Best seller. Sleek mid-century design with tapered metal legs.',
    tags: ['best seller', 'commercial grade', 'mid-century'],
  },
  {
    id: 'westelm-leroy-sofa',
    name: 'Leroy Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Contemporary',
    material: ['Fabric', 'Wood'],
    colors: ['Sand'],
    price: '£1,799',
    dimensions: '218 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=127903330&c=3572911&h=VgPHv6XViLDqUL84C4pBKwxfNaUNNusA1issW37whJouGbcA',
    productUrl: 'https://www.westelm.co.uk/leroy-sofa-h12197',
    description: 'Best seller. Clean, modern design with comfortable cushions.',
    tags: ['best seller', 'commercial grade'],
  },
  {
    id: 'westelm-axel-leather-sofa',
    name: 'Axel Leather Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Modern Industrial',
    material: ['Leather', 'Metal'],
    colors: ['Nut'],
    price: '£2,959 - £3,699',
    dimensions: '226 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=107250107&c=3572911&h=5aouajJZIQrc-p6e2DW9vja7jtsbt5Hn509Tf8ppRoJE1KBR',
    productUrl: 'https://www.westelm.co.uk/axel-leather-sofa-h1465',
    description: 'Best seller. Premium leather with industrial-inspired metal frame.',
    tags: ['best seller', 'commercial grade', 'leather'],
  },
  {
    id: 'westelm-penn-sofa',
    name: 'Penn Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Modern',
    material: ['Fabric', 'Wood'],
    colors: ['Slate'],
    price: '£799 - £999',
    dimensions: '221 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=115177633&c=3572911&h=TBSoIbHR5qyKmTE5PrO9gge4QcaBehPj_xs4favc9LsIdqNI',
    productUrl: 'https://www.westelm.co.uk/penn-sofa-h10764',
    description: 'Best seller. Affordable modern sofa with clean lines.',
    tags: ['best seller', 'affordable'],
  },
  {
    id: 'westelm-mella-sofa',
    name: 'Mella Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Contemporary',
    material: ['Fabric'],
    colors: ['Alabaster', 'Clay'],
    price: '£899',
    dimensions: '170 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=123437528&c=3572911&h=38CFQ98tk6cVcavoaUBboB_Axr0WtGT_Mn-V1ZRi5nBdX4KD',
    productUrl: 'https://www.westelm.co.uk/mella-sofa-h11980',
    description: 'Best seller. Compact sofa perfect for smaller spaces.',
    tags: ['best seller', 'compact'],
  },
  {
    id: 'westelm-oliver-sofa',
    name: 'Oliver Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Modern',
    material: ['Fabric', 'Wood'],
    colors: ['Dove'],
    price: '£999',
    dimensions: '183 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=110946136&c=3572911&h=oruuWk5GMgW6neMY--vOspW2SF056I7jGzinqWcpG2U_ZgKF',
    productUrl: 'https://www.westelm.co.uk/oliver-sofa-h6962',
    description: 'Best seller. Simple, elegant design at an accessible price.',
    tags: ['best seller', 'affordable'],
  },
  {
    id: 'westelm-kaufman-sofa',
    name: 'Kaufman Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Mid-Century Modern',
    material: ['Leather', 'Wood'],
    colors: ['Camel'],
    price: '£1,599',
    dimensions: '218 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=119866256&c=3572911&h=dZgTTdYBREbg2PsTDzKSDVfjp3MDqLViY1Uw5JuOxELW0L-i',
    productUrl: 'https://www.westelm.co.uk/kaufman-sofa-h12783',
    description: 'Best seller. Vintage-inspired leather sofa with wooden frame.',
    tags: ['best seller', 'commercial grade', 'leather'],
  },
  {
    id: 'westelm-harris-sofa',
    name: 'Harris Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Contemporary',
    material: ['Fabric', 'Wood'],
    colors: ['Cardamom'],
    price: '£1,599',
    dimensions: '218 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=119173114&c=3572911&h=f9Oim_5m2FWIi526nlScpo8jqXL-4ty5XI67hO1GLXgX9Ui8',
    productUrl: 'https://www.westelm.co.uk/harris-sofa-96-h4614',
    description: 'Best seller. Deep seating and plush cushions for maximum comfort.',
    tags: ['best seller', 'commercial grade'],
  },
  {
    id: 'westelm-bogart-sofa',
    name: 'Bogart Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Art Deco',
    material: ['Fabric', 'Wood'],
    colors: ['Alabaster'],
    price: '£1,199',
    dimensions: '152 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=121734707&c=3572911&h=wiy08J6zGCb7UVj1srxTZ1hcA5SBjuryKmaWK8wivimjk94r',
    productUrl: 'https://www.westelm.co.uk/bogart-sofa-h12937',
    description: 'Best seller. Art deco-inspired curves with modern comfort.',
    tags: ['best seller', 'commercial grade', 'art deco'],
  },
  {
    id: 'westelm-addie-sofa',
    name: 'Addie Sofa',
    brand: 'West Elm',
    category: 'sofa',
    style: 'Modern',
    material: ['Fabric', 'Wood'],
    colors: ['White'],
    price: '£1,049 - £2,099',
    dimensions: '218 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=112637852&c=3572911&h=Lu8TQ46sdWhIyn2tV1HGFs8s_Yv1oEZqyvEvcs44Z2MS2xfS',
    productUrl: 'https://www.westelm.co.uk/addie-sofa-h11784',
    description: 'Best seller. Clean, minimal design with deep comfortable seating.',
    tags: ['best seller', 'commercial grade'],
  },
];

// West Elm Sectionals
export const WESTELM_SECTIONALS: FurnitureItem[] = [
  {
    id: 'westelm-haven-2piece-sectional',
    name: 'Haven 2-Piece Bumper Chaise Sofa',
    brand: 'West Elm',
    category: 'sectional',
    style: 'Contemporary',
    material: ['Fabric', 'Wood'],
    colors: ['Dove', 'Storm Gray', 'Silver', 'White'],
    price: '£2,960 - £4,258',
    dimensions: '274 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=118276415&c=3572911&h=DkiYWMjECUUW04FDPGK3jbQgQkpvd5Nd3HgJaznqgEYrbHtV',
    productUrl: 'https://www.westelm.co.uk/haven-2-piece-terminal-chaise-sectional-h3422',
    description: 'Best seller. L-shaped sectional with chaise for ultimate lounging.',
    tags: ['best seller', 'commercial grade', 'sectional'],
  },
  {
    id: 'westelm-harmony-3piece-sectional',
    name: 'Harmony Modular 3-Piece Ottoman Chaise Sofa',
    brand: 'West Elm',
    category: 'sectional',
    style: 'Modern',
    material: ['Fabric', 'Wood'],
    colors: ['Mauve', 'White', 'Dove'],
    price: '£3,997 - £5,285',
    dimensions: '310 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=125052678&c=3572911&h=ItHJYK0rbGoMXdWS_yQE9eTWMhvaixnsWWg4oRwosiwmEGFM',
    productUrl: 'https://www.westelm.co.uk/harmony-modular-3-piece-chaise-sectional-h6269',
    description: 'Best seller. Modular sectional with ottoman for flexible arrangements.',
    tags: ['best seller', 'commercial grade', 'modular'],
  },
  {
    id: 'westelm-andes-corner-sectional',
    name: 'Andes 3-Piece Corner Sofa',
    brand: 'West Elm',
    category: 'sectional',
    style: 'Mid-Century Modern',
    material: ['Fabric', 'Metal Legs'],
    colors: ['Mauve', 'Dove', 'White', 'Petrol'],
    price: '£4,607 - £5,637',
    dimensions: '276 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=107239716&c=3572911&h=tWNl6LQ6FYPhimhite2iqFuGLdSu-Jn1P9dYkufgZ6KsQ1nT',
    productUrl: 'https://www.westelm.co.uk/andes-l-shape-sectional-h1816',
    description: 'Mid-century corner sectional with sleek metal legs.',
    tags: ['commercial grade', 'mid-century'],
  },
  {
    id: 'westelm-aviana-sectional',
    name: 'Aviana 2-Piece Wedge Chaise Sofa',
    brand: 'West Elm',
    category: 'sectional',
    style: 'Contemporary',
    material: ['Fabric', 'Wood'],
    colors: ['Oatmeal'],
    price: '£2,699',
    dimensions: '307 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=127818351&c=3572911&h=pIdRgJYexFmraL80cg35qdyHMnB0mrCyC1oNslyII7oQRJtO',
    productUrl: 'https://www.westelm.co.uk/aviana-2-piece-wedge-return-sofa-sectional-h13684',
    description: 'New arrival. Elegant wedge chaise design.',
    tags: ['new', 'commercial grade'],
  },
  {
    id: 'westelm-leroy-sectional',
    name: 'Leroy 2-Piece Chaise Sofa',
    brand: 'West Elm',
    category: 'sectional',
    style: 'Contemporary',
    material: ['Fabric', 'Wood'],
    colors: ['Sand'],
    price: '£3,098',
    dimensions: '281 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=129535233&c=3572911&h=1uXOxXKcWuRBQ9LI2l4swvW502Sde1GcOweqq67VQguOHTPf',
    productUrl: 'https://www.westelm.co.uk/leroy-2-piece-chaise-sectional-h12187',
    description: 'New arrival. Spacious sectional with clean lines.',
    tags: ['new'],
  },
];

// West Elm Armchairs
export const WESTELM_ARMCHAIRS: FurnitureItem[] = [
  {
    id: 'westelm-viv-swivel-chair',
    name: 'Viv Swivel Armchair',
    brand: 'West Elm',
    category: 'armchair',
    style: 'Modern',
    material: ['Fabric', 'Metal Base'],
    colors: ['Clay', 'Camel', 'Burnt Umber', 'Mauve'],
    price: '£643 - £949',
    dimensions: 'Swivel base',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=128151807&c=3572911&h=oXuG_zZpiyJsALHIFZLZvT-d5vMgLSvrGNzdat4rzp9y1i6u',
    productUrl: 'https://www.westelm.co.uk/viv-swivel-chair-h4573',
    description: 'Best seller. Comfortable swivel chair with curved silhouette.',
    tags: ['best seller', 'commercial grade', 'swivel'],
  },
  {
    id: 'westelm-benson-leather-chair',
    name: 'Benson Leather Armchair',
    brand: 'West Elm',
    category: 'armchair',
    style: 'Mid-Century Modern',
    material: ['Leather', 'Wood'],
    colors: ['Caramel'],
    price: '£1,399',
    dimensions: 'Standard',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=119995618&c=3572911&h=E-cmqhTMA6KNDRbV0AXzE-Jnml_4Oycf4uTMJv4JOOSjdp9u',
    productUrl: 'https://www.westelm.co.uk/benson-leather-chair-h11998',
    description: 'Best seller. Premium leather chair with wooden frame.',
    tags: ['best seller', 'commercial grade', 'leather'],
  },
  {
    id: 'westelm-carlo-mid-century-chair',
    name: 'Carlo Mid-Century Armchair',
    brand: 'West Elm',
    category: 'armchair',
    style: 'Mid-Century Modern',
    material: ['Fabric', 'Metal Legs'],
    colors: ['Mauve', 'Tarragon', 'Dove', 'White'],
    price: '£799 - £979',
    dimensions: 'Standard',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=111686199&c=3572911&h=XSaAnJuGx_l3UG6GSqru3IU1lmyYcXg4VUTuw-hAxP1GgMFE',
    productUrl: 'https://www.westelm.co.uk/carlo-mid-century-chair-h2763',
    description: 'Best seller. Classic mid-century design with metal legs.',
    tags: ['best seller', 'commercial grade', 'mid-century'],
  },
  {
    id: 'westelm-crescent-swivel-chair',
    name: 'Crescent Swivel Armchair',
    brand: 'West Elm',
    category: 'armchair',
    style: 'Modern',
    material: ['Fabric', 'Metal Base'],
    colors: ['Green Spruce', 'Dune', 'Dove', 'Pewter'],
    price: '£735 - £969',
    dimensions: 'Swivel base',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=117314671&c=3572911&h=7FsXXpufpuIaElwXD9rqsGWjBepzSxFHWa94cbPu6e0NK2a_',
    productUrl: 'https://www.westelm.co.uk/crescent-swivel-chair-h2914',
    description: 'Best seller. Curved crescent design with 360° swivel.',
    tags: ['best seller', 'commercial grade', 'swivel'],
  },
  {
    id: 'westelm-penn-armchair',
    name: 'Penn Armchair',
    brand: 'West Elm',
    category: 'armchair',
    style: 'Modern',
    material: ['Fabric', 'Wood'],
    colors: ['Slate', 'Olive'],
    price: '£399',
    dimensions: 'Compact',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=127907180&c=3572911&h=pbinqk-IpRn_rgMq2cEAFXpv1V6WrIuGzgkeA1oOsXcybYTu',
    productUrl: 'https://www.westelm.co.uk/penn-chair-h6480',
    description: 'Best seller. Affordable accent chair with clean lines.',
    tags: ['best seller', 'commercial grade', 'affordable'],
  },
  {
    id: 'westelm-ryder-leather-chair',
    name: 'Ryder Leather Armchair',
    brand: 'West Elm',
    category: 'armchair',
    style: 'Modern Industrial',
    material: ['Leather', 'Metal'],
    colors: ['Nut'],
    price: '£1,699',
    dimensions: 'Standard',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=107250050&c=3572911&h=1RJmUGTLTs3HYFfqrGA6Jm7S5wCopRbw9Lldsw-_Mb3aznMo',
    productUrl: 'https://www.westelm.co.uk/ryder-leather-chair-h4577',
    description: 'Best seller. Industrial-inspired leather chair.',
    tags: ['best seller', 'commercial grade', 'leather'],
  },
];

// West Elm Sofa Beds
export const WESTELM_SOFA_BEDS: FurnitureItem[] = [
  {
    id: 'westelm-paidge-sofa-bed',
    name: 'Paidge King Sofa Bed',
    brand: 'West Elm',
    category: 'sofa-bed',
    style: 'Modern',
    material: ['Fabric', 'Wood'],
    colors: ['Sand', 'Mauve', 'White', 'Dove'],
    price: '£2,299 - £2,699',
    dimensions: '206 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=119335353&c=3572911&h=WCsV2UDe1AsZVEUN3H6n4ZvvZhpijp-H3_YHBkWFaPom2Ehi',
    productUrl: 'https://www.westelm.co.uk/paidge-sleeper-sofa-h635',
    description: 'Best seller. King-size sleeper with easy pull-out mechanism.',
    tags: ['best seller', 'commercial grade', 'sleeper'],
  },
  {
    id: 'westelm-booker-sofa-bed',
    name: 'Booker King Sofa Bed',
    brand: 'West Elm',
    category: 'sofa-bed',
    style: 'Modern',
    material: ['Fabric', 'Wood'],
    colors: ['Juniper'],
    price: '£1,399',
    dimensions: '234 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=127816423&c=3572911&h=Lw43QSRee4gUIUrYoXgQuV__oE0_qUUyUKJqlW4fWNg1vXHP',
    productUrl: 'https://www.westelm.co.uk/booker-trundle-sofa-h13460',
    description: 'New arrival. Trundle-style sofa bed with modern design.',
    tags: ['new', 'commercial grade', 'trundle'],
  },
  {
    id: 'westelm-marin-sofa-bed',
    name: 'Marin Sofa Bed',
    brand: 'West Elm',
    category: 'sofa-bed',
    style: 'Contemporary',
    material: ['Fabric', 'Wood'],
    colors: ['Alabaster'],
    price: '£2,499',
    dimensions: '203 cm',
    imageUrl:
      'https://3572911.app.netsuite.com/core/media/media.nl?id=126468547&c=3572911&h=65ogb9ShYxo3Z9GcUidg0hIFp2hWmXl5EvjcfPB8KmrRcYhS',
    productUrl: 'https://www.westelm.co.uk/marin-sleeper-sofa-h6954',
    description: 'Best seller. Sleek sleeper sofa with comfortable mattress.',
    tags: ['best seller', 'commercial grade', 'sleeper'],
  },
];

// Combined collection for easy access
export const ALL_WESTELM_FURNITURE: FurnitureItem[] = [
  ...WESTELM_SOFAS,
  ...WESTELM_SECTIONALS,
  ...WESTELM_ARMCHAIRS,
  ...WESTELM_SOFA_BEDS,
];

// Helper functions
export const getFurnitureByCategory = (category: FurnitureItem['category']): FurnitureItem[] => {
  return ALL_WESTELM_FURNITURE.filter((item) => item.category === category);
};

export const getFurnitureByStyle = (style: string): FurnitureItem[] => {
  return ALL_WESTELM_FURNITURE.filter((item) =>
    item.style.toLowerCase().includes(style.toLowerCase())
  );
};

export const getFurnitureById = (id: string): FurnitureItem | undefined => {
  return ALL_WESTELM_FURNITURE.find((item) => item.id === id);
};

export const getBestSellers = (): FurnitureItem[] => {
  return ALL_WESTELM_FURNITURE.filter((item) => item.tags.includes('best seller'));
};

export const getNewArrivals = (): FurnitureItem[] => {
  return ALL_WESTELM_FURNITURE.filter((item) => item.tags.includes('new'));
};
