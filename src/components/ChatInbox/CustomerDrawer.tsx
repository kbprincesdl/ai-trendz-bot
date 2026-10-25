import React, { useState } from 'react';
import { InquiryCustomer, Booking } from '../../types/travel-bot';
import {
  X,
  User,
  Phone,
  Compass,
  Calendar,
  Users,
  DollarSign,
  Tag,
  Megaphone,
  Briefcase,
  FileCheck,
  CheckCircle,
  ExternalLink,
  Save,
} from 'lucide-react';

interface CustomerDrawerProps {
  customer: InquiryCustomer;
  onClose: () => void;
  onUpdateCustomer: (id: string, updates: Partial<InquiryCustomer>) => void;
  onCreateBookingClick: (customer: InquiryCustomer) => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  customer,
  onClose,
  onUpdateCustomer,
  onCreateBookingClick,
}) => {
  const [notes, setNotes] = useState(customer.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveNotes = () => {
    onUpdateCustomer(customer.id, { notes });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="w-80 sm:w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-900">Lead CRM & Profile</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Profile Card */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          {customer.avatar ? (
            <img
              src={customer.avatar}
              alt={customer.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              {customer.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-slate-900 truncate">{customer.name}</h4>
            <div className="text-slate-500 font-mono mt-0.5">{customer.phone}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Source: <span className="text-slate-700 font-medium">{customer.leadSource}</span>
            </div>
          </div>
        </div>

        {/* Meta Ads Campaign Attribution Box */}
        {(customer.adCampaign || customer.adId) && (
          <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
              <Megaphone className="w-3.5 h-3.5 text-blue-600" />
              <span>Meta Ads Tracking</span>
            </div>
            <div className="text-[11px] text-blue-800">
              <span className="font-medium">Campaign:</span> {customer.adCampaign}
            </div>
            {customer.adId && (
              <div className="text-[10px] text-blue-600 font-mono">
                Ad ID: {customer.adId}
              </div>
            )}
          </div>
        )}

        {/* Lead Status & Assignment */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Inquiry Status
            </label>
            <select
              value={customer.status}
              onChange={(e) =>
                onUpdateCustomer(customer.id, {
                  status: e.target.value as InquiryCustomer['status'],
                })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              <option value="New Lead">New Lead</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Quotation Sent">Quotation Sent</option>
              <option value="Booking Placed">Booking Placed</option>
              <option value="Cold">Cold / Follow-up later</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Assigned Travel Agent
            </label>
            <select
              value={customer.assignedAgent}
              onChange={(e) =>
                onUpdateCustomer(customer.id, { assignedAgent: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Unassigned">Unassigned (Round Robin)</option>
              <option value="David Miller">David Miller (Asia Lead)</option>
              <option value="Jessica Wong">Jessica Wong (Europe & Luxury)</option>
              <option value="Alex Rivera">Alex Rivera (Middle East & Visa)</option>
            </select>
          </div>
        </div>

        {/* Travel Intent Details */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="font-semibold text-slate-900 text-[11px]">Travel Preference</div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>Destination:</span>
            </span>
            <span className="font-medium text-slate-800">
              {customer.targetDestination || 'Flexible'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Dates:</span>
            </span>
            <span className="font-mono text-slate-800">
              {customer.travelDates || 'Not specified'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Travelers:</span>
            </span>
            <span className="font-mono text-slate-800">{customer.pax || 2} Pax</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Duration (Days):</span>
            </span>
            <span className="font-mono text-slate-800">{customer.durationDays || '5 Days'}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <span>Budget:</span>
            </span>
            <span className="font-mono text-slate-800">
              {customer.budgetRange || '$1,500 - $2,500'}
            </span>
          </div>
        </div>

        {/* Active Booking Reference */}
        {customer.bookingRef ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-900">Active Booking</span>
              <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                {customer.bookingRef}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-1">
              Linked to central booking system. Customer can query live status anytime via WhatsApp.
            </p>
          </div>
        ) : (
          <div className="pt-2">
            <button
              onClick={() => onCreateBookingClick(customer)}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Convert Lead to Booking</span>
            </button>
          </div>
        )}

        {/* Internal Notes */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900 text-[11px]">Internal Agent Notes</span>
            {savedSuccess && (
              <span className="text-emerald-600 text-[10px] font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Saved!
              </span>
            )}
          </div>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Log customer travel preferences, special meal requests, flight requirements..."
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={handleSaveNotes}
            className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
