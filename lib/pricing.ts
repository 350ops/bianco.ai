// scan3D Pricing Configuration
// All multipliers and rates for project cost estimation

export const PRICING_VERSION = 'v1.1';
export const BASE_RATE_PER_M2 = 450; // EUR per m²
export const MIN_ROOM_FEE = 600; // EUR minimum per room
export const DEFAULT_CURRENCY = 'EUR';

// ============================================
// LOCATION & CITY DATA
// ============================================

// Country multipliers (base location factor)
export const LOCATION_MULTIPLIERS: Record<string, number> = {
  Spain: 1.0,
  Brazil: 0.75,
  Portugal: 0.92,
  Mexico: 0.7,
  USA: 1.45,
  UK: 1.35,
  France: 1.2,
  Germany: 1.25,
  Italy: 1.15,
  Other: 1.1,
};

// Cities by country with their multipliers (relative to country base)
export const CITIES_BY_COUNTRY: Record<string, { name: string; multiplier: number }[]> = {
  Spain: [
    { name: 'Madrid', multiplier: 1.15 },
    { name: 'Barcelona', multiplier: 1.2 },
    { name: 'Valencia', multiplier: 0.95 },
    { name: 'Sevilla', multiplier: 0.9 },
    { name: 'Bilbao', multiplier: 1.05 },
    { name: 'Málaga', multiplier: 0.92 },
    { name: 'Alicante', multiplier: 0.88 },
    { name: 'Other city', multiplier: 1.0 },
  ],
  Brazil: [
    { name: 'São Paulo', multiplier: 1.25 },
    { name: 'Rio de Janeiro', multiplier: 1.2 },
    { name: 'Brasília', multiplier: 1.1 },
    { name: 'Salvador', multiplier: 0.9 },
    { name: 'Belo Horizonte', multiplier: 0.95 },
    { name: 'Curitiba', multiplier: 1.0 },
    { name: 'Other city', multiplier: 0.9 },
  ],
  Portugal: [
    { name: 'Lisboa', multiplier: 1.2 },
    { name: 'Porto', multiplier: 1.1 },
    { name: 'Faro', multiplier: 0.95 },
    { name: 'Braga', multiplier: 0.9 },
    { name: 'Other city', multiplier: 0.92 },
  ],
  Mexico: [
    { name: 'Ciudad de México', multiplier: 1.25 },
    { name: 'Monterrey', multiplier: 1.15 },
    { name: 'Guadalajara', multiplier: 1.05 },
    { name: 'Cancún', multiplier: 1.2 },
    { name: 'Other city', multiplier: 0.9 },
  ],
  USA: [
    { name: 'New York', multiplier: 1.4 },
    { name: 'Los Angeles', multiplier: 1.3 },
    { name: 'Miami', multiplier: 1.25 },
    { name: 'San Francisco', multiplier: 1.45 },
    { name: 'Chicago', multiplier: 1.15 },
    { name: 'Houston', multiplier: 1.0 },
    { name: 'Other city', multiplier: 1.1 },
  ],
  UK: [
    { name: 'London', multiplier: 1.4 },
    { name: 'Manchester', multiplier: 1.05 },
    { name: 'Birmingham', multiplier: 1.0 },
    { name: 'Edinburgh', multiplier: 1.1 },
    { name: 'Other city', multiplier: 0.95 },
  ],
  France: [
    { name: 'Paris', multiplier: 1.35 },
    { name: 'Lyon', multiplier: 1.05 },
    { name: 'Marseille', multiplier: 1.0 },
    { name: 'Nice', multiplier: 1.15 },
    { name: 'Other city', multiplier: 0.95 },
  ],
  Germany: [
    { name: 'Berlin', multiplier: 1.15 },
    { name: 'Munich', multiplier: 1.3 },
    { name: 'Frankfurt', multiplier: 1.2 },
    { name: 'Hamburg', multiplier: 1.1 },
    { name: 'Other city', multiplier: 1.0 },
  ],
  Italy: [
    { name: 'Milan', multiplier: 1.25 },
    { name: 'Rome', multiplier: 1.15 },
    { name: 'Florence', multiplier: 1.1 },
    { name: 'Venice', multiplier: 1.2 },
    { name: 'Other city', multiplier: 0.95 },
  ],
  Other: [
    { name: 'Major city', multiplier: 1.2 },
    { name: 'Medium city', multiplier: 1.0 },
    { name: 'Small town', multiplier: 0.85 },
  ],
};

