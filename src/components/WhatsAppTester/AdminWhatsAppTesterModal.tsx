import React, { useState } from 'react';
import {
  TourPackage,
  Booking,
  AutoReplyTrigger,
  AfterHoursConfig,
  FAQItem,
  QualificationQuestion,
  AgencyProfile,
  InquiryCustomer,
  ChatMessage,
} from '../../types/travel-bot';
import { evaluateCustomerMessage, isCurrentlyAfterHours } from '../../services/botEngine';
import {
  X,
  Smartphone,
  Send,
  ExternalLink,
  CheckCheck,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Phone,
  ArrowRight,
} from 'lucide-react';

interface AdminWhatsAppTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyProfile: AgencyProfile;
  triggers: AutoReplyTrigger[];
  packages: TourPackage[];
  bookings: Booking[];
  afterHoursConfig: AfterHoursConfig;
  faqs: FAQItem[];
  questions: QualificationQuestion[];
  onAddAdminChatToInbox: (inquiry: InquiryCustomer) => void;
}

export const AdminWhatsAppTesterModal: React.FC<AdminWhatsAppTesterModalProps> = ({
  isOpen,
  onClose,
  agencyProfile,
  triggers,
  packages,
  bookings,
  afterHoursConfig,
  faqs,
  questions,
  onAddAdminChatToInbox,
}) => {
  if (!isOpen) return null;

  const [adminPhone, setAdminPhone] = useState(agencyProfile.adminPhone || '+1 (555) 789-2041');
  const [adminName, setAdminName] = useState('Agency Admin (You)');
  const [testText, setTestText] = useState('Hi, I am planning a holiday! Can you share details?');

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-test',
      sender: 'bot',
      text: `👋 Hello Admin! This test is connected to your WhatsApp number *${adminPhone}*.\n\nType any holiday inquiry, ask a travel FAQ, or check booking status to see how your bot responds!`,
      timestamp: 'Just now',
      status: 'read',
      quickReplies: ['Plan a 5-Day Vacation', 'Cancellation Policy', 'Status VOY-8421', 'Visa Requirements'],
    },
  ]);

  const [qualificationState, setQualificationState] = useState<{
    currentQuestionIndex: number;
    isCompleted: boolean;
    collectedData: Record<string, string>;
  }>({
    currentQuestionIndex: 0,
    isCompleted: false,
    collectedData: {},
  });

  const handleSendTestMessage = (overrideText?: string) => {
    const text = (overrideText || testText).trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `admin-msg-${Date.now()}`,
      sender: 'customer',
      text,
      timestamp: timeStr,
      status: 'read',
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setTestText('');

    // Simulate dummy customer representing Admin's phone number
    const dummyCust: InquiryCustomer = {
      id: `admin-inq-${Date.now()}`,
      name: adminName,
      phone: adminPhone,
      leadSource: 'WhatsApp Direct',
      status: 'New Lead',
      botStatus: 'Active',
      isAfterHours: isCurrentlyAfterHours(afterHoursConfig),
      lastMessageTime: timeStr,
      unreadCount: 0,
      assignedAgent: 'Admin Self-Test',
      notes: 'Direct test inquiry from admin WhatsApp number.',
      messages: [],
      qualificationState,
    };

    setTimeout(() => {
      const result = evaluateCustomerMessage(
        text,
        dummyCust,
        triggers,
        packages,
        bookings,
        afterHoursConfig,
        faqs,
        questions,
        agencyProfile
      );

      if (result) {
        setChatHistory((prev) => [...prev, result.replyMessage]);
        if (result.updatedCustomerFields?.qualificationState) {
          setQualificationState(result.updatedCustomerFields.qualificationState as any);
        }
      }
    }, 500);
  };

  const handleOpenLiveInbox = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newInquiry: InquiryCustomer = {
      id: `inq-admin-${Date.now()}`,
      name: `${adminName} (Test)`,
      phone: adminPhone,
      leadSource: 'WhatsApp Direct',
      targetDestination: qualificationState.collectedData.targetDestination || 'Bali / Swiss',
      travelDates: qualificationState.collectedData.travelDates || 'Nov 2026',
      pax: 2,
      durationDays: qualificationState.collectedData.durationDays || '5 Days',
      status: 'New Lead',
      botStatus: 'Active',
      isAfterHours: isCurrentlyAfterHours(afterHoursConfig),
      lastMessageTime: timeStr,
      unreadCount: 0,
      assignedAgent: 'Unassigned',
      notes: `Admin WhatsApp test thread. Connected to ${adminPhone}.`,
      messages: chatHistory,
      qualificationState,
    };

    onAddAdminChatToInbox(newInquiry);
    onClose();
  };

  const cleanPhoneForWa = adminPhone.replace(/\D/g, '');
  const realWaLink = `https://wa.me/${cleanPhoneForWa}?text=${encodeURIComponent(
    'Hi! I am testing the automated WhatsApp bot from my travel agency dashboard.'
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Direct WhatsApp Tester & Lead Questionnaire
              </h3>
              <p className="text-[11px] text-slate-500">
                Simulate inbound inquiries from your own WhatsApp number and watch the bot ask the travel questionnaire.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp Number Config Bar */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-700 shrink-0">Your WhatsApp Number:</span>
            <input
              type="text"
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
              placeholder="+1 (555) 789-2041"
              className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-mono font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 flex-1 max-w-xs"
            />
          </div>

          <a
            href={realWaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 justify-center shadow-xs transition-colors shrink-0"
            title="Open real WhatsApp app with pre-filled message"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Real WhatsApp</span>
          </a>
        </div>

        {/* Simulated WhatsApp Chat Window */}
        <div className="flex-1 bg-[#EFEAE2] rounded-xl overflow-hidden flex flex-col min-h-[320px] max-h-[380px] border border-slate-300">
          {/* WA Top Bar */}
          <div className="bg-[#008069] text-white px-3.5 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-xs text-white">
                {agencyProfile.agencyName.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-xs">{agencyProfile.agencyName}</div>
                <div className="text-[10px] text-emerald-100 font-mono">
                  Connected to {adminPhone}
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono">
              Strict FAQ: {agencyProfile.strictFaqMode ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
            {chatHistory.map((msg) => {
              const isCust = msg.sender === 'customer';
              return (
                <div key={msg.id} className={`flex flex-col ${isCust ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] p-2 rounded-lg text-xs leading-relaxed shadow-2xs ${
                      isCust
                        ? 'bg-[#D9FDD3] text-slate-900 rounded-tr-none'
                        : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    {!isCust && (
                      <div className="text-[10px] font-semibold text-emerald-800 mb-0.5 flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        <span>{agencyProfile.agencyName} Bot</span>
                        {msg.isFaqReply && <span className="text-blue-700">· FAQ Answer</span>}
                        {msg.isQuestionnaireStep && <span className="text-purple-700">· Questionnaire</span>}
                      </div>
                    )}
                    <div className="whitespace-pre-line">{msg.text}</div>

                    <div className="text-[9px] text-slate-400 text-right mt-1 font-mono flex items-center justify-end gap-1">
                      <span>{msg.timestamp}</span>
                      <CheckCheck className="w-3 h-3 text-sky-500" />
                    </div>
                  </div>

                  {/* Quick reply buttons */}
                  {msg.quickReplies && (
                    <div className="mt-1 flex flex-wrap gap-1 max-w-[85%]">
                      {msg.quickReplies.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendTestMessage(r)}
                          className="text-[10px] bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 border-t border-slate-200 shrink-0">
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTestMessage()}
              placeholder="Type message to test bot responses..."
              className="flex-1 bg-white px-3 py-1.5 text-xs rounded-full border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSendTestMessage()}
              disabled={!testText.trim()}
              className="w-8 h-8 rounded-full bg-[#008069] text-white flex items-center justify-center hover:bg-emerald-700 disabled:bg-slate-300 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200 text-xs">
          <div className="text-slate-500 text-[11px]">
            Answers test queries using your verified FAQs and asks your 4 qualification questions.
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={handleOpenLiveInbox}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Add This Test to Live Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
