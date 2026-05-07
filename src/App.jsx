import React, { useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  Brain,
  CheckCircle2,
  Cloud,
  ChevronRight,
  ClipboardList,
  Cpu,
  Database,
  Dna,
  Download,
  Globe2,
  FileText,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  LockKeyhole,
  LogIn,
  Mic,
  Microscope,
  Moon,
  Network,
  RadioTower,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Siren,
  Sparkles,
  Stethoscope,
  Sun,
  Upload,
  Users,
  Zap
} from "lucide-react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

const symptomCatalog = [
  {
    id: "fever",
    label: "Fever",
    weight: 18,
    hint: "Elevated temperature or chills"
  },
  {
    id: "cough",
    label: "Cough",
    weight: 14,
    hint: "Dry or productive cough"
  },
  {
    id: "headache",
    label: "Headache",
    weight: 9,
    hint: "Persistent head pain"
  },
  {
    id: "fatigue",
    label: "Fatigue",
    weight: 10,
    hint: "Weakness or low energy"
  },
  {
    id: "chest-pain",
    label: "Chest pain",
    weight: 16,
    hint: "Pressure, tightness, or pain"
  },
  {
    id: "breathing",
    label: "Breathing difficulty",
    weight: 20,
    hint: "Shortness of breath"
  },
  {
    id: "sore-throat",
    label: "Sore throat",
    weight: 8,
    hint: "Throat irritation"
  },
  {
    id: "nausea",
    label: "Nausea",
    weight: 8,
    hint: "Vomiting or stomach upset"
  },
  {
    id: "rash",
    label: "Skin rash",
    weight: 12,
    hint: "Redness, spots, or irritation"
  },
  {
    id: "joint-pain",
    label: "Joint pain",
    weight: 11,
    hint: "Muscle or joint aches"
  }
];

const diseaseProfiles = [
  {
    name: "Influenza-like Viral Syndrome",
    pathogen: "Viral",
    symptoms: ["fever", "cough", "headache", "fatigue", "sore-throat"],
    riskBias: 0.04,
    suggestions: [
      "Hydration, rest, and temperature monitoring",
      "Mask usage and isolation until fever improves",
      "Medical review if fever persists beyond 3 days"
    ],
    explanation:
      "The fever, cough, fatigue, headache, and throat pattern is most consistent with a viral respiratory infection."
  },
  {
    name: "Bacterial Pneumonia Risk",
    pathogen: "Bacterial",
    symptoms: ["fever", "cough", "chest-pain", "breathing", "fatigue"],
    riskBias: 0.07,
    suggestions: [
      "Urgent clinician assessment for chest imaging and oxygen evaluation",
      "Do not self-start antibiotics without medical supervision",
      "Watch oxygen saturation and worsening breathlessness"
    ],
    explanation:
      "Chest pain, breathing difficulty, fever, and cough create a respiratory red-flag cluster."
  },
  {
    name: "Dengue-like Viral Fever",
    pathogen: "Viral",
    symptoms: ["fever", "headache", "joint-pain", "rash", "fatigue", "nausea"],
    riskBias: 0.03,
    suggestions: [
      "Check platelet count and hydration status",
      "Avoid aspirin or ibuprofen unless a clinician approves",
      "Seek care for bleeding, severe abdominal pain, or dizziness"
    ],
    explanation:
      "High fever with headache, joint pain, rash, nausea, and fatigue can indicate a viral fever pattern."
  },
  {
    name: "Fungal Respiratory Infection",
    pathogen: "Fungal",
    symptoms: ["cough", "breathing", "chest-pain", "fatigue"],
    riskBias: -0.01,
    suggestions: [
      "Consider specialist review if symptoms are chronic or immunity is low",
      "Report history of mold exposure or long-term cough",
      "Medical testing is required before antifungal therapy"
    ],
    explanation:
      "Breathing difficulty with chest discomfort and persistent cough can need fungal screening in selected patients."
  },
  {
    name: "Malaria-like Parasitic Infection",
    pathogen: "Parasitic",
    symptoms: ["fever", "headache", "fatigue", "nausea", "joint-pain"],
    riskBias: 0.02,
    suggestions: [
      "Request rapid malaria test or blood smear if exposure risk exists",
      "Track fever spikes and chills",
      "Seek urgent care for confusion, jaundice, or severe weakness"
    ],
    explanation:
      "Fever with headache, fatigue, nausea, and body aches can match a parasitic fever profile in endemic settings."
  },
  {
    name: "Allergic or Irritant Reaction",
    pathogen: "Non-infectious",
    symptoms: ["rash", "cough", "sore-throat", "breathing"],
    riskBias: -0.04,
    suggestions: [
      "Remove likely irritant exposure when possible",
      "Seek emergency care for facial swelling or severe breathing trouble",
      "Clinician review if rash spreads or wheezing occurs"
    ],
    explanation:
      "Rash with throat or breathing symptoms may be allergic or irritant-related rather than pathogen-driven."
  }
];

const analyticsSeries = {
  weekly: [42, 47, 53, 49, 61, 72, 68],
  risk: [18, 35, 29, 12, 6],
  pathogens: [46, 27, 12, 9, 6],
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
};

const activityRows = [
  ["08:10", "Symptom scan", "Moderate viral risk"],
  ["09:42", "Report uploaded", "CRP flagged high"],
  ["11:05", "Chatbot triage", "Emergency warning shown"],
  ["13:20", "Dataset sync", "1,248 records indexed"]
];

const adminUsers = [
  ["U-1041", "Aarav Mehta", "Patient", "Active"],
  ["D-2204", "Dr. Sana Roy", "Clinician", "Active"],
  ["R-0890", "Rural Health Center", "Partner", "Review"],
  ["A-0007", "System Admin", "Admin", "Active"]
];

