import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Database,
  FileText,
  Settings,
  Activity,
  Hexagon,
  Zap,
  MessageSquare,
  AlertTriangle,
  File,
  X,
  Columns,
  UploadCloud,
  Moon,
  Sun,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  Shield,
  Table,
  GitCompare,
  Lightbulb,
  Brain,
  Network,
  History,
  Info,
  Bookmark,
  BookmarkCheck,
  Heart,
  Clock,
  StickyNote,
  PackageOpen,
  RefreshCw,
  CheckSquare,
  Square,
  Menu,
  Play,
} from "lucide-react";
import axios from "axios";

const API_URL = "/api";

/* ─────────────────────────────────────────────
   AUDIT TRAIL VIEW
───────────────────────────────────────────── */
function AuditTrailView({
  auditLog,
  fetchAuditLog,
  renderAuditDetails,
  handleClearAudit,
}) {
  const [auditSearch, setAuditSearch] = useState("");
  const [auditFilter, setAuditFilter] = useState("all");

  const ACTION_COLORS = {
    compliance_check: {
      bg: "rgba(245,158,11,0.12)",
      color: "#d97706",
      label: "Compliance",
    },
    version_compare: {
      bg: "rgba(96,165,250,0.12)",
      color: "#3b82f6",
      label: "Version Diff",
    },
    health_score: {
      bg: "rgba(16,185,129,0.12)",
      color: "#10b981",
      label: "Health Score",
    },
    batch_export: {
      bg: "rgba(167,139,250,0.12)",
      color: "#8b5cf6",
      label: "Batch Export",
    },
    annotation_added: {
      bg: "rgba(224,180,92,0.12)",
      color: "#e0b45c",
      label: "Annotation",
    },
    bookmark_added: {
      bg: "rgba(224,180,92,0.12)",
      color: "#e0b45c",
      label: "Bookmark",
    },
    summarize: {
      bg: "rgba(16,185,129,0.12)",
      color: "#10b981",
      label: "Summary",
    },
    upload: { bg: "rgba(96,165,250,0.12)", color: "#3b82f6", label: "Upload" },
    search_query: {
      bg: "rgba(167,139,250,0.12)",
      color: "#8b5cf6",
      label: "Search Query",
    },
    ui_navigation: {
      bg: "rgba(255,255,255,0.05)",
      color: "var(--text-muted)",
      label: "UI Navigation",
    },
  };

  const getBadge = (action) =>
    ACTION_COLORS[action] || {
      bg: "var(--gold-bg)",
      color: "var(--gold)",
      label: action.replace(/_/g, " "),
    };

  const uniqueActions = [...new Set(auditLog.map((e) => e.action))];

  const filtered = auditLog.filter((entry) => {
    const matchAction = auditFilter === "all" || entry.action === auditFilter;
    const matchSearch =
      !auditSearch ||
      JSON.stringify(entry).toLowerCase().includes(auditSearch.toLowerCase());
    return matchAction && matchSearch;
  });

  const handleAuditExport = () => {
    const lines = filtered
      .map(
        (e) =>
          `[${new Date(e.timestamp).toLocaleString()}] ${e.action.toUpperCase()}\n${JSON.stringify(e.details, null, 2)}`,
      )
      .join("\n\n---\n\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit_trail.txt";
    a.click();
  };

  return (
    <div className="panel-full">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <History size={20} /> Audit Trail
          <span
            style={{
              fontSize: "12px",
              fontFamily: "var(--font-body)",
              color: "var(--text-muted)",
              fontWeight: 400,
            }}
          >
            {filtered.length} of {auditLog.length} events
          </span>
        </h2>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button className="btn-small" onClick={handleAuditExport}>
            <Download size={12} /> Export Log
          </button>
          <button className="btn-small" onClick={handleClearAudit}>
            <Trash2 size={12} /> Clear Logs
          </button>
          <button className="btn-small" onClick={fetchAuditLog}>
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            className="main-input"
            style={{
              paddingLeft: "32px",
              height: "36px",
              fontSize: "13px",
              width: "100%",
            }}
            placeholder="Search audit events..."
            value={auditSearch}
            onChange={(e) => setAuditSearch(e.target.value)}
          />
        </div>
        <select
          className="main-input"
          style={{ width: "180px", height: "36px", fontSize: "13px" }}
          value={auditFilter}
          onChange={(e) => setAuditFilter(e.target.value)}
        >
          <option value="all">All Actions</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>
              {getBadge(a).label}
            </option>
          ))}
        </select>
      </div>

      {auditLog.length === 0 ? (
        <div className="empty-state">
          <History size={32} style={{ opacity: 0.2, margin: "0 auto 12px" }} />
          <p>No audit events yet.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Search size={28} style={{ opacity: 0.2, margin: "0 auto 12px" }} />
          <p>No events match your search.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((entry, idx) => {
            const badge = getBadge(entry.action);
            return (
              <div
                key={idx}
                className="audit-event-card"
                style={{
                  background: "var(--bg-panel)",
                  padding: "14px",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      background: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.color}55`,
                      borderRadius: "10px",
                      padding: "3px 10px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {badge.label}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Clock size={11} />{" "}
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <div style={{ fontSize: "13px" }}>
                  {renderAuditDetails(entry)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState("query");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userSettings, setUserSettings] = useState({
    language: "English",
    searchDepth: 5,
    autoTagging: true,
    complianceMode: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("kiq_settings");
    if (saved) setUserSettings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (isLightMode) document.body.classList.add("light-theme");
    else document.body.classList.remove("light-theme");
  }, [isLightMode]);

  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [results, setResults] = useState([]);
  const [llmAnswer, setLlmAnswer] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [complianceWarnings, setComplianceWarnings] = useState([]);
  const [extractedTable, setExtractedTable] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [hypotheses, setHypotheses] = useState([]);
  const [entityGraph, setEntityGraph] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedAudit, setExpandedAudit] = useState({});
  const fileInputRef = useRef(null);

  const [sumDocId, setSumDocId] = useState("");
  const [sumFormat, setSumFormat] = useState("Executive Summary");
  const [summaryResult, setSummaryResult] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const [compDoc1, setCompDoc1] = useState("");
  const [compDoc2, setCompDoc2] = useState("");
  const [compResult, setCompResult] = useState("");
  const [isComparing, setIsComparing] = useState(false);

  const [versionGroups, setVersionGroups] = useState([]);
  const [diffHtml, setDiffHtml] = useState("");
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState({});

  const [analyticsData, setAnalyticsData] = useState(null);

  const [bookmarks, setBookmarks] = useState([]);
  const [pendingBookmarkNote, setPendingBookmarkNote] = useState("");
  const [editingBookmarkId, setEditingBookmarkId] = useState(null);

  const [healthScores, setHealthScores] = useState({});
  const [loadingHealth, setLoadingHealth] = useState({});

  const [annotations, setAnnotations] = useState([]);
  const [annotationInputs, setAnnotationInputs] = useState({});

  const [timeline, setTimeline] = useState([]);
  const [timelineFilter, setTimelineFilter] = useState("all");

  const [batchSelected, setBatchSelected] = useState([]);
  const [batchTitle, setBatchTitle] = useState("KnowledgeIQ Vault Report");
  const [batchFormat, setBatchFormat] = useState("pdf");
  const [isBatchExporting, setIsBatchExporting] = useState(false);

  // Real-time exhaustive logging function
  const logActivity = async (action, details) => {
    try {
      await axios.post(`${API_URL}/audit`, { action, details });
      fetchAuditLog();
    } catch (e) {}
  };

  useEffect(() => {
    // Log view navigation dynamically
    if (view !== "query") {
      logActivity("ui_navigation", { target_view: view });
    }

    fetchDocuments();
    fetchBookmarks();
    fetchAnnotations();
    if (view === "analytics") fetchAnalytics();
    if (view === "versions") fetchVersionGroups();
    if (view === "audit") fetchAuditLog();
    if (view === "timeline") fetchTimeline();
    if (view === "health") fetchAllHealthScores();
  }, [view]);

  const fetchDocuments = async () => {
    try {
      const r = await axios.get(`${API_URL}/documents`);
      setDocuments(r.data.documents || []);
    } catch (e) {}
  };
  const fetchAnalytics = async () => {
    try {
      const r = await axios.get(`${API_URL}/analytics`);
      setAnalyticsData(r.data);
    } catch (e) {}
  };
  const fetchVersionGroups = async () => {
    try {
      const r = await axios.get(`${API_URL}/versions`);
      setVersionGroups(r.data.groups || []);
      const init = {};
      for (const g of r.data.groups || []) {
        if (g.versions.length >= 2)
          init[g.base_name] = { v1: g.versions[0].id, v2: g.versions[1].id };
        else if (g.versions.length === 1)
          init[g.base_name] = { v1: g.versions[0].id, v2: g.versions[0].id };
        else init[g.base_name] = { v1: "", v2: "" };
      }
      setSelectedVersions(init);
    } catch (e) {}
  };
  const fetchAuditLog = async () => {
    try {
      const r = await axios.get(`${API_URL}/audit`);
      setAuditLog(r.data.audit || []);
    } catch (e) {}
  };

  const handleClearAuditLog = async () => {
    if (
      !window.confirm(
        "Are you sure you want to completely clear the system audit log?",
      )
    )
      return;
    try {
      await axios.delete(`${API_URL}/audit`);
      setAuditLog([]);
    } catch (e) {}
  };

  const fetchBookmarks = async () => {
    try {
      const r = await axios.get(`${API_URL}/bookmarks`);
      setBookmarks(r.data.bookmarks || []);
    } catch (e) {}
  };
  const fetchAnnotations = async () => {
    try {
      const r = await axios.get(`${API_URL}/annotations`);
      setAnnotations(r.data.annotations || []);
    } catch (e) {}
  };
  const fetchTimeline = async () => {
    try {
      const r = await axios.get(`${API_URL}/timeline?limit=100`);
      setTimeline(r.data.timeline || []);
    } catch (e) {}
  };
  const fetchAllHealthScores = async () => {
    const docs = (
      await axios
        .get(`${API_URL}/documents`)
        .catch(() => ({ data: { documents: [] } }))
    ).data.documents;
    docs.forEach((d) => {
      if (!healthScores[d.id]) fetchHealthScore(d.id);
    });
  };

  const handleAddBookmark = async () => {
    if (!query.trim()) return;
    try {
      await axios.post(`${API_URL}/bookmarks`, {
        query,
        note: pendingBookmarkNote,
      });
      setPendingBookmarkNote("");
      await fetchBookmarks();
    } catch (e) {}
  };
  const handleDeleteBookmark = async (id) => {
    try {
      await axios.delete(`${API_URL}/bookmarks/${id}`);
      await fetchBookmarks();
    } catch (e) {}
  };
  const handleUpdateBookmarkNote = async (id, note) => {
    try {
      await axios.patch(`${API_URL}/bookmarks/${id}`, { note });
      setEditingBookmarkId(null);
      await fetchBookmarks();
    } catch (e) {}
  };
  const handleRunBookmark = (bQuery) => {
    setView("query");
    setQuery(bQuery);
    setIsSidebarOpen(false);
    logActivity("run_bookmark", { query: bQuery });
    handleSearch(bQuery);
  };

  const fetchHealthScore = async (docId) => {
    setLoadingHealth((p) => ({ ...p, [docId]: true }));
    try {
      const r = await axios.post(`${API_URL}/health_score`, { doc_id: docId });
      setHealthScores((p) => ({ ...p, [docId]: r.data }));
    } catch (e) {
    } finally {
      setLoadingHealth((p) => ({ ...p, [docId]: false }));
    }
  };
  const refreshHealthScore = async (docId) => {
    await axios.delete(`${API_URL}/health_score/${docId}`).catch(() => {});
    setHealthScores((p) => {
      const n = { ...p };
      delete n[docId];
      return n;
    });
    fetchHealthScore(docId);
  };

  const handleAddAnnotation = async (docId, excerpt) => {
    const note = annotationInputs[docId] || "";
    if (!note.trim()) return;
    try {
      await axios.post(`${API_URL}/annotations`, {
        doc_id: docId,
        result_excerpt: excerpt,
        note,
      });
      setAnnotationInputs((p) => ({ ...p, [docId]: "" }));
      await fetchAnnotations();
    } catch (e) {}
  };
  const handleDeleteAnnotation = async (id) => {
    try {
      await axios.delete(`${API_URL}/annotations/${id}`);
      await fetchAnnotations();
    } catch (e) {}
  };

  const handleClearTimeline = async () => {
    if (!window.confirm("Clear all timeline events?")) return;
    try {
      await axios.delete(`${API_URL}/timeline`);
      setTimeline([]);
    } catch (e) {}
  };

  const toggleBatchSelect = (id) =>
    setBatchSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  const handleBatchSelectAll = () =>
    setBatchSelected(
      batchSelected.length === documents.length
        ? []
        : documents.map((d) => d.id),
    );
  const handleBatchExport = async () => {
    if (!batchSelected.length) return alert("Select at least one document");
    setIsBatchExporting(true);
    try {
      const r = await fetch(`${API_URL}/batch_export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_ids: batchSelected,
          title: batchTitle,
          filetype: batchFormat,
        }),
      });
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${batchTitle.replace(/\s+/g, "_")}.${batchFormat}`;
      a.click();
    } catch (e) {
      alert("Batch export failed.");
    } finally {
      setIsBatchExporting(false);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    setIsUploading(true);
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) fd.append("files", files[i]);
    try {
      await axios.post(`${API_URL}/documents/upload`, fd);
      await fetchDocuments();
      await fetchVersionGroups();
      alert(`Uploaded ${files.length} document(s).`);
    } catch (e) {
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${API_URL}/documents/${id}`);
      fetchDocuments();
      fetchVersionGroups();
      if (sumDocId === id) setSumDocId("");
      if (compDoc1 === id) setCompDoc1("");
      if (compDoc2 === id) setCompDoc2("");
    } catch (e) {
      alert("Delete failed.");
    }
  };

  const handleSearch = async (forcedQuery = null) => {
    const activeQuery = forcedQuery || query;
    if (!activeQuery.trim()) return;
    setIsSearching(true);
    setResults([]);
    setLlmAnswer("");
    setComplianceWarnings([]);
    setExtractedTable(null);
    setFollowups([]);
    setHypotheses([]);
    setEntityGraph(null);
    try {
      if (userSettings.complianceMode) {
        const vr = await axios.post(`${API_URL}/protocol_verify`, {
          query: activeQuery,
        });
        if (vr.data.warnings?.length)
          setComplianceWarnings(
            vr.data.warnings.filter(
              (w) =>
                !w.toLowerCase().includes("compliance officer") &&
                w.length < 300,
            ),
          );
      }
      const response = await fetch(`${API_URL}/query_stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: activeQuery,
          top_k: userSettings.searchDepth,
          filter_type: filterType,
          language: userSettings.language,
          compliance_mode: userSettings.complianceMode,
        }),
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullAnswer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        for (const chunk of decoder.decode(value).split("\n\n")) {
          if (!chunk.startsWith("data: ")) continue;
          const dataStr = chunk.replace("data: ", "");
          if (!dataStr) continue;
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.type === "results") setResults(parsed.data);
            else if (parsed.type === "chunk") {
              fullAnswer += parsed.text;
              setLlmAnswer((p) => p + parsed.text);
            } else if (parsed.type === "done") {
              setIsSearching(false);
              const fr = await axios.post(`${API_URL}/followup`, {
                query: activeQuery,
                answer: fullAnswer,
              });
              setFollowups(fr.data.suggestions || []);
              const hr = await axios.post(`${API_URL}/hypothesis`, {
                query: activeQuery,
                answer: fullAnswer,
              });
              setHypotheses(hr.data.hypotheses || []);
            }
          } catch (e) {}
        }
      }
    } catch (e) {
      setLlmAnswer("⚠️ Connection Error: Ensure Ollama is running.");
      setIsSearching(false);
    }
  };

  const handleSummarize = async () => {
    if (!sumDocId) return alert("Select a document");
    setIsSummarizing(true);
    setSummaryResult("");
    try {
      const r = await axios.post(`${API_URL}/summarize`, {
        doc_id: sumDocId,
        format: sumFormat,
      });
      setSummaryResult(r.data.summary);
    } catch (e) {
      setSummaryResult("Error generating summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCompare = async () => {
    if (!compDoc1 || !compDoc2) return alert("Select two documents");
    if (compDoc1 === compDoc2) return alert("Select different documents");
    setIsComparing(true);
    setCompResult("");
    try {
      const r = await axios.post(`${API_URL}/compare`, {
        doc1_id: compDoc1,
        doc2_id: compDoc2,
      });
      setCompResult(r.data.comparison);
    } catch (e) {
      setCompResult("Error generating comparison.");
    } finally {
      setIsComparing(false);
    }
  };

  const handleExtractTable = async (docId) => {
    logActivity("extract_table", { doc_id: docId });
    try {
      const r = await axios.post(`${API_URL}/extract_chemical_data`, {
        doc_id: docId,
      });
      setExtractedTable(r.data.html_table || "<p>No tabular data found.</p>");
    } catch (e) {
      setExtractedTable("<p>Extraction failed.</p>");
    }
  };
  const handleEntityGraph = async (docId) => {
    logActivity("extract_entity_graph", { doc_id: docId });
    try {
      const r = await axios.post(`${API_URL}/entity_graph`, { doc_id: docId });
      setEntityGraph(r.data);
    } catch (e) {
      setEntityGraph({ nodes: [], links: [] });
    }
  };
  const handleShowDiff = async (baseName, v1, v2) => {
    if (!v1 || !v2) return alert("Please select two versions");
    if (v1 === v2) return alert("Please select two different versions");
    try {
      const r = await axios.post(`${API_URL}/compare_versions`, {
        base_name: baseName,
        version1_id: v1,
        version2_id: v2,
      });
      setDiffHtml(r.data.diff_html);
      setShowVersionModal(true);
    } catch (e) {
      alert("Failed to generate diff.");
    }
  };
  const handleCitationClick = async (fileName) => {
    logActivity("citation_clicked", { filename: fileName });
    const doc = documents.find((d) => d.original_name === fileName);
    if (!doc) {
      alert("Document not found");
      return;
    }
    window.open(
      `${API_URL}/documents/${doc.id}/view?highlight=${encodeURIComponent(fileName)}`,
      "_blank",
    );
  };
  const handleExport = async (text, filetype, title) => {
    logActivity("export_document", { title, filetype });
    try {
      const r = await fetch(`${API_URL}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, filetype, title }),
      });
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}.${filetype}`;
      a.click();
    } catch (e) {
      alert("Export failed");
    }
  };

  const renderAnswerWithCitations = (htmlText) => {
    const regex = /\[Doc:\s*"([^"]+)"\]/g;
    const parts = [];
    let lastIndex = 0,
      match,
      key = 0;
    while ((match = regex.exec(htmlText)) !== null) {
      const before = htmlText.substring(lastIndex, match.index);
      if (before)
        parts.push(
          <span key={key++} dangerouslySetInnerHTML={{ __html: before }} />,
        );
      parts.push(
        <span
          key={key++}
          className="citation"
          onClick={() => handleCitationClick(match[1])}
        >
          [Doc: "{match[1]}"]
        </span>,
      );
      lastIndex = regex.lastIndex;
    }
    const after = htmlText.substring(lastIndex);
    if (after)
      parts.push(
        <span key={key++} dangerouslySetInnerHTML={{ __html: after }} />,
      );
    return parts;
  };

  const renderAuditDetails = (entry) => {
    const d = entry.details || {};
    if (entry.action === "search_query") {
      return (
        <div style={{ fontSize: "13px", lineHeight: 1.8 }}>
          <div
            style={{
              background: "var(--bg-dark)",
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              marginBottom: "6px",
            }}
          >
            <strong style={{ color: "var(--gold)" }}>Query:</strong> "{d.query}"
          </div>
          {d.filter_type && (
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Filter: {d.filter_type}
            </span>
          )}
        </div>
      );
    }
    if (entry.action === "compliance_check") {
      const warnings = d.warnings || [];
      if (!warnings.length)
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--success)",
              fontSize: "12px",
            }}
          >
            <CheckCircle2 size={13} /> No compliance violations detected
          </div>
        );
      const isExpanded = expandedAudit[entry.timestamp];
      const shown = isExpanded ? warnings : warnings.slice(0, 3);
      return (
        <div>
          {d.query && (
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              Query: <em>"{d.query}"</em>
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "6px",
            }}
          >
            <AlertTriangle size={12} color="var(--danger)" />{" "}
            <span
              style={{
                fontSize: "11px",
                color: "var(--danger)",
                fontWeight: 600,
              }}
            >
              {warnings.length} violation{warnings.length !== 1 ? "s" : ""}{" "}
              found
            </span>
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.2rem",
              fontSize: "12px",
              lineHeight: 1.7,
            }}
          >
            {shown.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
          {warnings.length > 3 && (
            <button
              className="btn-small"
              onClick={() =>
                setExpandedAudit((p) => ({
                  ...p,
                  [entry.timestamp]: !isExpanded,
                }))
              }
              style={{ marginTop: "8px" }}
            >
              {isExpanded ? "Show less" : `Show ${warnings.length - 3} more`}
            </button>
          )}
        </div>
      );
    }
    if (entry.action === "version_compare") {
      const short = (id) => (id ? id.slice(0, 8) + "…" : "?");
      return (
        <div style={{ fontSize: "12px", lineHeight: 1.8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: "var(--gold-bg)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "2px 8px",
                fontFamily: "monospace",
                fontSize: "11px",
              }}
            >
              {short(d.version1)}
            </span>
            <span style={{ color: "var(--gold)" }}>↔</span>
            <span
              style={{
                background: "var(--gold-bg)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "2px 8px",
                fontFamily: "monospace",
                fontSize: "11px",
              }}
            >
              {short(d.version2)}
            </span>
          </div>
          <div
            style={{
              marginTop: "4px",
              color: "var(--success)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <CheckCircle2 size={12} /> Diff generated successfully
          </div>
        </div>
      );
    }
    if (entry.action === "health_score") {
      const score = d.score ?? "?";
      const grade = d.grade || "mid";
      const gradeColor =
        grade === "high"
          ? "var(--success)"
          : grade === "mid"
            ? "var(--danger)"
            : "#ef4444";
      const gradeLabel =
        grade === "high" ? "Good" : grade === "mid" ? "Fair" : "Poor";
      return (
        <div style={{ fontSize: "12px", lineHeight: 1.8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Heart size={13} color={gradeColor} />{" "}
            <span>Health scored for document</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "4px",
            }}
          >
            <span
              style={{
                fontSize: "22px",
                fontFamily: "var(--font-head)",
                color: gradeColor,
              }}
            >
              {score}
            </span>
            <span style={{ fontSize: "10px" }}>/100</span>
            <span
              style={{
                background: gradeColor + "22",
                color: gradeColor,
                border: `1px solid ${gradeColor}44`,
                borderRadius: "10px",
                padding: "2px 10px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {gradeLabel}
            </span>
          </div>
        </div>
      );
    }
    if (entry.action === "batch_export") {
      const count = (d.doc_ids || []).length;
      return (
        <div style={{ fontSize: "12px", lineHeight: 1.8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <PackageOpen size={13} color="var(--gold)" />
            <span>
              Exported <strong>{count}</strong> document{count !== 1 ? "s" : ""}{" "}
              as <strong>{(d.format || "?").toUpperCase()}</strong>
            </span>
          </div>
        </div>
      );
    }
    if (entry.action === "annotation_added") {
      return (
        <div style={{ fontSize: "12px", lineHeight: 1.8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <StickyNote size={13} color="var(--gold)" />{" "}
            <span>Note added to document</span>
          </div>
          {d.note_preview && (
            <div
              style={{
                marginTop: "4px",
                background: "var(--gold-bg)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--gold)",
                borderRadius: "0 4px 4px 0",
                padding: "5px 10px",
                fontStyle: "italic",
                color: "var(--text-main)",
              }}
            >
              "{d.note_preview}"
            </div>
          )}
        </div>
      );
    }
    if (entry.action === "bookmark_added") {
      return (
        <div style={{ fontSize: "12px", lineHeight: 1.8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Bookmark size={13} color="var(--gold)" />{" "}
            <span>Query bookmarked</span>
          </div>
          {d.query && (
            <div
              style={{
                marginTop: "4px",
                background: "var(--gold-bg)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "4px 10px",
                color: "var(--text-main)",
              }}
            >
              {d.query}
            </div>
          )}
        </div>
      );
    }
    const entries = Object.entries(d).filter(([k]) => k !== "doc_ids");
    return (
      <div style={{ fontSize: "12px", lineHeight: 1.9 }}>
        {entries.map(([key, val]) => (
          <div
            key={key}
            style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
          >
            <span
              style={{
                color: "var(--text-muted)",
                textTransform: "capitalize",
                minWidth: "90px",
              }}
            >
              {key.replace(/_/g, " ")}:
            </span>
            <span style={{ color: "var(--text-main)" }}>
              {Array.isArray(val)
                ? val.length === 0
                  ? "None"
                  : val.join(", ")
                : typeof val === "object" && val !== null
                  ? Object.entries(val)
                      .map(([k2, v2]) => `${k2}: ${v2}`)
                      .join(" · ")
                  : String(val)}
            </span>
          </div>
        ))}
        {d.doc_ids && (
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ color: "var(--text-muted)", minWidth: "90px" }}>
              Documents:
            </span>
            <span>{d.doc_ids.length} selected</span>
          </div>
        )}
      </div>
    );
  };

  const isQueryBookmarked = bookmarks.some((b) => b.query === query);
  const filteredTimeline =
    timelineFilter === "all"
      ? timeline
      : timeline.filter((t) => t.type === timelineFilter);
  const saveSettings = (n) => {
    setUserSettings(n);
    localStorage.setItem("kiq_settings", JSON.stringify(n));
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
  };

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <div className="app-shell">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo">
          <Hexagon className="logo-icon" size={28} />
          <div>
            <h1>KnowledgeIQ</h1>
            <span style={{ color: "var(--gold)" }}>TCG LIFESCIENCES</span>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-label">Core</div>
          {[
            ["query", <Search size={16} />, "Query Engine"],
            ["vault", <Database size={16} />, "Document Vault"],
            ["versions", <GitCompare size={16} />, "Version Tracker"],
            ["summarizer", <FileText size={16} />, "Summarizer"],
            ["compare", <Columns size={16} />, "Compare Docs"],
          ].map(([v, icon, label]) => (
            <button
              key={v}
              className={`nav-item ${view === v ? "active" : ""}`}
              onClick={() => {
                setView(v);
                closeSidebarOnMobile();
                if (v === "versions") fetchVersionGroups();
              }}
            >
              {icon} {label}
              {v === "vault" && documents.length > 0 && (
                <span className="nav-badge">{documents.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="nav-section">
          <div className="nav-label">New Features</div>
          {[
            ["bookmarks", "Query Bookmarks", <Bookmark size={16} />],
            ["health", "Doc Health Score", <Heart size={16} />],
            ["timeline", "Activity Timeline", <Clock size={16} />],
            ["batch", "Batch Export", <PackageOpen size={16} />],
          ].map(([v, label, icon]) => (
            <button
              key={v}
              className={`nav-item ${view === v ? "active" : ""}`}
              onClick={() => {
                setView(v);
                closeSidebarOnMobile();
              }}
            >
              {icon} {label}
              {v === "bookmarks" && bookmarks.length > 0 && (
                <span className="nav-badge">{bookmarks.length}</span>
              )}
            </button>
          ))}
        </div>

        <div
          className="nav-section"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <div className="nav-label">Insights</div>
          {[
            ["analytics", "Analytics", <Activity size={16} />],
            ["audit", "Audit Trail", <History size={16} />],
            ["settings", "Settings", <Settings size={16} />],
          ].map(([v, label, icon]) => (
            <button
              key={v}
              className={`nav-item ${view === v ? "active" : ""}`}
              onClick={() => {
                setView(v);
                closeSidebarOnMobile();
              }}
            >
              {icon} {label}
            </button>
          ))}
          <div
            className="theme-toggle"
            onClick={() => setIsLightMode(!isLightMode)}
          >
            <span style={{ fontSize: "13px", fontWeight: 500 }}>
              {isLightMode ? "Light Mode" : "Dark Mode"}
            </span>
            {isLightMode ? (
              <Sun size={16} color="var(--gold)" />
            ) : (
              <Moon size={16} color="var(--gold)" />
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="main">
        <div className="topbar">
          <Menu
            className="hamburger"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <div className="topbar-title">
            {view === "query"
              ? "Query Engine"
              : view === "vault"
                ? "Vault"
                : view === "bookmarks"
                  ? "Query Bookmarks"
                  : view === "health"
                    ? "Document Health Score"
                    : view === "timeline"
                      ? "Activity Timeline"
                      : view === "batch"
                        ? "Batch Export"
                        : view.charAt(0).toUpperCase() + view.slice(1)}
          </div>
          <div className="llm-status">
            {isSearching || isSummarizing || isComparing || isBatchExporting ? (
              <div
                className="spinner"
                style={{
                  width: "10px",
                  height: "10px",
                  borderTopColor: "var(--gold)",
                }}
              />
            ) : (
              <div className="status-dot" />
            )}
            {isSearching || isSummarizing || isComparing || isBatchExporting
              ? "Processing..."
              : "LLM Ready"}
          </div>
        </div>

        <div className="content-area">
          {/* ══ QUERY ENGINE ══ */}
          {view === "query" && (
            <>
              <div className="panel-left">
                <div className="box-container" style={{ flexShrink: 0 }}>
                  <div className="section-label">Ask Your Knowledge Base</div>
                  <textarea
                    className="main-input"
                    style={{ minHeight: "100px", resize: "none" }}
                    placeholder="What would you like to know in detail?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "16px",
                      marginTop: "12px",
                    }}
                  >
                    <button
                      className="btn"
                      style={{ flex: 1 }}
                      onClick={() => handleSearch()}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <>
                          <div className="spinner" />
                          &nbsp;Deep Thinking...
                        </>
                      ) : (
                        <>
                          <Zap size={16} /> Ask AI
                        </>
                      )}
                    </button>
                    <button
                      className="btn-small"
                      title={
                        isQueryBookmarked
                          ? "Already bookmarked"
                          : "Bookmark this query"
                      }
                      onClick={handleAddBookmark}
                      disabled={!query.trim() || isQueryBookmarked}
                      style={{ padding: "8px 12px" }}
                    >
                      {isQueryBookmarked ? (
                        <BookmarkCheck size={16} color="var(--gold)" />
                      ) : (
                        <Bookmark size={16} />
                      )}
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <Shield size={16} color="var(--gold)" />
                    <label style={{ fontSize: "13px" }}>Compliance Mode</label>
                    <div
                      className={`toggle-switch ${userSettings.complianceMode ? "active" : ""}`}
                      onClick={() =>
                        saveSettings({
                          ...userSettings,
                          complianceMode: !userSettings.complianceMode,
                        })
                      }
                    >
                      <div className="toggle-knob" />
                    </div>
                    <Info
                      size={14}
                      style={{ cursor: "pointer", color: "var(--text-muted)" }}
                    />
                  </div>
                  <div className="chips-grid">
                    {[
                      ["HPLC SOP", "Summarize the HPLC SOP"],
                      [
                        "Safety Protocols",
                        "What are the safety requirements for acetonitrile?",
                      ],
                      [
                        "Clinical Trials",
                        "Show me clinical trial results for TCG-405",
                      ],
                      [
                        "Compliance Check",
                        "List all compliance violations in our documents",
                      ],
                    ].map(([label, q]) => (
                      <div
                        key={label}
                        className="chip"
                        onClick={() => {
                          setQuery(q);
                          handleSearch(q);
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{ fontSize: "11px", color: "var(--text-muted)" }}
                    >
                      Filter:
                    </span>
                    {["all", "pdf", "word"].map((t) => (
                      <div
                        key={t}
                        className={`chip ${filterType === t ? "active" : ""}`}
                        onClick={() => setFilterType(t)}
                      >
                        {t.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>

                {complianceWarnings.length > 0 && (
                  <div className="compliance-warnings-box">
                    <div
                      className="section-label"
                      style={{
                        color: "var(--danger)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "8px",
                      }}
                    >
                      <AlertTriangle size={14} /> Protocol Violations Detected
                    </div>
                    <ul
                      style={{
                        margin: "0 0 0 20px",
                        color: "var(--text-main)",
                        fontSize: "13px",
                      }}
                    >
                      {complianceWarnings.map((w, i) => (
                        <li style={{ marginBottom: "6px" }} key={i}>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="results-header">
                  <span>RESULTS</span>
                  <span>{results.length} matches</span>
                </div>
                <div className="results-list">
                  {results.length === 0 && !isSearching && (
                    <div className="empty-state">
                      <Database
                        size={32}
                        style={{ opacity: 0.3, margin: "0 auto 12px" }}
                      />
                      <p>No matching documents found.</p>
                    </div>
                  )}
                  {results.map((r, i) => {
                    const docAnnotations = annotations.filter(
                      (a) => a.doc_id === r.doc_id,
                    );
                    return (
                      <div key={i} className="result-card">
                        <h4
                          style={{
                            fontSize: "13px",
                            marginBottom: "8px",
                            color: "var(--gold)",
                          }}
                        >
                          {r.doc_name}
                        </h4>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            lineHeight: 1.5,
                          }}
                        >
                          ...{r.excerpt}...
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginTop: "8px",
                          }}
                        >
                          <button
                            className="btn-small"
                            onClick={() => handleExtractTable(r.doc_id)}
                          >
                            <Table size={12} /> Extract Table
                          </button>
                          <button
                            className="btn-small"
                            onClick={() => handleEntityGraph(r.doc_id)}
                          >
                            <Network size={12} /> Entity Graph
                          </button>
                        </div>
                        <div
                          style={{
                            marginTop: "10px",
                            borderTop: "1px solid var(--border)",
                            paddingTop: "10px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "10px",
                              color: "var(--gold)",
                              textTransform: "uppercase",
                              letterSpacing: "1px",
                              fontWeight: 600,
                              marginBottom: "6px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <StickyNote size={11} /> Notes
                          </div>
                          {docAnnotations.map((ann) => (
                            <div key={ann.id} className="annotation-note">
                              {ann.note}
                              <div className="ann-meta">
                                {new Date(ann.created_at).toLocaleString()}
                              </div>
                              <span
                                className="ann-del"
                                onClick={() => handleDeleteAnnotation(ann.id)}
                              >
                                ✕
                              </span>
                            </div>
                          ))}
                          <div className="annotation-row">
                            <textarea
                              className="annotation-input"
                              rows={2}
                              placeholder="Add a note to this result..."
                              value={annotationInputs[r.doc_id] || ""}
                              onChange={(e) =>
                                setAnnotationInputs((p) => ({
                                  ...p,
                                  [r.doc_id]: e.target.value,
                                }))
                              }
                            />
                            <button
                              className="btn-small"
                              onClick={() =>
                                handleAddAnnotation(r.doc_id, r.excerpt)
                              }
                              style={{ alignSelf: "flex-end" }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="panel-right">
                <div className="ai-header">
                  <span>
                    <Zap size={16} /> DEEP SYNTHESIS
                  </span>
                  <X
                    size={18}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setLlmAnswer("");
                      setResults([]);
                      setQuery("");
                      setComplianceWarnings([]);
                      setExtractedTable(null);
                      setFollowups([]);
                      setHypotheses([]);
                    }}
                  />
                </div>
                <div className="ai-body">
                  {!llmAnswer && !isSearching ? (
                    <div className="ai-placeholder">
                      <MessageSquare
                        size={32}
                        style={{ marginBottom: "16px" }}
                      />
                      <p>Ask a question to see detailed answers.</p>
                    </div>
                  ) : isSearching && !llmAnswer ? (
                    <div className="ai-thinking">
                      <div className="ai-dot" />
                      <div className="ai-dot" />
                      <div className="ai-dot" />
                      <span>Analyzing & structuring response...</span>
                    </div>
                  ) : (
                    <>
                      <div>
                        {renderAnswerWithCitations(
                          llmAnswer
                            .replace(/\n/g, "<br/>")
                            .replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong style="color:var(--text-main)">$1</strong>',
                            ),
                        )}
                      </div>
                      {hypotheses.length > 0 && (
                        <div
                          style={{
                            marginTop: "20px",
                            borderTop: "1px solid var(--border)",
                            paddingTop: "16px",
                          }}
                        >
                          <div className="section-label">
                            <Brain size={14} /> Suggested Hypotheses
                          </div>
                          <ul style={{ marginLeft: "20px" }}>
                            {hypotheses.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {followups.length > 0 && (
                        <div
                          style={{
                            marginTop: "20px",
                            borderTop: "1px solid var(--border)",
                            paddingTop: "16px",
                          }}
                        >
                          <div className="section-label">
                            <Lightbulb size={14} /> Smart Follow-ups
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                              marginTop: "8px",
                            }}
                          >
                            {followups.map((fb, i) => (
                              <button
                                key={i}
                                className="chip"
                                onClick={() => {
                                  setQuery(fb);
                                  handleSearch(fb);
                                }}
                              >
                                {fb}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {extractedTable && (
                  <div className="data-extraction-sidebar">
                    <div className="section-label">
                      <Table size={14} /> Extracted Chemical Data
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: extractedTable }} />
                  </div>
                )}
                {entityGraph?.nodes?.length > 0 && (
                  <div className="data-extraction-sidebar">
                    <div className="section-label">
                      <Network size={14} /> Entity Graph
                    </div>
                    <pre style={{ fontSize: "10px", overflow: "auto" }}>
                      {JSON.stringify(entityGraph, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ══ VAULT ══ */}
          {view === "vault" && (
            <div className="panel-full">
              <div
                className="box-container upload-area"
                onClick={() => fileInputRef.current.click()}
              >
                {isUploading ? (
                  <div
                    className="spinner"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderWidth: "3px",
                    }}
                  />
                ) : (
                  <UploadCloud size={32} />
                )}
                <h3>
                  {isUploading
                    ? "Encrypting & Uploading..."
                    : "Click to Upload Documents (PDF, DOCX, TXT)"}
                </h3>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleUpload}
                  accept=".pdf,.docx,.txt"
                  multiple
                />
              </div>
              <div className="doc-grid">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="result-card"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h4>
                        <File size={16} color="var(--gold)" />{" "}
                        {doc.original_name}
                      </h4>
                      <p className="doc-meta">
                        {doc.file_type.toUpperCase()} •{" "}
                        {(doc.size / 1024).toFixed(1)} KB •{" "}
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() =>
                          window.open(
                            `${API_URL}/documents/${doc.id}/view`,
                            "_blank",
                          )
                        }
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.original_name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ VERSIONS ══ */}
          {view === "versions" && (
            <div className="panel-full">
              <h2>
                <GitCompare size={20} /> Version Tracking & What Changed
              </h2>
              {versionGroups.length === 0 ? (
                <p>
                  No versioned documents found. Upload files like `SOP_v1.txt`,
                  `SOP_v2.txt`.
                </p>
              ) : (
                versionGroups.map((group) => {
                  const base = group.base_name;
                  const sel = selectedVersions[base] || { v1: "", v2: "" };
                  return (
                    <div
                      key={base}
                      className="box-container"
                      style={{ marginBottom: "24px" }}
                    >
                      <div className="section-label">Base: {base}</div>
                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          flexWrap: "wrap",
                          alignItems: "flex-end",
                        }}
                      >
                        {["v1", "v2"].map((vk, vi) => (
                          <div key={vk}>
                            <div
                              style={{ fontSize: "12px", marginBottom: "4px" }}
                            >
                              Version {vi === 0 ? "A" : "B"}
                            </div>
                            <select
                              className="main-input"
                              style={{ width: "180px" }}
                              value={sel[vk]}
                              onChange={(e) =>
                                setSelectedVersions((p) => ({
                                  ...p,
                                  [base]: { ...p[base], [vk]: e.target.value },
                                }))
                              }
                            >
                              <option value="">Select version</option>
                              {group.versions.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.version_label} ({v.original_name})
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                        <button
                          className="btn"
                          onClick={() => handleShowDiff(base, sel.v1, sel.v2)}
                          disabled={!sel.v1 || !sel.v2 || sel.v1 === sel.v2}
                        >
                          Compare Versions
                        </button>
                      </div>
                      <div
                        style={{
                          marginTop: "12px",
                          fontSize: "12px",
                          color: "var(--text-muted)",
                        }}
                      >
                        Available:{" "}
                        {group.versions.map((v) => v.version_label).join(", ")}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ══ SUMMARIZER ══ */}
          {view === "summarizer" && (
            <>
              <div className="panel-left">
                <div className="box-container">
                  <div className="section-label">Select Document</div>
                  <select
                    className="main-input"
                    value={sumDocId}
                    onChange={(e) => setSumDocId(e.target.value)}
                  >
                    <option value="">-- Select a document --</option>
                    {documents.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.original_name}
                      </option>
                    ))}
                  </select>
                  <div className="section-label">Format</div>
                  <select
                    className="main-input"
                    value={sumFormat}
                    onChange={(e) => setSumFormat(e.target.value)}
                  >
                    <option>Executive Summary</option>
                    <option>Bullet Points</option>
                    <option>Action Items</option>
                  </select>
                  <button
                    className="btn"
                    onClick={handleSummarize}
                    disabled={isSummarizing}
                  >
                    {isSummarizing ? (
                      <>
                        <div className="spinner" />
                        &nbsp;Generating...
                      </>
                    ) : (
                      "Generate Summary"
                    )}
                  </button>
                </div>
              </div>
              <div className="panel-right">
                <div className="ai-header">
                  <span>
                    <FileText size={16} /> SUMMARY RESULT
                  </span>
                  {summaryResult && (
                    <div className="export-buttons">
                      {["docx", "pdf", "txt"].map((ft) => (
                        <button
                          key={ft}
                          onClick={() =>
                            handleExport(summaryResult, ft, "Document Summary")
                          }
                        >
                          <Download size={12} /> {ft.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ai-body">
                  {isSummarizing ? (
                    <div className="ai-thinking">
                      <div className="ai-dot" />
                      <div className="ai-dot" />
                      <div className="ai-dot" />
                      <span>Reading document & structuring summary...</span>
                    </div>
                  ) : summaryResult ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: summaryResult
                          .replace(/\n/g, "<br/>")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  ) : (
                    <div className="ai-placeholder">
                      Select a document to summarize.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ══ COMPARE ══ */}
          {view === "compare" && (
            <>
              <div className="panel-left">
                <div className="box-container">
                  {["Document 1", "Document 2"].map((label, i) => {
                    const val = i === 0 ? compDoc1 : compDoc2;
                    const setter = i === 0 ? setCompDoc1 : setCompDoc2;
                    return (
                      <div key={label}>
                        <div className="section-label">{label}</div>
                        <select
                          className="main-input"
                          value={val}
                          onChange={(e) => setter(e.target.value)}
                        >
                          <option value="">-- Select document --</option>
                          {documents.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.original_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                  <button
                    className="btn"
                    onClick={handleCompare}
                    disabled={isComparing}
                  >
                    {isComparing ? (
                      <>
                        <div className="spinner" />
                        &nbsp;Analyzing...
                      </>
                    ) : (
                      "Compare Documents"
                    )}
                  </button>
                </div>
              </div>
              <div className="panel-right">
                <div className="ai-header">
                  <Columns size={16} /> COMPARISON ANALYSIS
                </div>
                <div className="ai-body">
                  {isComparing ? (
                    <div className="ai-thinking">
                      <div className="ai-dot" />
                      <div className="ai-dot" />
                      <div className="ai-dot" />
                      <span>Cross-referencing documents...</span>
                    </div>
                  ) : compResult ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: compResult
                          .replace(/\n/g, "<br/>")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  ) : (
                    <div className="ai-placeholder">
                      Select two documents to compare.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ══ ANALYTICS ══ */}
          {view === "analytics" && (
            <div className="panel-full">
              <h2>System Analytics</h2>
              {analyticsData ? (
                <div className="stat-grid">
                  {[
                    [analyticsData.total_documents, "Documents Indexed"],
                    [analyticsData.total_queries, "Total Queries Run"],
                    [
                      analyticsData.summaries_run +
                        analyticsData.comparisons_run,
                      "AI Tasks Executed",
                    ],
                    [`${analyticsData.vault_size_mb} MB`, "Vault Size"],
                    [bookmarks.length, "Saved Bookmarks"],
                    [annotations.length, "Annotations Added"],
                  ].map(([val, label]) => (
                    <div key={label} className="stat-card">
                      <div className="stat-value">{val}</div>
                      <div className="stat-label">{label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Loading analytics...</p>
              )}
            </div>
          )}

          {/* ══ AUDIT TRAIL ══ */}
          {view === "audit" && (
            <AuditTrailView
              auditLog={auditLog}
              fetchAuditLog={fetchAuditLog}
              renderAuditDetails={renderAuditDetails}
              handleClearAudit={handleClearAuditLog}
            />
          )}

          {/* ══ SETTINGS ══ */}
          {view === "settings" && (
            <div className="panel-full">
              <h2>
                Engine Settings{" "}
                <CheckCircle2 size={20} color="var(--success)" />
              </h2>
              <div className="settings-box">
                <div className="section-label">Response Language</div>
                <select
                  className="main-input"
                  value={userSettings.language}
                  onChange={(e) =>
                    saveSettings({ ...userSettings, language: e.target.value })
                  }
                >
                  <optgroup label="Indian Languages">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Bengali</option>
                  </optgroup>
                  <optgroup label="European Languages">
                    <option>French</option>
                    <option>German</option>
                    <option>Spanish</option>
                  </optgroup>
                </select>

                <div className="section-label">Search Context Depth</div>
                <input
                  type="number"
                  min="1"
                  max="15"
                  className="main-input"
                  value={userSettings.searchDepth}
                  onChange={(e) =>
                    saveSettings({
                      ...userSettings,
                      searchDepth: parseInt(e.target.value),
                    })
                  }
                />

                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="autoTag"
                    checked={userSettings.autoTagging}
                    onChange={(e) =>
                      saveSettings({
                        ...userSettings,
                        autoTagging: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="autoTag">
                    Enable Automatic Vault Tagging
                  </label>
                </div>
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="complianceMode"
                    checked={userSettings.complianceMode}
                    onChange={(e) =>
                      saveSettings({
                        ...userSettings,
                        complianceMode: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="complianceMode">
                    Enable Compliance Mode (Protocol Verification)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ══ BOOKMARKS ══ */}
          {view === "bookmarks" && (
            <div className="panel-full">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <h2
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Bookmark size={20} /> Query Bookmarks
                </h2>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {bookmarks.length} saved
                </span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "24px",
                }}
              >
                Click any saved query below to instantly run it in the Query
                Engine.
              </p>
              {bookmarks.length === 0 ? (
                <div className="empty-state" style={{ marginTop: "60px" }}>
                  <Bookmark
                    size={36}
                    style={{ opacity: 0.2, margin: "0 auto 12px" }}
                  />
                  <p>No bookmarks yet. Save queries from the engine.</p>
                </div>
              ) : (
                <div className="bookmark-list">
                  {bookmarks.map((bk) => (
                    <div key={bk.id} className="bookmark-card">
                      <div
                        className="bk-query"
                        onClick={() => handleRunBookmark(bk.query)}
                      >
                        <Play size={14} className="bk-play-icon" />
                        {bk.query}
                      </div>
                      {editingBookmarkId === bk.id ? (
                        <div>
                          <textarea
                            className="bookmark-note-input"
                            rows={2}
                            defaultValue={bk.note}
                            id={`bk-note-${bk.id}`}
                            placeholder="Add a note..."
                          />
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginTop: "6px",
                            }}
                          >
                            <button
                              className="btn-small"
                              onClick={() =>
                                handleUpdateBookmarkNote(
                                  bk.id,
                                  document.getElementById(`bk-note-${bk.id}`)
                                    .value,
                                )
                              }
                            >
                              Save
                            </button>
                            <button
                              className="btn-small"
                              onClick={() => setEditingBookmarkId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {bk.note && (
                            <div className="bk-note">"{bk.note}"</div>
                          )}
                          <div className="bk-date">
                            {new Date(bk.created_at).toLocaleString()}
                            <button
                              className="btn-small"
                              style={{ marginLeft: "8px" }}
                              onClick={() => setEditingBookmarkId(bk.id)}
                            >
                              Edit note
                            </button>
                          </div>
                        </>
                      )}
                      <Trash2
                        size={13}
                        className="bookmark-delete"
                        onClick={() => handleDeleteBookmark(bk.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ HEALTH SCORE ══ */}
          {view === "health" && (
            <div className="panel-full">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <h2
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Heart size={20} /> Document Health Score
                </h2>
                <button
                  className="btn-small"
                  onClick={() => {
                    setHealthScores({});
                    fetchAllHealthScores();
                  }}
                >
                  <RefreshCw size={13} /> Re-score all
                </button>
              </div>
              {documents.length === 0 ? (
                <div className="empty-state">
                  <p>No documents in vault.</p>
                </div>
              ) : (
                <div className="health-grid">
                  {documents.map((doc) => {
                    const hs = healthScores[doc.id];
                    const loading = loadingHealth[doc.id];
                    if (!hs && !loading) fetchHealthScore(doc.id);
                    const grade = hs?.grade || "mid";
                    const score = hs?.total_score ?? 0;
                    return (
                      <div key={doc.id} className="health-card">
                        <div
                          className="health-doc-name"
                          title={doc.original_name}
                        >
                          {doc.original_name}
                        </div>
                        {loading ? (
                          <div
                            className="ai-thinking"
                            style={{ padding: "8px 0" }}
                          >
                            <div className="ai-dot" />
                            <div className="ai-dot" />
                            <div className="ai-dot" />
                            <span>Scoring...</span>
                          </div>
                        ) : hs ? (
                          <>
                            <div className="health-score-row">
                              <div className={`health-score-num ${grade}`}>
                                {score}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div className="health-bar-bg">
                                  <div
                                    className={`health-bar-fill ${grade}`}
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                                <div
                                  style={{
                                    fontSize: "10px",
                                    color: "var(--text-muted)",
                                    marginTop: "4px",
                                  }}
                                >
                                  {hs.word_count} words
                                </div>
                              </div>
                              <span className={`health-badge ${grade}`}>
                                {grade === "high"
                                  ? "Good"
                                  : grade === "mid"
                                    ? "Fair"
                                    : "Poor"}
                              </span>
                            </div>
                            <button
                              className="btn-small"
                              style={{ marginTop: "10px" }}
                              onClick={() => refreshHealthScore(doc.id)}
                            >
                              <RefreshCw size={11} /> Refresh
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn-small"
                            onClick={() => fetchHealthScore(doc.id)}
                          >
                            Score document
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ TIMELINE ══ */}
          {view === "timeline" && (
            <div className="panel-full">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <h2
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Clock size={20} /> Activity Timeline
                </h2>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["all", "query", "upload", "summary", "compare"].map((f) => (
                    <button
                      key={f}
                      className={`chip ${timelineFilter === f ? "active" : ""}`}
                      onClick={() => setTimelineFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                  <button className="btn-small" onClick={handleClearTimeline}>
                    <Trash2 size={12} /> Clear
                  </button>
                </div>
              </div>
              {filteredTimeline.length === 0 ? (
                <div className="empty-state" style={{ marginTop: "60px" }}>
                  <Clock
                    size={36}
                    style={{ opacity: 0.2, margin: "0 auto 12px" }}
                  />
                  <p>No activity recorded yet.</p>
                </div>
              ) : (
                <div className="timeline-wrapper">
                  <div className="timeline-line" />
                  {filteredTimeline.map((event) => (
                    <div key={event.id} className="timeline-entry">
                      <div className={`timeline-dot ${event.type}`} />
                      <div className="timeline-card">
                        <span className={`timeline-type-badge ${event.type}`}>
                          {event.type}
                        </span>
                        <div className="timeline-content">{event.content}</div>
                        <div className="timeline-ts">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ BATCH EXPORT ══ */}
          {view === "batch" && (
            <div className="panel-full">
              <h2
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <PackageOpen size={20} /> Batch Vault Export
              </h2>
              <div className="batch-export-panel">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <div className="section-label" style={{ margin: 0 }}>
                    Select Documents
                  </div>
                  <button className="btn-small" onClick={handleBatchSelectAll}>
                    {batchSelected.length === documents.length ? (
                      <CheckSquare size={13} />
                    ) : (
                      <Square size={13} />
                    )}{" "}
                    Select all
                  </button>
                </div>
                {documents.map((doc) => (
                  <div key={doc.id} className="batch-doc-row">
                    <input
                      type="checkbox"
                      className="batch-checkbox"
                      checked={batchSelected.includes(doc.id)}
                      onChange={() => toggleBatchSelect(doc.id)}
                    />
                    <span className="batch-doc-name">{doc.original_name}</span>
                  </div>
                ))}
              </div>
              <button
                className="btn"
                onClick={handleBatchExport}
                disabled={isBatchExporting || !batchSelected.length}
                style={{ marginTop: "16px", padding: "12px 24px" }}
              >
                {isBatchExporting ? (
                  <>
                    <div className="spinner" />
                    &nbsp;Generating...
                  </>
                ) : (
                  <>
                    <Download size={16} /> Export
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
