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

export const INITIAL_AGENCY_PROFILE: AgencyProfile = {
  agencyName: 'VoyageCraft Ops',
  tagline: 'Premium Tour & Travel Automation',
  adminPhone: '+1 (555) 789-2041',
  adminEmail: 'ops@voyagecraft.travel',
  currency: 'USD',
  strictFaqMode: true, // User requested: bot should only respond with answers from the FAQ provided by admin
  notifyOnBotResponse: true,
  notifyOnWhatsApp: true,
};

export const INITIAL_QUALIFICATION_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'q-dest',
    fieldKey: 'targetDestination',
    questionText: 'Which dream destination are you planning to visit?',
    hintText: 'e.g. Bali, Swiss Alps, Dubai, Japan, or Europe',
    quickReplies: ['Bali 🌴', 'Swiss Alps 🏔️', 'Dubai 🏙️', 'Japan 🌸', 'Other'],
    isRequired: true,
    order: 1,
  },
  {
    id: 'q-dates',
    fieldKey: 'travelDates',
    questionText: 'What is your approximate date or month of travel?',
    hintText: 'e.g. Nov 2026, Dec 15-22, or Summer 2027',
    quickReplies: ['November 2026', 'December 2026 (Holidays)', 'Spring 2027', 'Flexible'],
    isRequired: true,
    order: 2,
  },
  {
    id: 'q-pax',
    fieldKey: 'pax',
    questionText: 'How many persons (adults & children) will be traveling?',
    hintText: 'e.g. 2 adults, or 2 adults + 1 child',
    quickReplies: ['Solo (1)', 'Couple (2)', 'Family (3-4)', 'Group (5+)'],
    isRequired: true,
    order: 3,
  },
  {
    id: 'q-duration',
    fieldKey: 'durationDays',
    questionText: 'What is your preferred trip duration (number of days)?',
    hintText: 'e.g. 5 Days, 7 Days, or 10+ Days',
    quickReplies: ['5 Days / 4 Nights', '7 Days / 6 Nights', '10 Days', 'Custom'],
    isRequired: true,
    order: 4,
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-01',
    question: 'How do I confirm and pay for a tour package?',
    answer: `💳 *Booking & Payment Confirmation:*
To confirm your booking, we require an initial deposit of *30%* at the time of reservation. The remaining balance is payable *14 days before your departure date*. We accept all major Credit/Debit Cards, Bank Wire Transfers, and secure Online Payment Links.`,
    category: 'booking_payment',
    keywords: ['confirm', 'pay', 'payment', 'deposit', 'book', 'credit card', 'how to pay'],
    isEnabled: true,
    hitCount: 84,
  },
  {
    id: 'faq-02',
    question: 'What is your cancellation and refund policy?',
    answer: `🔄 *Cancellation & Refund Policy:*
• *30+ days prior to departure:* 100% refund (minus standard banking administrative fee).
• *15–29 days prior:* 50% refund of total package price.
• *Under 14 days:* Non-refundable due to pre-paid hotel & transport commitments.
Travel insurance with trip interruption coverage is strongly recommended!`,
    category: 'booking_payment',
    keywords: ['cancel', 'cancellation', 'refund', 'money back', 'reschedule', 'policy'],
    isEnabled: true,
    hitCount: 52,
  },
  {
    id: 'faq-03',
    question: 'Are international flight tickets included in package prices?',
    answer: `✈️ *Flight Inclusions:*
Our catalog prices represent all-inclusive *ground tour packages* (4/5-star hotels, airport private transfers, guided excursions, and entry passes). We provide discounted airline ticketing add-ons from all major international airports upon request!`,
    category: 'flights_transfers',
    keywords: ['flight', 'airfare', 'tickets', 'airline', 'flight included', 'plane'],
    isEnabled: true,
    hitCount: 67,
  },
  {
    id: 'faq-04',
    question: 'Do you help with tourist visas and embassy paperwork?',
    answer: `📋 *Visa & Documentation Assistance:*
Yes! For Dubai, the tourist visa is *included free*. For Schengen (Europe) and Japan, our documentation team provides official hotel confirmation vouchers, verified dummy flight itineraries, and embassy appointment scheduling.`,
    category: 'visa_passport',
    keywords: ['visa', 'passport', 'embassy', 'schengen', 'documents', 'paperwork', 'validity'],
    isEnabled: true,
    hitCount: 61,
  },
  {
    id: 'faq-05',
    question: 'How much passport validity is required for international travel?',
    answer: `🛂 *Passport Validity Requirement:*
All international destinations require your passport to have a minimum of *6 months validity* from your planned return date, with at least 2 consecutive blank visa pages.`,
    category: 'visa_passport',
    keywords: ['passport validity', 'passport expiry', '6 months', 'blank pages'],
    isEnabled: true,
    hitCount: 29,
  },
  {
    id: 'faq-06',
    question: 'Can you accommodate vegetarian, vegan, or halal dietary meals?',
    answer: `🥗 *Dietary Requirements:*
Yes, absolutely! All our partnered hotel resorts and tour restaurants cater to Vegetarian, Vegan, Jain, Gluten-Free, and certified Halal meal requests. Simply inform us during booking!`,
    category: 'inclusions_meals',
    keywords: ['vegetarian', 'vegan', 'halal', 'jain', 'food', 'meals', 'diet', 'breakfast'],
    isEnabled: true,
    hitCount: 43,
  },
  {
    id: 'faq-07',
    question: 'Is airport pickup and drop-off provided?',
    answer: `🚗 *Airport Transfers:*
Yes! Every single package includes private, air-conditioned roundtrip airport meet-and-greet transfers. Our chauffeur will wait for you at the arrival terminal with a personalized name board.`,
    category: 'flights_transfers',
    keywords: ['airport', 'pickup', 'transfer', 'drop', 'taxi', 'driver', 'chauffeur'],
    isEnabled: true,
    hitCount: 38,
  },
  {
    id: 'faq-08',
    question: 'Are there discounts for children and toddlers?',
    answer: `👶 *Child Discount Policy:*
• Children under 2 years (infants) travel free (service fees apply).
• Children 2–11 years sharing existing bedding receive *25% discount*.
• Extra bed option available on all family departures.`,
    category: 'booking_payment',
    keywords: ['child', 'children', 'kid', 'kids', 'toddler', 'family discount', 'infant'],
    isEnabled: true,
    hitCount: 31,
  },
  {
    id: 'faq-09',
    question: 'Can we customize departure dates or request private tours?',
    answer: `🌟 *Private & Customized Itineraries:*
Yes! If you prefer a private departure just for your family or friends with customized travel dates, our senior travel designers can tailor any itinerary with luxury villas, yacht charters, or special activities.`,
    category: 'custom_private',
    keywords: ['customize', 'custom', 'private tour', 'private guide', 'custom dates', 'tailored', 'honeymoon'],
    isEnabled: true,
    hitCount: 56,
  },
  {
    id: 'faq-10',
    question: 'Do you provide travel insurance?',
    answer: `🛡️ *Comprehensive Travel Insurance:*
We offer comprehensive global travel insurance covering emergency medical expenses, luggage loss, trip delays, and COVID-19 medical assistance through Allianz Travel Care. Rates start at just $35/traveler.`,
    category: 'insurance_safety',
    keywords: ['insurance', 'medical', 'safety', 'health', 'cover', 'allianz'],
    isEnabled: true,
    hitCount: 22,
  },
];

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'Bot Auto-Responded to Customer',
    message: 'VoyageBot answered Marcus Sterling regarding PNR VOY-8421 with live hotel and flight vouchers.',
    timestamp: '10:45 AM',
    type: 'bot_reply',
    isRead: false,
    customerId: 'inq-02',
  },
  {
    id: 'notif-2',
    title: 'New Meta Ad Lead Captured',
    message: 'Sarah Jenkins clicked Facebook Ad "Bali 5D4N Summer Promo". Follow-up sent with code BALI20.',
    timestamp: '10:40 AM',
    type: 'lead',
    isRead: false,
    customerId: 'inq-01',
  },
  {
    id: 'notif-3',
    title: 'After-Hours Inquiry Logged',
    message: 'Jonathan Reynolds inquired about Dubai family package late night. Scheduled for 9 AM callback.',
    timestamp: 'Yesterday, 11:15 PM',
    type: 'after_hours',
    isRead: true,
    customerId: 'inq-03',
  },
];

