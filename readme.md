# 🧠 KnowledgeIQ: AI-Powered Document Vault & Query Engine

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Database-Local_Vector_DB-47A248?style=for-the-badge&logo=json" />
  <img src="https://img.shields.io/badge/AI-Ollama%20%7C%20LLaMA3-000000?style=for-the-badge&logo=meta" />
</p>

<p align="center">
  <b>Secure, On-Premise AI Document Management, Compliance Verification & Synthesis System</b>
</p>

---

## 📌 Overview

KnowledgeIQ is a highly secure, AI-driven document management platform designed specifically for regulated environments (life sciences, pharma, enterprise research). It solves information silos by allowing teams to upload complex documents (PDFs, DOCX, TXT) into a secure vault.

By utilizing local Large Language Models (LLaMA 3 via Ollama) and a custom local vector search engine, users can ask complex questions, generate compliance health scores, cross‑reference protocols, and run automated document audits — **all while keeping 100% of the data internal and offline.**

---

## ✨ Key Features

### 🔍 Deep Query Engine

- Real‑time streaming AI answers
- Automatic inline citations `[Doc: "Filename"]` with exact text linking
- Interactive query bookmarking for quick re‑runs

### 🛡️ Compliance Mode

- Automated scanning for protocol violations
- Detection of forbidden chemicals / missing safety data (MSDS, PPE)
- Visual warning alerts before AI generation

### 📊 Document Health Scoring

- Automated 0–100 grading system for every uploaded document
- Analyzes readability, completeness, data richness, compliance terminology
- AI‑generated issue narration (e.g., “Missing quantitative data points”)

### 📑 Intelligent Summarizer & Comparator

- Generate Executive Summaries, Bullet Points, or Action Items
- Run side‑by‑side comparative analysis of two different documents
- Extract tabular chemical data automatically

### ⏳ Version Control & Diffing

- Visual HTML diffing for comparing document versions (`SOP_v1` vs `SOP_v2`)
- Comprehensive Audit Trail logging every search, compliance check, export
- Activity Timeline to track document lifecycle events

### 📦 Batch Exporting

- Select multiple documents to generate a single AI‑summarized report
- Export directly to PDF, DOCX, or TXT

---

# 🏗️ System Architecture

```text
┌──────────────────────────┐
│       React.js UI        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      FastAPI Server      │
└────────────┬─────────────┘
             │
 ┌───────────┼───────────┐
 ▼           ▼           ▼

 Local     Local Vector   Ollama
 JSON DB     Engine      (LLaMA 3)
```

---

## 📂 Project Structure

```text
knowledge_iq_workspace/
│
├── backend/
│   ├── data/
│   │   ├── db/
│   │   ├── papers/
│   │   └── vectors/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

# 🛠️ Tech Stack

```text

| Category        | Technologies                          |
| --------------- | ------------------------------------- |
| Frontend        | React.js, Lucide-react                |
| Backend         | FastAPI, Uvicorn                      |
| Database        | Custom JSON / TF‑IDF Vectors          |
| AI Models       | Ollama (LLaMA 3 Local)                |
| Doc Parsing     | PyMuPDF, python-docx                  |
| Exporting       | FPDF, python-docx                     |
| HTTP Client     | Axios                                 |
```

---

## 🔄 Workflow

```text
User Uploads Document
 │
 ▼
Text Extraction & Vectorization
 │
 ▼
User Submits Query
 │
 ▼
Vector Engine Finds Top Excerpts
 │
 ▼
Ollama Synthesizes Answer
 │
 ▼
UI Displays Streaming Response + Citations
```

---

## 📸 Application Modules

```text
✅ Document Vault (Upload / Manage)

✅ AI Query Engine with Citations

✅ Compliance Checker

✅ Document Health Scoring

✅ Intelligent Summarizer

✅ Document Comparator (Diff View)

✅ Version Control & Auditing

✅ Batch Export (PDF/DOCX/TXT)

✅ Audit Trail & Activity Timeline
```

---

```text
## 👨‍💻 Developed By

### Saikat Kr De

B.Tech CSE Student (VIT Chennai, Class of 2028)

AI • Full Stack Development • Enterprise Automation
```

---

## 📄 License

```text
Licensed under the MIT License.

See `LICENSE` for more information.
```
