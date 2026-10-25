import React, { useState } from 'react';
import { FAQItem, AgencyProfile } from '../../types/travel-bot';
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Filter,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface FAQManagerProps {
  faqs: FAQItem[];
  onSaveFAQs: (faqs: FAQItem[]) => void;
  agencyProfile: AgencyProfile;
  onUpdateAgencyProfile: (updates: Partial<AgencyProfile>) => void;
}

export const FAQManager: React.FC<FAQManagerProps> = ({
  faqs,
  onSaveFAQs,
  agencyProfile,
  onUpdateAgencyProfile,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState<FAQItem['category']>('booking_payment');
  const [formKeywords, setFormKeywords] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);

  const categories: { key: FAQItem['category'] | 'all'; label: string }[] = [
    { key: 'all', label: 'All FAQs' },
    { key: 'booking_payment', label: 'Booking & Payment' },
    { key: 'visa_passport', label: 'Visa & Passport' },
    { key: 'flights_transfers', label: 'Flights & Transfers' },
    { key: 'inclusions_meals', label: 'Inclusions & Meals' },
    { key: 'insurance_safety', label: 'Insurance & Safety' },
    { key: 'custom_private', label: 'Custom & Private' },
  ];

  const handleToggleStrict = () => {
    onUpdateAgencyProfile({ strictFaqMode: !agencyProfile.strictFaqMode });
  };

  const handleToggleFaq = (id: string) => {
    const updated = faqs.map((f) => (f.id === id ? { ...f, isEnabled: !f.isEnabled } : f));
    onSaveFAQs(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ answer? The bot will no longer respond with it.')) {
      const updated = faqs.filter((f) => f.id !== id);
      onSaveFAQs(updated);
    }
  };

  const handleStartEdit = (item: FAQItem) => {
    setEditingFaq(item);
    setFormQuestion(item.question);
    setFormAnswer(item.answer);
    setFormCategory(item.category);
    setFormKeywords(item.keywords.join(', '));
    setFormEnabled(item.isEnabled);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setEditingFaq(null);
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('booking_payment');
    setFormKeywords('');
    setFormEnabled(true);
    setIsCreating(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) {
      alert('Please fill in both Question and Answer.');
      return;
    }

    const keywordList = formKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    if (editingFaq) {
      const updated = faqs.map((f) =>
        f.id === editingFaq.id
          ? {
              ...f,
              question: formQuestion.trim(),
              answer: formAnswer.trim(),
              category: formCategory,
              keywords: keywordList,
              isEnabled: formEnabled,
            }
          : f
      );
      onSaveFAQs(updated);
    } else {
      const newFaq: FAQItem = {
        id: `faq-${Date.now()}`,
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        category: formCategory,
        keywords: keywordList,
        isEnabled: formEnabled,
        hitCount: 0,
      };
      onSaveFAQs([newFaq, ...faqs]);
    }

    setEditingFaq(null);
    setIsCreating(false);
  };

  const filteredFaqs = faqs.filter((f) => {
    const q = search.toLowerCase();
    const matchesSearch =
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      f.keywords.some((k) => k.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Strict FAQ Mode Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Bot Knowledge Base & Travel FAQs
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                agencyProfile.strictFaqMode
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{agencyProfile.strictFaqMode ? 'Strict FAQ Mode: ACTIVE' : 'Standard Mode'}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure the verified answers your bot delivers to travelers. When Strict Mode is enabled, the bot answers strictly from your approved list.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Strict Mode Toggle */}
          <button
            onClick={handleToggleStrict}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs ${
              agencyProfile.strictFaqMode
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
            title="Toggle whether the bot is strictly restricted to your FAQ answers"
          >
            {agencyProfile.strictFaqMode ? (
              <>
                <ToggleRight className="w-5 h-5 text-white" />
                <span>Strict FAQ Active</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5 text-slate-400" />
                <span>Enable Strict FAQ</span>
              </>
            )}
          </button>

          <button
            onClick={handleStartCreate}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {/* Info Callout */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900">
        <BookOpen className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">How Bot Answers FAQs:</span>
          <p className="text-emerald-800 leading-relaxed">
            Whenever a customer inquires about payment terms, refund policy, visas, flights, meals, or baggage on WhatsApp, the bot searches your FAQ keywords and replies with your verified exact answer. If Strict Mode is on, it will never hallucinate or invent answers.
          </p>
        </div>
      </div>

      {/* Search & Category Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions, keywords, or answers..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No FAQs match your search. Click "Add New FAQ" to create one.
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`p-4 transition-colors hover:bg-slate-50/70 ${
                !faq.isEnabled ? 'opacity-60 bg-slate-50/30' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">
                      {faq.question}
                    </h3>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {faq.category.replace('_', ' ')}
                    </span>
                    {!faq.isEnabled && (
                      <span className="text-[10px] text-slate-400 font-mono">(Disabled)</span>
                    )}
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-2.5 rounded-md border border-slate-200/60 font-sans">
                    {faq.answer}
                  </div>

                  {/* Keywords */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-600">Trigger Keywords:</span>
                    {faq.keywords.map((k, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]"
                      >
                        {k}
                      </span>
                    ))}
                    <span className="mx-1">·</span>
                    <span className="font-mono tabular-nums text-emerald-700 font-semibold">
                      {faq.hitCount} bot answers sent
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button
                    onClick={() => handleToggleFaq(faq.id)}
                    className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title={faq.isEnabled ? 'Disable FAQ' : 'Enable FAQ'}
                  >
                    {faq.isEnabled ? (
                      <ToggleRight className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-400" />
                    )}
                  </button>

                  <button
                    onClick={() => handleStartEdit(faq)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer rounded hover:bg-slate-100"
                    title="Edit FAQ"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded hover:bg-slate-100"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit FAQ Modal */}
      {(isCreating || editingFaq) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingFaq ? 'Edit Travel FAQ' : 'Add New Customer FAQ'}
              </h3>
              <button
                onClick={() => {
                  setEditingFaq(null);
                  setIsCreating(false);
                }}
                className="text-slate-400 hover:text-slate-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Customer Question
                </label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. Can we customize departure dates or request private tours?"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as FAQItem['category'])}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-xs"
                >
                  <option value="booking_payment">Booking & Payment Confirmation</option>
                  <option value="visa_passport">Visa, Passport & Embassies</option>
                  <option value="flights_transfers">Flights & Airport Transfers</option>
                  <option value="inclusions_meals">Inclusions, Hotels & Dietary Meals</option>
                  <option value="insurance_safety">Insurance, Safety & Health</option>
                  <option value="custom_private">Custom Itineraries & Private Groups</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Trigger Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={formKeywords}
                  onChange={(e) => setFormKeywords(e.target.value)}
                  placeholder="e.g. customize, custom, private tour, flexible dates"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono text-[11px]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Bot searches for these words in customer messages to deliver this answer.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-slate-700">
                    Official Bot Answer (WhatsApp Formatted)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Use *bold*, emojis, and bullet points
                  </span>
                </div>
                <textarea
                  rows={5}
                  required
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Type the exact official response the WhatsApp bot will send..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-sans"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="faqEnabledCheck"
                  checked={formEnabled}
                  onChange={(e) => setFormEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="faqEnabledCheck" className="text-slate-800 font-medium">
                  Active (Allow bot to respond with this answer)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingFaq(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium shadow-xs cursor-pointer"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
