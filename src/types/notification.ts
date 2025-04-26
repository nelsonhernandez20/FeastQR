export interface Notification {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  title: string;
  description: string;
  type: string;
  isRead: boolean;
  paymentProofUrl: string | null;
  paymentProofFilename: string | null;
  paymentProofBucket: string | null;
  paymentProofPath: string | null;
  paymentAmount: number | null;
  paymentCurrency: string | null;
  paymentDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  menuSlug: string;
  locationInfo: string | null;
  additionalNotes: string | null;
  idNotification?: string;
} 