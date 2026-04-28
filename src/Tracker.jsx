import { useState } from "react";

const syllabus = [
  {
    id: 1,
    title: "Module 1",
    subtitle: "Introduction to C Programming",
    color: "#00C9A7",
    topics: [
      { id: "1.1", name: "Overview of C – History and Features" },
      { id: "1.2", name: "Structure of a C Program" },
      { id: "1.3", name: "Compiling and Running a C Program" },
      { id: "1.4", name: "Data Types, Variables and Constants" },
      { id: "1.5", name: "Operators and Expressions" },
      { id: "1.6", name: "Input/Output: printf() and scanf()" },
      { id: "1.7", name: "Type Conversion and Casting" },
    ],
    notes: "Start here! Understand how a basic C program is structured before moving on.",
  },
  {
    id: 2,
    title: "Module 2",
    subtitle: "Control Structures & Functions",
    color: "#845EF7",
    topics: [
      { id: "2.1", name: "Decision Making: if, if-else, nested if, switch" },
      { id: "2.2", name: "Loops: while, do-while, for" },
      { id: "2.3", name: "Jump Statements: break, continue, goto" },
      { id: "2.4", name: "Functions – Declaration, Definition, Call" },
      { id: "2.5", name: "Recursion" },
      { id: "2.6", name: "Storage Classes: auto, extern, static, register" },
      { id: "2.7", name: "Scope and Lifetime of Variables" },
    ],
    notes: "Practice loops with small programs daily. Recursion needs extra attention!",
  },
  {
    id: 3,
    title: "Module 3",
    subtitle: "Arrays, Strings & Pointers",
    color: "#FF6B6B",
    topics: [
      { id: "3.1", name: "Arrays – 1D and 2D" },
      { id: "3.2", name: "String Handling Functions" },
      { id: "3.3", name: "Pointers – Declaration and Initialization" },
      { id: "3.4", name: "Pointer Arithmetic" },
      { id: "3.5", name: "Pointers and Arrays" },
      { id: "3.6", name: "Pointers and Functions (Call by Reference)" },
      { id: "3.7", name: "Dynamic Memory Allocation: malloc, calloc, free" },
    ],
    notes: "Pointers are tough! Draw memory diagrams when studying this module.",
  },
  {
    id: 4,
    title: "Module 4",
    subtitle: "Structures, Unions & File Handling",
    color: "#FFA500",
    topics: [
      { id: "4.1", name: "Structures – Declaration and Access" },
      { id: "4.2", name: "Array of Structures" },
      { id: "4.3", name: "Nested Structures" },
      { id: "4.4", name: "Unions" },
      { id: "4.5", name: "Typedef and Enum" },
      { id: "4.6", name: "File Handling – fopen, fclose, fread, fwrite" },
      { id: "4.7", name: "Command Line Arguments" },
    ],
    notes: "File handling questions are common in KTU exams. Don't skip!",
  },
];

