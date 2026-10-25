import {
  TourPackage,
  Booking,
  AutoReplyTrigger,
  AfterHoursConfig,
  MetaAdCampaign,
  CRMWebhookConfig,
  InquiryCustomer,
  FAQItem,
  QualificationQuestion,
  AgencyProfile,
  AdminNotification,
} from '../types/travel-bot';
import {
  INITIAL_PACKAGES,
  INITIAL_BOOKINGS,
  INITIAL_TRIGGERS,
  INITIAL_AFTER_HOURS_CONFIG,
  INITIAL_META_CAMPAIGNS,
  INITIAL_INQUIRIES,
  INITIAL_CRM_CONFIG,
  INITIAL_FAQS,
  INITIAL_QUALIFICATION_QUESTIONS,
  INITIAL_AGENCY_PROFILE,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const STORAGE_KEYS = {
  PACKAGES: 'voyage_packages_v2',
  BOOKINGS: 'voyage_bookings_v2',
  TRIGGERS: 'voyage_triggers_v2',
  AFTER_HOURS: 'voyage_after_hours_v2',
  META_CAMPAIGNS: 'voyage_meta_campaigns_v2',
  INQUIRIES: 'voyage_inquiries_v2',
  CRM_CONFIG: 'voyage_crm_config_v2',
  FAQS: 'voyage_faqs_v2',
  QUESTIONS: 'voyage_qualification_questions_v2',
  AGENCY_PROFILE: 'voyage_agency_profile_v2',
  NOTIFICATIONS: 'voyage_notifications_v2',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to read ${key} from storage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Failed to write ${key} to storage:`, e);
  }
}

export const StorageService = {
  getPackages(): TourPackage[] {
    return safeGet<TourPackage[]>(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
  },
  savePackages(packages: TourPackage[]): void {
    safeSet(STORAGE_KEYS.PACKAGES, packages);
  },

  getBookings(): Booking[] {
    return safeGet<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },
  saveBookings(bookings: Booking[]): void {
    safeSet(STORAGE_KEYS.BOOKINGS, bookings);
  },

  getTriggers(): AutoReplyTrigger[] {
    return safeGet<AutoReplyTrigger[]>(STORAGE_KEYS.TRIGGERS, INITIAL_TRIGGERS);
  },
  saveTriggers(triggers: AutoReplyTrigger[]): void {
    safeSet(STORAGE_KEYS.TRIGGERS, triggers);
  },

  getAfterHoursConfig(): AfterHoursConfig {
    return safeGet<AfterHoursConfig>(STORAGE_KEYS.AFTER_HOURS, INITIAL_AFTER_HOURS_CONFIG);
  },
  saveAfterHoursConfig(config: AfterHoursConfig): void {
    safeSet(STORAGE_KEYS.AFTER_HOURS, config);
  },

  getMetaCampaigns(): MetaAdCampaign[] {
    return safeGet<MetaAdCampaign[]>(STORAGE_KEYS.META_CAMPAIGNS, INITIAL_META_CAMPAIGNS);
  },
  saveMetaCampaigns(campaigns: MetaAdCampaign[]): void {
    safeSet(STORAGE_KEYS.META_CAMPAIGNS, campaigns);
  },

  getInquiries(): InquiryCustomer[] {
    return safeGet<InquiryCustomer[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
  },
  saveInquiries(inquiries: InquiryCustomer[]): void {
    safeSet(STORAGE_KEYS.INQUIRIES, inquiries);
  },

  getCRMConfig(): CRMWebhookConfig {
    return safeGet<CRMWebhookConfig>(STORAGE_KEYS.CRM_CONFIG, INITIAL_CRM_CONFIG);
  },
  saveCRMConfig(config: CRMWebhookConfig): void {
    safeSet(STORAGE_KEYS.CRM_CONFIG, config);
  },

  getFAQs(): FAQItem[] {
    return safeGet<FAQItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  },
  saveFAQs(faqs: FAQItem[]): void {
    safeSet(STORAGE_KEYS.FAQS, faqs);
  },

  getQualificationQuestions(): QualificationQuestion[] {
    return safeGet<QualificationQuestion[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUALIFICATION_QUESTIONS);
  },
  saveQualificationQuestions(questions: QualificationQuestion[]): void {
    safeSet(STORAGE_KEYS.QUESTIONS, questions);
  },

  getAgencyProfile(): AgencyProfile {
    return safeGet<AgencyProfile>(STORAGE_KEYS.AGENCY_PROFILE, INITIAL_AGENCY_PROFILE);
  },
  saveAgencyProfile(profile: AgencyProfile): void {
    safeSet(STORAGE_KEYS.AGENCY_PROFILE, profile);
  },

  getNotifications(): AdminNotification[] {
    return safeGet<AdminNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  saveNotifications(notifs: AdminNotification[]): void {
    safeSet(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  resetAll(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
