import React from 'react';
import {
  MessageSquare,
  HelpCircle,
  ListOrdered,
  Compass,
  Megaphone,
  Clock,
  CalendarCheck,
  FileSpreadsheet,
  Settings,
  Bell,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { AgencyProfile, AdminNotification } from '../types/travel-bot';

export type NavTab =
  | 'inbox'
  | 'faqs'
  | 'questionnaire'
  | 'packages'
  | 'meta-ads'
  | 'after-hours'
  | 'bookings'
  | 'crm-export';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  agencyProfile: AgencyProfile;
  onOpenAgencySettings: () => void;
  onOpenWhatsAppTester: () => void;
  onOpenNotifications: () => void;
  unreadInquiriesCount: number;
  unreadNotificationsCount: number;
  isAfterHoursActive: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  agencyProfile,
  onOpenAgencySettings,
  onOpenWhatsAppTester,
  onOpenNotifications,
  unreadInquiriesCount,
  unreadNotificationsCount,
  isAfterHoursActive,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems: { tab: NavTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      tab: 'inbox',
      label: 'Inquiries Inbox',
      icon: <MessageSquare className="w-4 h-4 shrink-0" />,
      badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : undefined,
    },
    {
      tab: 'faqs',
      label: 'Bot Travel FAQs',
      icon: <HelpCircle className="w-4 h-4 shrink-0" />,
      badge: agencyProfile.strictFaqMode ? 'Strict' : undefined,
    },
    {
      tab: 'questionnaire',
      label: 'Inquiry Questions',
      icon: <ListOrdered className="w-4 h-4 shrink-0" />,
    },
    {
      tab: 'packages',
      label: 'Packages & Destinations',
      icon: <Compass className="w-4 h-4 shrink-0" />,
    },
    {
      tab: 'meta-ads',
      label: 'Meta & FB Ads',
      icon: <Megaphone className="w-4 h-4 shrink-0" />,
    },
    {
      tab: 'after-hours',
      label: 'After-Hours Rules',
      icon: <Clock className="w-4 h-4 shrink-0" />,
      badge: isAfterHoursActive ? 'Closed' : undefined,
    },
    {
      tab: 'bookings',
      label: 'Live Reservations',
      icon: <CalendarCheck className="w-4 h-4 shrink-0" />,
    },
    {
      tab: 'crm-export',
      label: 'Excel & CRM Export',
      icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Agency Brand Header */}
      <div className="h-16 px-3 flex items-center justify-between border-b border-slate-800">
        <div
          onClick={onOpenAgencySettings}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1 py-1"
          title="Click to edit Agency Name & Profile (Admin Role)"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs transition-colors">
            {agencyProfile.agencyName.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-white truncate tracking-tight group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                <span className="truncate">{agencyProfile.agencyName}</span>
                <Settings className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
              </div>
              <div className="text-[10px] text-slate-400 truncate font-mono">
                Admin Panel · {agencyProfile.currency}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer hidden md:block"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="shrink-0">{item.icon}</div>

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        typeof item.badge === 'number'
                          ? 'bg-emerald-700 text-white'
                          : item.badge === 'Closed'
                          ? 'bg-amber-900/80 text-amber-200 border border-amber-700'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Notification Bell & WhatsApp Live Tester Bar */}
      <div className="p-2 border-t border-slate-800 space-y-1.5">
        {/* Notifications button */}
        <button
          onClick={onOpenNotifications}
          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white relative`}
          title="Bot Response & Lead Notifications"
        >
          <div className="relative shrink-0">
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between text-left">
              <span>Notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="text-[10px] bg-rose-600 text-white font-mono px-1.5 py-0.2 rounded-full">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Test on my WhatsApp number */}
        <button
          onClick={onOpenWhatsAppTester}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors cursor-pointer shadow-xs`}
          title="Test bot on your WhatsApp number"
        >
          <Smartphone className="w-4 h-4 shrink-0 text-emerald-200" />
          {!isCollapsed && <span className="truncate">Test My WhatsApp</span>}
        </button>

        {/* Agency Settings button */}
        <button
          onClick={onOpenAgencySettings}
          className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Agency Settings (Admin Role)"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Agency Profile & Name</span>}
        </button>
      </div>
    </aside>
  );
};
