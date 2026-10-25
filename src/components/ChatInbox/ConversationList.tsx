import React, { useState } from 'react';
import { InquiryCustomer } from '../../types/travel-bot';
import { Search, Megaphone, Smartphone, Moon, UserCheck, Bot } from 'lucide-react';

interface ConversationListProps {
  inquiries: InquiryCustomer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewInquiryClick: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  inquiries,
  selectedId,
  onSelect,
  onNewInquiryClick,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'meta' | 'after-hours' | 'agent' | 'bot'>('all');

  const filtered = inquiries.filter((inq) => {
    // Search matching
    const query = search.toLowerCase();
    const matchSearch =
      inq.name.toLowerCase().includes(query) ||
      inq.phone.toLowerCase().includes(query) ||
      (inq.targetDestination && inq.targetDestination.toLowerCase().includes(query)) ||
      (inq.adCampaign && inq.adCampaign.toLowerCase().includes(query));

    if (!matchSearch) return false;

    // Filter matching
    if (filter === 'meta') {
      return inq.leadSource === 'Meta Ad' || inq.leadSource === 'Facebook Feed' || inq.leadSource === 'Instagram Sponsored';
    }
    if (filter === 'after-hours') {
      return inq.isAfterHours;
    }
    if (filter === 'agent') {
      return inq.botStatus === 'Agent Handled';
    }
    if (filter === 'bot') {
      return inq.botStatus === 'Active';
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Header & Search */}
      <div className="p-3.5 border-b border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">
            Inquiries <span className="text-xs font-normal text-slate-500 tabular-nums">({filtered.length})</span>
          </div>
          <button
            onClick={onNewInquiryClick}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            + Simulate New Lead
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search traveler, phone, package..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-1 rounded whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('meta')}
            className={`px-2 py-1 rounded whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 cursor-pointer ${
              filter === 'meta' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Megaphone className="w-3 h-3 text-blue-500" />
            <span>Meta Ads</span>
          </button>
          <button
            onClick={() => setFilter('bot')}
            className={`px-2 py-1 rounded whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 cursor-pointer ${
              filter === 'bot' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-3 h-3 text-emerald-600" />
            <span>Bot Live</span>
          </button>
          <button
            onClick={() => setFilter('after-hours')}
            className={`px-2 py-1 rounded whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 cursor-pointer ${
              filter === 'after-hours' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Moon className="w-3 h-3 text-amber-500" />
            <span>After-Hours</span>
          </button>
          <button
            onClick={() => setFilter('agent')}
            className={`px-2 py-1 rounded whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 cursor-pointer ${
              filter === 'agent' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3 h-3 text-purple-600" />
            <span>Human Agent</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No inquiries match your criteria.
          </div>
        ) : (
          filtered.map((inq) => {
            const isSelected = inq.id === selectedId;
            const lastMsg = inq.messages[inq.messages.length - 1];

            return (
              <div
                key={inq.id}
                onClick={() => onSelect(inq.id)}
                className={`p-3 cursor-pointer transition-colors hover:bg-slate-50 ${
                  isSelected ? 'bg-emerald-50/60 border-l-2 border-emerald-600' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      {inq.avatar ? (
                        <img
                          src={inq.avatar}
                          alt={inq.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {inq.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      {inq.leadSource.includes('Meta') || inq.leadSource.includes('Facebook') || inq.leadSource.includes('Instagram') ? (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] shadow-xs" title="From Meta Ad">
                          f
                        </span>
                      ) : (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[9px] shadow-xs" title="WhatsApp Direct">
                          W
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {inq.name}
                        </span>
                        {inq.isAfterHours && (
                          <span title="After-Hours Lead">
                            <Moon className="w-3 h-3 text-amber-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        {inq.phone}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                      {inq.lastMessageTime}
                    </span>
                    {inq.unreadCount > 0 && (
                      <div className="mt-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-600 text-white rounded-full">
                          {inq.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtitle / preview */}
                <div className="mt-2 text-xs text-slate-600 line-clamp-1">
                  {lastMsg ? (
                    <span>
                      {lastMsg.sender === 'bot' && <span className="text-emerald-700 font-medium">Bot: </span>}
                      {lastMsg.sender === 'agent' && <span className="text-purple-700 font-medium">Agent: </span>}
                      {lastMsg.text}
                    </span>
                  ) : (
                    <span className="italic text-slate-400">No messages yet</span>
                  )}
                </div>

                {/* Metadata row without pills */}
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700 truncate max-w-[120px]">
                    {inq.targetDestination || 'General'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate max-w-[100px] text-slate-500">
                    {inq.leadSource}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      inq.botStatus === 'Active'
                        ? 'text-emerald-600 font-medium'
                        : 'text-purple-600 font-medium'
                    }
                  >
                    {inq.botStatus === 'Active' ? 'Bot Auto' : 'Agent Manual'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
