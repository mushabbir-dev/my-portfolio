export type Localized = { english: string; japanese: string };

export type Certificate = {
  id: string;                 // uuid
  name: Localized;            // required
  issuer: Localized;          // required
  institute?: Localized;      // optional (kept to match your structure)
  date: Localized;            // required (you've been storing strings; we normalize)
  imageUrl?: string;
  imageKey?: string;          // storage key inside bucket (for deletion)
  pdfUrl?: string;
  pdfKey?: string;            // storage key inside bucket (for deletion)
  isActive?: boolean;         // default true
  createdAt?: string;         // ISO
  updatedAt?: string;         // ISO
};
