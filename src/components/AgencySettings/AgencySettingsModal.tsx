import React, { useState } from 'react';
import { AgencyProfile } from '../../types/travel-bot';
import {
  X,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  Bell,
  Smartphone,
  Save,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface AgencySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AgencyProfile;
  onSaveProfile: (profile: AgencyProfile) => void;
}

export const AgencySettingsModal: React.FC<AgencySettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<AgencyProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agencyName.trim()) return;

    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
              {formData.agencyName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Agency Profile & Admin Role
              </h3>
              <p className="text-[11px] text-slate-500">
                Customize your agency brand name, WhatsApp notification number, and bot rules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Agency Name */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Agency Name (Replaces "VoyageCraft Ops")
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                placeholder="e.g. Prince Travel & Tours / WanderLust Journeys"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              This name is shown in the left menu, WhatsApp greetings, bot signatures, and Excel files.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Agency Tagline / Slogan
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Luxury Vacations & Group Tour Specialists"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Admin WhatsApp Number */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Admin WhatsApp Number
              </label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-emerald-600" />
                <input
                  type="text"
                  required
                  value={formData.adminPhone}
                  onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                  placeholder="+1 (555) 789-2041"
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                For testing inquiries & receiving lead alerts.
              </p>
            </div>

            {/* Admin Email */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  placeholder="admin@youragency.com"
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Currency selection */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Primary Operating Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="USD">USD ($) - United States Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="AED">AED (د.إ) - UAE Dirham</option>
              <option value="AUD">AUD ($) - Australian Dollar</option>
              <option value="CAD">CAD ($) - Canadian Dollar</option>
            </select>
          </div>

          {/* Bot Notifications & Strict Mode Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <span className="font-semibold text-slate-900 block">
              Bot Notifications & Knowledge Rules
            </span>

            <label className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyOnBotResponse}
                onChange={(e) =>
                  setFormData({ ...formData, notifyOnBotResponse: e.target.checked })
                }
                className="rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
              />
              <div>
                <div className="font-semibold text-slate-800">
                  Notify Me Whenever Bot Responds
                </div>
                <div className="text-[11px] text-slate-500">
                  Sends an in-app alert banner & bell counter whenever a customer receives a bot reply or submits qualification details.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyOnWhatsApp}
                onChange={(e) =>
                  setFormData({ ...formData, notifyOnWhatsApp: e.target.checked })
                }
                className="rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
              />
              <div>
                <div className="font-semibold text-slate-800">
                  Forward Lead Alert to Admin WhatsApp ({formData.adminPhone})
                </div>
                <div className="text-[11px] text-slate-500">
                  Simulate forwarding copy of completed lead inquiries directly to your WhatsApp.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.strictFaqMode}
                onChange={(e) =>
                  setFormData({ ...formData, strictFaqMode: e.target.checked })
                }
                className="rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
              />
              <div>
                <div className="font-semibold text-emerald-900">
                  Strict FAQ Mode (Bot ONLY answers from your approved FAQ list)
                </div>
                <div className="text-[11px] text-emerald-800">
                  Restricts bot answers strictly to the travel FAQs configured by you.
                </div>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            {savedSuccess ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Agency profile updated!
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">
                Changes take effect across the entire app immediately.
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
