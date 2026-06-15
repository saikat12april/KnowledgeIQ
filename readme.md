# 🧠 KnowledgeIQ: AI-Powered Document Vault & Query Engine

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/Frontend-React.js-blue.svg)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)
![Ollama](<https://img.shields.io/badge/AI-Ollama_(LLaMA_3)-black.svg>)

> **KnowledgeIQ** is a highly secure, AI-driven document management platform designed for regulated environments. It leverages local Large Language Models (LLMs) to ingest, analyze, summarize, and cross-reference protocols, SOPs, and research papers without sending sensitive data to external APIs.

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Prerequisites](#-prerequisites)

---

## 📖 About the Project

In highly regulated industries (like life sciences, pharma, and research), data privacy is paramount. **KnowledgeIQ** solves the problem of information silos by allowing teams to upload complex documents (PDFs, DOCX, TXT) into a secure vault. Using a local vector search engine paired with a local LLM, users can ask complex questions, compare document versions, and generate compliance health scores—all while keeping data 100% internal.

## ✨ Key Features

- 🔍 **Deep Query Engine:** Ask natural language questions and get synthesized answers with direct inline citations to your internal documents.
- 🛡️ **Compliance Mode:** Automatically scans queries and documents for protocol violations, forbidden chemicals, or missing safety warnings (MSDS, PPE).
- 📊 **Automated Health Scoring:** Grades every uploaded document (0-100) based on readability, completeness, data richness, and compliance terminology.
- 📑 **Intelligent Summarizer & Comparator:** Generate executive summaries or run side-by-side analyses of two different documents.
- ⏳ **Version Control & Diffing:** Upload different versions of the same SOP and visually track what changed via HTML diffs.
- 📦 **Batch Exporting:** Select multiple documents and generate a single, AI-summarized PDF or Word report.
- 🗄️ **Comprehensive Audit Trail:** Logs every search query, compliance check, upload, and export for regulatory oversight.

---

## 🏗️ Architecture & Tech Stack

This project is built using a decoupled Two-Tier Architecture:

### Frontend

- **Framework:** React.js (Functional Components, Hooks)
- **Styling:** Custom CSS with CSS Variables for Light/Dark Mode toggling
- **Icons:** `lucide-react`
- **HTTP Client:** `axios`

### Backend

- **Framework:** FastAPI (Python)
- **AI/LLM Engine:** Ollama (running `llama3` locally)
- **Vector Search:** Custom TF-IDF Local Vector Engine
- **Document Processing:** `PyMuPDF` (PDFs), `python-docx` (Word), `fpdf` (PDF Generation)
- **Storage:** Local Ephemeral/Persistent Disk (JSON file-based DB)

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:

1. **Node.js** (v16.0 or higher) & **npm**
2. **Python** (v3.9 or higher)
3. **Ollama:** You must have [Ollama installed](https://ollama.com/) and running locally.
   - _Once installed, pull the LLaMA 3 model by running:_
     ```bash
     ollama run llama3
     ```