// ============================================
// PROPERTY CHARACTERISTICS
// ============================================

// Property age band multipliers
export const PROPERTY_AGE_MULTIPLIERS: Record<string, number> = {
  '1 - 5 Years': 0.95,
  '6 - 10 Years': 1.0,
  '11 - 15 Years': 1.06,
  '16 - 20 Years': 1.12,
  '21 - 25 Years': 1.2,
  'More than 25 Years': 1.32,
};

// Property type multipliers
export const PROPERTY_TYPE_MULTIPLIERS: Record<string, number> = {
  Apartment: 1.0,
  Penthouse: 1.15,
  Townhouse: 1.05,
  'Detached House': 1.08,
  Villa: 1.2,
  'Loft / Industrial': 1.12,
  Studio: 0.95,
  Duplex: 1.1,
};

// Property condition multipliers (current state before renovation)
export const PROPERTY_CONDITION_MULTIPLIERS: Record<string, number> = {
  'Newly built (minor customization)': 0.75,
  'Good condition (cosmetic refresh)': 0.9,
  'Average (needs updating)': 1.0,
  'Below average (significant work)': 1.15,
  'Poor (major renovation)': 1.35,
  'Gut renovation required': 1.55,
};

// Access difficulty multipliers
export const ACCESS_DIFFICULTY_MULTIPLIERS: Record<string, number> = {
  'Easy (ground floor / elevator)': 1.0,
  'Moderate (stairs up to 3rd floor)': 1.05,
  'Difficult (4th+ floor, no elevator)': 1.12,
  'Very difficult (restricted access)': 1.2,
  'Historic building restrictions': 1.25,
};

// Project urgency multipliers
export const URGENCY_MULTIPLIERS: Record<string, number> = {
  'Flexible timeline (3+ months)': 0.95,
  'Standard (1-3 months)': 1.0,
  'Urgent (2-4 weeks)': 1.15,
  'Very urgent (under 2 weeks)': 1.35,
};

// ============================================
// ROOM & FINISH OPTIONS
// ============================================

// Room type multipliers
export const ROOM_TYPE_MULTIPLIERS: Record<string, number> = {
  'Entire Property': 0.92, // Economy of scale discount
  'Living Room': 1.0,
  'Dining Room': 0.98,
  Kitchen: 1.45, // Wet area - higher cost
  Bathroom: 1.55, // Wet area - highest cost
  Bedroom: 0.95,
  'Master Bedroom': 1.02,
  'Balcony / Terrace': 1.1,
  'Home Office': 0.97,
  'Walk-in Closet': 0.9,
  'Laundry Room': 1.25,
  'Hallway / Corridor': 0.85,
  'Entrance Hall': 0.88,
  Garage: 0.75,
  Basement: 0.8,
};

// Floor finish multipliers
export const FLOOR_FINISH_MULTIPLIERS: Record<string, number> = {
  Hardwood: 1.25,
  Laminate: 0.95,
  'Tile (Ceramic)': 1.1,
  'Tile (Porcelain)': 1.2,
  'Vinyl / LVT': 0.85,
  Carpet: 0.9,
  'Polished Concrete': 0.92,
  Marble: 1.55,
  'Engineered Wood': 1.1,
  'Natural Stone': 1.45,
  Microcement: 1.3,
  Terrazzo: 1.4,
};

// Wall finish multipliers
export const WALL_FINISH_MULTIPLIERS: Record<string, number> = {
  'Paint (Standard)': 0.9,
  'Paint (Premium)': 1.0,
  Wallpaper: 1.1,
  Tile: 1.3,
  'Wood Paneling': 1.25,
  'Exposed Brick': 1.15,
  'Textured Plaster': 1.12,
  'Stone Veneer': 1.35,
  Microcement: 1.28,
  'Acoustic Panels': 1.2,
};

