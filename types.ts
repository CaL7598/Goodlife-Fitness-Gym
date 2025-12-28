
export enum UserRole {
  PUBLIC = 'PUBLIC',
  STAFF = 'STAFF',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum SubscriptionPlan {
  BASIC = 'Basic',
  PREMIUM = 'Premium',
  VIP = 'VIP'
}

export enum PaymentMethod {
  CASH = 'Cash',
  MOMO = 'Mobile Money'
}

export enum PaymentStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  REJECTED = 'Rejected'
}

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  emergencyContact?: string;
  plan: SubscriptionPlan;
  startDate: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired';
}

export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  confirmedBy?: string;
  transactionId?: string;
  momoPhone?: string;
  network?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface AppState {
  userRole: UserRole;
  members: Member[];
  payments: PaymentRecord[];
  announcements: Announcement[];
  gallery: GalleryImage[];
}