export const INITIAL_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-bali-01',
    title: 'Bali 5D4N Tropical Escape & Rice Terraces',
    destination: 'Bali, Indonesia',
    duration: '5 Days / 4 Nights',
    pricePerPerson: 749,
    currency: 'USD',
    image: '/src/assets/images/tour_bali_tropical_1792918136609.jpg',
    badge: 'Best Seller',
    highlights: ['Ubud Tegallalang Rice Terraces', 'Ulun Danu Water Temple', 'Nusa Penida Speedboat', 'Private Sunset Villa Dinner'],
    inclusions: ['4-Star Resort Stay', 'Daily Buffet Breakfast', 'Airport Private Transfers', 'English Speaking Guide', 'All Entry Passes'],
    totalSlots: 24,
    availableSlots: 7,
    nextDeparture: '2026-11-15',
  },
  {
    id: 'pkg-swiss-02',
    title: 'Swiss Alps Panorama & Glacier Express 7D6N',
    destination: 'Interlaken & Zermatt, Switzerland',
    duration: '7 Days / 6 Nights',
    pricePerPerson: 1890,
    currency: 'USD',
    image: '/src/assets/images/tour_swiss_alps_1792918136765.jpg',
    badge: 'Popular Group Tour',
    highlights: ['Jungfraujoch Top of Europe', 'Glacier Express Scenic Train', 'Matterhorn Viewpoint Zermatt', 'Lake Thun Steamer Cruise'],
    inclusions: ['Swiss Rail Pass 1st Class', 'Alpine Chalet Accommodations', 'Mountain Cable Car Tickets', 'Daily Gourmet Breakfast'],
    totalSlots: 18,
    availableSlots: 4,
    nextDeparture: '2026-12-05',
  },
  {
    id: 'pkg-dubai-03',
    title: 'Dubai Luxury Desert Safari & Skyline 5D4N',
    destination: 'Dubai & Abu Dhabi, UAE',
    duration: '5 Days / 4 Nights',
    pricePerPerson: 899,
    currency: 'USD',
    image: '/src/assets/images/tour_dubai_luxury_1792918136643.jpg',
    badge: 'Family Special',
    highlights: ['Burj Khalifa Level 124 VIP', 'Red Dunes Desert Camp & BBQ', 'Marina Luxury Dhow Yacht', 'Sheikh Zayed Grand Mosque'],
    inclusions: ['5-Star Downtown Hotel', 'Desert Safari 4x4 with Dinner', 'Luxury Transfers', 'Tourist Visa Processing'],
    totalSlots: 30,
    availableSlots: 11,
    nextDeparture: '2026-11-20',
  },
  {
    id: 'pkg-kyoto-04',
    title: 'Kyoto & Tokyo Blossom Heritage Tour 6D5N',
    destination: 'Kyoto & Tokyo, Japan',
    duration: '6 Days / 5 Nights',
    pricePerPerson: 1650,
    currency: 'USD',
    image: '/src/assets/images/tour_kyoto_japan_1792918137211.jpg',
    badge: 'Early Bird Deal',
    highlights: ['Fushimi Inari 10,000 Torii', 'Arashiyama Bamboo Forest', 'Shinkansen Bullet Train ride', 'Shibuya & Ginza Guided Walk'],
    inclusions: ['Traditional Ryokan + Onsen', 'Bullet Train JR Pass', 'Tea Ceremony Experience', 'Pocket Wi-Fi device'],
    totalSlots: 16,
    availableSlots: 3,
    nextDeparture: '2026-11-28',
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'VOY-8421',
    customerName: 'Marcus Sterling',
    customerPhone: '+1 (555) 349-8291',
    packageId: 'pkg-bali-01',
    packageName: 'Bali 5D4N Tropical Escape & Rice Terraces',
    departureDate: '2026-11-15',
    returnDate: '2026-11-19',
    paxCount: 2,
    totalPrice: 1498,
    paidAmount: 1498,
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
    hotelVoucherIssued: true,
    flightConfirmed: true,
    notes: 'Honeymoon couple, requested quiet pool villa and anniversary cake.',
  },
  {
    id: 'VOY-9902',
    customerName: 'Elena Rostova',
    customerPhone: '+44 7700 900143',
    packageId: 'pkg-swiss-02',
    packageName: 'Swiss Alps Panorama & Glacier Express 7D6N',
    departureDate: '2026-12-05',
    returnDate: '2026-12-11',
    paxCount: 3,
    totalPrice: 5670,
    paidAmount: 2000,
    paymentStatus: 'Partial',
    bookingStatus: 'Deposit Paid',
    hotelVoucherIssued: false,
    flightConfirmed: true,
    notes: 'Remaining balance due 14 days before departure.',
  },
  {
    id: 'VOY-3318',
    customerName: 'Dr. Tariq Al-Mansoor',
    customerPhone: '+971 50 123 4567',
    packageId: 'pkg-kyoto-04',
    packageName: 'Kyoto & Tokyo Blossom Heritage Tour 6D5N',
    departureDate: '2026-11-28',
    returnDate: '2026-12-03',
    paxCount: 4,
    totalPrice: 6600,
    paidAmount: 6600,
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
    hotelVoucherIssued: true,
    flightConfirmed: true,
    notes: 'Family with 2 teenagers, dietary: Halal meals requested.',
  },
];

