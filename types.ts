type Coordinates = [number, number];

interface VaccineLocation extends Feature {
  distance: number;
}

interface AppointmentsResponse {
  type: string;
  features: Feature[];
  metadata: Metadata;
}

interface Feature {
  type: FeatureType;
  geometry: Geometry;
  properties: Properties;
}

interface Geometry {
  type: GeometryType;
  coordinates: Coordinates;
}

enum GeometryType {
  Point = "Point",
}

interface Properties {
  id: number;
  url: string;
  city: string;
  name: string;
  state: Code;
  address: null | string;
  provider: Provider;
  time_zone: TimeZone | null;
  postal_code: null | string;
  appointments: Appointment[] | null;
  provider_brand: Provider;
  carries_vaccine: boolean | null;
  appointment_types: AppointmentTypes | null;
  provider_brand_id: number;
  provider_brand_name: Name;
  provider_location_id: string;
  appointments_available: boolean | null;
  appointment_vaccine_types: AppointmentVaccineTypes | null;
  appointments_last_fetched: Date | null;
  appointments_last_modified: Date | null;
  appointments_available_all_doses: boolean | null;
  appointments_available_2nd_dose_only: boolean | null;
}

interface AppointmentTypes {
  unknown?: boolean;
  all_doses?: boolean;
  "2nd_dose_only"?: boolean;
}

interface AppointmentVaccineTypes {
  pfizer?: boolean;
  moderna?: boolean;
}

interface Appointment {
  time: Date;
  type: AppointmentType;
  vaccine_types: VaccineType[];
  appointment_types: string[];
}

enum AppointmentType {
  Moderna = "Moderna",
  Pfizer = "Pfizer",
  Pfizer2NdDoseOnly = "Pfizer - 2nd Dose Only",
}

enum VaccineType {
  Moderna = "moderna",
  Pfizer = "pfizer",
}

enum Provider {
  CVS = "cvs",
  CommunityAWalgreensPharmacy = "community_a_walgreens_pharmacy",
  HealthMart = "health_mart",
  Hyvee = "hyvee",
  SamsClub = "sams_club",
  ThriftyWhite = "thrifty_white",
  Walgreens = "walgreens",
  Walmart = "walmart",
}

enum Name {
  CVS = "CVS",
  CommunityWalgreens = "Community (Walgreens)",
  HealthMart = "Health Mart",
  HyVee = "Hy-Vee",
  SamSClub = "Sam's Club",
  ThriftyWhite = "Thrifty White",
  Walgreens = "Walgreens",
  Walmart = "Walmart",
}

enum Code {
  Mn = "MN",
}

enum TimeZone {
  AmericaChicago = "America/Chicago",
}

enum FeatureType {
  Feature = "Feature",
}

interface Metadata {
  code: Code;
  name: string;
  store_count: number;
  bounding_box: BoundingBox;
  provider_brands: ProviderBrand[];
  provider_brand_count: number;
  appointments_last_fetched: Date;
  appointments_last_modified: Date;
}

interface BoundingBox {
  type: string;
  coordinates: Array<Array<number[]>>;
}

interface ProviderBrand {
  id: number;
  key: Provider;
  url: string;
  name: Name;
  status: string;
  provider_id: Provider;
  location_count: number;
  appointments_last_fetched: Date;
  appointments_last_modified: Date;
}
