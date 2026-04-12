import React, { useEffect, useRef, useState, useCallback } from "react";
import LearnHeader from '../FrontPages/HeaderSection/LearnHeader'
// ─── TOPIC BANK ──────────────────────────────────────────────────────────────
const TOPICS = [
  {
    id: "hometown",
    label: "Hometown",
    prompt: "Describe your hometown and what makes it special to you.",
    hint: "Talk about the location, culture, food, people, or memories.",
  },
  {
    id: "influence",
    label: "Influence",
    prompt: "Talk about a person who has greatly influenced your life.",
    hint: "Describe who they are, what they did, and how they changed you.",
  },
  {
    id: "travel",
    label: "Travel",
    prompt: "Describe a memorable travel experience you have had.",
    hint: "Include where you went, what happened, and why it was meaningful.",
  },
  {
    id: "technology",
    label: "Technology",
    prompt: "Discuss the impact of technology on modern education.",
    hint: "Consider both benefits and drawbacks, and give examples.",
  },
  {
    id: "arts",
    label: "Arts",
    prompt: "Talk about your favourite book or film and explain why you love it.",
    hint: "Describe the story, themes, and what makes it stand out.",
  },
];

const ADVANCED_VOCAB = [
  "therefore","however","furthermore","nevertheless","consequently",
  "significantly","particularly","essential","demonstrate","perspective",
  "approach","consider","suggest","indicate","reflect","enhance",
  "implement","analyse","evaluate","establish","contribute","regarding",
  "substantial","crucial","fundamental","apparent","considerable",
  "adequate","prominent","relevant","sufficient","diverse",
];

const CONNECTORS = /\b(because|although|however|therefore|moreover|furthermore|in addition|for example|such as|firstly|secondly|finally|in conclusion|on the other hand|as a result|in contrast|similarly|despite|even though|whereas|since|while|after all|above all|in particular)\b/gi;

const GRAMMAR_PATTERNS = /\b(i am|i have|i was|i will|i would|i think|i believe|i feel|it is|there are|there is|we can|they are|he was|she was|i had|we were|i could|i should|i might|it was|they have|you can|you should)\b/gi;

