import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Building2, 
  Briefcase, 
  User, 
  Bot, 
  Play, 
  Square,
  FileText,
  TrendingUp,
  Download,
  Share2
} from 'lucide-react';
import { BRANDED_COMPANIES } from '../data/companyData';
import { InterviewMessage, InterviewEvaluation, SavedInterviewSession } from '../types';

interface AIMockInterviewArenaProps {
  initialCompanyId?: string;
  onViewHistory?: () => void;
}

export const AIMockInterviewArena: React.FC<AIMockInterviewArenaProps> = ({ 
  initialCompanyId = 'google',
  onViewHistory 
}) => {
  // Setup configuration state
  const [companyId, setCompanyId] = useState<string>(initialCompanyId);
  const [role, setRole] = useState<string>('Software Engineer');
  const [level, setLevel] = useState<string>('Mid-Level');
  const [roundType, setRoundType] = useState<string>('Technical & Algorithmic Problem Solving');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);

  // Chat conversation state
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Audio / Speech Recognition and Synthesis state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<InterviewEvaluation | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentCompany = BRANDED_COMPANIES.find(c => c.id === companyId) || BRANDED_COMPANIES[0];

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputMessage(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Timer effect during active session
  useEffect(() => {
    if (isSessionActive && !evaluationResult) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isSessionActive, evaluationResult]);

  const toggleSpeechRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const speakText = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Start new mock interview session
  const handleStartInterview = async () => {
    setIsSessionActive(true);
    setMessages([]);
    setEvaluationResult(null);
    setElapsedSeconds(0);
    setIsLoading(true);

    const initialGreeting = `Hello and welcome to your ${roundType} interview at ${currentCompany.name}. I will be your interviewer today. We will assess your problem-solving depth, communication clarity, and alignment with our principles. To begin, please introduce yourself and walk me through a complex project you led, highlighting your specific technical contributions and measurable business impact.`;

    const welcomeMsg: InterviewMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([welcomeMsg]);
    setIsLoading(false);
    speakText(initialGreeting);
  };

  // Send candidate answer to AI interviewer
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const userMsg: InterviewMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: currentCompany.name,
          role,
          level,
          roundType,
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      const aiReply = data.reply || "Thank you. Let's move on to the next question.";

      const aiMsg: InterviewMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...updatedMessages, aiMsg]);
      speakText(aiReply);
    } catch (err) {
      console.error(err);
      const fallbackMsg: InterviewMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Understood. In relation to ${currentCompany.name}'s standards, how would your approach scale if traffic increased 10-fold? What is the single biggest bottleneck?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...updatedMessages, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Finish and trigger AI evaluation scorecard
  const handleEvaluateInterview = async () => {
    if (messages.length < 2) {
      alert('Please complete at least one round of conversation before generating an evaluation.');
      return;
    }

    window.speechSynthesis?.cancel();
    setIsEvaluating(true);
    setShowEvaluationModal(true);

    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: currentCompany.name,
          role,
          level,
          transcript: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data: InterviewEvaluation = await response.json();
      setEvaluationResult(data);

      // Save to local storage
      const savedSession: SavedInterviewSession = {
        id: `session-${Date.now()}`,
        companyId: currentCompany.id,
        companyName: currentCompany.name,
        role,
        level,
        roundType,
        date: new Date().toLocaleDateString(),
        durationMinutes: Math.ceil(elapsedSeconds / 60),
        messages,
        evaluation: data
      };

      const existingHistory: SavedInterviewSession[] = JSON.parse(localStorage.getItem('interview_history') || '[]');
      localStorage.setItem('interview_history', JSON.stringify([savedSession, ...existingHistory]));
    } catch (err) {
      console.error('Evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6" id="ai-mock-interview-container">
      {/* Session Header / Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black text-lg flex items-center justify-center shadow-sm">
            {currentCompany.logoBadge}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                AI Mock Interviewer • {currentCompany.name}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/50">
                {roundType.split(' ')[0]}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Role: <span className="font-semibold text-slate-700">{role} ({level})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSessionActive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {formatTimer(elapsedSeconds)}
            </div>
          )}

          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-2 rounded-lg border transition-colors ${
              ttsEnabled ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title={ttsEnabled ? 'Voice output enabled' : 'Voice output muted'}
            id="toggle-tts-btn"
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {isSessionActive ? (
            <button
              onClick={handleEvaluateInterview}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              id="finish-and-evaluate-btn"
            >
              <Award className="w-4 h-4" /> Finish & Evaluate
            </button>
          ) : (
            <button
              onClick={handleStartInterview}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
              id="start-interview-session-btn"
            >
              <Play className="w-4 h-4" /> Start Mock Interview
            </button>
          )}
        </div>
      </div>

      {/* Configuration Drawer when session is not yet active */}
      {!isSessionActive && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Configure Your Interview Session</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the company, target position, seniority level, and interview stage to simulate real hiring loops.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Company Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Target Company</label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                id="select-company-dropdown"
              >
                {BRANDED_COMPANIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Role Track</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                id="select-role-dropdown"
              >
                <option value="Software Engineer">Software Engineer (SWE / SDE)</option>
                <option value="Product Manager">Product Manager (PM)</option>
                <option value="Data Scientist & AI">Data Scientist & AI Engineer</option>
                <option value="Management Consultant">Management Consultant</option>
                <option value="Cloud Architect">Cloud Solutions Architect</option>
              </select>
            </div>

            {/* Seniority Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Experience Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                id="select-level-dropdown"
              >
                <option value="Entry / College Grad">Entry-Level / Campus Hire</option>
                <option value="Mid-Level">Mid-Level (2-5 yrs exp)</option>
                <option value="Senior / Lead">Senior / Staff Lead (5+ yrs)</option>
              </select>
            </div>

            {/* Round Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Interview Stage</label>
              <select
                value={roundType}
                onChange={(e) => setRoundType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                id="select-round-type-dropdown"
              >
                <option value="Technical & Algorithmic Problem Solving">Technical & Coding (DSA)</option>
                <option value="System Design & Architecture">System Design & Architecture</option>
                <option value="Behavioral & Leadership Principles">Behavioral & Leadership Fit (STAR)</option>
                <option value="Bar Raiser / Executive Calibration">Bar Raiser / Partner Round</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Powered by Gemini AI
              </span>
              <p className="text-xs text-slate-500">
                You can speak your answers via Microphone or type in the text field. The interviewer uses speech synthesis for an authentic experience.
              </p>
            </div>
            <button
              onClick={handleStartInterview}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
              id="begin-session-btn"
            >
              Launch Mock Interview
            </button>
          </div>
        </div>
      )}

      {/* Active Interview Conversation Area */}
      {isSessionActive && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[580px] overflow-hidden">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50" id="chat-messages-container">
            {messages.map((msg) => {
              const isAi = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAi ? 'bg-slate-900 text-white shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                  }`}>
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className={`space-y-1 ${isAi ? 'text-left' : 'text-right'}`}>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                      <span>{isAi ? `${currentCompany.name} Interviewer` : 'You (Candidate)'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAi 
                        ? 'bg-white text-slate-800 border border-slate-200/80 shadow-xs' 
                        : 'bg-blue-600 text-white shadow-xs text-left'
                    }`}>
                      {msg.content}
                    </div>

                    {isAi && ttsEnabled && (
                      <button
                        onClick={() => speakText(msg.content)}
                        className="text-[11px] text-slate-400 hover:text-blue-600 inline-flex items-center gap-1 mt-1 px-1 transition-colors"
                        title="Replay audio"
                      >
                        <Volume2 className="w-3 h-3" /> Replay voice
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 mr-auto max-w-3xl items-center text-xs text-slate-500 py-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>Interviewer is listening and reviewing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200">
            {isRecording && (
              <div className="mb-2 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg flex items-center gap-2 animate-pulse border border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>Microphone active — speak clearly into your mic...</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSpeechRecording}
                className={`p-3 rounded-xl border transition-all ${
                  isRecording 
                    ? 'bg-red-600 text-white border-red-700 shadow-md animate-bounce' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title={isRecording ? 'Stop speech recognition' : 'Speak your answer (Voice to Text)'}
                id="mic-recording-btn"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type or speak your answer using the STAR method (Situation, Task, Action, Result)..."
                rows={2}
                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                id="candidate-response-input"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl shadow-sm transition-all"
                title="Submit Answer"
                id="submit-answer-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span>Press <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">Enter</kbd> to submit, <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">Shift+Enter</kbd> for new line.</span>
              <button
                onClick={handleEvaluateInterview}
                className="text-blue-600 hover:underline font-semibold"
              >
                Ready for evaluation?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Evaluation Scorecard Modal */}
      {showEvaluationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto" id="evaluation-scorecard-modal">
            {isEvaluating ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-spin">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Bar-Raiser Hiring Committee Review</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Gemini AI is analyzing your transcript against {currentCompany.name}'s hiring rubrics, STAR framework structure, and technical depth...
                  </p>
                </div>
              </div>
            ) : evaluationResult ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Official Interview Scorecard
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {currentCompany.name} • {role}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowEvaluationModal(false)}
                    className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
                    id="close-evaluation-modal-btn"
                  >
                    ✕
                  </button>
                </div>

                {/* Score and Verdict Banner */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center shadow-md">
                      {evaluationResult.overallScore}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Hiring Recommendation:</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          evaluationResult.verdict === 'Strong Hire' ? 'bg-emerald-100 text-emerald-800' :
                          evaluationResult.verdict === 'Hire' ? 'bg-blue-100 text-blue-800' :
                          evaluationResult.verdict === 'Lean Hire' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {evaluationResult.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {evaluationResult.verdictDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Multi-Dimensional Bar Metrics */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Performance Dimensions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Technical Soundness & Problem Solving', value: evaluationResult.metrics.technicalOrDomain },
                      { label: 'STAR Framework & Structure', value: evaluationResult.metrics.starMethodStructure },
                      { label: 'Communication Clarity & Articulation', value: evaluationResult.metrics.communicationClarity },
                      { label: 'Company Cultural & Leadership Fit', value: evaluationResult.metrics.culturalAndLeadershipFit }
                    ].map((m, i) => (
                      <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700 truncate">{m.label}</span>
                          <span className="text-blue-600">{m.value}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all"
                            style={{ width: `${m.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths
                    </span>
                    <ul className="text-xs text-emerald-950 space-y-1 list-disc list-inside">
                      {evaluationResult.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Growth Areas
                    </span>
                    <ul className="text-xs text-amber-950 space-y-1 list-disc list-inside">
                      {evaluationResult.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Exemplary Model Answer */}
                {evaluationResult.exemplaryAnswer && (
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
                    <span className="text-xs font-bold text-blue-900 block">
                      💡 Bar-Raiser Exemplary Answer Blueprint:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{evaluationResult.exemplaryAnswer}"
                    </p>
                  </div>
                )}

                {/* Actionable Advice */}
                {evaluationResult.actionableAdvice.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Coaching Recommendations:</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {evaluationResult.actionableAdvice.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">→</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowEvaluationModal(false);
                      setIsSessionActive(false);
                    }}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all"
                    id="finish-review-btn"
                  >
                    Close & Finish Session
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
