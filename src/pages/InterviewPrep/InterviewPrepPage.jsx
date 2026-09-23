import React, { useState, useEffect } from 'react';
import {
  Video,
  HelpCircle,
  Sparkles,
  Filter,
  Play,
  CheckCircle2,
  Award,
  Clock,
  X,
  Mic,
  Send,
  BookOpen,
  Check,
  ExternalLink,
  Youtube,
  Tv
} from 'lucide-react';
import InterviewCard from '../../components/InterviewCard/InterviewCard';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { getInterviewPrep, evaluateInterviewAnswer } from '../../services/api';
import { useUser } from '../../hooks/useUser';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';

const YOUTUBE_MOCK_VIDEOS = [
  {
    id: 'yt-1',
    videoId: 'XKu_SEDAykw',
    title: 'Google Coding Interview With A College Student',
    channel: 'Clément Mihailescu (Ex-Google Software Engineer)',
    category: 'Algorithms & LeetCode',
    duration: '42 min',
    level: 'Hard / Google FAANG',
    url: 'https://www.youtube.com/watch?v=XKu_SEDAykw',
    thumbnail: 'https://img.youtube.com/vi/XKu_SEDAykw/hqdefault.jpg',
    description: 'Real live technical coding round simulation covering dynamic programming, problem breakdown, and complexity analysis.'
  },
  {
    id: 'yt-2',
    videoId: 'Z-0g_YZ4UFc',
    title: 'System Design Interview: Design Instagram / TikTok Feed',
    channel: 'Exponent',
    category: 'System Design & Distributed Systems',
    duration: '38 min',
    level: 'Senior Architecture',
    url: 'https://www.youtube.com/watch?v=Z-0g_YZ4UFc',
    thumbnail: 'https://img.youtube.com/vi/Z-0g_YZ4UFc/hqdefault.jpg',
    description: 'End-to-end distributed system design covering caching, database sharding, fan-out architecture, and scaling to 100M+ users.'
  },
  {
    id: 'yt-3',
    videoId: '1m3x_QJmCSo',
    title: 'Machine Learning Engineer Mock Technical Interview',
    channel: 'Ken Jee',
    category: 'AI & Machine Learning',
    duration: '45 min',
    level: 'ML / Data Science',
    url: 'https://www.youtube.com/watch?v=1m3x_QJmCSo',
    thumbnail: 'https://img.youtube.com/vi/1m3x_QJmCSo/hqdefault.jpg',
    description: 'Real technical round covering feature engineering, model evaluation metrics, deep neural networks, and inference pipelines.'
  },
  {
    id: 'yt-4',
    videoId: 'uG36dZlFqnc',
    title: 'How to Ace Behavioral Interviews: STAR Method with Real FAANG Examples',
    channel: 'Jeff Su (Ex-Google Product Lead)',
    category: 'Behavioral & Leadership',
    duration: '18 min',
    level: 'All Engineering Tracks',
    url: 'https://www.youtube.com/watch?v=uG36dZlFqnc',
    thumbnail: 'https://img.youtube.com/vi/uG36dZlFqnc/hqdefault.jpg',
    description: 'Master the Situation-Task-Action-Result structure for answering tough leadership and cultural fit questions.'
  },
  {
    id: 'yt-5',
    videoId: 'qUV2h19g7_U',
    title: 'Full Stack & Frontend Mock Interview: React & Systems',
    channel: 'TechLead / Joma Tech',
    category: 'Full Stack & Web Architecture',
    duration: '32 min',
    level: 'Intermediate / Senior',
    url: 'https://www.youtube.com/watch?v=qUV2h19g7_U',
    thumbnail: 'https://img.youtube.com/vi/qUV2h19g7_U/hqdefault.jpg',
    description: 'Practical live technical round evaluating React component lifecycle, asynchronous data fetching, and web performance optimization.'
  }
];