export const INITIAL_TRIGGERS: AutoReplyTrigger[] = [
  {
    id: 'trg-01-packages',
    name: 'Tour Packages & Catalog',
    category: 'destinations',
    matchType: 'contains_any',
    keywords: ['package', 'packages', 'destinations', 'catalog', 'where can i go', 'tours', 'trips', 'options'],
    responseTemplate: `🌍 *Top Holiday Specials (2026 Season)* ✈️

Here are our top trending international tour packages:
1️⃣ *Bali 5D4N Tropical Escape* - From $749/pax
2️⃣ *Dubai Luxury & Desert Safari 5D4N* - From $899/pax
3️⃣ *Swiss Alps & Glacier Express 7D6N* - From $1,890/pax
4️⃣ *Kyoto & Tokyo Blossom 6D5N* - From $1,650/pax

Reply with *Bali*, *Dubai*, *Swiss*, or *Japan* to get full itinerary!`,
    includeQuickReplies: ['View Bali 5D4N', 'View Dubai Deal', 'View Swiss Alps', 'Talk to Specialist'],
    isActive: true,
    usageCount: 142,
  },
  {
    id: 'trg-02-bali',
    name: 'Bali Destination Details',
    category: 'destinations',
    matchType: 'contains_any',
    keywords: ['bali', 'ubud', 'indonesia', 'nusa penida', 'kuta'],
    responseTemplate: `🌴 *Bali 5D4N Tropical Escape & Rice Terraces* 🌺

💰 *Special Price:* $749/person
🗓 *Next Departure:* Nov 15, 2026 (7 slots remaining!)

✨ *What's included:*
• 4 Nights in luxury resort with private pool option
• Daily artisan buffet breakfast
• Tegallalang Terraces & Sacred Water Temple
• Nusa Penida Island VIP speedboat excursion
• Airport VIP meet & greet`,
    includePackageId: 'pkg-bali-01',
    includeQuickReplies: ['Reserve 2 Slots', 'Download PDF Brochure', 'Change Travel Dates'],
    isActive: true,
    usageCount: 89,
  },
  {
    id: 'trg-03-dubai',
    name: 'Dubai Luxury Getaway',
    category: 'destinations',
    matchType: 'contains_any',
    keywords: ['dubai', 'burj', 'abu dhabi', 'emirates', 'desert safari'],
    responseTemplate: `🏙️ *Dubai Luxury Desert Safari & Skyline 5D4N* 🐪

💰 *Special Price:* $899/person
🗓 *Next Departure:* Nov 20, 2026 (11 slots available)

✨ *Package Highlights:*
• 4-Star Downtown Hotel adjacent to Dubai Mall
• Red Dunes 4x4 Dune Bashing + Bedouin BBQ feast
• Burj Khalifa 124th Floor Observatory VIP tickets
• Complimentary UAE 30-Day Tourist Visa processing`,
    includePackageId: 'pkg-dubai-03',
    includeQuickReplies: ['Book Dubai Offer', 'Visa Requirements', 'Call Travel Agent'],
    isActive: true,
    usageCount: 64,
  },
  {
    id: 'trg-04-booking-lookup',
    name: 'Live Booking Status & PNR Check',
    category: 'bookings',
    matchType: 'contains_any',
    keywords: ['status', 'pnr', 'booking status', 'check booking', 'voy-', 'my booking', 'reservation'],
    responseTemplate: `🔍 *Real-Time Booking Verification*

Looking up your reservation in our central booking system... Please provide your booking reference code (e.g., *VOY-8421*) or registered mobile phone number.`,
    enableBookingLookup: true,
    includeQuickReplies: ['Status VOY-8421', 'Status VOY-9902', 'Download Hotel Voucher'],
    isActive: true,
    usageCount: 97,
  },
  {
    id: 'trg-05-agent',
    name: 'Human Agent Escalation',
    category: 'escalation',
    matchType: 'contains_any',
    keywords: ['agent', 'human', 'specialist', 'speak to someone', 'talk to person', 'call me', 'customer care'],
    responseTemplate: `👤 *Connecting you with a Senior Travel Specialist*

I have notified our on-duty travel counselor to step in! An agent will take over this WhatsApp chat shortly to assist with customized itineraries, corporate bookings, or special requests.`,
    pauseBotAfterTrigger: true,
    includeQuickReplies: ['Request Callback Now', 'Send Flight Request', 'Main Menu'],
    isActive: true,
    usageCount: 76,
  },
];