const reminders = [
  "Recheck oxygen saturation at 8:00 PM",
  "Upload CBC report after lab result arrives",
  "Medicine reminder: clinician-prescribed dose only"
];

const initialChat = [
  {
    role: "assistant",
    text:
      "Hello, I am MedCentinum Assist. Share symptoms, report values, or a care question and I will help you triage the next step."
  }
];

const navigation = [
  { id: "overview", label: "Overview", icon: Hospital },
  { id: "auth", label: "Login", icon: LogIn },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "command", label: "Global Command", icon: Globe2 },
  { id: "symptoms", label: "Symptom Checker", icon: Stethoscope },
  { id: "result", label: "Prediction", icon: Activity },
  { id: "chatbot", label: "AI Chatbot", icon: Bot },
  { id: "reports", label: "Report Analyzer", icon: FileText },
  { id: "admin", label: "Admin Panel", icon: Settings }
];

const deploymentSignals = [
  ["Public deployment", "Vercel, Netlify, Firebase Hosting, or any CDN", Cloud],
  ["Realtime cloud mode", "Firebase-ready records, alerts, chat, and analytics", Database],
  ["Responsible AI", "Explainability, risk flags, and clinician escalation", Brain],
  ["Secure health data", "Auth, privacy boundaries, audit trails, and encryption-ready flow", LockKeyhole]
];

const globalWatchRegions = [
  ["North Zone", "Viral respiratory", 78, "Rising", "Fever, cough, fatigue clusters increased 14%"],
  ["Coastal Belt", "Bacterial pneumonia", 62, "Watch", "Breathing difficulty and chest pain reports need triage"],
  ["Rural Hub", "Dengue-like fever", 71, "Rising", "Platelet and rash signals increased in report analyzer"],
  ["Metro Grid", "Allergic/irritant", 38, "Stable", "Air quality linked cough and throat irritation patterns"]
];

