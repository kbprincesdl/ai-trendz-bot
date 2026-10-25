import React, { useState } from 'react';
import { AutoReplyTrigger, TourPackage, Booking, AfterHoursConfig, InquiryCustomer } from '../../types/travel-bot';
import { evaluateCustomerMessage } from '../../services/botEngine';
import { X, TestTube, CheckCircle, AlertTriangle, ArrowRight, Bot } from 'lucide-react';

interface TriggerTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggers: AutoReplyTrigger[];
  packages: TourPackage[];
  bookings: Booking[];
  afterHoursConfig: AfterHoursConfig;
}

export const TriggerTesterModal: React.FC<TriggerTesterModalProps> = ({
  isOpen,
  onClose,
  triggers,
  packages,
  bookings,
  afterHoursConfig,
}) => {
  if (!isOpen) return null;

  const [testText, setTestText] = useState('How much does the Bali package cost?');

  const dummyCustomer: InquiryCustomer = {
    id: 'test-traveler',
    name: 'Alex Johnson',
    phone: '+1 (555) 019-2831',
    leadSource: 'WhatsApp Direct',
    status: 'New Lead',
    botStatus: 'Active',
    isAfterHours: false,
    lastMessageTime: 'Now',
    unreadCount: 0,
    assignedAgent: 'Unassigned',
    notes: '',
    messages: [],
  };

  const evalResult = evaluateCustomerMessage(
    testText,
    dummyCustomer,
    triggers,
    packages,
    bookings,
    afterHoursConfig
  );

  const sampleInputs = [
    'How much does the Bali package cost?',
    'What tours do you offer for December?',
    'Status VOY-8421',
    'Status VOY-9999',
    'Do I need a visa for Switzerland?',
    'I want to speak with a human agent',
    'Can I cancel my tour?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Trigger Rule Simulator</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xs font-medium cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Sample Customer WhatsApp Message:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Type customer question here..."
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-xs"
              />
            </div>

            {/* Quick samples */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {sampleInputs.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestText(sample)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Test Result Display */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Trigger Match Result:</span>
              {evalResult?.matchedTrigger ? (
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Matched: {evalResult.matchedTrigger.name}
                </span>
              ) : evalResult?.replyMessage?.bookingCard ? (
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Live Booking Lookup Successful
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  Default Fallback Response
                </span>
              )}
            </div>

            {evalResult?.matchedTrigger && (
              <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                <span className="font-medium text-slate-800">Category:</span> {evalResult.matchedTrigger.category}
                <span className="mx-2">·</span>
                <span className="font-medium text-slate-800">Match Type:</span> {evalResult.matchedTrigger.matchType}
              </div>
            )}

            <div>
              <span className="text-[11px] font-medium text-slate-600 block mb-1">
                Generated WhatsApp Reply:
              </span>
              <div className="bg-[#D9FDD3] text-slate-900 p-2.5 rounded-md text-xs leading-relaxed whitespace-pre-line border border-emerald-200 font-sans shadow-2xs">
                {evalResult?.replyMessage.text}
              </div>
            </div>

            {evalResult?.replyMessage.quickReplies && (
              <div className="pt-1">
                <span className="text-[10px] text-slate-500 font-medium block mb-1">
                  Generated Quick Action Buttons:
                </span>
                <div className="flex flex-wrap gap-1">
                  {evalResult.replyMessage.quickReplies.map((r, i) => (
                    <span
                      key={i}
                      className="bg-white text-emerald-800 border border-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-medium"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Tester
          </button>
        </div>
      </div>
    </div>
  );
};
