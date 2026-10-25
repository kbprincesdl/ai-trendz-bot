import React, { useState, useEffect } from 'react';
import {
  TourPackage,
  Booking,
  AutoReplyTrigger,
  AfterHoursConfig,
  MetaAdCampaign,
  CRMWebhookConfig,
  InquiryCustomer,
  ChatMessage,
  FAQItem,
  QualificationQuestion,
  AgencyProfile,
  AdminNotification,
} from './types/travel-bot';
import { StorageService } from './services/storageService';
import {
  evaluateCustomerMessage,
  isCurrentlyAfterHours,
} from './services/botEngine';
import { Sidebar, NavTab } from './components/Sidebar';
import { ConversationList } from './components/ChatInbox/ConversationList';
import { ChatWindow } from './components/ChatInbox/ChatWindow';
import { CustomerDrawer } from './components/ChatInbox/CustomerDrawer';
import { WhatsAppSimulatorModal } from './components/ChatInbox/WhatsAppSimulatorModal';
import { FAQManager } from './components/FAQ/FAQManager';
import { QuestionnaireManager } from './components/Questionnaire/QuestionnaireManager';
import { PackageManager } from './components/Packages/PackageManager';
import { MetaAdsManager } from './components/MetaAds/MetaAdsManager';
import { AfterHoursSettings } from './components/AfterHours/AfterHoursSettings';
import { BookingsDashboard } from './components/BookingSync/BookingsDashboard';
import { ExportCRMHub } from './components/ExportAndCRM/ExportCRMHub';
import { AgencySettingsModal } from './components/AgencySettings/AgencySettingsModal';
import { AdminWhatsAppTesterModal } from './components/WhatsAppTester/AdminWhatsAppTesterModal';
import { NotificationDrawer } from './components/Notifications/NotificationDrawer';
import {
  Menu,
  Bell,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  X,
  Bot,
} from 'lucide-react';

