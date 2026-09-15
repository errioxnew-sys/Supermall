import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  AlertCircle,
  FileText,
  HelpCircle,
  BookOpen,
  Truck,
  Flag,
  Loader2,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  AboutContent,
  FaqItem,
  HelpArticle,
  ShippingReturnsPolicy,
  IssueReport,
  ActiveView,
} from '../types/index.ts';
import {
  updateAbout,
  updateShippingReturns,
  addFaq,
  updateFaq,
  deleteFaq,
  addHelpArticle,
  updateHelpArticle,
  deleteHelpArticle,
  updateIssueReportStatus,
  subscribeIssueReports,
} from '../firebase/contentServices.ts';

// ============================================
// SHARED UI
// ============================================
const inputClass =
  'w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-500';
const textareaClass = inputClass + ' resize-y';

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <div>
    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {children}
    {hint && <p className="mt-1 text-[11px] text-stone-500">{hint}</p>}
  </div>
);

const Card: React.FC<{ title: string; action?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  action,
  children,
}) => (
  <section className="bg-white border border-stone-200 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 font-serif">
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);

const SaveBar: React.FC<{ saving: boolean; saved: boolean; onSave: () => void }> = ({
  saving,
  saved,
  onSave,
}) => (
  <div className="sticky bottom-4 z-30 flex justify-end pointer-events-none">
    <button
      onClick={onSave}
      disabled={saving}
      className="pointer-events-auto flex items-center gap-2 px-6 py-3 bg-amber-600 text-white text-sm font-semibold rounded-full shadow-xl hover:bg-amber-700 disabled:opacity-60 transition-colors"
    >
      {saving ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : saved ? (
        <Check className="w-4 h-4" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      <span>{saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}</span>
    </button>
  </div>
);

// ============================================
// CONSTANTS
// ============================================
type Section = 'about' | 'faqs' | 'help' | 'shipping' | 'issues';

const SECTIONS: { id: Section; label: string; icon: any }[] = [
  { id: 'about', label: 'About Page', icon: FileText },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'help', label: 'Help Articles', icon: BookOpen },
  { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
  { id: 'issues', label: 'Issue Reports', icon: Flag },
];

const ICON_OPTIONS = ['MapPin', 'ShieldCheck', 'Sparkles', 'Users', 'Heart', 'Star', 'Award', 'Globe'];
const FAQ_CATEGORIES: FaqItem['category'][] = ['general', 'buying', 'selling', 'account', 'payments'];
const HELP_CATEGORIES: HelpArticle['category'][] = [
  'getting-started',
  'buying',
  'selling',
  'account',
  'troubleshooting',
];

// ============================================
// MAIN
// ============================================
interface Props {
  aboutContent: AboutContent;
  faqs: FaqItem[];
  helpArticles: HelpArticle[];
  shippingReturns: ShippingReturnsPolicy;
  setCurrentView: (view: ActiveView) => void;
}

export const ContentEditor: React.FC<Props> = ({
  aboutContent,
  faqs,
  helpArticles,
  shippingReturns,
  setCurrentView,
}) => {
  const { isAdmin, isSuperuser } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('about');
  const [issueReports, setIssueReports] = useState<IssueReport[]>([]);

  useEffect(() => {
    const unsub = subscribeIssueReports(setIssueReports);
    return () => unsub();
  }, []);

  if (!isAdmin && !isSuperuser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">Access Denied</h1>
          <p className="text-stone-600 mb-6 text-sm">
            You need admin privileges to edit site content.
          </p>
          <button
            onClick={() => setCurrentView({ type: 'home' })}
            className="px-5 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-lg hover:bg-stone-800"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const openIssues = issueReports.filter((r) => r.status === 'open').length;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView({ type: 'admin', subTab: 'dashboard' })}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
              title="Back to Admin Panel"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-serif font-bold text-stone-900 leading-none">
                Content Editor
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mt-0.5">
                Public site content
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView({ type: 'home' })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
          >
            <Eye className="w-3.5 h-3.5" /> View Site
          </button>
        </div>

        {/* Section tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-100">
          <nav className="flex gap-1 overflow-x-auto">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-amber-600 text-amber-700'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.label}</span>
                  {s.id === 'issues' && openIssues > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-700 rounded-full">
                      {openIssues}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'about' && <AboutEditor content={aboutContent} />}
        {activeSection === 'faqs' && <FAQsEditor faqs={faqs} />}
        {activeSection === 'help' && <HelpEditor articles={helpArticles} />}
        {activeSection === 'shipping' && <ShippingEditor content={shippingReturns} />}
        {activeSection === 'issues' && <IssuesViewer reports={issueReports} />}
      </main>
    </div>
  );
};

// ============================================
// ABOUT EDITOR
// ============================================
const AboutEditor: React.FC<{ content: AboutContent }> = ({ content }) => {
  const [draft, setDraft] = useState<AboutContent>(content);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const update = <K extends keyof AboutContent>(key: K, value: AboutContent[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const updateValue = (i: number, patch: Partial<AboutContent['values'][number]>) =>
    setDraft((d) => ({
      ...d,
      values: d.values.map((v, idx) => (idx === i ? { ...v, ...patch } : v)),
    }));
  const addValue = () =>
    update('values', [
      ...draft.values,
      { title: 'New Value', description: 'Describe this value…', icon: 'Sparkles' },
    ]);
  const removeValue = (i: number) =>
    update('values', draft.values.filter((_, idx) => idx !== i));

  const updateStat = (i: number, patch: Partial<AboutContent['stats'][number]>) =>
    setDraft((d) => ({
      ...d,
      stats: d.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));
  const addStat = () => update('stats', [...draft.stats, { label: 'New Stat', value: '0' }]);
  const removeStat = (i: number) => update('stats', draft.stats.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAbout(draft);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Hero Section">
        <div className="space-y-4">
          <Field label="Hero Title">
            <input
              className={inputClass}
              value={draft.heroTitle}
              onChange={(e) => update('heroTitle', e.target.value)}
            />
          </Field>
          <Field label="Hero Subtitle">
            <textarea
              rows={3}
              className={textareaClass}
              value={draft.heroSubtitle}
              onChange={(e) => update('heroSubtitle', e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card title="Mission & Story">
        <div className="space-y-4">
          <Field label="Mission">
            <textarea
              rows={4}
              className={textareaClass}
              value={draft.mission}
              onChange={(e) => update('mission', e.target.value)}
            />
          </Field>
          <Field label="Story">
            <textarea
              rows={6}
              className={textareaClass}
              value={draft.story}
              onChange={(e) => update('story', e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Values"
        action={
          <button
            onClick={addValue}
            className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900"
          >
            <Plus className="w-3.5 h-3.5" /> Add Value
          </button>
        }
      >
        <div className="space-y-3">
          {draft.values.map((v, i) => (
            <div
              key={i}
              className="flex gap-2 items-start bg-stone-50 rounded-lg p-3 border border-stone-200"
            >
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    className={inputClass}
                    placeholder="Title"
                    value={v.title}
                    onChange={(e) => updateValue(i, { title: e.target.value })}
                  />
                  <select
                    className={inputClass}
                    value={v.icon}
                    onChange={(e) => updateValue(i, { icon: e.target.value })}
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows={2}
                  className={textareaClass}
                  placeholder="Description"
                  value={v.description}
                  onChange={(e) => updateValue(i, { description: e.target.value })}
                />
              </div>
              <button
                onClick={() => removeValue(i)}
                className="p-2 text-stone-400 hover:text-rose-600 hover:bg-white rounded"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Stats"
        action={
          <button
            onClick={addStat}
            className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900"
          >
            <Plus className="w-3.5 h-3.5" /> Add Stat
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {draft.stats.map((s, i) => (
            <div
              key={i}
              className="flex gap-2 items-center bg-stone-50 rounded-lg p-3 border border-stone-200"
            >
              <input
                className={inputClass + ' flex-1'}
                placeholder="Value (e.g. 500+)"
                value={s.value}
                onChange={(e) => updateStat(i, { value: e.target.value })}
              />
              <input
                className={inputClass + ' flex-1'}
                placeholder="Label"
                value={s.label}
                onChange={(e) => updateStat(i, { label: e.target.value })}
              />
              <button
                onClick={() => removeStat(i)}
                className="p-2 text-stone-400 hover:text-rose-600 hover:bg-white rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Contact Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email">
            <input
              className={inputClass}
              value={draft.contactEmail}
              onChange={(e) => update('contactEmail', e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              className={inputClass}
              value={draft.contactPhone}
              onChange={(e) => update('contactPhone', e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <SaveBar saving={saving} saved={savedMsg} onSave={handleSave} />
    </div>
  );
};

// ============================================
// FAQS EDITOR
// ============================================
const FAQsEditor: React.FC<{ faqs: FaqItem[] }> = ({ faqs }) => {
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const blank: FaqItem = {
    id: '',
    question: '',
    answer: '',
    category: 'general',
    order: faqs.length + 1,
  };

  const handleCreate = async (data: Partial<FaqItem>) => {
    await addFaq(data as Omit<FaqItem, 'id'>);
    setIsCreating(false);
  };
  const handleUpdate = async (id: string, data: Partial<FaqItem>) => {
    await updateFaq(id, data);
    setEditing(null);
  };
  const handleDelete = async (id: string) => {
    if (confirm('Delete this FAQ? This cannot be undone.')) await deleteFaq(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-600">
          {faqs.length} FAQ{faqs.length === 1 ? '' : 's'}
        </p>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700"
        >
          <Plus className="w-3.5 h-3.5" /> Add FAQ
        </button>
      </div>

      <div className="space-y-2">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="flex items-start gap-3 bg-white border border-stone-200 rounded-xl p-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700">
                  {faq.category}
                </span>
                <span className="text-[10px] text-stone-400">#{faq.order}</span>
              </div>
              <h3 className="text-sm font-semibold text-stone-900">{faq.question}</h3>
              <p className="text-xs text-stone-600 mt-1 line-clamp-2">{faq.answer}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setEditing(faq)}
                className="p-2 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(isCreating || editing) && (
        <FaqModal
          initial={editing || blank}
          isNew={isCreating}
          onClose={() => {
            setIsCreating(false);
            setEditing(null);
          }}
          onSave={(data) =>
            isCreating ? handleCreate(data) : handleUpdate(editing!.id, data)
          }
        />
      )}
    </div>
  );
};

const FaqModal: React.FC<{
  initial: FaqItem;
  isNew: boolean;
  onClose: () => void;
  onSave: (data: Partial<FaqItem>) => void | Promise<void>;
}> = ({ initial, isNew, onClose, onSave }) => {
  const [draft, setDraft] = useState<FaqItem>(initial);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!draft.question.trim() || !draft.answer.trim()) {
      alert('Question and answer are required.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        question: draft.question.trim(),
        answer: draft.answer.trim(),
        category: draft.category,
        order: Number(draft.order) || 0,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h3 className="font-serif font-bold text-stone-900">
            {isNew ? 'New FAQ' : 'Edit FAQ'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Question">
            <input
              className={inputClass}
              value={draft.question}
              onChange={(e) => setDraft({ ...draft, question: e.target.value })}
            />
          </Field>
          <Field label="Answer">
            <textarea
              rows={5}
              className={textareaClass}
              value={draft.answer}
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select
                className={inputClass}
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value as FaqItem['category'] })
                }
              >
                {FAQ_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Order">
              <input
                type="number"
                className={inputClass}
                value={draft.order}
                onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
              />
            </Field>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-stone-200 bg-stone-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : isNew ? 'Create FAQ' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// HELP ARTICLES EDITOR
// ============================================
const HelpEditor: React.FC<{ articles: HelpArticle[] }> = ({ articles }) => {
  const [editing, setEditing] = useState<HelpArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const blank: HelpArticle = {
    id: '',
    title: '',
    summary: '',
    content: '',
    category: 'getting-started',
    order: articles.length + 1,
  };

  const handleCreate = async (data: Partial<HelpArticle>) => {
    await addHelpArticle(data as Omit<HelpArticle, 'id'>);
    setIsCreating(false);
  };
  const handleUpdate = async (id: string, data: Partial<HelpArticle>) => {
    await updateHelpArticle(id, data);
    setEditing(null);
  };
  const handleDelete = async (id: string) => {
    if (confirm('Delete this article? This cannot be undone.')) await deleteHelpArticle(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-600">
          {articles.length} article{articles.length === 1 ? '' : 's'}
        </p>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700"
        >
          <Plus className="w-3.5 h-3.5" /> Add Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {articles.map((a) => (
          <div
            key={a.id}
            className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700">
                {a.category}
              </span>
              <span className="text-[10px] text-stone-400">#{a.order}</span>
            </div>
            <h3 className="text-sm font-semibold text-stone-900 mb-1">{a.title}</h3>
            <p className="text-xs text-stone-600 flex-1 line-clamp-3">{a.summary}</p>
            <div className="flex items-center gap-1 justify-end mt-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setEditing(a)}
                className="p-2 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(isCreating || editing) && (
        <HelpModal
          initial={editing || blank}
          isNew={isCreating}
          onClose={() => {
            setIsCreating(false);
            setEditing(null);
          }}
          onSave={(data) =>
            isCreating ? handleCreate(data) : handleUpdate(editing!.id, data)
          }
        />
      )}
    </div>
  );
};

const HelpModal: React.FC<{
  initial: HelpArticle;
  isNew: boolean;
  onClose: () => void;
  onSave: (data: Partial<HelpArticle>) => void | Promise<void>;
}> = ({ initial, isNew, onClose, onSave }) => {
  const [draft, setDraft] = useState<HelpArticle>(initial);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!draft.title.trim() || !draft.summary.trim() || !draft.content.trim()) {
      alert('Title, summary, and content are all required.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        title: draft.title.trim(),
        summary: draft.summary.trim(),
        content: draft.content,
        category: draft.category,
        order: Number(draft.order) || 0,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h3 className="font-serif font-bold text-stone-900">
            {isNew ? 'New Help Article' : 'Edit Help Article'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Title">
            <input
              className={inputClass}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </Field>
          <Field label="Summary" hint="One or two sentences shown on the card.">
            <textarea
              rows={2}
              className={textareaClass}
              value={draft.summary}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            />
          </Field>
          <Field label="Content" hint="Full article body. Line breaks are preserved.">
            <textarea
              rows={10}
              className={textareaClass}
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select
                className={inputClass}
                value={draft.category}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    category: e.target.value as HelpArticle['category'],
                  })
                }
              >
                {HELP_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Order">
              <input
                type="number"
                className={inputClass}
                value={draft.order}
                onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
              />
            </Field>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-stone-200 bg-stone-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : isNew ? 'Create Article' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SHIPPING & RETURNS EDITOR
// ============================================
const ShippingEditor: React.FC<{ content: ShippingReturnsPolicy }> = ({ content }) => {
  const [draft, setDraft] = useState<ShippingReturnsPolicy>(content);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const update = <K extends keyof ShippingReturnsPolicy>(
    key: K,
    value: ShippingReturnsPolicy[K]
  ) => setDraft((d) => ({ ...d, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateShippingReturns(draft);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Shipping & Delivery">
        <Field label="Section Title">
          <input
            className={inputClass}
            value={draft.shippingTitle}
            onChange={(e) => update('shippingTitle', e.target.value)}
          />
        </Field>
        <div className="mt-4">
          <Field label="Content">
            <textarea
              rows={10}
              className={textareaClass}
              value={draft.shippingContent}
              onChange={(e) => update('shippingContent', e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card title="Returns Policy">
        <Field label="Section Title">
          <input
            className={inputClass}
            value={draft.returnsTitle}
            onChange={(e) => update('returnsTitle', e.target.value)}
          />
        </Field>
        <div className="mt-4">
          <Field label="Content">
            <textarea
              rows={10}
              className={textareaClass}
              value={draft.returnsContent}
              onChange={(e) => update('returnsContent', e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card title="Refunds">
        <Field label="Section Title">
          <input
            className={inputClass}
            value={draft.refundsTitle}
            onChange={(e) => update('refundsTitle', e.target.value)}
          />
        </Field>
        <div className="mt-4">
          <Field label="Content">
            <textarea
              rows={8}
              className={textareaClass}
              value={draft.refundsContent}
              onChange={(e) => update('refundsContent', e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <SaveBar saving={saving} saved={savedMsg} onSave={handleSave} />
    </div>
  );
};

// ============================================
// ISSUE REPORTS VIEWER
// ============================================
const IssuesViewer: React.FC<{ reports: IssueReport[] }> = ({ reports }) => {
  const [filter, setFilter] = useState<IssueReport['status'] | 'all'>('all');

  const sorted = [...reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const filtered = sorted.filter((r) => (filter === 'all' ? true : r.status === filter));

  const handleStatusChange = async (id: string, status: IssueReport['status']) => {
    await updateIssueReportStatus(id, status);
  };

  const STATUS_COLORS: Record<IssueReport['status'], string> = {
    open: 'bg-rose-100 text-rose-700',
    in_progress: 'bg-amber-100 text-amber-800',
    resolved: 'bg-emerald-100 text-emerald-700',
    closed: 'bg-stone-100 text-stone-600',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
              filter === s
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
            {s === 'all' && ` (${reports.length})`}
            {s !== 'all' && ` (${reports.filter((r) => r.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl">
          <Flag className="w-10 h-10 mx-auto text-stone-300 mb-3" />
          <p className="text-sm text-stone-500">No issue reports in this view.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    {r.type}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status]}`}
                  >
                    {r.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                </div>
                <select
                  value={r.status}
                  onChange={(e) =>
                    handleStatusChange(r.id, e.target.value as IssueReport['status'])
                  }
                  className="text-xs px-2 py-1 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <h3 className="font-semibold text-stone-900 text-sm">{r.subject}</h3>
                <p className="text-xs text-stone-600 mt-1 whitespace-pre-line">{r.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                <div>
                  <span className="font-semibold text-stone-700">From: </span>
                  {r.userEmail || 'anonymous'}
                </div>
                {r.relatedId && (
                  <div>
                    <span className="font-semibold text-stone-700">Related ID: </span>
                    <span className="font-mono">{r.relatedId}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
