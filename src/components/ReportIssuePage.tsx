import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ActiveView, IssueReport } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface Props {
  setCurrentView: (v: ActiveView) => void;
  onSubmit: (report: Omit<IssueReport, 'id'>) => Promise<string | null>;
}

const ISSUE_TYPES: { value: IssueReport['type']; label: string }[] = [
  { value: 'order', label: 'Problem with an order' },
  { value: 'booking', label: 'Problem with a booking' },
  { value: 'payment', label: 'Payment issue' },
  { value: 'account', label: 'Account issue' },
  { value: 'technical', label: 'Technical / website bug' },
  { value: 'other', label: 'Other' },
];

export const ReportIssuePage: React.FC<Props> = ({ setCurrentView, onSubmit }) => {
  const { user } = useAuth();
  const [type, setType] = useState<IssueReport['type']>('order');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [relatedId, setRelatedId] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subject.trim() || !description.trim()) {
      setError('Please fill in both the subject and description.');
      return;
    }

    setSubmitting(true);
    try {
      const id = await onSubmit({
        userId: user?.uid,
        userEmail: email || user?.email || 'anonymous',
        type,
        subject: subject.trim(),
        description: description.trim(),
        relatedId: relatedId.trim() || undefined,
        status: 'open',
        createdAt: new Date().toISOString(),
      });
      if (id) setSubmitted(true);
      else setError('Something went wrong. Please try again.');
    } catch (err: any) {
      setError(err?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-3">
            Report Received
          </h1>
          <p className="text-stone-600 mb-8">
            Thank you — our support team will look into this and respond within 24–48 hours. You
            can also email us directly at <span className="font-semibold">support@supermall.mw</span>.
          </p>
          <button
            onClick={() => setCurrentView({ type: 'home' })}
            className="px-6 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-lg hover:bg-stone-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-amber-50 via-stone-50 to-white border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <button
            onClick={() => setCurrentView({ type: 'home' })}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-amber-700 mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Report an Issue</h1>
          <p className="mt-3 text-stone-600">
            Tell us what went wrong and we'll help sort it out.
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-2">
              What's the issue about?
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as IssueReport['type'])}
              className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/30"
            >
              {ISSUE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-2">
              Your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/30"
            />
            <p className="mt-1 text-xs text-stone-500">
              We'll use this to follow up with you.
            </p>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue"
              className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/30"
            />
          </div>

          {/* Related ID (optional) */}
          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-2">
              Order or booking ID <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={relatedId}
              onChange={(e) => setRelatedId(e.target.value)}
              placeholder="e.g. ord-12345 or biz-urban-cut"
              className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe what happened — the more detail, the better."
              className="w-full px-4 py-3 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/30 resize-none"
            />
          </div>

          {error && (
            <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-stone-900 text-white text-sm font-semibold rounded-lg hover:bg-stone-800 disabled:opacity-60 transition-colors"
          >
            {submitting ? 'Submitting…' : 'Submit Report'}
          </button>
        </form>
      </section>
    </div>
  );
};