export const INITIAL_AFTER_HOURS_CONFIG: AfterHoursConfig = {
  timezone: 'America/New_York (UTC-4)',
  forceSimulateClosed: false,
  autoReplyText: `🌙 *Thank you for reaching out!*

Our travel consultation desk is currently closed for the evening. 

⏰ *Business Hours:* Mon - Sat, 09:00 AM – 06:30 PM EST
Our travel specialists will respond to your inquiry first thing tomorrow morning starting at 09:00 AM!

💡 *In the meantime, you can:*
• Reply *Packages* to browse our instant 2026 holiday brochure
• Reply *Status <PNR>* to check an active reservation
• Click below to request a prioritized morning callback.

🚨 *Flight or Airport Emergency?*
Call our 24/7 Duty Manager at: +1 (800) 555-8728`,
  emergencyPhone: '+1 (800) 555-8728',
  enableCallbackBooking: true,
  schedule: [
    { dayOfWeek: 0, dayName: 'Sunday', isOpen: false, openTime: '10:00', closeTime: '16:00' },
    { dayOfWeek: 1, dayName: 'Monday', isOpen: true, openTime: '09:00', closeTime: '18:30' },
    { dayOfWeek: 2, dayName: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '18:30' },
    { dayOfWeek: 3, dayName: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '18:30' },
    { dayOfWeek: 4, dayName: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '18:30' },
    { dayOfWeek: 5, dayName: 'Friday', isOpen: true, openTime: '09:00', closeTime: '18:30' },
    { dayOfWeek: 6, dayName: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '17:00' },
  ],
};

