import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  Search, 
  Tag, 
  Star, 
  Quote, 
  Filter, 
  Download, 
  Sparkles,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { StudentQuote, FeedbackSubmission } from '../types';

interface FeedbackListViewProps {
  quotes: StudentQuote[];
  submissions: FeedbackSubmission[];
  onOpenNewFeedback: () => void;
}

export const FeedbackListView: React.FC<FeedbackListViewProps> = ({
  quotes,
  submissions,
  onOpenNewFeedback,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);

  // Combine static quotes with actual submissions
  const submissionQuotes: StudentQuote[] = submissions.map((sub) => ({
    id: sub.id,
    quote: `${sub.wellFeedback} ${sub.improveFeedback}`.trim(),
    author: sub.isAnonymous ? 'Anonymous Student' : sub.studentName || 'Student',
    course: `${sub.courseTitle} (${sub.courseCode})`,
    initials: sub.studentInitials || 'AS',
    colorClass: 'bg-indigo-600 text-white',
    avatarBg: 'bg-indigo-100',
    avatarText: 'text-indigo-700',
    date: sub.submittedAt,
    rating: sub.scores.overall,
    tags: [...sub.wellTags, ...sub.improveTags],
  }));

  const allQuotes = [...submissionQuotes, ...quotes];

  // All unique tags
  const allTags = Array.from(
    new Set(allQuotes.flatMap((q) => q.tags))
  );

  const filteredQuotes = allQuotes.filter((q) => {
    const matchesSearch =
      q.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || q.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleShareQuote = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedQuoteId(id);
    setTimeout(() => setCopiedQuoteId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold mb-2 border border-indigo-100">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            Qualitative Insights
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Student Feedback & Comments
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Student reviews, course suggestions, and teaching appreciation across all departments.
          </p>
        </div>

        <button
          onClick={onOpenNewFeedback}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" /> Share Feedback
        </button>
      </header>

      {/* Filter Chips Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords in student comments (e.g., lectures, assignments, pacing)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800"
          />
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3" /> Topics:
          </span>

          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedTag === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({allQuotes.length})
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Quote Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuotes.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              {/* Top rating & Course */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {q.course}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{typeof q.rating === 'number' ? q.rating.toFixed(1) : q.rating}</span>
                </div>
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                "{q.quote}"
              </p>

              {/* Tag badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {q.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-100">
                  {q.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{q.author}</p>
                  <p className="text-[10px] text-slate-400">{q.date}</p>
                </div>
              </div>

              <button
                onClick={() => handleShareQuote(q.id, q.quote)}
                className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1 font-semibold cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors"
                title="Copy Quote"
              >
                {copiedQuoteId === q.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
