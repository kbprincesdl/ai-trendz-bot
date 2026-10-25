import React, { useState } from 'react';
import { QualificationQuestion } from '../../types/travel-bot';
import {
  ListOrdered,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Check,
  Smartphone,
  Sparkles,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';

interface QuestionnaireManagerProps {
  questions: QualificationQuestion[];
  onSaveQuestions: (questions: QualificationQuestion[]) => void;
  agencyName: string;
}

export const QuestionnaireManager: React.FC<QuestionnaireManagerProps> = ({
  questions,
  onSaveQuestions,
  agencyName,
}) => {
  const [editingQuestion, setEditingQuestion] = useState<QualificationQuestion | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [formText, setFormText] = useState('');
  const [formHint, setFormHint] = useState('');
  const [formReplies, setFormReplies] = useState('');
  const [formRequired, setFormRequired] = useState(true);
  const [formFieldKey, setFormFieldKey] = useState<QualificationQuestion['fieldKey']>('custom');

  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedQuestions.length) return;

    const reordered = [...sortedQuestions];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Reassign order
    const updated = reordered.map((q, idx) => ({ ...q, order: idx + 1 }));
    onSaveQuestions(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this qualification question from the customer questionnaire?')) {
      const remaining = sortedQuestions.filter((q) => q.id !== id);
      const updated = remaining.map((q, idx) => ({ ...q, order: idx + 1 }));
      onSaveQuestions(updated);
    }
  };

  const handleStartEdit = (q: QualificationQuestion) => {
    setEditingQuestion(q);
    setFormText(q.questionText);
    setFormHint(q.hintText || '');
    setFormReplies((q.quickReplies || []).join(', '));
    setFormRequired(q.isRequired);
    setFormFieldKey(q.fieldKey);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setEditingQuestion(null);
    setFormText('');
    setFormHint('');
    setFormReplies('');
    setFormRequired(true);
    setFormFieldKey('custom');
    setIsCreating(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    const quickReplyList = formReplies
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    if (editingQuestion) {
      const updated = questions.map((q) =>
        q.id === editingQuestion.id
          ? {
              ...q,
              questionText: formText.trim(),
              hintText: formHint.trim() || undefined,
              quickReplies: quickReplyList.length ? quickReplyList : undefined,
              isRequired: formRequired,
              fieldKey: formFieldKey,
            }
          : q
      );
      onSaveQuestions(updated);
    } else {
      const newQ: QualificationQuestion = {
        id: `q-${Date.now()}`,
        fieldKey: formFieldKey,
        questionText: formText.trim(),
        hintText: formHint.trim() || undefined,
        quickReplies: quickReplyList.length ? quickReplyList : undefined,
        isRequired: formRequired,
        order: sortedQuestions.length + 1,
      };
      onSaveQuestions([...questions, newQ]);
    }

    setEditingQuestion(null);
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Inquiry Questionnaire Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            When a customer sends a vacation inquiry, the bot automatically asks this sequence of questions to collect Dates, Persons, Departure Time, and Duration.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Question</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Questions Configuration List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Bot Question Sequence ({sortedQuestions.length} Steps)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Auto-saves to customer CRM profile
              </span>
            </div>

            <div className="space-y-2.5">
              {sortedQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="font-semibold text-xs text-slate-900">
                        {q.questionText}
                      </div>

                      {q.hintText && (
                        <div className="text-[11px] text-slate-500 italic">
                          Hint: {q.hintText}
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 font-mono">
                        CRM Field: <span className="font-bold text-slate-700">{q.fieldKey}</span>
                        {q.isRequired && <span className="text-rose-500 ml-1.5">*Required</span>}
                      </div>

                      {q.quickReplies && q.quickReplies.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {q.quickReplies.map((r, rIdx) => (
                            <span
                              key={rIdx}
                              className="text-[10px] bg-white border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-full font-medium"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Move & Edit Actions */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === sortedQuestions.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleStartEdit(q)}
                      className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                      title="Edit question text"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Simulated WhatsApp Traveler Experience (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#EFEAE2] border border-slate-300 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300/60">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#008069]" />
                <h4 className="font-bold text-xs text-slate-900">
                  Customer WhatsApp Flow Preview
                </h4>
              </div>
              <span className="text-[10px] text-emerald-800 font-mono">Live Demo</span>
            </div>

            <div className="space-y-2.5 text-xs max-h-[460px] overflow-y-auto pr-1">
              <div className="bg-white p-2.5 rounded-lg rounded-tl-none shadow-2xs border border-slate-200">
                <div className="font-semibold text-emerald-800 text-[10px] mb-1">
                  VoyageBot · Step 1
                </div>
                <div>
                  👋 Hello Traveler! Welcome to <b>{agencyName}</b>!
                  <br /><br />
                  📋 <b>Step 1 of {sortedQuestions.length}:</b>
                  <br />
                  {sortedQuestions[0]?.questionText}
                </div>
                {sortedQuestions[0]?.quickReplies && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {sortedQuestions[0].quickReplies.slice(0, 3).map((r, i) => (
                      <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <div className="bg-[#D9FDD3] p-2 rounded-lg rounded-tr-none text-slate-900 max-w-[80%] shadow-2xs">
                  Bali 🌴
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg rounded-tl-none shadow-2xs border border-slate-200">
                <div className="font-semibold text-emerald-800 text-[10px] mb-1">
                  VoyageBot · Step 2
                </div>
                <div>
                  ✨ Got it! Saved: <b>Bali</b>
                  <br /><br />
                  📋 <b>Step 2 of {sortedQuestions.length}:</b>
                  <br />
                  {sortedQuestions[1]?.questionText}
                </div>
              </div>

              <div className="p-3 bg-white/80 rounded-lg border border-dashed border-emerald-400 text-center text-slate-600 text-[11px]">
                Customer continues through all {sortedQuestions.length} steps. Once done, an instant Lead Summary is sent and Admin is notified immediately!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {(isCreating || editingQuestion) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingQuestion ? 'Edit Qualification Question' : 'Add Custom Question'}
              </h3>
              <button
                onClick={() => {
                  setEditingQuestion(null);
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
                  Question Text Sent on WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="e.g. How many persons (adults & children) will be traveling?"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Example / Helper Hint Text
                </label>
                <input
                  type="text"
                  value={formHint}
                  onChange={(e) => setFormHint(e.target.value)}
                  placeholder="e.g. 2 adults, or 2 adults + 1 child"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Field Key to Store in Customer Profile
                </label>
                <select
                  value={formFieldKey}
                  onChange={(e) =>
                    setFormFieldKey(e.target.value as QualificationQuestion['fieldKey'])
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="targetDestination">targetDestination (Destination Country/City)</option>
                  <option value="travelDates">travelDates (Date or Month of Travel)</option>
                  <option value="pax">pax (Number of Persons)</option>
                  <option value="durationDays">durationDays (Number of Days)</option>
                  <option value="budgetPreference">budgetPreference (Budget Range)</option>
                  <option value="custom">custom (Internal Customer Note)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Interactive WhatsApp Buttons (Comma separated)
                </label>
                <input
                  type="text"
                  value={formReplies}
                  onChange={(e) => setFormReplies(e.target.value)}
                  placeholder="e.g. Solo (1), Couple (2), Family (3-4), Group (5+)"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuestion(null);
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
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
