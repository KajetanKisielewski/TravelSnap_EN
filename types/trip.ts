export interface TripData {
  title: string;
  destination: string;
  date: string;
  rating: number;

  imageUri?: string;

  // REVIEW: Currently this field is not used in runtime flow.
  // Why it is risky: dead schema fields create confusion about real data contract.
  // How to fix: either implement full gallery flow using this field or remove it.
  galleryUris?: string[];
}

export interface Trip extends TripData {
  id: string;
}