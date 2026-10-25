import React, { useState } from 'react';
import {
  AfterHoursConfig,
  BusinessHoursSchedule,
  InquiryCustomer,
} from '../../types/travel-bot';
import { isCurrentlyAfterHours } from '../../services/botEngine';
import {
  Clock,
  Moon,
  Sun,
  ShieldAlert,
  PhoneCall,
  Save,
  CheckCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Send,
  Calendar,
} from 'lucide-react';

interface AfterHoursSettingsProps {
  config: AfterHoursConfig;
  onSaveConfig: (config: AfterHoursConfig) => void;
  inquiries: InquiryCustomer[];
  onSelectInquiry: (id: string) => void;
}

export const AfterHoursSettings: React.FC<AfterHoursSettingsProps> = ({
  config,
  onSaveConfig,
  inquiries,
  onSelectInquiry,
}) => {
  const [formData, setFormData] = useState<AfterHoursConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isClosedNow = isCurrentlyAfterHours(formData);
  const afterHoursLeads = inquiries.filter((inq) => inq.isAfterHours);

  const handleToggleForceClosed = () => {
    const updated = { ...formData, forceSimulateClosed: !formData.forceSimulateClosed };
    setFormData(updated);
    onSaveConfig(updated);
  };

  const handleScheduleChange = (
    dayIndex: number,
    field: keyof BusinessHoursSchedule,
    value: any
  ) => {
    const newSchedule = formData.schedule.map((day, idx) =>
      idx === dayIndex ? { ...day, [field]: value } : day
    );
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              After-Hours Business Rules & Schedule
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                isClosedNow
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              {isClosedNow ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{isClosedNow ? 'Agency Currently CLOSED (After-Hours Active)' : 'Agency Currently OPEN'}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ensure customers inquiring outside operating hours receive instant professional responses, morning callback options, and emergency contact details.
          </p>
        </div>

        {/* Quick Simulator Override Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleForceClosed}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs ${
              formData.forceSimulateClosed
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            {formData.forceSimulateClosed ? (
              <>
                <ToggleRight className="w-5 h-5 text-white" />
                <span>Simulate Night Mode (Active)</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5 text-slate-400" />
                <span>Simulate Night Mode (Off)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Operating Hours & Auto-Reply (8 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-8 space-y-6">
          {/* Operating Hours Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Weekly Business Schedule</h3>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Agency Timezone: {formData.timezone}
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {formData.schedule.map((day, idx) => (
                <div key={day.dayOfWeek} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-32">
                    <input
                      type="checkbox"
                      id={`day-${idx}`}
                      checked={day.isOpen}
                      onChange={(e) => handleScheduleChange(idx, 'isOpen', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <label
                      htmlFor={`day-${idx}`}
                      className={`font-semibold cursor-pointer ${
                        day.isOpen ? 'text-slate-900' : 'text-slate-400 line-through'
                      }`}
                    >
                      {day.dayName}
                    </label>
                  </div>

                  {day.isOpen ? (
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>Opens:</span>
                      <input
                        type="time"
                        value={day.openTime}
                        onChange={(e) => handleScheduleChange(idx, 'openTime', e.target.value)}
                        className="p-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                      <span className="mx-1">to</span>
                      <span>Closes:</span>
                      <input
                        type="time"
                        value={day.closeTime}
                        onChange={(e) => handleScheduleChange(idx, 'closeTime', e.target.value)}
                        className="p-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Closed all day (Full After-Hours Bot Response)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* After-Hours Response Template */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  After-Hours Auto-Reply Message
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Sent within 2 seconds of customer inquiry
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                WhatsApp Message Content
              </label>
              <textarea
                rows={6}
                value={formData.autoReplyText}
                onChange={(e) => setFormData({ ...formData, autoReplyText: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed font-sans focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  24/7 Airport / Flight Emergency Hotline
                </label>
                <div className="relative">
                  <PhoneCall className="absolute left-2.5 top-2.5 w-4 h-4 text-rose-500" />
                  <input
                    type="text"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="callbackCheck"
                  checked={formData.enableCallbackBooking}
                  onChange={(e) =>
                    setFormData({ ...formData, enableCallbackBooking: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="callbackCheck" className="text-xs text-slate-800 font-medium">
                  Offer Morning Priority Callback button
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> After-hours configuration saved!
                </span>
              ) : (
                <span className="text-xs text-slate-400">
                  Settings update bot response rules in real-time.
                </span>
              )}

              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Schedule & Rules</span>
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Pending After-Hours Inquiries (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-xs text-slate-900">
                  After-Hours Queue ({afterHoursLeads.length})
                </h4>
              </div>
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                Morning Callback Needed
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Customers who contacted your agency outside business hours. Follow up first thing at 09:00 AM!
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto divide-y divide-slate-100">
              {afterHoursLeads.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No pending after-hours inquiries right now.
                </div>
              ) : (
                afterHoursLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onSelectInquiry(lead.id)}
                    className="pt-2 pb-1 hover:bg-slate-50 rounded p-1.5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{lead.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {lead.lastMessageTime}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 truncate mt-0.5">
                      Destination: <span className="font-medium text-slate-800">{lead.targetDestination || 'General'}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-mono">{lead.phone}</span>
                      <span className="text-emerald-700 font-medium">Open in Chat →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
