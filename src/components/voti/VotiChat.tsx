"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, MessageSquare, X, Bot, Loader2,
  Mic, MicOff, Volume2, VolumeX, AlertCircle,
} from "lucide-react";
import { VotiOrb } from "./VotiOrb";
import { useAuth } from "@/context/AuthContext";
import type { ChatMessage } from "@/services/firestore.service";

type Mode = "chat" | "voice";
type OpenVotiEvent = CustomEvent<{ mode?: Mode }>;
interface Message { 
  role: "user" | "bot"; 
  content: string; 
  infographic?: { url: string; query: string };
}

const STARTERS = [
  "How do I register to vote?",
  "What ID do I need at the polling booth?",
  "How does an EVM work?",
  "What is VVPAT?",
  "My name isn't on the voter list — what should I do?",
  "What is the Model Code of Conduct?",
];

// ─── Main Voti Component ────────────────────────────────────────────
export function VotiChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Voice state
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  
  // Refs for audio handling
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const e = event as OpenVotiEvent;
      setIsOpen(true);
      if (e.detail?.mode) setMode(e.detail.mode);
    };
    window.addEventListener("open-voti", handleOpen);
    return () => window.removeEventListener("open-voti", handleOpen);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // ── Step 1: Initial Greeting / Load History ───────────────────────
  useEffect(() => {
    const initVoti = async () => {
      if (user) {
        setLoading(true);
        try {
          // Fetch memory from API
          const res = await fetch(`/api/voti/memory?uid=${user.uid}`);
          const history = (await res.json()) as ChatMessage[];
          if (history && history.length > 0) {
            setMessages(history.map((m) => ({
              role: m.role === "user" ? "user" : "bot",
              content: m.content
            })));
          } else {
            // New user greeting
            setMessages([{
              role: "bot",
              content: `Namaste ${user.displayName?.split(" ")[0] || "Voter"}! I am Voti — your official Election Assistant. I've been briefed on your interest in Indian democracy. How can I assist you today?`
            }]);
          }
        } catch (e) {
          console.error("Failed to load Voti history", e);
        } finally {
          setLoading(false);
        }
      } else {
        // Default anonymous greeting
        setMessages([{
          role: "bot",
          content: "Namaste! I am Voti — your official Election Assistant. I provide neutral, verified information on Indian elections. How can I assist your democratic journey today?"
        }]);
      }
    };

    initVoti();
  }, [user]);

  const callVoti = useCallback(async (query: string, wantsAudio: boolean = false) => {
    setLoading(true);
    try {
      const res = await fetch("/api/voti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query, 
          wantsAudio,
          uid: user?.uid || "anonymous",
          userName: user?.displayName || "Voter"
        }),
      });
      const data = await res.json();
      return { answer: data.answer || "I couldn't find a response.", audioBase64: data.audioBase64 };
    } catch {
      return { answer: "I'm having connectivity issues. Please call the ECI voter helpline at 1950 for immediate assistance.", audioBase64: null };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const sendMessage = useCallback(async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    
    const data = await callVoti(q, false);
    
    // Check for infographic trigger in response
    let infographic = undefined;
    const infoMatch = data.answer.match(/\[INFOGRAPHIC:\s*(.*?)\]/);
    if (infoMatch) {
      const topic = infoMatch[1];
      try {
        const infoRes = await fetch("/api/infographic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: topic, uid: user?.uid }),
        });
        const infoData = await infoRes.json();
        if (infoData.imageUrl) {
          infographic = { url: infoData.imageUrl, query: topic };
        }
      } catch (e) {
        console.error("Failed to generate infographic for Voti", e);
      }
    }

    setMessages((prev) => [...prev, { role: "bot", content: data.answer, infographic }]);
  }, [input, loading, callVoti, user]);

  // ─── Google Cloud Speech-to-Text ───
  const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
    try {
      const res = await fetch("/api/stt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioContent: base64Audio, mimeType }),
      });
      const data = await res.json();
      if (data.transcription) {
        return data.transcription;
      }
      throw new Error("No transcription returned");
    } catch (err) {
      console.error("[STT] Transcription failed:", err);
      throw err;
    }
  };

  // ─── Google Cloud Text-to-Speech ───
  const synthesizeSpeech = async (text: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      return data.audioContent || null;
    } catch (err) {
      console.error("[TTS] Synthesis failed:", err);
      return null;
    }
  };

  // Play audio from base64 content
  const playAudioFromBase64 = (base64Audio: string, mimeType: string = 'audio/mp3'): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      const audio = new Audio(`data:${mimeType};base64,${base64Audio}`);
      audioRef.current = audio;
      
      audio.onplay = () => setSpeaking(true);
      audio.onended = () => {
        setSpeaking(false);
        resolve();
      };
      audio.onerror = (e) => {
        console.error("[Voti] Audio playback failed:", e);
        setSpeaking(false);
        setVoiceError("Audio playback failed. Please check browser permissions.");
        reject(e);
      };
      
      audio.play().catch(reject);
    });
  };

  // ─── Voice Input with Google Cloud STT ───
  const startListening = async () => {
    setVoiceError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000,
        } 
      });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: 'audio/webm;codecs=opus' 
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          const base64Audio = base64data.split(',')[1];
          setListening(false);
          setIsProcessingAudio(true);
          
          try {
            // Step 1: Transcribe audio using Google Cloud STT
            const transcription = await transcribeAudio(base64Audio, 'audio/webm;codecs=opus');
            
            if (!transcription.trim()) {
              setVoiceError("I couldn't understand your voice. Please try again.");
              setIsProcessingAudio(false);
              return;
            }

            // Add user message with transcription
            setMessages((prev) => [...prev, { role: "user", content: `🎙️ ${transcription}` }]);
            
            // Step 2: Get response from Voti
            setLoading(true);
            const data = await callVoti(transcription, false);
            setMessages((prev) => [...prev, { role: "bot", content: data.answer }]);
            
            // Step 3: Generate speech using Google Cloud TTS
            if (data.answer) {
              try {
                const ttsAudio = await synthesizeSpeech(data.answer);
                if (ttsAudio) {
                  await playAudioFromBase64(ttsAudio, 'audio/mp3');
                }
              } catch (ttsError) {
                console.error("[Voti] TTS failed:", ttsError);
              }
            }
          } catch (err) {
            console.error("[Voti] Voice processing error:", err);
            setVoiceError("Error processing voice. Please try again or type your question.");
          } finally {
            setLoading(false);
            setIsProcessingAudio(false);
          }
        };
      };

      mediaRecorder.start();
      setListening(true);
    } catch (err) {
      console.error(err);
      setVoiceError("Microphone access denied or unavailable. Please enable microphone permissions.");
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    } else {
      setListening(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSpeaking(false);
  };

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        id="voti-trigger"
        className="fixed bottom-8 right-8 rounded-full shadow-2xl z-40 transition-colors flex items-center justify-center p-0.5"
        style={{ background: "linear-gradient(135deg, #000080, #FF9933)" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Voti assistant" : "Open Voti assistant"}
      >
        {isOpen ? (
          <div className="bg-slate-800 rounded-full p-3.5 text-white">
            <X className="h-5 w-5" />
          </div>
        ) : (
          <VotiOrb size={64} active={true} />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed bottom-28 right-8 w-[420px] h-[620px] rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
            role="dialog"
            aria-label="Voti Election Assistant"
          >
            {/* Header */}
            <div className="shrink-0 px-5 py-4 flex items-center gap-3" style={{ background: "#0f172a" }}>
              <div className="p-2 rounded-xl bg-white/10">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-white">Voti</h3>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-white">Online</span>
              </div>
            </div>

            {/* Mode tabs */}
            <div className="shrink-0 flex border-b" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
              {(["chat", "voice"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                  style={{
                    color: mode === m ? "var(--text)" : "var(--text-faint)",
                    borderBottom: mode === m ? "2px solid var(--text)" : "2px solid transparent",
                    background: "transparent",
                  }}
                >
                  {m === "chat" ? "💬 Chat" : "🎙️ Voice"}
                </button>
              ))}
            </div>

            {/* ─── CHAT MODE ─── */}
            {mode === "chat" && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: "var(--bg-subtle)" }}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} gap-2`}>
                      <div
                        className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                        style={
                          msg.role === "user"
                            ? { background: "#000080", color: "#fff", borderRadius: "1rem 1rem 0.25rem 1rem" }
                            : { background: "var(--card-bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "1rem 1rem 1rem 0.25rem" }
                        }
                      >
                        {msg.content.replace(/\[INFOGRAPHIC:.*?\]/g, "").trim()}
                      </div>
                      
                      {/* Integrated Infographic Card */}
                      {msg.infographic && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-full rounded-2xl overflow-hidden border-2 shadow-lg mt-1"
                          style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
                        >
                          <img 
                            src={msg.infographic.url} 
                            alt={msg.infographic.query}
                            className="w-full aspect-[4/3] object-cover bg-white"
                          />
                          <div className="px-4 py-2 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                            <span className="text-[10px] font-bold text-election-gradient">ELECTIQ VISUAL AI</span>
                            <button 
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = msg.infographic?.url || "";
                                const safeQuery = msg.infographic?.query ? msg.infographic.query.replace(/\s+/g, '-') : 'query';
                                link.download = `ElectiQ-Voti-${safeQuery}.png`;
                                link.click();
                              }}
                              className="text-[10px] font-black text-slate-500 hover:text-[#FF9933] cursor-pointer"
                            >
                              DOWNLOAD
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 rounded-2xl text-sm flex items-center gap-2" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                        Voti is thinking...
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Quick starters */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-2" style={{ background: "var(--bg-subtle)" }}>
                    {STARTERS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all hover:border-indigo-500 hover:text-white"
                        style={{ background: "var(--card-bg)", color: "var(--text-muted)", borderColor: "var(--border)" }}
                      >
                        {q}
                      </button>
                    ))}
                    <button
                      onClick={() => sendMessage("Generate an infographic on how to register to vote")}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#FF9933]/30 text-[#FF9933] cursor-pointer transition-all hover:bg-[#FF9933] hover:text-white"
                      style={{ background: "var(--card-bg)" }}
                    >
                      ✨ Visual AI Guide
                    </button>
                  </div>
                )}

                {/* Input */}
                <div className="shrink-0 flex gap-3 px-4 py-4 border-t" style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}>
                  <input
                    type="text"
                    placeholder="Ask about Indian elections..."
                    className="flex-1 text-sm outline-none bg-transparent"
                    style={{ color: "var(--text)" }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={loading}
                    aria-label="Ask Voti a question"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="p-2 rounded-xl text-white transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                    style={{ background: "#000080" }}
                    aria-label="Send message"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </>
            )}

            {/* ─── VOICE MODE ─── */}
            {mode === "voice" && (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 py-6" style={{ background: "var(--bg-subtle)" }}>
                {/* 3D Orb Visualizer */}
                <div className="relative group cursor-pointer" onClick={listening ? stopListening : startListening}>
                  <VotiOrb 
                    size={220} 
                    active={true} 
                    speaking={speaking} 
                    listening={listening} 
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {!listening && !speaking && !isProcessingAudio && (
                      <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Tap to speak
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>
                    {listening ? "🎙️ Listening..." : 
                     isProcessingAudio ? "⚙️ Processing..." :
                     speaking ? "🔊 Speaking..." : "Tap the mic to ask Voti"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                    {isProcessingAudio ? "Transcribing & generating response..." : 
                     "Powered by Google Cloud Speech · Indian English"}
                  </p>
                </div>

                {/* Mic button */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={listening ? stopListening : startListening}
                  disabled={isProcessingAudio || speaking}
                  className="h-20 w-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer disabled:opacity-50"
                  style={{ background: listening ? "#FF9933" : isProcessingAudio ? "#f59e0b" : "#000080" }}
                  aria-label={listening ? "Stop recording" : "Start voice input"}
                >
                  {isProcessingAudio ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : listening ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </motion.button>

                {/* Stop speaking */}
                {speaking && (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl cursor-pointer"
                    style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}
                  >
                    <VolumeX className="h-4 w-4" /> Stop speaking
                  </button>
                )}

                {/* Voice error */}
                {voiceError && (
                  <div className="flex items-start gap-2 text-xs p-3 rounded-xl" style={{ background: "#e0e7ff", color: "#000080" }}>
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {voiceError}
                  </div>
                )}

                {/* Last voice exchange */}
                {messages.length > 1 && (
                  <div className="w-full space-y-2 max-h-44 overflow-y-auto">
                    {messages.slice(-2).map((msg, i) => (
                      <div key={i} className="text-xs p-3 rounded-xl" style={{
                        background: msg.role === "user" ? "#00008015" : "var(--card-bg)",
                        color: "var(--text)",
                        border: "1px solid var(--border)",
                      }}>
                        <span className="font-bold" style={{ color: msg.role === "user" ? "#000080" : "var(--text-muted)" }}>
                          {msg.role === "user" ? "You: " : "Voti: "}
                        </span>
                        {msg.content}
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[10px] text-center" style={{ color: "var(--text-faint)" }}>
                  Voice powered by Google Cloud Speech-to-Text & Text-to-Speech · Indian English
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