// ─── SCORING ENGINE ───────────────────────────────────────────────────────────
function analyzeAndScore(fullText, elapsedSeconds, pauseCount) {
  const raw = fullText.trim();
  if (!raw) return null;

  const words = raw.split(/\s+/).filter((w) => w.length > 0);
  const wc = words.length;
  const wpm = elapsedSeconds > 0 ? Math.round((wc / elapsedSeconds) * 60) : 0;
  const sents = Math.max((raw.match(/[.!?]+/g) || []).length, 1);
  const avgWordsPerSent = wc / sents;

  const cleanWords = words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ""));
  const uniqueWords = new Set(cleanWords.filter((w) => w.length > 2));
  const ttr = uniqueWords.size / Math.max(wc, 1);

  let advancedCount = 0;
  cleanWords.forEach((w) => {
    if (ADVANCED_VOCAB.includes(w)) advancedCount++;
  });

  const grammarMatches = (raw.match(GRAMMAR_PATTERNS) || []).length;
  const connectorCount = (raw.match(CONNECTORS) || []).length;

  // FLUENCY
  let fluency = 30;
  if (wc > 15) fluency = 50;
  if (wc > 30) fluency = 62;
  if (wc > 50) fluency = 72;
  if (wc > 80) fluency = 82;
  if (wc > 110) fluency = 90;
  if (wc > 140) fluency = 95;
  if (pauseCount > 5) fluency = Math.max(fluency - 14, 25);
  else if (pauseCount > 3) fluency = Math.max(fluency - 8, 25);
  else if (pauseCount <= 1 && wc > 40) fluency = Math.min(fluency + 3, 99);
  fluency = Math.min(fluency + Math.floor(ttr * 8), 99);

  // VOCABULARY
  let vocab = 35;
  if (ttr > 0.35) vocab = 52;
  if (ttr > 0.45) vocab = 63;
  if (ttr > 0.55) vocab = 74;
  if (ttr > 0.65) vocab = 84;
  if (ttr > 0.75) vocab = 92;
  vocab = Math.min(vocab + advancedCount * 3, 99);

  // GRAMMAR
  let grammar = 45;
  if (grammarMatches > 0) grammar = 62;
  if (grammarMatches > 2) grammar = 72;
  if (grammarMatches > 4) grammar = 82;
  if (grammarMatches > 7) grammar = 90;
  if (avgWordsPerSent >= 8 && avgWordsPerSent <= 22) grammar = Math.min(grammar + 5, 99);
  if (wc > 60) grammar = Math.min(grammar + 3, 99);

  // COHERENCE
  let coherence = 40;
  if (connectorCount > 0) coherence = 58;
  if (connectorCount > 2) coherence = 70;
  if (connectorCount > 4) coherence = 82;
  if (connectorCount > 6) coherence = 90;
  if (sents > 4) coherence = Math.min(coherence + 5, 99);
  if (avgWordsPerSent >= 8 && avgWordsPerSent <= 22) coherence = Math.min(coherence + 5, 99);

  // PACE
  let pace = 40;
  if (wpm >= 100 && wpm <= 160) pace = 95;
  else if (wpm >= 90 && wpm < 100) pace = 85;
  else if (wpm >= 160 && wpm <= 180) pace = 80;
  else if (wpm >= 75 && wpm < 90) pace = 70;
  else if (wpm > 180 && wpm <= 210) pace = 65;
  else if (wpm >= 55 && wpm < 75) pace = 55;
  else if (wpm > 0) pace = 45;

  // CONFIDENCE
  let confidence = 45;
  if (wc > 25 && pauseCount < 4) confidence = 68;
  if (wc > 55 && pauseCount < 3) confidence = 80;
  if (wc > 85 && pauseCount < 2) confidence = 90;
  if (ttr > 0.6 && advancedCount > 1) confidence = Math.min(confidence + 8, 99);
  if (connectorCount > 2) confidence = Math.min(confidence + 5, 99);

  const overall = Math.round(
    fluency * 0.22 +
    vocab * 0.20 +
    grammar * 0.18 +
    coherence * 0.20 +
    pace * 0.10 +
    confidence * 0.10
  );

  let cefr, band;
  if (overall >= 88) { cefr = "C2"; band = "Mastery"; }
  else if (overall >= 78) { cefr = "C1"; band = "Advanced"; }
  else if (overall >= 68) { cefr = "B2"; band = "Upper-Intermediate"; }
  else if (overall >= 58) { cefr = "B1"; band = "Intermediate"; }
  else if (overall >= 45) { cefr = "A2"; band = "Elementary"; }
  else { cefr = "A1"; band = "Beginner"; }

  const feedback = [];
  if (wpm >= 100 && wpm <= 160) feedback.push({ type: "pos", text: `Great pace at ${wpm} wpm — ideal for clear English speech.` });
  else if (wpm < 80 && wpm > 0) feedback.push({ type: "neg", text: `Speaking pace is slow (${wpm} wpm). Target 100–160 wpm.` });
  if (ttr > 0.65) feedback.push({ type: "pos", text: "Excellent vocabulary diversity — you use a wide range of words." });

  return {
    overall, cefr, band,
    scores: { fluency, vocab, grammar, coherence, pace, confidence },
    stats: { wc, wpm, sents, uniqueWords: uniqueWords.size, ttr, advancedCount, connectorCount, pauseCount },
    feedback,
  };
}

// ─── APPLE STYLE UTILITIES ──────────────────────────────────────────────────
const APPLE_BLACK = "#1d1d1f";
const APPLE_GRAY = "#86868b";
const APPLE_BG = "#f5f5f7";
const APPLE_BLUE = "#0071e3";

function cefrStyle(cefr) {
  if (["C2", "C1"].includes(cefr)) return { bg: "#f5f5f7", color: APPLE_BLACK, border: "#d2d2d7" };
  return { bg: "#f5f5f7", color: APPLE_BLACK, border: "#d2d2d7" };
}

// ─── CIRCULAR PROGRESS ───────────────────────────────────────────────────────
function CircleScore({ value, size = 80, stroke = 6, color }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
      />
    </svg>
  );
}

// ─── AUDIO VISUALIZER ────────────────────────────────────────────────────────
function AudioBars({ active }) {
  const [heights, setHeights] = useState([4, 6, 8, 5, 7, 4, 9]);
  useEffect(() => {
    if (!active) { setHeights([4, 4, 4, 4, 4, 4, 4]); return; }
    const id = setInterval(() => {
      setHeights(Array.from({ length: 7 }, () => active ? 3 + Math.floor(Math.random() * 18) : 4));
    }, 110);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 22 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 3, height: h, borderRadius: 10,
          background: active ? APPLE_BLUE : "#d2d2d7",
          transition: "height 0.1s ease",
        }} />
      ))}
    </div>
  );
}