export const INITIAL_META_CAMPAIGNS: MetaAdCampaign[] = [
  {
    id: 'cmp-01-bali',
    campaignId: 'META-AD-FB-89104',
    name: 'Bali 5D4N Summer Promo - 20% OFF Early Bird',
    platform: 'Facebook',
    headline: 'Experience Bali Paradise: 5D4N Villas & Sacred Temples from $749',
    associatedPackageId: 'pkg-bali-01',
    promoCode: 'BALI20',
    discountPercentage: 20,
    clicksCount: 1480,
    leadsGenerated: 164,
    spendAmount: 420,
    status: 'Active',
    autoFollowUpEnabled: true,
    followUpDelaySeconds: 3,
    greetingMessage: `👋 Hi {customer_name}! Thanks for clicking our Facebook Ad for the *Bali 5D4N Tropical Escape*! 🌺`,
    offerMessage: `🎁 *Exclusive Ad Discount Unlocked:* Use code *BALI20* for 20% off resort upgrades or $100 instant cash credit per couple! 

Here is our complete day-by-day itinerary summary. Would you like to check available departure dates for November/December?`,
  },
  {
    id: 'cmp-02-swiss',
    campaignId: 'META-AD-IG-72311',
    name: 'Swiss Alps Winter Glacier Express - Instagram Reel Ad',
    platform: 'Instagram',
    headline: 'Snow-capped peaks & Glacier Express: Dream Swiss Holiday 7D6N',
    associatedPackageId: 'pkg-swiss-02',
    promoCode: 'ALPS15',
    discountPercentage: 15,
    clicksCount: 980,
    leadsGenerated: 92,
    spendAmount: 310,
    status: 'Active',
    autoFollowUpEnabled: true,
    followUpDelaySeconds: 3,
    greetingMessage: `🏔️ Welcome {customer_name}! We noticed you tapped our Instagram Reel on the *Swiss Alps Glacier Express*! 🚡`,
    offerMessage: `❄️ *Winter Special Deal:* We have 4 remaining panoramic coach seats for Dec 05 departure! Complimentary 1st Class Swiss Rail upgrades included with code *ALPS15*.`,
  },
  {
    id: 'cmp-03-dubai',
    campaignId: 'META-AD-FB-44910',
    name: 'Dubai Luxury Desert Safari & Burj Khalifa Ad',
    platform: 'Facebook',
    headline: '5-Star Dubai Vacation: Desert Safari, Luxury Yacht & Burj Khalifa',
    associatedPackageId: 'pkg-dubai-03',
    promoCode: 'DUBAI100',
    discountPercentage: 15,
    clicksCount: 1120,
    leadsGenerated: 118,
    spendAmount: 280,
    status: 'Active',
    autoFollowUpEnabled: true,
    followUpDelaySeconds: 4,
    greetingMessage: `✨ Hello {customer_name}! Thanks for checking out our Facebook Ad for *Dubai Luxury Getaways*! 🐪`,
    offerMessage: `🎉 Enjoy complimentary 30-Day UAE Tourist Visa processing + VIP Burj Khalifa top-deck access when booking this week!`,
  },
];