const advancedModules = [
  ["AI Triage Brain", "Multi-signal symptom scoring with explainable disease and pathogen ranking", Cpu],
  ["Pathogen Intelligence", "Viral, bacterial, fungal, parasitic, and non-infectious classification", Dna],
  ["Report AI Lab", "CBC, CRP, glucose, platelet, hemoglobin, and oxygen abnormality detection", Microscope],
  ["Emergency Radar", "Critical-risk escalation for chest pain, low oxygen, high fever, and breathing distress", Siren],
  ["Hospital Network", "Cloud records designed for clinics, rural centers, and telemedicine workflows", Network],
  ["Live Surveillance", "Regional monitoring layer for trends, outbreaks, reminders, and admin governance", RadioTower]
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function calculatePrediction(selectedSymptoms, vitals) {
  const oxygen = Number(vitals.oxygen);

  if (!selectedSymptoms.length) {
    return {
      top: {
        name: "Insufficient symptom data",
        pathogen: "Undetermined",
        suggestions: [
          "Add symptoms to generate a prediction",
          "Use voice input or manual selection",
          "Seek medical care for severe or sudden symptoms"
        ],
        explanation:
          "The model needs at least one symptom before it can rank disease and pathogen patterns."
      },
      confidence: 0,
      risk: "Pending",
      riskScore: 0,
      scores: diseaseProfiles.map((profile) => ({ ...profile, score: 0 })),
      emergency: false
    };
  }

  const selectedSet = new Set(selectedSymptoms);
  const symptomWeight = Object.fromEntries(
    symptomCatalog.map((symptom) => [symptom.id, symptom.weight])
  );

  const scores = diseaseProfiles
    .map((profile) => {
      const profileTotal = profile.symptoms.reduce(
        (sum, symptomId) => sum + (symptomWeight[symptomId] || 8),
        0
      );
      const matched = profile.symptoms.reduce(
        (sum, symptomId) =>
          sum + (selectedSet.has(symptomId) ? symptomWeight[symptomId] || 8 : 0),
        0
      );
      const overlap = matched / profileTotal;
      const extraSymptoms = Math.max(
        0,
        selectedSymptoms.length - profile.symptoms.length
      );
      let clinicalBoost = 0;

      if (Number(vitals.temperature) >= 39 && selectedSet.has("fever")) {
        clinicalBoost += 0.06;
      }
      if (
        oxygen > 0 &&
        oxygen < 94 &&
        (profile.symptoms.includes("breathing") ||
          profile.symptoms.includes("chest-pain"))
      ) {
        clinicalBoost += 0.14;
      }
      if (
        Number(vitals.duration) >= 7 &&
        ["Bacterial", "Fungal"].includes(profile.pathogen)
      ) {
        clinicalBoost += 0.05;
      }
      if (Number(vitals.age) >= 60 && selectedSet.has("breathing")) {
        clinicalBoost += 0.04;
      }

      const score = clamp(
        overlap + profile.riskBias + clinicalBoost - extraSymptoms * 0.015,
        0,
        0.98
      );

      return {
        ...profile,
        score: Math.round(score * 100)
      };
    })
    .sort((a, b) => b.score - a.score);

  const top = scores[0];
  const emergency =
    selectedSet.has("chest-pain") ||
    selectedSet.has("breathing") ||
    (oxygen > 0 && oxygen < 94) ||
    Number(vitals.temperature) >= 40;

  const riskScore = clamp(
    top.score +
      (emergency ? 12 : 0) +
      (Number(vitals.age) >= 60 ? 5 : 0) +
      (Number(vitals.duration) >= 7 ? 4 : 0),
    0,
    100
  );

  let risk = "Low";
  if (riskScore >= 82 || (oxygen > 0 && oxygen < 92)) risk = "Critical";
  else if (riskScore >= 66 || emergency) risk = "High";
  else if (riskScore >= 42) risk = "Moderate";

  return {
    top,
    confidence: top.score,
    risk,
    riskScore,
    scores,
    emergency
  };
}

function parseSymptomsFromSpeech(text) {
  const normalized = text.toLowerCase();
  return symptomCatalog
    .filter((symptom) => {
      if (normalized.includes(symptom.label.toLowerCase())) return true;
      if (symptom.id === "breathing") return normalized.includes("breath");
      if (symptom.id === "chest-pain") {
        return normalized.includes("chest") || normalized.includes("pressure");
      }
      if (symptom.id === "sore-throat") return normalized.includes("throat");
      if (symptom.id === "joint-pain") {
        return normalized.includes("joint") || normalized.includes("body ache");
      }
      return false;
    })
    .map((symptom) => symptom.id);
}

function generateBotReply(input, prediction) {
  const text = input.toLowerCase();
  const top = prediction.top.name;

  if (text.includes("emergency") || text.includes("chest") || text.includes("breath")) {
    return "Chest pain, severe breathing difficulty, bluish lips, fainting, confusion, or oxygen below 94% should be treated as urgent. Please contact emergency care or a clinician immediately.";
  }
  if (text.includes("fever") || text.includes("cough") || text.includes("symptom")) {
    return `Based on the active symptom scan, the leading pattern is ${top} with ${prediction.confidence}% confidence. Track fever duration, oxygen, hydration, and any worsening symptoms.`;
  }
  if (text.includes("pathogen") || text.includes("viral") || text.includes("bacterial")) {
    return `The current pathogen category is ${prediction.top.pathogen}. This is a triage classification, not a lab diagnosis, so confirm with a medical test when symptoms are significant.`;
  }
  if (text.includes("report") || text.includes("blood") || text.includes("platelet")) {
    return "Upload the report in the analyzer and paste key values such as WBC, CRP, hemoglobin, platelets, glucose, or oxygen saturation. I can flag abnormal ranges and connect them to risk context.";
  }
  if (text.includes("medicine") || text.includes("reminder")) {
    return "I can help organize reminders, but medicines should follow a clinician prescription. For fever, avoid mixing medicines and avoid aspirin if dengue is possible unless a doctor approves.";
  }

  return "I can help with symptom triage, pathogen category reasoning, report flags, precautions, and next-step guidance. For severe or rapidly worsening symptoms, please seek professional care.";
}

function analyzeReportText(reportText, file) {
  const text = reportText.toLowerCase();
  const rules = [
    {
      label: "White blood cells",
      normal: "4.0 to 11.0 x10^9/L",
      unit: "x10^9/L",
      patterns: [/wbc[^0-9]*([0-9]+(?:\.[0-9]+)?)/, /white blood cells[^0-9]*([0-9]+(?:\.[0-9]+)?)/],
      low: 4,
      high: 11,
      highMessage: "Possible infection or inflammation signal",
      lowMessage: "Possible immune suppression or viral effect"
    },
    {
      label: "Platelets",
      normal: "150000 to 450000 /uL",
      unit: "/uL",
      patterns: [/platelet[s]?[^0-9]*([0-9]+(?:\.[0-9]+)?)/],
      low: 150000,
      high: 450000,
      highMessage: "Can rise with inflammation or recovery phase",
      lowMessage: "Low platelets can be important in dengue-like illness"
    },
    {
      label: "Hemoglobin",
      normal: "12.0 to 17.5 g/dL",
      unit: "g/dL",
      patterns: [/hemoglobin[^0-9]*([0-9]+(?:\.[0-9]+)?)/, /hb[^0-9]*([0-9]+(?:\.[0-9]+)?)/],
      low: 12,
      high: 17.5,
      highMessage: "Can indicate dehydration or other causes",
      lowMessage: "Possible anemia or blood loss signal"
    },
    {
      label: "CRP",
      normal: "0 to 5 mg/L",
      unit: "mg/L",
      patterns: [/crp[^0-9]*([0-9]+(?:\.[0-9]+)?)/, /c-reactive protein[^0-9]*([0-9]+(?:\.[0-9]+)?)/],
      low: 0,
      high: 5,
      highMessage: "Inflammation marker is elevated",
      lowMessage: "Below reference range"
    },
    {
      label: "Blood glucose",
      normal: "70 to 140 mg/dL",
      unit: "mg/dL",
      patterns: [/glucose[^0-9]*([0-9]+(?:\.[0-9]+)?)/, /sugar[^0-9]*([0-9]+(?:\.[0-9]+)?)/],
      low: 70,
      high: 140,
      highMessage: "High glucose can increase infection risk",
      lowMessage: "Low glucose can need prompt correction"
    },
    {
      label: "Oxygen saturation",
      normal: "95 to 100%",
      unit: "%",
      patterns: [/spo2[^0-9]*([0-9]+(?:\.[0-9]+)?)/, /oxygen[^0-9]*([0-9]+(?:\.[0-9]+)?)/],
      low: 95,
      high: 100,
      highMessage: "Above expected range, verify reading",
      lowMessage: "Low oxygen is a respiratory warning sign"
    }
  ];

  const values = rules
    .map((rule) => {
      const match = rule.patterns
        .map((pattern) => text.match(pattern))
        .find(Boolean);
      if (!match) return null;

      const value = Number(match[1]);
      let status = "Normal";
      let message = "Within the reference range";
      if (value < rule.low) {
        status = "Low";
        message = rule.lowMessage;
      } else if (value > rule.high) {
        status = "High";
        message = rule.highMessage;
      }

      return {
        label: rule.label,
        value,
        unit: rule.unit,
        normal: rule.normal,
        status,
        message
      };
    })
    .filter(Boolean);

  const abnormal = values.filter((value) => value.status !== "Normal");
  const fileSignals = [];

  if (file?.name?.toLowerCase().includes("dengue")) {
    fileSignals.push("Filename suggests dengue screening context");
  }
  if (file?.name?.toLowerCase().includes("cbc")) {
    fileSignals.push("CBC report detected from filename");
  }

  return {
    values,
    abnormal,
    fileSignals,
    summary:
      values.length === 0
        ? "File accepted. Paste visible values from the report to extract abnormal findings."
        : abnormal.length
          ? `${abnormal.length} abnormal marker${abnormal.length > 1 ? "s" : ""} detected.`
          : "No abnormal markers detected from the pasted values."
  };
}

function MetricCard({ icon: Icon, label, value, detail, tone = "cyan" }) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <div className="metric-icon" aria-hidden="true">
        <Icon size={20} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}

