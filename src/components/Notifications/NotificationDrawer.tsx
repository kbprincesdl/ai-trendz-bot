import React from 'react';
import { AdminNotification, AgencyProfile } from '../../types/travel-bot';
import {
  Bell,
  X,
  CheckCircle,
  Bot,
  User,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Check,
  Smartphone,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AdminNotification[];
  agencyProfile: AgencyProfile;
  onMarkAllAsRead: () => void;
  onSelectNotificationInquiry: (customerId?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  agencyProfile,
  onMarkAllAsRead,
  onSelectNotificationInquiry,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-emerald-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Bot Activity & Lead Alerts
              </h3>
              <div className="text-[11px] text-slate-500 font-mono">
                {unreadCount} new alerts
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WhatsApp Forwarding status banner */}
        <div className="bg-emerald-50 border-b border-emerald-100 p-3 text-xs text-emerald-900 flex items-center gap-2.5">
          <Smartphone className="w-4 h-4 text-emerald-700 shrink-0" />
          <div className="min-w-0">
            <span className="font-bold">Admin WhatsApp Forwarding:</span>
            <div className="text-[11px] text-emerald-800 truncate font-mono">
              Alerts synced to {agencyProfile.adminPhone}
            </div>
          </div>
        </div>

        {/* Notification Feed */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No recent notifications. When travelers chat with the bot, alerts will appear here.
            </div>
          ) : (
            notifications.map((notif) => {
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.customerId) {
                      onSelectNotificationInquiry(notif.customerId);
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-lg transition-colors cursor-pointer my-1 ${
                    !notif.isRead ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          notif.type === 'lead'
                            ? 'bg-blue-100 text-blue-700'
                            : notif.type === 'booking'
                            ? 'bg-emerald-100 text-emerald-700'
                            : notif.type === 'after_hours'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {notif.type === 'lead' ? (
                          <Sparkles className="w-3.5 h-3.5" />
                        ) : notif.type === 'booking' ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : notif.type === 'after_hours' ? (
                          <Clock className="w-3.5 h-3.5" />
                        ) : (
                          <Bot className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        {notif.title}
                      </h4>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono tabular-nums shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 pl-8 leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.customerId && (
                    <div className="mt-2 pl-8 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <MessageSquare className="w-3 h-3" />
                      <span>Click to view chat in Inbox →</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center">
          In-app alerts are updated in real-time as the bot engages with travelers.
        </div>
      </div>
    </div>
  );
};
