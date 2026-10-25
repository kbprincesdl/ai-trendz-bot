import React from 'react';
import {
  MessageSquare,
  Zap,
  Clock,
  Megaphone,
  CalendarCheck,
  FileSpreadsheet,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export type NavTab = 'inbox' | 'triggers' | 'after-hours' | 'meta-ads' | 'bookings' | 'crm-export';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenSimulator: () => void;
  isAfterHoursActive: boolean;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSimulator,
  isAfterHoursActive,
  unreadCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand wordmark (single element) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
              V
            </div>
            <a
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                onTabChange('inbox');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-emerald-700 transition-colors"
            >
              VoyageCraft Ops
            </a>
            {isAfterHoursActive && (
              <span className="hidden sm:inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Night Mode Active
              </span>
            )}
          </div>

          {/* Zone 2: Navigation Links (Single-line, 1-2 words each) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onTabChange('inbox')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'inbox'
                  ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries</span>
              {unreadCount > 0 && (
                <span className="ml-1 text-[11px] font-mono px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('triggers')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'triggers'
                  ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Bot Triggers</span>
            </button>

            <button
              onClick={() => onTabChange('after-hours')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'after-hours'
                  ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>After-Hours</span>
            </button>

            <button
              onClick={() => onTabChange('meta-ads')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'meta-ads'
                  ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Meta Ads</span>
            </button>

            <button
              onClick={() => onTabChange('bookings')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'bookings'
                  ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Bookings</span>
            </button>

            <button
              onClick={() => onTabChange('crm-export')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                activeTab === 'crm-export'
                  ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel & CRM</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSimulator}
              className="px-3.5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Test WhatsApp Bot</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