// Built-in furniture multipliers
export const BUILT_IN_FURNITURE_MULTIPLIERS: Record<string, number> = {
  None: 1.0,
  'Basic Cabinets': 1.08,
  'Custom Closets': 1.12,
  'Built-in Shelving': 1.07,
  'Kitchen Cabinets (Standard)': 1.18,
  'Kitchen Cabinets (Premium)': 1.35,
  'Bathroom Vanity': 1.1,
  'Entertainment Center': 1.1,
  'Home Office Desk & Storage': 1.15,
  'Full Custom Joinery': 1.3,
};

// ============================================
// ADDITIONAL OPTIONS (NEW)
// ============================================

// Ceiling height multipliers (affects wall area and difficulty)
export const CEILING_HEIGHT_MULTIPLIERS: Record<string, number> = {
  'Standard (2.4 - 2.7m)': 1.0,
  'High (2.8 - 3.2m)': 1.08,
  'Very high (3.3 - 4m)': 1.18,
  'Double height (4m+)': 1.35,
};

// Electrical work scope
export const ELECTRICAL_SCOPE_MULTIPLIERS: Record<string, number> = {
  'No changes': 0.95,
  'Minor updates (outlets, switches)': 1.0,
  'Moderate (new circuits, lighting)': 1.1,
  'Major rewiring': 1.25,
  'Full electrical overhaul': 1.4,
};

// Plumbing work scope
export const PLUMBING_SCOPE_MULTIPLIERS: Record<string, number> = {
  'No changes': 1.0,
  'Fixture replacement only': 1.05,
  'Minor relocations': 1.15,
  'Major changes': 1.3,
  'Full replumb': 1.5,
};

// ============================================
// OPTION LISTS FOR UI
// ============================================

export const PROPERTY_LOCATIONS = Object.keys(LOCATION_MULTIPLIERS);
export const PROPERTY_AGES = Object.keys(PROPERTY_AGE_MULTIPLIERS);
export const PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_MULTIPLIERS);
export const PROPERTY_CONDITIONS = Object.keys(PROPERTY_CONDITION_MULTIPLIERS);
export const ACCESS_DIFFICULTIES = Object.keys(ACCESS_DIFFICULTY_MULTIPLIERS);
export const URGENCY_OPTIONS = Object.keys(URGENCY_MULTIPLIERS);
export const ROOM_TYPES = Object.keys(ROOM_TYPE_MULTIPLIERS);
export const FLOOR_FINISHES = Object.keys(FLOOR_FINISH_MULTIPLIERS);
export const WALL_FINISHES = Object.keys(WALL_FINISH_MULTIPLIERS);
export const FURNITURE_OPTIONS = Object.keys(BUILT_IN_FURNITURE_MULTIPLIERS);
export const CEILING_HEIGHTS = Object.keys(CEILING_HEIGHT_MULTIPLIERS);
export const ELECTRICAL_SCOPES = Object.keys(ELECTRICAL_SCOPE_MULTIPLIERS);
export const PLUMBING_SCOPES = Object.keys(PLUMBING_SCOPE_MULTIPLIERS);

// Get cities for a country
export const getCitiesForCountry = (country: string): string[] => {
  const cities = CITIES_BY_COUNTRY[country] || CITIES_BY_COUNTRY['Other'];
  return cities.map((c) => c.name);
};

// Get city multiplier
export const getCityMultiplier = (country: string, city: string): number => {
  const cities = CITIES_BY_COUNTRY[country] || CITIES_BY_COUNTRY['Other'];
  const cityData = cities.find((c) => c.name === city);
  return cityData?.multiplier || 1.0;
};

// Get multiplier safely with fallback
export const getMultiplier = (
  multipliers: Record<string, number>,
  key: string,
  fallback: number = 1.0
): number => {
  return multipliers[key] ?? fallback;
};

// Calculate combined location multiplier (country × city)
export const getLocationMultiplier = (country: string, city: string): number => {
  const countryMultiplier = LOCATION_MULTIPLIERS[country] || 1.0;
  const cityMultiplier = getCityMultiplier(country, city);
  return countryMultiplier * cityMultiplier;
};