export const INITIAL_INQUIRIES: InquiryCustomer[] = [
  {
    id: 'inq-01',
    name: 'Sarah Jenkins',
    phone: '+1 (415) 892-4102',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    leadSource: 'Meta Ad',
    adCampaign: 'Bali 5D4N Summer Promo - 20% OFF Early Bird',
    adId: 'META-AD-FB-89104',
    targetDestination: 'Bali, Indonesia',
    travelDates: 'Nov 15 - Nov 20, 2026',
    durationDays: '5 Days',
    budgetRange: '$1,500 - $2,000 for 2',
    pax: 2,
    status: 'In Discussion',
    botStatus: 'Active',
    isAfterHours: false,
    lastMessageTime: '10:42 AM',
    unreadCount: 0,
    assignedAgent: 'David Miller',
    notes: 'Interested in private pool villa upgrade. Sent BALI20 coupon.',
    qualificationState: {
      currentQuestionIndex: 4,
      isCompleted: true,
      collectedData: {
        targetDestination: 'Bali, Indonesia',
        travelDates: 'Nov 15 - Nov 20, 2026',
        pax: 2,
        durationDays: '5 Days',
      },
    },
    messages: [
      {
        id: 'msg-s1',
        sender: 'customer',
        text: 'Hi, I saw your Facebook ad for Bali 5D4N! Can you share details and dates?',
        timestamp: '10:40 AM',
        status: 'read',
        adAttribution: {
          campaignName: 'Bali 5D4N Summer Promo',
          adId: 'META-AD-FB-89104',
        },
      },
      {
        id: 'msg-s2',
        sender: 'bot',
        text: `👋 Hi Sarah! Thanks for clicking our Facebook Ad for the *Bali 5D4N Tropical Escape*! 🌺

🎁 *Exclusive Ad Discount Unlocked:* Use code *BALI20* for 20% off resort upgrades or $100 instant cash credit per couple!

Here is our package overview:
• 4-Star Resort in Ubud & Seminyak
• Nusa Penida VIP Speedboat
• Sacred Water Temple & Private guide
• Price: $749/pax (Next Departure: Nov 15, 2026)`,
        timestamp: '10:40 AM',
        status: 'read',
        packageCard: INITIAL_PACKAGES[0],
        quickReplies: ['Check Nov 15 Availability', 'Request Pool Villa Upgrade', 'Download Itinerary PDF'],
      },
      {
        id: 'msg-s3',
        sender: 'customer',
        text: 'This looks gorgeous! We are 2 adults. Are the flights included from San Francisco?',
        timestamp: '10:42 AM',
        status: 'read',
      },
      {
        id: 'msg-s4',
        sender: 'bot',
        text: `✈️ The $749 rate is our all-inclusive ground tour package. We can bundle roundtrip flights from SFO (Singapore Airlines or Cathay Pacific) for approximately +$820/pax with luggage included!

Would you like me to connect you with our flight ticketing specialist to lock in airline seats?`,
        timestamp: '10:42 AM',
        status: 'delivered',
        quickReplies: ['Yes, Connect Agent', 'Show Ground Only Details', 'Other Dates'],
      },
    ],
  },
  {
    id: 'inq-02',
    name: 'Marcus Sterling',
    phone: '+1 (555) 349-8291',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    leadSource: 'WhatsApp Direct',
    targetDestination: 'Bali, Indonesia',
    travelDates: 'Nov 15 - Nov 19, 2026',
    durationDays: '5 Days',
    budgetRange: '$1,500',
    pax: 2,
    status: 'Booking Placed',
    botStatus: 'Active',
    isAfterHours: false,
    lastMessageTime: '09:15 AM',
    unreadCount: 0,
    assignedAgent: 'Jessica Wong',
    notes: 'Booking Confirmed: VOY-8421. Honeymoon couple.',
    bookingRef: 'VOY-8421',
    messages: [
      {
        id: 'msg-m1',
        sender: 'customer',
        text: 'Status VOY-8421',
        timestamp: '09:14 AM',
        status: 'read',
      },
      {
        id: 'msg-m2',
        sender: 'bot',
        text: `✅ *Booking Status: CONFIRMED* (Ref: *VOY-8421*)

👤 *Traveler:* Marcus Sterling (2 Guests)
🌴 *Package:* Bali 5D4N Tropical Escape & Rice Terraces
📅 *Travel Dates:* Nov 15 - Nov 19, 2026
🏨 *Hotel:* Ubud Hanging Gardens Resort & Spa (Pool Villa)
🎫 *Payment:* $1,498 (Fully Paid)
📄 *Vouchers:* Hotel Voucher & Flight E-Tickets are verified and ready!`,
        timestamp: '09:15 AM',
        status: 'read',
        bookingCard: INITIAL_BOOKINGS[0],
        quickReplies: ['Download Hotel Voucher', 'Airport Pickup Instructions', 'Modify Booking'],
      },
    ],
  },
  {
    id: 'inq-03',
    name: 'Jonathan Reynolds',
    phone: '+1 (702) 419-0092',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    leadSource: 'Facebook Feed',
    adCampaign: 'Dubai Luxury Desert Safari & Burj Khalifa Ad',
    adId: 'META-AD-FB-44910',
    targetDestination: 'Dubai, UAE',
    travelDates: 'Dec 2026',
    durationDays: '5 Days',
    budgetRange: '$3,500 for family',
    pax: 4,
    status: 'New Lead',
    botStatus: 'Active',
    isAfterHours: true,
    lastMessageTime: 'Yesterday, 11:15 PM',
    unreadCount: 1,
    assignedAgent: 'Unassigned',
    notes: 'Inquired late night after office hours. Follow-up priority!',
    messages: [
      {
        id: 'msg-j1',
        sender: 'customer',
        text: 'Saw the Dubai safari ad on FB. Can you send price for family of 4 in December?',
        timestamp: '11:14 PM',
        status: 'read',
        adAttribution: {
          campaignName: 'Dubai Luxury Desert Safari',
          adId: 'META-AD-FB-44910',
        },
      },
      {
        id: 'msg-j2',
        sender: 'bot',
        text: `🌙 *Thank you for reaching out!*

Our travel consultation desk is currently closed for the evening. 

⏰ *Business Hours:* Mon - Sat, 09:00 AM – 06:30 PM EST
Our travel specialists will respond to your inquiry first thing tomorrow morning starting at 09:00 AM!

💡 *In the meantime, your inquiry for the Dubai 5D4N Family Package is logged with special Ad Promo DUBAI100 applied.*`,
        timestamp: '11:15 PM',
        status: 'delivered',
        isAfterHoursReply: true,
        quickReplies: ['View Dubai Package PDF', 'Schedule 9AM Callback', 'Check December Dates'],
      },
    ],
  },
];

export const INITIAL_CRM_CONFIG: CRMWebhookConfig = {
  webhookUrl: 'https://script.google.com/macros/s/AKfycbz_voyage_crm_export/exec',
  authHeader: 'Bearer vyg_crm_key_secure_live',
  provider: 'Google Sheets',
  syncOnNewLead: true,
  syncOnBooking: true,
  syncOnAfterHours: true,
  lastSyncStatus: 'Success',
  lastSyncTimestamp: '2026-10-25 10:45 AM',
};
