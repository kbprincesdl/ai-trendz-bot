import React, { useState, useRef, useEffect } from 'react';
import {
  InquiryCustomer,
  ChatMessage,
  TourPackage,
  Booking,
} from '../../types/travel-bot';
import {
  Send,
  Bot,
  User,
  PauseCircle,
  PlayCircle,
  Sparkles,
  CheckCheck,
  Check,
  Calendar,
  Clock,
  Phone,
  Tag,
  Paperclip,
  Info,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface ChatWindowProps {
  customer: InquiryCustomer;
  onSendMessage: (text: string, sender: 'agent' | 'customer') => void;
  onToggleBotStatus: (customerId: string) => void;
  onQuickReplyClick: (replyText: string) => void;
  onOpenCustomerInfo: () => void;
  allPackages: TourPackage[];
  allBookings: Booking[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  customer,
  onSendMessage,
  onToggleBotStatus,
  onQuickReplyClick,
  onOpenCustomerInfo,
  allPackages,
  allBookings,
}) => {
  const [inputText, setInputText] = useState('');
  const [senderRole, setSenderRole] = useState<'agent' | 'customer'>('agent');
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [customer.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), senderRole);
    setInputText('');
  };

  const cannedTemplates = [
    {
      title: 'Send Bali Itinerary',
      text: 'Here is our curated Bali 5D4N Itinerary brochure with luxury villa inclusions: https://voyagecraft.travel/brochures/bali-2026.pdf',
    },
    {
      title: 'Request Travel Dates & Pax',
      text: 'To generate your exact quotation, could you share your approximate travel dates and how many adults and children will be traveling?',
    },
    {
      title: 'Payment Link (Deposit)',
      text: 'You can secure your 2 reserved slots with a 30% refundable deposit here: https://pay.voyagecraft.travel/dep-nov26',
    },
    {
      title: 'Schengen Visa Checklist',
      text: 'We have compiled the complete Schengen visa checklist for Interlaken & Zermatt. Please have your 6-month valid passport and 3 months bank statements ready!',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#EFEAE2]">
      {/* Top Header */}
      <div className="bg-[#008069] text-white px-4 py-2.5 flex items-center justify-between shadow-xs z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                {customer.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                customer.botStatus === 'Active' ? 'bg-emerald-400' : 'bg-purple-400'
              }`}
              title={customer.botStatus === 'Active' ? 'Bot Auto-Reply Active' : 'Agent Manual Mode'}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">{customer.name}</span>
              {customer.adCampaign && (
                <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded truncate max-w-[150px]">
                  {customer.adCampaign}
                </span>
              )}
            </div>
            <div className="text-[11px] text-emerald-100 flex items-center gap-1.5 font-mono">
              <span>{customer.phone}</span>
              <span>·</span>
              <span>{customer.botStatus === 'Active' ? 'Auto-reply active' : 'Human agent active'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onToggleBotStatus(customer.id)}
            className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              customer.botStatus === 'Active'
                ? 'bg-emerald-800/80 hover:bg-emerald-900 text-emerald-100'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {customer.botStatus === 'Active' ? (
              <>
                <PauseCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pause Bot</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Resume Bot</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenCustomerInfo}
            className="p-1.5 hover:bg-white/10 rounded-full text-white transition-colors cursor-pointer"
            title="Customer Details & CRM Data"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* WhatsApp Chat Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* Security / Encryption Notice */}
        <div className="flex justify-center">
          <div className="bg-[#FFEECD] text-[#54656F] text-[11px] px-3 py-1 rounded-lg text-center max-w-sm shadow-xs border border-[#F3E2BD]">
            🔒 Messages with WhatsApp Business API are secured and synced in real-time with VoyageCraft Booking CRM.
          </div>
        </div>

        {/* Messages */}
        {customer.messages.map((msg) => {
          const isCustomer = msg.sender === 'customer';
          const isBot = msg.sender === 'bot';
          const isAgent = msg.sender === 'agent';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
            >
              {/* Attribution if from Meta Ad */}
              {msg.adAttribution && (
                <div className="mb-1 text-[11px] text-slate-500 flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded shadow-2xs">
                  <span className="font-medium text-blue-700">Meta Ad Click:</span>
                  <span>{msg.adAttribution.campaignName}</span>
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2.5 shadow-xs relative text-xs leading-relaxed ${
                  isCustomer
                    ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200/60'
                    : isBot
                    ? 'bg-[#D9FDD3] text-slate-900 rounded-tr-none'
                    : 'bg-[#E2F0FD] text-slate-900 rounded-tr-none border border-blue-200'
                }`}
              >
                {/* Sender badge if agent or bot */}
                {!isCustomer && (
                  <div className="text-[10px] font-semibold mb-1 flex items-center gap-1 text-slate-600">
                    {isBot ? (
                      <>
                        <Bot className="w-3 h-3 text-emerald-700" />
                        <span className="text-emerald-800">VoyageBot Auto-Reply</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 text-blue-700" />
                        <span className="text-blue-800">Travel Agent ({customer.assignedAgent})</span>
                      </>
                    )}
                    {msg.isAfterHoursReply && (
                      <span className="text-amber-700 ml-1 font-normal">· After-Hours Response</span>
                    )}
                  </div>
                )}

                {/* Text body with line breaks */}
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Package Card if attached */}
                {msg.packageCard && (
                  <div className="mt-2.5 bg-white rounded-md overflow-hidden border border-slate-200 shadow-xs">
                    <img
                      src={msg.packageCard.image}
                      alt={msg.packageCard.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2.5">
                      <div className="font-semibold text-xs text-slate-900 line-clamp-1">
                        {msg.packageCard.title}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-600">
                        <span className="font-mono font-medium text-emerald-700">
                          ${msg.packageCard.pricePerPerson} / pax
                        </span>
                        <span>{msg.packageCard.duration}</span>
                      </div>
                      <div className="mt-1.5 text-[10px] text-amber-700 font-mono">
                        🔥 Only {msg.packageCard.availableSlots} seats available for {msg.packageCard.nextDeparture}
                      </div>
                    </div>
                  </div>
                )}

                {/* Booking Status Card if attached */}
                {msg.bookingCard && (
                  <div className="mt-2.5 bg-white rounded-md p-2.5 border border-emerald-300 shadow-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <span className="text-[11px] font-bold text-slate-900">
                        PNR: {msg.bookingCard.id}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {msg.bookingCard.bookingStatus}
                      </span>
                    </div>
                    <div className="mt-1.5 space-y-1 text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="font-medium text-slate-800 truncate max-w-[150px]">
                          {msg.bookingCard.packageName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dates:</span>
                        <span className="font-mono text-slate-800">
                          {msg.bookingCard.departureDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment:</span>
                        <span className="font-mono text-emerald-700 font-medium">
                          ${msg.bookingCard.paidAmount} / ${msg.bookingCard.totalPrice} ({msg.bookingCard.paymentStatus})
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timestamp and ticks */}
                <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-500 font-mono tabular-nums">
                  <span>{msg.timestamp}</span>
                  {!isCustomer && (
                    <CheckCheck
                      className={`w-3.5 h-3.5 ${
                        msg.status === 'read' ? 'text-sky-500' : 'text-slate-400'
                      }`}
                    />
                  )}
                </div>
              </div>

              {/* Quick Action Chips (WhatsApp Native Interactive Buttons) */}
              {msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5 max-w-[85%] sm:max-w-[70%]">
                  {msg.quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => onQuickReplyClick(reply)}
                      className="text-xs bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-full font-medium transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      title="Click to simulate customer tapping this quick reply"
                    >
                      <span>{reply}</span>
                      <ChevronRight className="w-3 h-3 text-emerald-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Canned Templates Drawer / Popover */}
      {showTemplates && (
        <div className="bg-white border-t border-slate-200 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span>Canned Travel Responses</span>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cannedTemplates.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(tmpl.text);
                  setShowTemplates(false);
                }}
                className="text-left p-2 rounded-md bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 transition-colors cursor-pointer"
              >
                <div className="font-semibold text-slate-900">{tmpl.title}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{tmpl.text}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="bg-[#F0F2F5] p-3 border-t border-slate-200 shrink-0">
        <div className="flex items-center justify-between pb-2 text-[11px]">
          {/* Role Switcher */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-slate-200">
            <button
              type="button"
              onClick={() => setSenderRole('agent')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                senderRole === 'agent'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reply as Agent
            </button>
            <button
              type="button"
              onClick={() => setSenderRole('customer')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                senderRole === 'customer'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Test triggering the bot by sending a query as the customer!"
            >
              Simulate Customer Input
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quick Templates</span>
          </button>
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              senderRole === 'agent'
                ? 'Type manual agent response (or choose template)...'
                : 'Simulate customer message (e.g., "Bali package", "price", "status VOY-8421")...'
            }
            className="flex-1 bg-white px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-2xs"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-lg text-white transition-colors cursor-pointer shrink-0 ${
              inputText.trim()
                ? senderRole === 'agent'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