function ViewHeader({ eyebrow, title, children }) {
  return (
    <div className="view-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function App() {
  const [activeView, setActiveView] = useState("overview");
  const [theme, setTheme] = useState("dark");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState({
    name: "Dr. Tejendra",
    email: "demo@medcentinum.ai",
    role: "Clinician"
  });
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState([
    "fever",
    "cough",
    "fatigue"
  ]);
  const [symptomNarrative, setSymptomNarrative] = useState(
    "Fever, cough, and fatigue for three days."
  );
  const [vitals, setVitals] = useState({
    age: 29,
    temperature: 38.4,
    oxygen: 97,
    duration: 3
  });
  const [voiceStatus, setVoiceStatus] = useState("Voice input ready");
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState(initialChat);
  const [chatInput, setChatInput] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [reportPreview, setReportPreview] = useState("");
  const [reportText, setReportText] = useState(
    "CBC report: WBC 13.4, Platelets 118000, Hemoglobin 11.1, CRP 18, Glucose 126, SpO2 96"
  );
  const [reportAnalysis, setReportAnalysis] = useState(() =>
    analyzeReportText(
      "CBC report: WBC 13.4, Platelets 118000, Hemoglobin 11.1, CRP 18, Glucose 126, SpO2 96",
      null
    )
  );
  const recognitionRef = useRef(null);

  const prediction = useMemo(
    () => calculatePrediction(selectedSymptoms, vitals),
    [selectedSymptoms, vitals]
  );

  const lineData = useMemo(
    () => ({
      labels: analyticsSeries.labels,
      datasets: [
        {
          label: "Predictions",
          data: analyticsSeries.weekly,
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56, 189, 248, 0.18)",
          fill: true,
          tension: 0.45,
          pointRadius: 4,
          pointBackgroundColor: "#7dd3fc"
        }
      ]
    }),
    []
  );

  const barData = useMemo(
    () => ({
      labels: ["Low", "Moderate", "High", "Critical", "Pending"],
      datasets: [
        {
          label: "Risk cases",
          data: analyticsSeries.risk,
          borderRadius: 8,
          backgroundColor: ["#22c55e", "#facc15", "#fb923c", "#ef4444", "#8b5cf6"]
        }
      ]
    }),
    []
  );

  const doughnutData = useMemo(
    () => ({
      labels: ["Viral", "Bacterial", "Fungal", "Parasitic", "Other"],
      datasets: [
        {
          data: analyticsSeries.pathogens,
          backgroundColor: ["#38bdf8", "#14b8a6", "#a78bfa", "#f59e0b", "#f43f5e"],
          borderColor: "transparent",
          hoverOffset: 8
        }
      ]
    }),
    []
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: theme === "dark" ? "#cbd5e1" : "#334155" }
      },
      tooltip: {
        backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
        titleColor: theme === "dark" ? "#f8fafc" : "#0f172a",
        bodyColor: theme === "dark" ? "#e2e8f0" : "#334155",
        borderColor: "rgba(56, 189, 248, 0.28)",
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: { color: theme === "dark" ? "#94a3b8" : "#475569" },
        grid: { color: "rgba(148, 163, 184, 0.12)" }
      },
      y: {
        ticks: { color: theme === "dark" ? "#94a3b8" : "#475569" },
        grid: { color: "rgba(148, 163, 184, 0.12)" }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: theme === "dark" ? "#cbd5e1" : "#334155" }
      }
    }
  };

  function toggleSymptom(symptomId) {
    setSelectedSymptoms((current) =>
      current.includes(symptomId)
        ? current.filter((id) => id !== symptomId)
        : [...current, symptomId]
    );
  }

  function handleVitalChange(key, value) {
    setVitals((current) => ({ ...current, [key]: value }));
  }

  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus("Speech recognition is not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus("Listening for symptoms...");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const parsed = parseSymptomsFromSpeech(transcript);
      setSymptomNarrative(transcript);
      setSelectedSymptoms((current) => Array.from(new Set([...current, ...parsed])));
      setVoiceStatus(
        parsed.length
          ? `Captured ${parsed.length} symptom${parsed.length > 1 ? "s" : ""}`
          : "Captured voice note. Add symptoms manually if needed."
      );
    };
    recognition.onerror = () => {
      setVoiceStatus("Voice capture failed. Try again or type symptoms manually.");
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function handleAuthSubmit(event) {
    event.preventDefault();
    setUser({
      name: authForm.name || user.name,
      email: authForm.email || user.email,
      role: authMode === "register" ? "Patient" : user.role
    });
    setAuthForm({ name: "", email: "", password: "" });
    setActiveView("dashboard");
  }

  function sendChatMessage(event) {
    event.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const reply = generateBotReply(trimmed, prediction);
    setChatHistory((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: reply }
    ]);
    setChatInput("");
  }

  function handleReportFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (reportPreview) {
      URL.revokeObjectURL(reportPreview);
    }

    setReportFile(file);
    if (file.type.startsWith("image/")) {
      setReportPreview(URL.createObjectURL(file));
    } else {
      setReportPreview("");
    }
    setReportAnalysis(analyzeReportText(reportText, file));
  }

  function runReportAnalysis() {
    setReportAnalysis(analyzeReportText(reportText, reportFile));
  }

  function exportPredictionReport() {
    const selectedLabels = selectedSymptoms
      .map((id) => symptomCatalog.find((symptom) => symptom.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const reportWindow = window.open("", "_blank", "width=900,height=1100");
    if (!reportWindow) return;

    reportWindow.document.write(`
      <html>
        <head>
          <title>MedCentinum AI Prediction Report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #0f172a; padding: 32px; line-height: 1.5; }
            h1 { color: #075985; }
            .box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; margin: 16px 0; }
            strong { color: #0f766e; }
          </style>
        </head>
        <body>
          <h1>MedCentinum AI Prediction Report</h1>
          <p><strong>Patient:</strong> ${user.name}</p>
          <p><strong>Symptoms:</strong> ${selectedLabels || "None selected"}</p>
          <div class="box">
            <h2>${prediction.top.name}</h2>
            <p><strong>Pathogen category:</strong> ${prediction.top.pathogen}</p>
            <p><strong>Confidence:</strong> ${prediction.confidence}%</p>
            <p><strong>Risk level:</strong> ${prediction.risk}</p>
            <p>${prediction.top.explanation}</p>
          </div>
          <div class="box">
            <h2>Suggested next steps</h2>
            <ul>${prediction.top.suggestions
              .map((item) => `<li>${item}</li>`)
              .join("")}</ul>
          </div>
          <p>This AI report is for triage support and does not replace professional medical diagnosis.</p>
        </body>
      </html>
    `);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  }

  function renderOverview() {
    return (
      <section className="overview-view">
        <div className="hero-copy">
          <span className="eyebrow">AI healthcare intelligence platform</span>
          <h1>MedCentinum AI</h1>
          <p>
            A deployable pathogen detection and monitoring system for symptom
            triage, report analysis, explainable prediction, realtime cloud
            records, and healthcare operations.
          </p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => setActiveView("symptoms")}>
              <Stethoscope size={18} />
              Start scan
            </button>
            <button className="secondary-action" onClick={() => setActiveView("command")}>
              <Globe2 size={18} />
              Global command
            </button>
            <button className="secondary-action" onClick={() => setActiveView("dashboard")}>
              <BarChart3 size={18} />
              View analytics
            </button>
          </div>
        </div>

        <div className="scanner-stage" aria-label="Live AI scanner visualization">
          <div className="scanner-ring ring-one" />
          <div className="scanner-ring ring-two" />
          <div className="scanner-core">
            <HeartPulse size={54} />
            <strong>{prediction.risk}</strong>
            <span>{prediction.confidence}% confidence</span>
          </div>
          <div className="signal-card signal-a">
            <span>Pathogen</span>
            <strong>{prediction.top.pathogen}</strong>
          </div>
          <div className="signal-card signal-b">
            <span>Response</span>
            <strong>{prediction.emergency ? "Urgent" : "Monitor"}</strong>
          </div>
        </div>

        <div className="feature-grid">
          {[
            ["AI Symptom Checker", "Real-time scoring from manual or voice input", Stethoscope],
            ["Health Analytics", "Charts for disease, risk, and pathogen trends", BarChart3],
            ["Medical Reports", "PDF/JPG/PNG upload with abnormal value flags", FileText],
            ["AI Assistant", "Chat-based triage guidance and precautions", Bot],
            ["Cloud Records", "Firebase-ready patient records, chat, reports, and alerts", Cloud],
            ["Advanced AI Lab", "Explainability, triage governance, and pathogen intelligence", Brain]
          ].map(([title, text, Icon]) => (
            <article className="feature-card" key={title}>
              <Icon size={24} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="launch-grid">
          {deploymentSignals.map(([title, text, Icon]) => (
            <article className="launch-card" key={title}>
              <Icon size={22} />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function renderAuth() {
    return (
      <section className="auth-view">
        <ViewHeader
          eyebrow="Secure access"
          title={authMode === "login" ? "Login to MedCentinum AI" : "Create a healthcare profile"}
        />
        <form className="auth-form" onSubmit={handleAuthSubmit}>
          <div className="segmented-control" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === "register" ? "active" : ""}
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>

          {authMode === "register" && (
            <label>
              Full name
              <input
                value={authForm.name}
                onChange={(event) =>
                  setAuthForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Patient or clinician name"
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={authForm.email}
              onChange={(event) =>
                setAuthForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="name@clinic.org"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={authForm.password}
              onChange={(event) =>
                setAuthForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Encrypted in production"
            />
          </label>
          <div className="form-row">
            <label className="check-row">
              <input type="checkbox" defaultChecked />
              Use secure session
            </label>
            <button type="button" className="text-button">
              Forgot password
            </button>
          </div>
          <button className="primary-action" type="submit">
            <ShieldCheck size={18} />
            {authMode === "login" ? "Enter dashboard" : "Create account"}
          </button>
        </form>

        <div className="security-strip">
          <MetricCard icon={ShieldCheck} label="Password policy" value="AES-ready" detail="Hash and salt backend pattern" />
          <MetricCard icon={Database} label="Patient records" value="Cloud" detail="Firebase or MongoDB schema" tone="green" />
          <MetricCard icon={Bell} label="Alerts" value="Live" detail="Emergency and reminders" tone="amber" />
        </div>
      </section>
    );
  }

  function renderDashboard() {
    return (
      <section className="dashboard-view">
        <ViewHeader eyebrow="Clinical command center" title="Health analytics dashboard">
          <button className="secondary-action" onClick={() => setActiveView("reports")}>
            <Upload size={18} />
            Upload report
          </button>
        </ViewHeader>

        <div className="metric-grid">
          <MetricCard
            icon={Activity}
            label="Predictions today"
            value="68"
            detail="14% above weekly average"
          />
          <MetricCard
            icon={Zap}
            label="Current risk"
            value={prediction.risk}
            detail={`${prediction.riskScore}/100 composite score`}
            tone="amber"
          />
          <MetricCard
            icon={Sparkles}
            label="Model confidence"
            value={`${prediction.confidence}%`}
            detail={prediction.top.name}
            tone="violet"
          />
          <MetricCard
            icon={Bell}
            label="Active alerts"
            value={prediction.emergency ? "3" : "1"}
            detail={prediction.emergency ? "Emergency warning active" : "Routine monitoring"}
            tone="rose"
          />
        </div>

        <div className="chart-grid">
          <article className="chart-panel wide">
            <div className="panel-title">
              <h3>Real-time prediction volume</h3>
              <span>Last 7 days</span>
            </div>
            <div className="chart-box">
              <Line data={lineData} options={chartOptions} />
            </div>
          </article>
          <article className="chart-panel">
            <div className="panel-title">
              <h3>Risk distribution</h3>
              <span>Live triage mix</span>
            </div>
            <div className="chart-box">
              <Bar data={barData} options={chartOptions} />
            </div>
          </article>
          <article className="chart-panel">
            <div className="panel-title">
              <h3>Pathogen categories</h3>
              <span>AI classifications</span>
            </div>
            <div className="chart-box">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </article>
        </div>

        <div className="operations-grid">
          <article className="activity-panel">
            <div className="panel-title">
              <h3>User history</h3>
              <span>Recent events</span>
            </div>
            <div className="activity-list">
              {activityRows.map(([time, event, status]) => (
                <div className="activity-row" key={`${time}-${event}`}>
                  <strong>{time}</strong>
                  <span>{event}</span>
                  <em>{status}</em>
                </div>
              ))}
            </div>
          </article>
          <article className="activity-panel">
            <div className="panel-title">
              <h3>Notifications</h3>
              <span>Care reminders</span>
            </div>
            <div className="reminder-list">
              {reminders.map((reminder) => (
                <div className="reminder-row" key={reminder}>
                  <Bell size={18} />
                  <span>{reminder}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    );
  }

  function renderCommand() {
    return (
      <section className="command-view">
        <ViewHeader eyebrow="Advanced public platform" title="Global health intelligence command">
          <button className="secondary-action" onClick={() => setActiveView("reports")}>
            <Microscope size={18} />
            Analyze reports
          </button>
        </ViewHeader>

        <div className="command-hero">
          <div>
            <span className="eyebrow">Most advanced version</span>
            <h3>Realtime AI surveillance, clinical triage, and cloud-ready healthcare workflows in one deployable website.</h3>
            <p>
              MedCentinum AI now behaves like a complete product surface: public
              web deployment, mobile-ready layout, pathogen intelligence,
              emergency escalation, report analysis, chatbot guidance, and
              Firebase-ready data architecture.
            </p>
          </div>
          <div className="command-score">
            <strong>{prediction.riskScore}</strong>
            <span>live risk index</span>
            <em>{prediction.top.pathogen} signal</em>
          </div>
        </div>

        <div className="module-grid">
          {advancedModules.map(([title, text, Icon]) => (
            <article className="module-card" key={title}>
              <Icon size={24} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="command-grid">
          <article className="surveillance-panel">
            <div className="panel-title">
              <h3>Regional outbreak watch</h3>
              <span>AI public health layer</span>
            </div>
            <div className="region-list">
              {globalWatchRegions.map(([region, signal, score, status, detail]) => (
                <div className="region-row" key={region}>
                  <div>
                    <strong>{region}</strong>
                    <span>{signal}</span>
                  </div>
                  <meter min="0" max="100" value={score} />
                  <em>{score}%</em>
                  <small>{status}</small>
                  <p>{detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="surveillance-panel">
            <div className="panel-title">
              <h3>Deployment architecture</h3>
              <span>Works beyond localhost</span>
            </div>
            <div className="architecture-stack">
              {[
                ["Browser CDN", "Static Vite build served globally from HTTPS hosting"],
                ["Firebase Layer", "Auth, Firestore, Storage, and future functions-ready data path"],
                ["AI Runtime", "Local deterministic triage now, API model gateway ready later"],
                ["Mobile Expansion", "Android app and web share the same product concept"]
              ].map(([title, text]) => (
                <div className="architecture-row" key={title}>
                  <Cloud size={18} />
                  <div>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="surveillance-panel wide">
            <div className="panel-title">
              <h3>Clinical-grade roadmap</h3>
              <span>Presentation-ready differentiators</span>
            </div>
            <div className="roadmap-grid">
              {[
                ["Voice AI", "Browser speech input and Android microphone triage"],
                ["Explainable AI", "Symptom contribution and confidence ranking"],
                ["Report generation", "Printable PDF-style prediction report"],
                ["Realtime mode", "Firebase-ready web and Android architecture"],
                ["Governance", "Dataset quality, privacy scan, and admin controls"],
                ["Public launch", "Vercel/Netlify/Firebase hosting configuration included"]
              ].map(([title, text]) => (
                <div className="roadmap-item" key={title}>
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    );
  }

  function renderSymptoms() {
    return (
      <section className="symptom-view">
        <ViewHeader eyebrow="AI disease prediction" title="Symptom checker">
          <button
            className={`secondary-action ${isListening ? "listening" : ""}`}
            onClick={startVoiceInput}
          >
            <Mic size={18} />
            {isListening ? "Listening" : "Voice input"}
          </button>
        </ViewHeader>

        <div className="workspace-grid">
          <article className="input-panel">
            <div className="panel-title">
              <h3>Symptoms</h3>
              <span>{voiceStatus}</span>
            </div>
            <div className="symptom-grid">
              {symptomCatalog.map((symptom) => (
                <button
                  type="button"
                  className={`symptom-chip ${
                    selectedSymptoms.includes(symptom.id) ? "selected" : ""
                  }`}
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  title={symptom.hint}
                >
                  <CheckCircle2 size={18} />
                  <span>{symptom.label}</span>
                </button>
              ))}
            </div>

            <label className="narrative-field">
              Symptom note
              <textarea
                value={symptomNarrative}
                onChange={(event) => setSymptomNarrative(event.target.value)}
                rows={5}
              />
            </label>
          </article>

          <article className="input-panel">
            <div className="panel-title">
              <h3>Vitals and context</h3>
              <span>Real-time score</span>
            </div>
            <div className="vital-grid">
              <label>
                Age
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={vitals.age}
                  onChange={(event) => handleVitalChange("age", event.target.value)}
                />
              </label>
              <label>
                Temperature C
                <input
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(event) =>
                    handleVitalChange("temperature", event.target.value)
                  }
                />
              </label>
              <label>
                SpO2 %
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={vitals.oxygen}
                  onChange={(event) => handleVitalChange("oxygen", event.target.value)}
                />
              </label>
              <label>
                Duration days
                <input
                  type="number"
                  min="0"
                  value={vitals.duration}
                  onChange={(event) => handleVitalChange("duration", event.target.value)}
                />
              </label>
            </div>

            <div className="live-prediction">
              <div className="risk-meter" style={{ "--score": `${prediction.riskScore}%` }}>
                <span>{prediction.riskScore}</span>
              </div>
              <div>
                <span className="eyebrow">Leading prediction</span>
                <h3>{prediction.top.name}</h3>
                <p>{prediction.top.explanation}</p>
              </div>
            </div>

            <button className="primary-action full-width" onClick={() => setActiveView("result")}>
              <Search size={18} />
              Analyze patient
            </button>
          </article>
        </div>
      </section>
    );
  }

  function renderResult() {
    return (
      <section className="result-view">
        <ViewHeader eyebrow="Explainable AI result" title="Prediction result">
          <button className="secondary-action" onClick={exportPredictionReport}>
            <Download size={18} />
            Export PDF
          </button>
        </ViewHeader>

        {prediction.emergency && (
          <div className="emergency-banner">
            <AlertTriangle size={22} />
            <span>
              Emergency warning: chest pain, breathing difficulty, very high fever,
              or low oxygen needs immediate clinical review.
            </span>
          </div>
        )}

        <div className="result-grid">
          <article className="diagnosis-panel">
            <div className="diagnosis-topline">
              <span>{prediction.top.pathogen}</span>
              <strong>{prediction.risk} risk</strong>
            </div>
            <h3>{prediction.top.name}</h3>
            <p>{prediction.top.explanation}</p>
            <div className="confidence-row">
              <div>
                <span>Confidence</span>
                <strong>{prediction.confidence}%</strong>
              </div>
              <div>
                <span>Risk score</span>
                <strong>{prediction.riskScore}/100</strong>
              </div>
              <div>
                <span>Pathogen</span>
                <strong>{prediction.top.pathogen}</strong>
              </div>
            </div>
          </article>

          <article className="rank-panel">
            <div className="panel-title">
              <h3>Disease ranking</h3>
              <span>Model alternatives</span>
            </div>
            <div className="rank-list">
              {prediction.scores.slice(0, 5).map((item) => (
                <div className="rank-row" key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.pathogen}</span>
                  </div>
                  <meter min="0" max="100" value={item.score} />
                  <em>{item.score}%</em>
                </div>
              ))}
            </div>
          </article>

          <article className="care-panel">
            <div className="panel-title">
              <h3>Healthcare recommendations</h3>
              <span>Next best actions</span>
            </div>
            <ul>
              {prediction.top.suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </article>

          <article className="care-panel">
            <div className="panel-title">
              <h3>Why this was predicted</h3>
              <span>Explainable AI</span>
            </div>
            <ul>
              {selectedSymptoms.map((symptomId) => {
                const symptom = symptomCatalog.find((item) => item.id === symptomId);
                return (
                  <li key={symptomId}>
                    {symptom?.label} contributed {symptom?.weight || 8} signal
                    points to matching disease profiles.
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
      </section>
    );
  }

  function renderChatbot() {
    return (
      <section className="chatbot-view">
        <ViewHeader eyebrow="Conversational AI" title="Healthcare chatbot">
          <button className="secondary-action" onClick={() => setChatHistory(initialChat)}>
            <Sparkles size={18} />
            Reset chat
          </button>
        </ViewHeader>

        <div className="chat-layout">
          <article className="chat-panel">
            <div className="chat-history" aria-live="polite">
              {chatHistory.map((message, index) => (
                <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
                  <span>{message.role === "assistant" ? "AI" : "You"}</span>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
            <form className="chat-input-row" onSubmit={sendChatMessage}>
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Ask about symptoms, pathogens, reports, or precautions"
              />
              <button className="primary-action icon-only" aria-label="Send message">
                <Send size={18} />
              </button>
            </form>
          </article>

          <aside className="assistant-context">
            <div className="panel-title">
              <h3>Current AI context</h3>
              <span>Synced with symptom checker</span>
            </div>
            <MetricCard
              icon={Activity}
              label="Prediction"
              value={prediction.top.name}
              detail={`${prediction.confidence}% confidence`}
            />
            <MetricCard
              icon={ShieldCheck}
              label="Risk"
              value={prediction.risk}
              detail={prediction.emergency ? "Emergency warning active" : "No emergency flag"}
              tone="amber"
            />
          </aside>
        </div>
      </section>
    );
  }

  function renderReports() {
    return (
      <section className="reports-view">
        <ViewHeader eyebrow="Medical report analyzer" title="Upload and extract abnormal values">
          <button className="secondary-action" onClick={runReportAnalysis}>
            <Search size={18} />
            Analyze
          </button>
        </ViewHeader>

        <div className="report-grid">
          <article className="upload-panel">
            <label className="file-drop">
              <Upload size={28} />
              <strong>{reportFile ? reportFile.name : "Upload PDF, JPG, or PNG"}</strong>
              <span>
                {reportFile
                  ? `${Math.round(reportFile.size / 1024)} KB selected`
                  : "Files stay local in this demo"}
              </span>
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                onChange={handleReportFile}
              />
            </label>
            {reportPreview ? (
              <img className="report-preview" src={reportPreview} alt="Uploaded medical report preview" />
            ) : (
              <div className="pdf-placeholder">
                <FileText size={36} />
                <span>{reportFile?.type === "application/pdf" ? "PDF ready for value extraction" : "No preview loaded"}</span>
              </div>
            )}
          </article>

          <article className="input-panel">
            <div className="panel-title">
              <h3>Extracted values</h3>
              <span>Paste report text or key markers</span>
            </div>
            <textarea
              className="report-textarea"
              value={reportText}
              onChange={(event) => setReportText(event.target.value)}
              rows={11}
            />
            <button className="primary-action full-width" onClick={runReportAnalysis}>
              <ClipboardList size={18} />
              Detect abnormalities
            </button>
          </article>

          <article className="analysis-panel">
            <div className="panel-title">
              <h3>Analysis result</h3>
              <span>{reportAnalysis.summary}</span>
            </div>
            <div className="flag-list">
              {reportAnalysis.fileSignals.map((signal) => (
                <div className="flag-row info" key={signal}>
                  <Sparkles size={18} />
                  <span>{signal}</span>
                </div>
              ))}
              {reportAnalysis.values.length === 0 && (
                <div className="flag-row info">
                  <FileText size={18} />
                  <span>Try: WBC 13.4, Platelets 118000, Hemoglobin 11.1, CRP 18</span>
                </div>
              )}
              {reportAnalysis.values.map((value) => (
                <div
                  className={`lab-row ${value.status.toLowerCase()}`}
                  key={value.label}
                >
                  <div>
                    <strong>{value.label}</strong>
                    <span>{value.message}</span>
                  </div>
                  <em>
                    {value.value} {value.unit}
                  </em>
                  <small>{value.normal}</small>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    );
  }

  function renderAdmin() {
    return (
      <section className="admin-view">
        <ViewHeader eyebrow="Operations and datasets" title="Admin panel">
          <button className="secondary-action">
            <Database size={18} />
            Sync datasets
          </button>
        </ViewHeader>

        <div className="metric-grid">
          <MetricCard icon={Users} label="Managed users" value="1,284" detail="Patients, clinicians, admins" />
          <MetricCard icon={Database} label="Training records" value="52K" detail="Verified symptom cases" tone="green" />
          <MetricCard icon={ShieldCheck} label="Security checks" value="99.9%" detail="Access rules passing" tone="violet" />
          <MetricCard icon={Activity} label="Model accuracy" value="91.8%" detail="Cross-validation demo metric" tone="amber" />
        </div>

        <div className="admin-grid">
          <article className="table-panel">
            <div className="panel-title">
              <h3>User management</h3>
              <span>Role and account status</span>
            </div>
            <div className="data-table">
              <div className="table-head">
                <span>ID</span>
                <span>Name</span>
                <span>Role</span>
                <span>Status</span>
              </div>
              {adminUsers.map((row) => (
                <div className="table-row" key={row[0]}>
                  {row.map((cell) => (
                    <span key={cell}>{cell}</span>
                  ))}
                </div>
              ))}
            </div>
          </article>

          <article className="table-panel">
            <div className="panel-title">
              <h3>Dataset governance</h3>
              <span>Quality controls</span>
            </div>
            <div className="governance-list">
              {[
                ["Duplicate checks", "Passed", "98.7% clean"],
                ["Missing symptom labels", "Review", "143 records"],
                ["Pathogen balance", "Healthy", "4 categories"],
                ["Privacy scan", "Passed", "No exposed identifiers"]
              ].map(([name, status, detail]) => (
                <div className="governance-row" key={name}>
                  <span>{name}</span>
                  <strong>{status}</strong>
                  <em>{detail}</em>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    );
  }

  const viewMap = {
    overview: renderOverview,
    auth: renderAuth,
    dashboard: renderDashboard,
    command: renderCommand,
    symptoms: renderSymptoms,
    result: renderResult,
    chatbot: renderChatbot,
    reports: renderReports,
    admin: renderAdmin
  };

  return (
    <div className={`app-shell theme-${theme}`}>
      <aside className="sidebar">
        <button className="brand-button" onClick={() => setActiveView("overview")}>
          <span className="brand-mark">
            <HeartPulse size={23} />
          </span>
          <span>
            <strong>MedCentinum</strong>
            <small>AI Health OS</small>
          </span>
        </button>

        <nav className="nav-list" aria-label="Primary navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              className={activeView === id ? "active" : ""}
              key={id}
              onClick={() => setActiveView(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-status">
          <span>System health</span>
          <strong>Online</strong>
          <small>AI engine, auth, reports, and alerts ready</small>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <div className="user-chip">
            <span>{user.name.slice(0, 2).toUpperCase()}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </div>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button"
              aria-label="Open notifications"
              title="Notifications"
              onClick={() => setActiveView("dashboard")}
            >
              <Bell size={18} />
            </button>
            <button
              className="icon-button"
              aria-label="Toggle theme"
              title="Toggle theme"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <div className="view-container">{viewMap[activeView]()}</div>

        <footer className="medical-note">
          <AlertTriangle size={16} />
          <span>
            AI predictions are clinical decision support only and do not replace
            professional medical diagnosis or emergency care.
          </span>
          <ChevronRight size={16} />
        </footer>
      </main>
    </div>
  );
}

export default App;
