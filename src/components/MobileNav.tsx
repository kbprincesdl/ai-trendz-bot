import React from 'react';
import {
  MessageSquare,
  Zap,
  Clock,
  Megaphone,
  CalendarCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface MobileNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  unreadCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
      <button
        onClick={() => onTabChange('inbox')}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[54px] min-h-[44px] transition-colors ${
          activeTab === 'inbox' ? 'text-emerald-600 font-semibold' : 'text-slate-500'
        }`}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 text-[10px] font-mono px-1 bg-emerald-600 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Inbox</span>
      </button>

      <button
        onClick={() => onTabChange('triggers')}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[54px] min-h-[44px] transition-colors ${
          activeTab === 'triggers' ? 'text-emerald-600 font-semibold' : 'text-slate-500'
        }`}
      >
        <Zap className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Triggers</span>
      </button>

      <button
        onClick={() => onTabChange('after-hours')}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[54px] min-h-[44px] transition-colors ${
          activeTab === 'after-hours' ? 'text-emerald-600 font-semibold' : 'text-slate-500'
        }`}
      >
        <Clock className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">After-Hours</span>
      </button>

      <button
        onClick={() => onTabChange('meta-ads')}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[54px] min-h-[44px] transition-colors ${
          activeTab === 'meta-ads' ? 'text-emerald-600 font-semibold' : 'text-slate-500'
        }`}
      >
        <Megaphone className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Meta Ads</span>
      </button>

      <button
        onClick={() => onTabChange('bookings')}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[54px] min-h-[44px] transition-colors ${
          activeTab === 'bookings' ? 'text-emerald-600 font-semibold' : 'text-slate-500'
        }`}
      >
        <CalendarCheck className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Bookings</span>
      </button>

      <button
        onClick={() => onTabChange('crm-export')}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[54px] min-h-[44px] transition-colors ${
          activeTab === 'crm-export' ? 'text-emerald-600 font-semibold' : 'text-slate-500'
        }`}
      >
        <FileSpreadsheet className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">CRM/Excel</span>
      </button>
    </nav>
  );
};
