import React, { useState, useRef, useEffect } from 'react';
import {
  TourPackage,
  Booking,
  AutoReplyTrigger,
  AfterHoursConfig,
  ChatMessage,
  InquiryCustomer,
} from '../../types/travel-bot';
import {
  evaluateCustomerMessage,
  isCurrentlyAfterHours,
} from '../../services/botEngine';
import {
  X,
  Send,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  ChevronRight,
  Sparkles,
  Bot,
  Compass,
} from 'lucide-react';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggers: AutoReplyTrigger[];
  packages: TourPackage[];
  bookings: Booking[];
  afterHoursConfig: AfterHoursConfig;
  onLeadGenerated?: (inquiry: InquiryCustomer) => void;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  isOpen,
  onClose,
  triggers,
  packages,
  bookings,
  afterHoursConfig,
  onLeadGenerated,
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sim-welcome',
      sender: 'bot',
      text: `👋 Welcome to *VoyageCraft Holiday Bot*! ✈️\n\nHow can we help you plan your dream vacation today?\n\n💡 *Try typing:* \n• "Bali package" \n• "Swiss alps" \n• "Price per person"\n• "Status VOY-8421"`,
      timestamp: 'Just now',
      status: 'read',
      quickReplies: ['Bali 5D4N', 'Dubai Safari', 'Check Booking Status', 'Talk to Human Agent'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `sim-user-${Date.now()}`,
      sender: 'customer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot processing delay (800ms)
    setTimeout(() => {
      const dummyCustomer: InquiryCustomer = {
        id: `sim-traveler-${Date.now()}`,
        name: 'Simulated Traveler',
        phone: '+1 (555) 728-1092',
        leadSource: 'WhatsApp Direct',
        status: 'New Lead',
        botStatus: 'Active',
        isAfterHours: isCurrentlyAfterHours(afterHoursConfig),
        lastMessageTime: 'Just now',
        unreadCount: 0,
        assignedAgent: 'Unassigned',
        notes: 'Lead created in live simulator test.',
        messages: [],
      };

      const result = evaluateCustomerMessage(
        text,
        dummyCustomer,
        triggers,
        packages,
        bookings,
        afterHoursConfig
      );

      if (result) {
        setMessages((prev) => [...prev, result.replyMessage]);
      }
      setIsTyping(false);
    }, 750);
  };

  const samplePrompts = [
    'Bali package',
    'Swiss alps',
    'Dubai family deal',
    'Status VOY-8421',
    'Do you assist with visa?',
    'I want to speak with human agent',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 rounded-3xl p-3 shadow-2xl border border-slate-700 flex flex-col max-h-[92vh]">
        {/* Phone Frame Speaker & Camera */}
        <div className="flex items-center justify-between px-6 pt-1 pb-2">
          <div className="text-[11px] font-mono text-slate-400">9:41</div>
          <div className="w-20 h-4 bg-slate-800 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp App Screen */}
        <div className="flex-1 bg-[#EFEAE2] rounded-2xl overflow-hidden flex flex-col min-h-0 border border-slate-700">
          {/* WhatsApp Header */}
          <div className="bg-[#008069] text-white px-3 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-xs text-white shrink-0">
                VC
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs truncate">VoyageCraft Travels</div>
                <div className="text-[10px] text-emerald-100 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                  <span>{isTyping ? 'typing...' : 'Business Account'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white/90">
              <Phone className="w-4 h-4" />
              <Video className="w-4 h-4" />
              <MoreVertical className="w-4 h-4" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
            {messages.map((m) => {
              const isCust = m.sender === 'customer';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isCust ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2 rounded-lg text-xs leading-relaxed shadow-xs ${
                      isCust
                        ? 'bg-[#E7FFDB] text-slate-900 rounded-tr-none'
                        : 'bg-white text-slate-900 rounded-tl-none border border-slate-200/60'
                    }`}
                  >
                    {!isCust && (
                      <div className="text-[10px] font-semibold text-emerald-800 mb-0.5 flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        <span>VoyageBot Auto-Reply</span>
                      </div>
                    )}

                    <div className="whitespace-pre-line">{m.text}</div>

                    {/* Attached Package Card */}
                    {m.packageCard && (
                      <div className="mt-2 bg-slate-50 rounded border border-slate-200 overflow-hidden">
                        <img
                          src={m.packageCard.image}
                          alt={m.packageCard.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2">
                          <div className="font-semibold text-[11px] text-slate-900 line-clamp-1">
                            {m.packageCard.title}
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                            <span className="font-mono font-bold text-emerald-700">
                              ${m.packageCard.pricePerPerson}
                            </span>
                            <span>{m.packageCard.duration}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Attached Booking Card */}
                    {m.bookingCard && (
                      <div className="mt-2 bg-emerald-50/70 rounded p-2 border border-emerald-300 text-[11px]">
                        <div className="font-bold text-emerald-900">
                          PNR: {m.bookingCard.id} · {m.bookingCard.bookingStatus}
                        </div>
                        <div className="text-[10px] text-slate-600 mt-1">
                          Traveler: {m.bookingCard.customerName} | Dep: {m.bookingCard.departureDate}
                        </div>
                      </div>
                    )}

                    <div className="text-[9px] text-slate-400 text-right mt-1 font-mono flex items-center justify-end gap-1">
                      <span>{m.timestamp}</span>
                      <CheckCheck className="w-3 h-3 text-sky-500" />
                    </div>
                  </div>

                  {/* Interactive Quick Replies */}
                  {m.quickReplies && m.quickReplies.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 max-w-[85%]">
                      {m.quickReplies.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(r)}
                          className="text-[11px] bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <span>{r}</span>
                          <ChevronRight className="w-2.5 h-2.5 text-emerald-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white text-slate-500 px-3 py-1.5 rounded-full text-xs w-28 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-200"></span>
                <span className="text-[10px] ml-1 font-mono">typing...</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick test prompts toolbar */}
          <div className="bg-slate-100 border-t border-slate-200 p-2 overflow-x-auto flex items-center gap-1.5 text-[11px] shrink-0">
            <span className="text-slate-500 shrink-0 font-medium">Test:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="bg-white hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] whitespace-nowrap shrink-0 border border-slate-200 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 border-t border-slate-200 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type message as customer..."
              className="flex-1 bg-white px-3 py-1.5 text-xs rounded-full border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 shadow-2xs"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="w-8 h-8 rounded-full bg-[#008069] text-white flex items-center justify-center hover:bg-emerald-700 disabled:bg-slate-300 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
