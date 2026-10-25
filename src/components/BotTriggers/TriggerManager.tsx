import React, { useState } from 'react';
import { AutoReplyTrigger, TourPackage } from '../../types/travel-bot';
import {
  Zap,
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TestTube,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface TriggerManagerProps {
  triggers: AutoReplyTrigger[];
  packages: TourPackage[];
  onSaveTriggers: (triggers: AutoReplyTrigger[]) => void;
  onOpenTestModal: () => void;
}

export const TriggerManager: React.FC<TriggerManagerProps> = ({
  triggers,
  packages,
  onSaveTriggers,
  onOpenTestModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingTrigger, setEditingTrigger] = useState<AutoReplyTrigger | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<AutoReplyTrigger['category']>('destinations');
  const [formMatchType, setFormMatchType] = useState<AutoReplyTrigger['matchType']>('contains_any');
  const [formKeywords, setFormKeywords] = useState('');
  const [formTemplate, setFormTemplate] = useState('');
  const [formPackageId, setFormPackageId] = useState<string>('');
  const [formQuickReplies, setFormQuickReplies] = useState('');
  const [formPauseBot, setFormPauseBot] = useState(false);

  const handleToggleActive = (id: string) => {
    const updated = triggers.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t));
    onSaveTriggers(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this auto-reply trigger?')) {
      const updated = triggers.filter((t) => t.id !== id);
      onSaveTriggers(updated);
    }
  };

  const handleStartEdit = (t: AutoReplyTrigger) => {
    setEditingTrigger(t);
    setFormName(t.name);
    setFormCategory(t.category);
    setFormMatchType(t.matchType);
    setFormKeywords(t.keywords.join(', '));
    setFormTemplate(t.responseTemplate);
    setFormPackageId(t.includePackageId || '');
    setFormQuickReplies((t.includeQuickReplies || []).join(', '));
    setFormPauseBot(!!t.pauseBotAfterTrigger);
    setIsCreatingNew(false);
  };

  const handleStartCreate = () => {
    setEditingTrigger(null);
    setFormName('');
    setFormCategory('destinations');
    setFormMatchType('contains_any');
    setFormKeywords('');
    setFormTemplate(`👋 Hello {customer_name}! Thank you for asking about our holiday packages...`);
    setFormPackageId('');
    setFormQuickReplies('View Details, Check Dates, Talk to Agent');
    setFormPauseBot(false);
    setIsCreatingNew(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formKeywords.trim() || !formTemplate.trim()) {
      alert('Please fill in trigger name, keywords, and response template.');
      return;
    }

    const keywordList = formKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const quickReplyList = formQuickReplies
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    if (editingTrigger) {
      // Update existing
      const updated = triggers.map((t) =>
        t.id === editingTrigger.id
          ? {
              ...t,
              name: formName.trim(),
              category: formCategory,
              matchType: formMatchType,
              keywords: keywordList,
              responseTemplate: formTemplate.trim(),
              includePackageId: formPackageId || undefined,
              includeQuickReplies: quickReplyList.length ? quickReplyList : undefined,
              pauseBotAfterTrigger: formPauseBot,
            }
          : t
      );
      onSaveTriggers(updated);
    } else {
      // Create new
      const newTrigger: AutoReplyTrigger = {
        id: `trg-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        matchType: formMatchType,
        keywords: keywordList,
        responseTemplate: formTemplate.trim(),
        includePackageId: formPackageId || undefined,
        includeQuickReplies: quickReplyList.length ? quickReplyList : undefined,
        pauseBotAfterTrigger: formPauseBot,
        isActive: true,
        usageCount: 0,
      };
      onSaveTriggers([newTrigger, ...triggers]);
    }

    setEditingTrigger(null);
    setIsCreatingNew(false);
  };

  const filteredTriggers = triggers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())) ||
      t.responseTemplate.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            WhatsApp Auto-Reply Triggers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated keyword triggers, instant pricing replies, package brochures, and human escalation rules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenTestModal}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <TestTube className="w-4 h-4 text-emerald-600" />
            <span>Test Trigger Rules</span>
          </button>

          <button
            onClick={handleStartCreate}
            className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Trigger</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search triggers by name, keyword, response..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {['all', 'destinations', 'pricing', 'bookings', 'faq', 'escalation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Triggers' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Triggers Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100">
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-3">Trigger & Category</div>
          <div className="col-span-3">Matching Keywords</div>
          <div className="col-span-3">Response & Attachment</div>
          <div className="col-span-1 text-center">Usage</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filteredTriggers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No triggers found matching your criteria. Click "Add New Trigger" to create one.
          </div>
        ) : (
          filteredTriggers.map((t) => (
            <div
              key={t.id}
              className={`p-4 transition-colors hover:bg-slate-50/80 ${
                !t.isActive ? 'opacity-60 bg-slate-50/30' : ''
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Column 1: Name & category */}
                <div className="col-span-1 md:col-span-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">{t.name}</span>
                    {!t.isActive && (
                      <span className="text-[10px] text-slate-400 font-mono">Paused</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="capitalize">{t.category}</span>
                    <span>·</span>
                    <span className="font-mono text-slate-400">{t.matchType}</span>
                  </div>
                </div>

                {/* Column 2: Keywords */}
                <div className="col-span-1 md:col-span-3 space-y-1">
                  <div className="text-xs text-slate-700 flex flex-wrap gap-1">
                    {t.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[11px]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Column 3: Response preview & attachments */}
                <div className="col-span-1 md:col-span-3 space-y-1 text-xs text-slate-600">
                  <p className="line-clamp-2 italic font-mono text-[11px]">
                    "{t.responseTemplate}"
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    {t.includePackageId && (
                      <span className="text-emerald-700 font-medium">
                        + Tour Card ({packages.find((p) => p.id === t.includePackageId)?.destination || 'Attached'})
                      </span>
                    )}
                    {t.pauseBotAfterTrigger && (
                      <span className="text-purple-700 font-medium">
                        · Pauses Bot for Human
                      </span>
                    )}
                  </div>
                </div>

                {/* Column 4: Usage */}
                <div className="col-span-1 md:col-span-1 flex md:justify-center items-center">
                  <span className="font-mono tabular-nums text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {t.usageCount} hits
                  </span>
                </div>

                {/* Column 5: Actions */}
                <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleToggleActive(t.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title={t.isActive ? 'Disable Trigger' : 'Enable Trigger'}
                  >
                    {t.isActive ? (
                      <ToggleRight className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-400" />
                    )}
                  </button>

                  <button
                    onClick={() => handleStartEdit(t)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Edit Trigger"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Trigger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {(isCreatingNew || editingTrigger) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingTrigger ? 'Edit Auto-Reply Trigger' : 'Add New Trigger Rule'}
              </h3>
              <button
                onClick={() => {
                  setEditingTrigger(null);
                  setIsCreatingNew(false);
                }}
                className="text-slate-400 hover:text-slate-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Trigger Rule Name
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Bali Package Inquiries"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as AutoReplyTrigger['category'])
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="destinations">Destinations & Tours</option>
                    <option value="pricing">Pricing & Quotes</option>
                    <option value="bookings">Booking Status & PNR</option>
                    <option value="faq">Visa & Policies FAQ</option>
                    <option value="escalation">Human Agent Escalation</option>
                    <option value="general">General Welcome</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Match Condition
                  </label>
                  <select
                    value={formMatchType}
                    onChange={(e) =>
                      setFormMatchType(e.target.value as AutoReplyTrigger['matchType'])
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="contains_any">Contains Any Keyword (Default)</option>
                    <option value="exact">Exact Message Match</option>
                    <option value="starts_with">Message Starts With</option>
                    <option value="regex">Regular Expression (Regex)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Attach Tour Package Card (Optional)
                  </label>
                  <select
                    value={formPackageId}
                    onChange={(e) => setFormPackageId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">None (Text Only)</option>
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (${p.pricePerPerson})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Trigger Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={formKeywords}
                  onChange={(e) => setFormKeywords(e.target.value)}
                  placeholder="e.g. bali, ubud, nusa penida, indonesia"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono text-[11px]"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  When a customer's WhatsApp message includes any of these words, this auto-reply fires.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-slate-700">
                    WhatsApp Response Template
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Supports *bold*, _italics_, and {`{customer_name}`}
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={formTemplate}
                  onChange={(e) => setFormTemplate(e.target.value)}
                  placeholder="Type WhatsApp auto-reply text..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Interactive Quick Reply Buttons (Comma separated)
                </label>
                <input
                  type="text"
                  value={formQuickReplies}
                  onChange={(e) => setFormQuickReplies(e.target.value)}
                  placeholder="e.g. View Itinerary, Check Dates, Book Slot"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-purple-50 border border-purple-200 rounded-md">
                <input
                  type="checkbox"
                  id="pauseBotCheck"
                  checked={formPauseBot}
                  onChange={(e) => setFormPauseBot(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="pauseBotCheck" className="text-purple-900 font-medium">
                  Pause Bot After Trigger (Escalate to Human Agent)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTrigger(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium shadow-xs cursor-pointer"
                >
                  Save Trigger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