const STORAGE_KEY = "ktu_c_progress";

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [activeModule, setActiveModule] = useState(null);
  const [view, setView] = useState("home"); // home | module

  const toggleTopic = (topicId) => {
    const updated = { ...progress, [topicId]: !progress[topicId] };
    setProgress(updated);
    saveProgress(updated);
  };

  const totalTopics = syllabus.reduce((a, m) => a + m.topics.length, 0);
  const doneTopics = syllabus.reduce(
    (a, m) => a + m.topics.filter((t) => progress[t.id]).length,
    0
  );
  const overallPct = Math.round((doneTopics / totalTopics) * 100);

  const openModule = (mod) => {
    setActiveModule(mod);
    setView("module");
  };

  const goHome = () => setView("home");

  const mod = activeModule;
  const modDone = mod ? mod.topics.filter((t) => progress[t.id]).length : 0;
  const modPct = mod ? Math.round((modDone / mod.topics.length) * 100) : 0;

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        {view === "module" && (
          <button onClick={goHome} style={styles.backBtn}>← Back</button>
        )}
        <div>
          <div style={styles.logoRow}>
            <span style={styles.logo}>⌨️</span>
            <span style={styles.appTitle}>KTU C Programming Tracker</span>
          </div>
          <div style={styles.subtitle}>GXEST204 • B.Tech S2 • KGU</div>
        </div>
      </div>

      {view === "home" && (
        <div>
          {/* Overall Progress */}
          <div style={styles.card}>
            <div style={styles.progressLabel}>
              <span>Overall Progress</span>
              <span style={{ color: "#00C9A7", fontWeight: 700 }}>{overallPct}%</span>
            </div>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: `${overallPct}%`, background: "#00C9A7" }} />
            </div>
            <div style={styles.progressSub}>{doneTopics} of {totalTopics} topics completed</div>
          </div>

          {/* Module Cards */}
          <div style={styles.sectionTitle}>📚 Modules</div>
          {syllabus.map((mod) => {
            const done = mod.topics.filter((t) => progress[t.id]).length;
            const pct = Math.round((done / mod.topics.length) * 100);
            return (
              <div
                key={mod.id}
                style={{ ...styles.moduleCard, borderLeft: `5px solid ${mod.color}` }}
                onClick={() => openModule(mod)}
              >
                <div style={styles.moduleTop}>
                  <div>
                    <div style={{ ...styles.moduleTitle, color: mod.color }}>{mod.title}</div>
                    <div style={styles.moduleSubtitle}>{mod.subtitle}</div>
                  </div>
                  <div style={{ ...styles.pctBadge, background: mod.color + "22", color: mod.color }}>
                    {pct}%
                  </div>
                </div>
                <div style={styles.barBg}>
                  <div style={{ ...styles.barFill, width: `${pct}%`, background: mod.color }} />
                </div>
                <div style={styles.moduleTopicCount}>{done}/{mod.topics.length} topics • Tap to study →</div>
              </div>
            );
          })}

          {/* Tips */}
          <div style={styles.sectionTitle}>💡 Study Tips for Beginners</div>
          <div style={styles.card}>
            {[
              "Start with Module 1 – don't skip basics!",
              "Write code by hand first, then type it.",
              "Use an online compiler like OnlineGDB to practice.",
              "Study 1-2 topics per day consistently.",
              "Draw diagrams for pointers (Module 3).",
              "Past KTU papers are your best exam prep.",
            ].map((tip, i) => (
              <div key={i} style={styles.tip}>
                <span style={styles.tipNum}>{i + 1}</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "module" && mod && (
        <div>
          <div style={{ ...styles.card, borderTop: `4px solid ${mod.color}` }}>
            <div style={{ ...styles.moduleTitle, color: mod.color, fontSize: 20 }}>{mod.title}</div>
            <div style={styles.moduleSubtitle}>{mod.subtitle}</div>
            <div style={styles.progressLabel}>
              <span>Progress</span>
              <span style={{ color: mod.color, fontWeight: 700 }}>{modPct}%</span>
            </div>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: `${modPct}%`, background: mod.color }} />
            </div>
          </div>

          <div style={styles.sectionTitle}>📝 Topics</div>
          {mod.topics.map((topic) => {
            const done = !!progress[topic.id];
            return (
              <div
                key={topic.id}
                style={{
                  ...styles.topicRow,
                  background: done ? mod.color + "18" : "#1e1e2e",
                  borderLeft: done ? `4px solid ${mod.color}` : "4px solid #333",
                }}
                onClick={() => toggleTopic(topic.id)}
              >
                <div style={{
                  ...styles.checkbox,
                  background: done ? mod.color : "transparent",
                  border: `2px solid ${done ? mod.color : "#555"}`,
                }}>
                  {done && <span style={{ color: "#000", fontSize: 12, fontWeight: 900 }}>✓</span>}
                </div>
                <div>
                  <div style={{ ...styles.topicId, color: mod.color }}>{topic.id}</div>
                  <div style={{ ...styles.topicName, textDecoration: done ? "line-through" : "none", opacity: done ? 0.5 : 1 }}>
                    {topic.name}
                  </div>
                </div>
              </div>
            );
          })}

          <div style={styles.sectionTitle}>🗒️ Notes for This Module</div>
          <div style={{ ...styles.card, borderLeft: `4px solid ${mod.color}` }}>
            <div style={styles.noteText}>{mod.notes}</div>
          </div>

          <button
            style={{ ...styles.resetBtn, borderColor: mod.color, color: mod.color }}
            onClick={() => {
              const updated = { ...progress };
              mod.topics.forEach((t) => delete updated[t.id]);
              setProgress(updated);
              saveProgress(updated);
            }}
          >
            Reset Module Progress
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  root: {
    background: "#0f0f1a",
    minHeight: "100vh",
    color: "#e0e0f0",
    fontFamily: "'Courier New', monospace",
    padding: "16px",
    Width: "100",
    margin: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: "1px solid #2a2a3e",
  },
  backBtn: {
    background: "none",
    border: "1px solid #444",
    color: "#aaa",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    whiteSpace: "nowrap",
  },
  logoRow: { display: "flex", alignItems: "center", gap: 8 },
  logo: { fontSize: 22 },
  appTitle: { fontSize: 15, fontWeight: 700, color: "#fff" },
  subtitle: { fontSize: 11, color: "#666", marginTop: 2 },
  card: {
    background: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    marginBottom: 8,
    color: "#aaa",
  },
  barBg: {
    background: "#2a2a3e",
    borderRadius: 99,
    height: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  barFill: {
    height: "100%",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },
  progressSub: { fontSize: 11, color: "#666", textAlign: "right" },
  sectionTitle: {
    fontSize: 13,
    color: "#777",
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
    textTransform: "uppercase",
  },
  moduleCard: {
    background: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    cursor: "pointer",
    transition: "transform 0.15s",
  },
  moduleTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  moduleTitle: { fontSize: 16, fontWeight: 700 },
  moduleSubtitle: { fontSize: 12, color: "#888", marginTop: 2 },
  pctBadge: {
    borderRadius: 20,
    padding: "4px 10px",
    fontSize: 13,
    fontWeight: 700,
  },
  moduleTopicCount: { fontSize: 11, color: "#666", marginTop: 6 },
  topicRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 8,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
  },
  topicId: { fontSize: 10, fontWeight: 700, marginBottom: 2 },
  topicName: { fontSize: 13, color: "#ddd", lineHeight: 1.4 },
  tip: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 10,
    fontSize: 13,
    color: "#bbb",
    lineHeight: 1.5,
  },
  tipNum: {
    background: "#2a2a3e",
    color: "#00C9A7",
    borderRadius: 6,
    padding: "1px 7px",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 1,
  },
  noteText: { fontSize: 13, color: "#ccc", lineHeight: 1.6, fontStyle: "italic" },
  resetBtn: {
    background: "transparent",
    border: "1px solid",
    borderRadius: 8,
    padding: "10px 16px",
    fontSize: 12,
    cursor: "pointer",
    marginTop: 8,
    marginBottom: 24,
    width: "100%",
    letterSpacing: 0.5,
  },
};
