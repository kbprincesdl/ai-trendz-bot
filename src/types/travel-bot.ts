export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  duration: string; // e.g. "5 Days / 4 Nights"
  pricePerPerson: number;
  currency: string;
  image: string;
  badge?: string;
  highlights: string[];
  inclusions: string[];
  totalSlots: number;
  availableSlots: number;
  nextDeparture: string;
}

export interface Booking {
  id: string; // PNR / Ref e.g. "VOY-8421"
  customerName: string;
  customerPhone: string;
  packageId: string;
  packageName: string;
  departureDate: string;
  returnDate: string;
  paxCount: number;
  totalPrice: number;
  paidAmount: number;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
  bookingStatus: 'Confirmed' | 'Deposit Paid' | 'Pending Documents' | 'Cancelled' | 'Completed';
  hotelVoucherIssued: boolean;
  flightConfirmed: boolean;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'bot' | 'agent';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  quickReplies?: string[];
  packageCard?: TourPackage;
  bookingCard?: Booking;
  mediaUrl?: string;
  mediaType?: 'image' | 'pdf';
  isAfterHoursReply?: boolean;
  isFaqReply?: boolean;
  isQuestionnaireStep?: boolean;
  adAttribution?: {
    campaignName: string;
    adId: string;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'booking_payment' | 'visa_passport' | 'inclusions_meals' | 'flights_transfers' | 'insurance_safety' | 'custom_private';
  keywords: string[];
  isEnabled: boolean;
  hitCount: number;
}

export interface QualificationQuestion {
  id: string;
  fieldKey: 'targetDestination' | 'travelDates' | 'pax' | 'durationDays' | 'budgetPreference' | 'custom';
  questionText: string;
  hintText?: string;
  quickReplies?: string[];
  isRequired: boolean;
  order: number;
}

export interface CustomerQualificationState {
  currentQuestionIndex: number;
  isCompleted: boolean;
  collectedData: {
    targetDestination?: string;
    travelDates?: string;
    pax?: number;
    durationDays?: string;
    budgetPreference?: string;
    [key: string]: any;
  };
}

export interface InquiryCustomer {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  leadSource: 'Meta Ad' | 'Facebook Feed' | 'Instagram Sponsored' | 'WhatsApp Direct' | 'Google Search' | 'Referral';
  adCampaign?: string;
  adId?: string;
  targetDestination?: string;
  travelDates?: string;
  durationDays?: string;
  budgetRange?: string;
  pax?: number;
  status: 'New Lead' | 'In Discussion' | 'Quotation Sent' | 'Booking Placed' | 'Cold' | 'Closed';
  botStatus: 'Active' | 'Paused' | 'Agent Handled';
  isAfterHours: boolean;
  lastMessageTime: string;
  unreadCount: number;
  assignedAgent: string;
  notes: string;
  messages: ChatMessage[];
  bookingRef?: string;
  qualificationState?: CustomerQualificationState;
}

export interface AutoReplyTrigger {
  id: string;
  name: string;
  category: 'destinations' | 'pricing' | 'bookings' | 'general' | 'faq' | 'escalation';
  matchType: 'contains_any' | 'exact' | 'regex' | 'starts_with';
  keywords: string[];
  responseTemplate: string;
  includePackageId?: string;
  includeQuickReplies?: string[];
  enableBookingLookup?: boolean;
  pauseBotAfterTrigger?: boolean;
  isActive: boolean;
  usageCount: number;
}

export interface BusinessHoursSchedule {
  dayOfWeek: number;
  dayName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface AfterHoursConfig {
  timezone: string;
  forceSimulateClosed: boolean;
  autoReplyText: string;
  emergencyPhone: string;
  enableCallbackBooking: boolean;
  schedule: BusinessHoursSchedule[];
}

export interface MetaAdCampaign {
  id: string;
  campaignId: string;
  name: string;
  platform: 'Facebook' | 'Instagram' | 'Meta Audience';
  headline: string;
  associatedPackageId: string;
  promoCode: string;
  discountPercentage: number;
  clicksCount: number;
  leadsGenerated: number;
  spendAmount: number;
  status: 'Active' | 'Paused';
  autoFollowUpEnabled: boolean;
  followUpDelaySeconds: number;
  greetingMessage: string;
  offerMessage: string;
}

export interface CRMWebhookConfig {
  webhookUrl: string;
  authHeader: string;
  provider: 'Google Sheets' | 'Supabase' | 'HubSpot' | 'Zoho CRM' | 'Custom Webhook';
  syncOnNewLead: boolean;
  syncOnBooking: boolean;
  syncOnAfterHours: boolean;
  lastSyncStatus?: 'Success' | 'Failed' | 'Never';
  lastSyncTimestamp?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'lead' | 'bot_reply' | 'booking' | 'after_hours';
  isRead: boolean;
  customerId?: string;
}

export interface AgencyProfile {
  agencyName: string;
  tagline: string;
  adminPhone: string; // WhatsApp number for testing and alerts
  adminEmail: string;
  currency: string;
  strictFaqMode: boolean; // Only respond from FAQs and questions questionnaire
  notifyOnBotResponse: boolean; // In-app notification
  notifyOnWhatsApp: boolean; // Forward alert to admin WhatsApp
}