export const InterviewPrepPage = () => {
  const { profile, updateProfileData } = useUser();
  const [prepData, setPrepData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeMockModal, setActiveMockModal] = useState(null);
  const [selectedYoutubeVideo, setSelectedYoutubeVideo] = useState(null);
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

  const handleEvaluateAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswerText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    toast.loading('AI Twin is evaluating your technical answer...', { id: 'eval-toast' });

    try {
      const response = await evaluateInterviewAnswer(
        activeMockModal.question,
        userAnswerText,
        activeMockModal.category,
        profile.targetRole
      );

      if (response.success && response.feedback) {
        setMockFeedback(response.feedback);
        toast.success('AI Evaluation Report Ready!', { id: 'eval-toast' });

        // Update profile readiness
        updateProfileData({
          readinessScore: Math.min(99, profile.readinessScore + 1)
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not evaluate answer', { id: 'eval-toast' });
    } finally {
      setIsSubmitting(false);
    }
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
            AI Mock Interview Room & Question Bank
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulate live enterprise technical rounds with instant Gemini 3.8 feedback and model answers.
          </p>
        </div>
        <PrimaryButton
          icon={Play}
          onClick={() => handleStartPractice(prepData.questions[0])}
          className="py-2.5 px-6 shadow-glow"
        >
          Start AI Mock Interview
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
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{profile.readinessScore || 88}%</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Target Role</span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-[150px]">
              {profile.targetRole}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Avg AI Rating</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">4.8 / 5.0</h3>
          </div>
        </GlassCard>
      </div>

      {/* Curated YouTube Mock Interview Masterclasses */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center">
              <Youtube className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Curated YouTube Mock Interview Masterclasses
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Watch real FAANG candidates and engineering managers walkthrough coding, system design, and behavioral interviews.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-red-600 bg-red-500/10 px-3 py-1 rounded-full self-start sm:self-auto flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5" /> 5 Video Rounds Available
          </span>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {YOUTUBE_MOCK_VIDEOS.map((video) => (
            <GlassCard key={video.id} className="p-0 overflow-hidden flex flex-col justify-between group hover:border-red-500/40 transition-all duration-300">
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {video.duration}
                </span>

                {/* Big Center Play Button */}
                <button
                  onClick={() => setSelectedYoutubeVideo(video)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 hover:bg-red-600 transition-all cursor-pointer"
                  title="Watch Video"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              </div>

              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span className="text-brand-600 dark:text-brand-400">{video.category}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{video.level}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">{video.channel}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedYoutubeVideo(video)}
                    className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Watch Here
                  </button>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Open on YouTube directly"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
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
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-brand-500/30 shadow-2xl animate-in zoom-in-95 bg-white dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-500 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Mock Interview Room</h3>
                  <span className="text-[10px] text-slate-400">Evaluating for {profile.targetRole}</span>
                </div>
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
                <Sparkles className="w-3.5 h-3.5" /> Technical Interviewer Question
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                "{activeMockModal.question}"
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                <span className="px-2 py-0.5 rounded bg-white/60 dark:bg-slate-800/60 font-semibold">
                  Difficulty: {activeMockModal.difficulty}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/60 dark:bg-slate-800/60 font-semibold">
                  Expected time: 3 - 5 mins
                </span>
              </div>
            </div>

            {/* Answer Box */}
            <form onSubmit={handleEvaluateAnswer} className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Your Technical Response (Type or dictate your explanation):
              </label>
              <textarea
                rows="5"
                required
                value={userAnswerText}
                onChange={(e) => setUserAnswerText(e.target.value)}
                placeholder="Structure your answer with architecture trade-offs, algorithms, and real implementation details..."
                className="w-full p-4 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setUserAnswerText(
                      "To minimize latency and mitigate hallucinations in enterprise RAG systems, I implement a two-stage hybrid retrieval strategy combining BM25 keyword search with dense vector embeddings in Pinecone. Candidate chunks are passed through a cross-encoder re-ranking model before context injection. Furthermore, I cache hot queries in Redis and stream tokens via Server-Sent Events (SSE)."
                    )
                  }
                  className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  Insert Sample Draft
                </button>
                <PrimaryButton
                  type="submit"
                  loading={isSubmitting}
                  icon={Send}
                  className="py-2 px-5 text-xs shadow-glow"
                >
                  Evaluate with Gemini
                </PrimaryButton>
              </div>
            </form>

            {/* Live AI Feedback Output */}
            {mockFeedback && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                  <div>
                    <h4 className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      AI Twin Evaluation Report
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Verdict: {mockFeedback.verdict}
                    </p>
                  </div>
                  <span className="text-2xl font-extrabold text-emerald-500">{mockFeedback.score}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] block">
                      Demonstrated Strengths
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300 mt-1">
                      {mockFeedback.strengths?.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {mockFeedback.improvements?.length > 0 && (
                    <div className="pt-2">
                      <span className="text-amber-500 font-bold uppercase tracking-wider text-[10px] block">
                        Areas for Optimization
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300 mt-1">
                        {mockFeedback.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {mockFeedback.idealAnswer && (
                    <div className="pt-3 border-t border-emerald-500/20">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                        Benchmark Senior Model Answer
                      </span>
                      <p className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed">
                        {mockFeedback.idealAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded YouTube Video Player Modal */}
      {selectedYoutubeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2 truncate pr-4">
                <Youtube className="w-5 h-5 text-red-600 flex-shrink-0" />
                <h3 className="text-sm font-bold text-white truncate">
                  {selectedYoutubeVideo.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={selectedYoutubeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setSelectedYoutubeVideo(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative aspect-video w-full bg-black flex-1 min-h-[300px]">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedYoutubeVideo.videoId}?autoplay=1`}
                title={selectedYoutubeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-4 bg-slate-950 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-800">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">{selectedYoutubeVideo.channel}</span>
                <span>Category: {selectedYoutubeVideo.category} • Level: {selectedYoutubeVideo.level}</span>
              </div>
              <span className="font-semibold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                Duration: {selectedYoutubeVideo.duration}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrepPage;