// ─── SCORE BREAKDOWN BAR ──────────────────────────────────────────────────────
function ScoreBar({ label, value, animate }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: APPLE_GRAY }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: APPLE_BLACK }}>{value}</span>
      </div>
      <div style={{ height: 4, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 999, background: APPLE_BLACK,
          width: animate ? `${value}%` : "0%",
          transition: "width 1.5s cubic-bezier(0.65, 0, 0.35, 1)",
        }} />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SpeechTestPlatform() {
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const [phase, setPhase] = useState("idle");
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [elapsed, setElapsed] = useState(0);
  const [fullText, setFullText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const [result, setResult] = useState(null);
  const [topicIdx, setTopicIdx] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const [animateScores, setAnimateScores] = useState(false);
  const [duration, setDuration] = useState(60);

  const lastWordTimeRef = useRef(0);
  const pauseCountRef = useRef(0);
  const fullTextRef = useRef("");
  const elapsedRef = useRef(0);

  const topic = TOPICS[topicIdx];

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (e) {
      console.warn("Access denied");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  const startRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          fullTextRef.current += " " + t;
          const now = Date.now();
          if (lastWordTimeRef.current && now - lastWordTimeRef.current > 2200) {
            pauseCountRef.current += 1;
            setPauseCount(pauseCountRef.current);
          }
          lastWordTimeRef.current = now;
          const words = fullTextRef.current.trim().split(/\s+/).filter(Boolean);
          setFullText(fullTextRef.current);
          setWordCount(words.length);
          setSentCount((fullTextRef.current.match(/[.!?]+/g) || []).length);
        } else {
          interim = t;
        }
      }
      setInterimText(interim);
    };

    rec.onend = () => {
      if (recognitionRef.current === rec) {
        try { rec.start(); } catch (_) {}
      }
    };
    rec.start();
    recognitionRef.current = rec;
  }, []);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      const rec = recognitionRef.current;
      recognitionRef.current = null;
      try { rec.stop(); } catch (_) {}
    }
  }, []);

  const handleStart = useCallback(async () => {
    fullTextRef.current = "";
    elapsedRef.current = 0;
    pauseCountRef.current = 0;
    lastWordTimeRef.current = 0;
    setFullText(""); setInterimText(""); setWordCount(0); setWpm(0);
    setSentCount(0); setPauseCount(0); setResult(null); setAnimateScores(false);
    setTimeLeft(duration); setElapsed(0);

    await startCamera();
    setPhase("countdown");
    setCountdown(3);

    let c = 3;
    const cd = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(cd);
        setPhase("recording");
        startRecognition();
        lastWordTimeRef.current = Date.now();
        let t = duration;
        let e = 0;
        timerRef.current = setInterval(() => {
          t--; e++;
          elapsedRef.current = e;
          setTimeLeft(t); setElapsed(e);
          if (e > 0) setWpm(Math.round((fullTextRef.current.split(/\s+/).length / e) * 60));
          if (t <= 0) handleStop();
        }, 1000);
      }
    }, 1000);
  }, [duration, startCamera, startRecognition]);

  const handleStop = useCallback(() => {
    clearInterval(timerRef.current);
    stopRecognition();
    setInterimText("");
    setPhase("done");
    setTimeout(() => {
      const res = analyzeAndScore(fullTextRef.current, elapsedRef.current, pauseCountRef.current);
      setResult(res);
      setTimeout(() => setAnimateScores(true), 200);
    }, 300);
  }, [stopRecognition]);

  const handleReset = useCallback(() => {
    clearInterval(timerRef.current);
    stopRecognition();
    stopCamera();
    setPhase("idle"); setFullText(""); setResult(null);
  }, [stopRecognition, stopCamera]);

  const isRecording = phase === "recording";
  const isDone = phase === "done";
  const isIdle = phase === "idle";
  const isCountdown = phase === "countdown";

  return (
    <> 
    <LearnHeader/>
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      background: "#ffffff", color: APPLE_BLACK, minHeight: "100vh",
      padding: "40px 20px", maxWidth: 2040, margin: "0 auto",
    }}>
         

      {/* APPLE HEADER */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 60 }}>
        <div>
          <h1 style={{ fontSize: 59, fontWeight: 600, letterSpacing: "-0.022em", margin: 0 }}>
             <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(97deg, #0096ff, #bb64ff 42%, #f2416b 74%, #eb7500)"
            }}
          >
           English Speech Test
          </span> 
          </h1>
          <p style={{ fontSize: 19, color: APPLE_GRAY, fontWeight: 400, marginTop: 4 }}>
            Professional English self ratings
          </p>
        </div>
        <div style={{ display: "flex", background: APPLE_BG, padding: 4, borderRadius: 999 }}>
          {[60, 90, 120].map((d) => (
            <button key={d} onClick={() => isIdle && setDuration(d)}
              style={{
                padding: "8px 20px", borderRadius: 999, fontSize: 14, fontWeight: 500,
                border: "none",
                background: duration === d ? "#fff" : "transparent",
                color: duration === d ? APPLE_BLACK : APPLE_GRAY,
                boxShadow: duration === d ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                cursor: isIdle ? "pointer" : "default",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>{d}s</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 32, marginBottom: 32 }}>

        {/* LEFT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            borderRadius: 28, overflow: "hidden", background: "#000",
            aspectRatio: "1/1", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
          }}>
            <video ref={videoRef} autoPlay muted playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {isCountdown && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}>
                <span style={{ fontSize: 80, fontWeight: 600, color: "#fff" }}>{countdown}</span>
              </div>
            )}
          </div>

          <div style={{ background: APPLE_BG, borderRadius: 24, padding: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: APPLE_GRAY, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              Select Topic
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TOPICS.map((t, i) => (
                <button key={t.id} onClick={() => isIdle && setTopicIdx(i)}
                  style={{
                    padding: "12px 16px", borderRadius: 14, fontSize: 15, fontWeight: 500,
                    textAlign: "left", border: "1px solid",
                    borderColor: topicIdx === i ? "transparent" : "#d2d2d7",
                    background: topicIdx === i ? APPLE_BLACK : "#fff",
                    color: topicIdx === i ? "#fff" : APPLE_BLACK,
                    cursor: isIdle ? "pointer" : "default",
                    transition: "all 0.2s",
                  }}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: APPLE_BG, borderRadius: 32, padding: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: APPLE_GRAY, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
              Speaking Prompt
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.01em", margin: "0 0 12px" }}>
              {topic.prompt}
            </h2>
            <p style={{ fontSize: 17, color: APPLE_GRAY, lineHeight: 1.5 }}>{topic.hint}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { label: "Words", value: wordCount },
              { label: "WPM", value: wpm > 0 ? wpm : "—" },
              { label: "Sentences", value: sentCount },
              { label: "Pauses", value: pauseCount },
            ].map((m) => (
              <div key={m.label} style={{ background: APPLE_BG, borderRadius: 22, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: APPLE_GRAY, marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 24, fontWeight: 600 }}>{m.value}</div>
              </div>
            ))}
          </div>

          <div style={{ background: APPLE_BG, borderRadius: 32, padding: 32, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: APPLE_BLACK }}>Live Transcript</span>
              {isRecording && <AudioBars active={true} />}
            </div>
            <div style={{ fontSize: 19, lineHeight: 1.6, color: APPLE_BLACK, fontWeight: 400 }}>
              {!fullText && !interimText ? (
                <span style={{ color: APPLE_GRAY }}>Assessment details will appear here as you speak...</span>
              ) : (
                <>
                  <span>{fullText.trim()}</span>
                  <span style={{ color: APPLE_GRAY, marginLeft: 6 }}>{interimText}</span>
                </>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {(isIdle || isDone) && (
              <button onClick={handleStart} style={{
                background: APPLE_BLACK, color: "#fff", padding: "18px 36px", borderRadius: 99,
                fontSize: 17, fontWeight: 500, border: "none", cursor: "pointer"
              }}>
                {isDone ? "Try Again" : "Start Assessment"}
              </button>
            )}
            {isRecording && (
              <button onClick={handleStop} style={{
                background: "#ff3b30", color: "#fff", padding: "18px 36px", borderRadius: 99,
                fontSize: 17, fontWeight: 500, border: "none", cursor: "pointer"
              }}>Stop Session</button>
            )}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: timeLeft < 10 ? "#ff3b30" : APPLE_BLACK }}>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div style={{ background: "#fff", borderRadius: 32, padding: 40, border: "1px solid #d2d2d7", marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 40, borderBottom: "1px solid #d2d2d7", paddingBottom: 40, marginBottom: 40 }}>
            <CircleScore value={result.overall} size={100} stroke={8} color={APPLE_BLACK} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: APPLE_GRAY, textTransform: "uppercase" }}>Test Result</div>
              <h3 style={{ fontSize: 40, fontWeight: 600, margin: "4px 0" }}>{result.cefr} Level</h3>
              <p style={{ fontSize: 19, color: APPLE_GRAY }}>{result.band}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 60px" }}>
            <ScoreBar label="Fluency" value={result.scores.fluency} animate={animateScores} />
            <ScoreBar label="Vocabulary" value={result.scores.vocab} animate={animateScores} />
            <ScoreBar label="Grammar" value={result.scores.grammar} animate={animateScores} />
            <ScoreBar label="Coherence" value={result.scores.coherence} animate={animateScores} />
            <ScoreBar label="Speaking Pace" value={result.scores.pace} animate={animateScores} />
            <ScoreBar label="Confidence" value={result.scores.confidence} animate={animateScores} />
          </div>
        </div>
      )}
    </div>
    </>
  );
}