export default function App() {
  // Global Navigation & Profile States
  const [activeTab, setActiveTab] = useState<NavTab>('inbox');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Agency Profile (Editable by Admin)
  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile>(() =>
    StorageService.getAgencyProfile()
  );

  // FAQs (Bot knowledge base)
  const [faqs, setFaqs] = useState<FAQItem[]>(() => StorageService.getFAQs());

  // Qualification Questions (Dates, Persons, Travel date, Days)
  const [qualificationQuestions, setQualificationQuestions] = useState<QualificationQuestion[]>(() =>
    StorageService.getQualificationQuestions()
  );

  // Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>(() =>
    StorageService.getNotifications()
  );
  const [toastNotification, setToastNotification] = useState<AdminNotification | null>(null);

  // Packages, Bookings, Triggers, After-Hours, Meta Ads, Inquiries, CRM
  const [packages, setPackages] = useState<TourPackage[]>(() => StorageService.getPackages());
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getBookings());
  const [triggers, setTriggers] = useState<AutoReplyTrigger[]>(() => StorageService.getTriggers());
  const [afterHoursConfig, setAfterHoursConfig] = useState<AfterHoursConfig>(() =>
    StorageService.getAfterHoursConfig()
  );
  const [metaCampaigns, setMetaCampaigns] = useState<MetaAdCampaign[]>(() =>
    StorageService.getMetaCampaigns()
  );
  const [inquiries, setInquiries] = useState<InquiryCustomer[]>(() =>
    StorageService.getInquiries()
  );
  const [crmConfig, setCrmConfig] = useState<CRMWebhookConfig>(() =>
    StorageService.getCRMConfig()
  );

  // Active Inquiry Selection & Side Drawer
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    inquiries[0]?.id || null
  );
  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false);

  // Modals
  const [showAgencySettings, setShowAgencySettings] = useState(false);
  const [showWhatsAppTester, setShowWhatsAppTester] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showCustomerSimulator, setShowCustomerSimulator] = useState(false);

  // Persistence Handlers
  const handleSaveAgencyProfile = (newProfile: AgencyProfile | Partial<AgencyProfile>) => {
    const merged: AgencyProfile = { ...agencyProfile, ...newProfile };
    setAgencyProfile(merged);
    StorageService.saveAgencyProfile(merged);
  };

  const handleSaveFAQs = (newFaqs: FAQItem[]) => {
    setFaqs(newFaqs);
    StorageService.saveFAQs(newFaqs);
  };

  const handleSaveQuestions = (newQuestions: QualificationQuestion[]) => {
    setQualificationQuestions(newQuestions);
    StorageService.saveQualificationQuestions(newQuestions);
  };

  const handleSaveNotifications = (newNotifs: AdminNotification[]) => {
    setNotifications(newNotifs);
    StorageService.saveNotifications(newNotifs);
  };

  const handleSavePackages = (newPkgs: TourPackage[]) => {
    setPackages(newPkgs);
    StorageService.savePackages(newPkgs);
  };

  const handleSaveBookings = (newBkgs: Booking[]) => {
    setBookings(newBkgs);
    StorageService.saveBookings(newBkgs);
  };

  const handleSaveAfterHours = (newConfig: AfterHoursConfig) => {
    setAfterHoursConfig(newConfig);
    StorageService.saveAfterHoursConfig(newConfig);
  };

  const handleSaveMetaCampaigns = (newCamps: MetaAdCampaign[]) => {
    setMetaCampaigns(newCamps);
    StorageService.saveMetaCampaigns(newCamps);
  };

  const handleSaveInquiries = (newInqs: InquiryCustomer[]) => {
    setInquiries(newInqs);
    StorageService.saveInquiries(newInqs);
  };

  const handleSaveCRMConfig = (newCRM: CRMWebhookConfig) => {
    setCrmConfig(newCRM);
    StorageService.saveCRMConfig(newCRM);
  };

  const activeInquiry = inquiries.find((i) => i.id === selectedInquiryId) || inquiries[0];
  const isAfterHoursActive = isCurrentlyAfterHours(afterHoursConfig);
  const totalUnreadInquiries = inquiries.reduce((sum, inq) => sum + inq.unreadCount, 0);
  const totalUnreadNotifications = notifications.filter((n) => !n.isRead).length;

  // Add notification & show toast
  const triggerNotification = (notif: AdminNotification) => {
    const updated = [notif, ...notifications];
    handleSaveNotifications(updated);
    if (agencyProfile.notifyOnBotResponse) {
      setToastNotification(notif);
      setTimeout(() => setToastNotification(null), 4000);
    }
  };

  // Handle Sending a Message in the Chat Window
  const handleSendMessage = (text: string, senderRole: 'agent' | 'customer') => {
    if (!activeInquiry) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: senderRole,
      text,
      timestamp: timeStr,
      status: senderRole === 'customer' ? 'read' : 'delivered',
    };

    const updatedMessages = [...activeInquiry.messages, newMessage];

    let updatedInquiry: InquiryCustomer = {
      ...activeInquiry,
      messages: updatedMessages,
      lastMessageTime: timeStr,
      unreadCount: senderRole === 'customer' ? activeInquiry.unreadCount + 1 : 0,
    };

    // If sent by customer and bot is active, trigger bot engine auto-reply!
    if (senderRole === 'customer' && activeInquiry.botStatus === 'Active') {
      setTimeout(() => {
        const botResult = evaluateCustomerMessage(
          text,
          activeInquiry,
          triggers,
          packages,
          bookings,
          afterHoursConfig,
          faqs,
          qualificationQuestions,
          agencyProfile
        );

        if (botResult) {
          const withBotReply = [...updatedMessages, botResult.replyMessage];
          const finalInquiry: InquiryCustomer = {
            ...updatedInquiry,
            ...botResult.updatedCustomerFields,
            messages: withBotReply,
            isAfterHours: botResult.isAfterHours,
            botStatus: botResult.pauseBot ? 'Agent Handled' : updatedInquiry.botStatus,
          };

          const newInquiries = inquiries.map((inq) =>
            inq.id === activeInquiry.id ? finalInquiry : inq
          );
          handleSaveInquiries(newInquiries);

          // Trigger notification
          if (botResult.notification) {
            triggerNotification(botResult.notification);
          }
        }
      }, 700);
    }

    const newInquiries = inquiries.map((inq) =>
      inq.id === activeInquiry.id ? updatedInquiry : inq
    );
    handleSaveInquiries(newInquiries);
  };

  // Toggle Bot Status for active inquiry (Pause / Resume)
  const handleToggleBotStatus = (customerId: string) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === customerId) {
        const nextStatus: InquiryCustomer['botStatus'] =
          inq.botStatus === 'Active' ? 'Agent Handled' : 'Active';
        return { ...inq, botStatus: nextStatus };
      }
      return inq;
    });
    handleSaveInquiries(updated);
  };

  // Update specific customer fields from CRM drawer
  const handleUpdateCustomer = (customerId: string, updates: Partial<InquiryCustomer>) => {
    const updated = inquiries.map((inq) =>
      inq.id === customerId ? { ...inq, ...updates } : inq
    );
    handleSaveInquiries(updated);
  };

  // Create Booking from active lead
  const handleCreateBookingFromCustomer = (cust: InquiryCustomer) => {
    const pkg =
      packages.find((p) =>
        p.destination.toLowerCase().includes((cust.targetDestination || '').toLowerCase())
      ) || packages[0];

    const newPNR = `VOY-${Math.floor(2000 + Math.random() * 7000)}`;
    const newBooking: Booking = {
      id: newPNR,
      customerName: cust.name,
      customerPhone: cust.phone,
      packageId: pkg.id,
      packageName: pkg.title,
      departureDate: pkg.nextDeparture,
      returnDate: '2026-11-20',
      paxCount: cust.pax || 2,
      totalPrice: pkg.pricePerPerson * (cust.pax || 2),
      paidAmount: Math.floor(pkg.pricePerPerson * (cust.pax || 2) * 0.3),
      paymentStatus: 'Partial',
      bookingStatus: 'Deposit Paid',
      hotelVoucherIssued: false,
      flightConfirmed: true,
      notes: `Converted from lead ${cust.id}.`,
    };

    handleSaveBookings([newBooking, ...bookings]);
    handleUpdateCustomer(cust.id, {
      bookingRef: newPNR,
      status: 'Booking Placed',
      notes: `${cust.notes}\nConfirmed Booking PNR: ${newPNR}`,
    });

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const bookingMsg: ChatMessage = {
      id: `msg-bkg-${Date.now()}`,
      sender: 'agent',
      text: `🎉 Great news! Reservation for ${cust.name} has been confirmed under PNR *${newPNR}*. Deposit received!`,
      timestamp: timeStr,
      status: 'delivered',
      bookingCard: newBooking,
    };
    handleSendMessage(bookingMsg.text, 'agent');

    triggerNotification({
      id: `notif-${Date.now()}`,
      title: `New Reservation Booked: ${newPNR}`,
      message: `${cust.name} booked ${pkg.title} for ${cust.pax || 2} travelers.`,
      timestamp: timeStr,
      type: 'booking',
      isRead: false,
      customerId: cust.id,
    });
  };

  // Simulate Meta Ad Click Flow
  const handleSimulateMetaAdClick = (campaign: MetaAdCampaign) => {
    const matchedPkg = packages.find((p) => p.id === campaign.associatedPackageId) || packages[0];
    const newLeadId = `inq-meta-${Date.now()}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const customerMsg: ChatMessage = {
      id: `msg-meta-cust-${Date.now()}`,
      sender: 'customer',
      text: `Hi! I saw your ${campaign.platform} ad: "${campaign.headline}". Can you share available dates, prices, and brochure?`,
      timestamp: timeStr,
      status: 'read',
      adAttribution: {
        campaignName: campaign.name,
        adId: campaign.campaignId,
      },
    };

    const botGreetingMsg: ChatMessage = {
      id: `msg-meta-bot-1-${Date.now()}`,
      sender: 'bot',
      text: `${campaign.greetingMessage.replace('{customer_name}', 'Traveler')}\n\n${campaign.offerMessage}`,
      timestamp: timeStr,
      status: 'delivered',
      packageCard: matchedPkg,
      quickReplies: ['Check Nov/Dec Dates', 'Hold 2 Slots Now', 'Download Itinerary PDF'],
    };

    const newInquiry: InquiryCustomer = {
      id: newLeadId,
      name: `Ad Lead (${campaign.platform})`,
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      leadSource: 'Meta Ad',
      adCampaign: campaign.name,
      adId: campaign.campaignId,
      targetDestination: matchedPkg.destination,
      travelDates: 'November / December 2026',
      durationDays: '5 Days',
      budgetRange: `$${matchedPkg.pricePerPerson * 2}`,
      pax: 2,
      status: 'New Lead',
      botStatus: 'Active',
      isAfterHours: isCurrentlyAfterHours(afterHoursConfig),
      lastMessageTime: timeStr,
      unreadCount: 1,
      assignedAgent: 'David Miller',
      notes: `Captured via ${campaign.name}. Discount Code ${campaign.promoCode} offered.`,
      messages: [customerMsg, botGreetingMsg],
    };

    const updatedCampaigns = metaCampaigns.map((c) =>
      c.id === campaign.id
        ? { ...c, clicksCount: c.clicksCount + 1, leadsGenerated: c.leadsGenerated + 1 }
        : c
    );
    handleSaveMetaCampaigns(updatedCampaigns);

    const updatedInquiries = [newInquiry, ...inquiries];
    handleSaveInquiries(updatedInquiries);
    setSelectedInquiryId(newLeadId);
    setActiveTab('inbox');

    triggerNotification({
      id: `notif-${Date.now()}`,
      title: `Meta Ad Lead: ${campaign.name}`,
      message: `Inbound Click-to-WhatsApp message received and auto-followed up.`,
      timestamp: timeStr,
      type: 'lead',
      isRead: false,
      customerId: newLeadId,
    });
  };

  // Add Admin Test Inbound Chat to Inbox
  const handleAddAdminChatToInbox = (adminInq: InquiryCustomer) => {
    const updated = [adminInq, ...inquiries];
    handleSaveInquiries(updated);
    setSelectedInquiryId(adminInq.id);
    setActiveTab('inbox');
    triggerNotification({
      id: `notif-${Date.now()}`,
      title: `Admin WhatsApp Self-Test Logged`,
      message: `Test conversation for ${adminInq.phone} added to live inbox.`,
      timestamp: 'Just now',
      type: 'lead',
      isRead: false,
      customerId: adminInq.id,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 antialiased overflow-hidden">
      {/* LEFT MENU (Sidebar Navigation) - Replacing top headers as requested */}
      <div className={`${isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 flex' : 'hidden md:flex'}`}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
          agencyProfile={agencyProfile}
          onOpenAgencySettings={() => setShowAgencySettings(true)}
          onOpenWhatsAppTester={() => setShowWhatsAppTester(true)}
          onOpenNotifications={() => setShowNotificationDrawer(true)}
          unreadInquiriesCount={totalUnreadInquiries}
          unreadNotificationsCount={totalUnreadNotifications}
          isAfterHoursActive={isAfterHoursActive}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Top App Bar (Only visible on small mobile screens to open left menu) */}
        <header className="md:hidden bg-slate-900 text-white px-4 h-14 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-slate-300 hover:text-white rounded-md cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm tracking-tight truncate">
              {agencyProfile.agencyName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotificationDrawer(true)}
              className="p-1.5 text-slate-300 hover:text-white relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {totalUnreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setShowWhatsAppTester(true)}
              className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Test</span>
            </button>
          </div>
        </header>

        {/* In-App Toast Notification */}
        {toastNotification && (
          <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 max-w-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="font-bold text-emerald-400">{toastNotification.title}</div>
              <div className="text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                {toastNotification.message}
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab 1: Inquiries / Multi-Conversation Inbox */}
        {activeTab === 'inbox' && (
          <div className="flex-1 flex h-full overflow-hidden">
            {/* Conversation List */}
            <div className="w-full sm:w-80 md:w-96 shrink-0 h-full">
              <ConversationList
                inquiries={inquiries}
                selectedId={selectedInquiryId}
                onSelect={(id) => {
                  setSelectedInquiryId(id);
                  const updated = inquiries.map((i) =>
                    i.id === id ? { ...i, unreadCount: 0 } : i
                  );
                  handleSaveInquiries(updated);
                }}
                onNewInquiryClick={() => setShowWhatsAppTester(true)}
              />
            </div>

            {/* Middle: Active Chat Window */}
            {activeInquiry ? (
              <div className="hidden sm:flex flex-1 flex-col h-full border-r border-slate-200 min-w-0">
                <ChatWindow
                  customer={activeInquiry}
                  onSendMessage={handleSendMessage}
                  onToggleBotStatus={handleToggleBotStatus}
                  onQuickReplyClick={(reply) => handleSendMessage(reply, 'customer')}
                  onOpenCustomerInfo={() => setShowCustomerDrawer(!showCustomerDrawer)}
                  allPackages={packages}
                  allBookings={bookings}
                />
              </div>
            ) : (
              <div className="hidden sm:flex flex-1 items-center justify-center text-slate-400 text-xs">
                Select an inquiry from the list to view conversation.
              </div>
            )}

            {/* Right: Customer CRM Profile Drawer */}
            {showCustomerDrawer && activeInquiry && (
              <CustomerDrawer
                customer={activeInquiry}
                onClose={() => setShowCustomerDrawer(false)}
                onUpdateCustomer={handleUpdateCustomer}
                onCreateBookingClick={handleCreateBookingFromCustomer}
              />
            )}
          </div>
        )}

        {/* Tab 2: Bot Travel FAQs Knowledge Base */}
        {activeTab === 'faqs' && (
          <div className="flex-1 overflow-y-auto">
            <FAQManager
              faqs={faqs}
              onSaveFAQs={handleSaveFAQs}
              agencyProfile={agencyProfile}
              onUpdateAgencyProfile={handleSaveAgencyProfile}
            />
          </div>
        )}

        {/* Tab 3: Inquiry Qualification Questions */}
        {activeTab === 'questionnaire' && (
          <div className="flex-1 overflow-y-auto">
            <QuestionnaireManager
              questions={qualificationQuestions}
              onSaveQuestions={handleSaveQuestions}
              agencyName={agencyProfile.agencyName}
            />
          </div>
        )}

        {/* Tab 4: Packages & Destinations CRUD */}
        {activeTab === 'packages' && (
          <div className="flex-1 overflow-y-auto">
            <PackageManager
              packages={packages}
              onSavePackages={handleSavePackages}
            />
          </div>
        )}

        {/* Tab 5: Meta & Facebook Ads CTWA */}
        {activeTab === 'meta-ads' && (
          <div className="flex-1 overflow-y-auto">
            <MetaAdsManager
              campaigns={metaCampaigns}
              packages={packages}
              onSaveCampaigns={handleSaveMetaCampaigns}
              onSimulateAdClick={handleSimulateMetaAdClick}
            />
          </div>
        )}

        {/* Tab 6: After-Hours Rules & Night Mode */}
        {activeTab === 'after-hours' && (
          <div className="flex-1 overflow-y-auto">
            <AfterHoursSettings
              config={afterHoursConfig}
              onSaveConfig={handleSaveAfterHours}
              inquiries={inquiries}
              onSelectInquiry={(id) => {
                setSelectedInquiryId(id);
                setActiveTab('inbox');
              }}
            />
          </div>
        )}

        {/* Tab 7: Central Reservations & Bookings */}
        {activeTab === 'bookings' && (
          <div className="flex-1 overflow-y-auto">
            <BookingsDashboard
              bookings={bookings}
              packages={packages}
              onSaveBookings={handleSaveBookings}
              onSavePackages={handleSavePackages}
            />
          </div>
        )}

        {/* Tab 8: Excel & CRM Webhook Hub */}
        {activeTab === 'crm-export' && (
          <div className="flex-1 overflow-y-auto">
            <ExportCRMHub
              inquiries={inquiries}
              bookings={bookings}
              crmConfig={crmConfig}
              onSaveCRMConfig={handleSaveCRMConfig}
            />
          </div>
        )}
      </div>

      {/* Admin Role Agency Profile & Name Modal */}
      <AgencySettingsModal
        isOpen={showAgencySettings}
        onClose={() => setShowAgencySettings(false)}
        profile={agencyProfile}
        onSaveProfile={handleSaveAgencyProfile}
      />

      {/* Admin Direct WhatsApp Tester Modal */}
      <AdminWhatsAppTesterModal
        isOpen={showWhatsAppTester}
        onClose={() => setShowWhatsAppTester(false)}
        agencyProfile={agencyProfile}
        triggers={triggers}
        packages={packages}
        bookings={bookings}
        afterHoursConfig={afterHoursConfig}
        faqs={faqs}
        questions={qualificationQuestions}
        onAddAdminChatToInbox={handleAddAdminChatToInbox}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        notifications={notifications}
        agencyProfile={agencyProfile}
        onMarkAllAsRead={() => {
          const marked = notifications.map((n) => ({ ...n, isRead: true }));
          handleSaveNotifications(marked);
        }}
        onSelectNotificationInquiry={(customerId) => {
          if (customerId) {
            setSelectedInquiryId(customerId);
            setActiveTab('inbox');
          }
        }}
      />

      {/* Customer Mobile Phone Simulator Modal */}
      <WhatsAppSimulatorModal
        isOpen={showCustomerSimulator}
        onClose={() => setShowCustomerSimulator(false)}
        triggers={triggers}
        packages={packages}
        bookings={bookings}
        afterHoursConfig={afterHoursConfig}
      />
    </div>
  );
}
