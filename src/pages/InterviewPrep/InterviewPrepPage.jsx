import React, { useState, useEffect } from 'react';
import { Video, HelpCircle, Sparkles, Filter, Play, CheckCircle2, Award, Clock, X, Mic, Send } from 'lucide-react';
import InterviewCard from '../../components/InterviewCard/InterviewCard';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { getInterviewPrep } from '../../services/api';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';

export const InterviewPrepPage = () => {
  const [prepData, setPrepData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMockModal, setActiveMockModal] = useState(null);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [mockFeedback, setMockFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getInterviewPrep();
        setPrepData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStartPractice = (question) => {
    setActiveMockModal(question);
    setUserAnswerText('');
    setMockFeedback(null);
  };

  const handleEvaluateAnswer = (e) => {
    e.preventDefault();
    if (!userAnswerText.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setMockFeedback({
        score: "4.7 / 5.0",
        strengths: ["Great technical precision regarding context window optimization", "Clearly explained SSE streaming vs polling"],
        improvements: ["Quantify latency impact with exact millisecond benchmarks"],
        verdict: "Strong Hire Recommendation for Senior AI Role"
      });
      toast.success("AI Twin feedback generated!");
    }, 1200);
  };

  if (loading) {
    return <SpinnerLoader size="lg" text="Loading AI Interview Question Bank..." />;
  }

  const filteredQuestions = prepData.questions.filter((q) => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Mock Interviewer & Question Bank
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulate live enterprise technical interviews with instant AI feedback & model answers.
          </p>
        </div>
        <PrimaryButton icon={Play} onClick={() => handleStartPractice(prepData.questions[0])} className="py-2.5 px-6 shadow-glow">
          Start Full AI Mock Interview
        </PrimaryButton>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Readiness Score</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{prepData.readinessScore}%</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Completed Mocks</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{prepData.completedMocks} Sessions</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Avg AI Rating</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{prepData.avgFeedbackRating}</h3>
          </div>
        </GlassCard>
      </div>

      {/* Track Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === 'all'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          All Questions ({prepData.questions.length})
        </button>
        {prepData.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredQuestions.map((q) => (
          <InterviewCard
            key={q.id}
            questionItem={q}
            onStartPractice={handleStartPractice}
          />
        ))}
      </div>

      {/* Interactive Mock Interview Modal */}
      {activeMockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-brand-500/30 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-500 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Mock Interview Room</h3>
              </div>
              <button
                onClick={() => setActiveMockModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interviewer Prompt */}
            <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Twin Interviewer Prompt
              </span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                "{activeMockModal.question}"
              </p>
            </div>

            {/* Answer Box */}
            <form onSubmit={handleEvaluateAnswer} className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your Technical Response</label>
              <textarea
                rows="4"
                required
                value={userAnswerText}
                onChange={(e) => setUserAnswerText(e.target.value)}
                placeholder="Type or dictate your answer here..."
                className="w-full p-4 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setUserAnswerText("To mitigate hallucinations, I structure context injection using semantic similarity thresholds with vector databases like Pinecone. I pass candidate documents through a cross-encoder re-ranker model.")}
                  className="text-xs text-brand-600 font-semibold hover:underline"
                >
                  Insert Sample Draft
                </button>
                <PrimaryButton type="submit" loading={isSubmitting} icon={Send} className="py-2 px-5 text-xs">
                  Submit to AI Twin
                </PrimaryButton>
              </div>
            </form>

            {/* Mock AI Feedback Output */}
            {mockFeedback && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">AI Twin Evaluation Report</h4>
                  <span className="text-base font-extrabold text-emerald-500">{mockFeedback.score}</span>
                </div>

                <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  <p><strong>Verdict:</strong> {mockFeedback.verdict}</p>
                  <p className="text-emerald-600 font-semibold">Strengths:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {mockFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default InterviewPrepPage;
