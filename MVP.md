# Aegis AI
Version: MVP v2.0

Author: Jefferson Arnado

Last Updated: July 31, 2026

---

# Project Status

Current Phase

🟦 Phase 1 — Foundation & Landing Page

Progress

███████░░░░░░░░░░░░░░░ 30%

Overall MVP Progress

████░░░░░░░░░░░░░░░░░░ 18%

---

# Product Vision

Aegis AI is an AI-powered Interview Copilot built specifically for software engineers.

Unlike ChatGPT, Aegis is NOT a chatbot.

Every interaction revolves around an Interview Session.

The AI understands:

- Resume
- Job Description
- Company
- Position
- Interview Type

Then generates personalized interview answers based on the user's actual experience.

The long-term vision is to become the "Cursor for Technical Interviews."

---

# Core User Flow

Landing Page

↓

Create Account

↓

Login

↓

Dashboard

↓

Upload Resume

↓

Create Interview Session

↓

Select Resume

↓

Paste Job Description

↓

Generate Interview Context

↓

Interview Workspace

↓

AI Listens

↓

Generate Answer

↓

Copy Answer

↓

Save Session

↓

Interview History

---

# Current Folder Structure

Status

✅ Stable

Architecture

src/

app/

components/

hooks/

lib/

providers/

store/

styles/

types/

utils/

---

# Current Tech Stack

Framework

✅ Next.js 15

UI

✅ React 19

Styling

✅ Tailwind CSS v4

Component Library

✅ shadcn/ui

Animation

✅ Framer Motion

Language

✅ TypeScript

State

⬜ Zustand

Server State

⬜ TanStack Query

Authentication

⬜ Better Auth

ORM

⬜ Prisma

Database

⬜ PostgreSQL

Storage

⬜ Supabase Storage

AI

⬜ OpenAI
⬜ Gemini
⬜ Claude

Deployment

⬜ Vercel

---

# MVP Roadmap

## Phase 1

Foundation

Status

🟨 In Progress

Tasks

✅ Next.js Project

✅ Tailwind CSS

✅ shadcn/ui

✅ TypeScript

✅ Framer Motion

✅ Design Tokens

✅ Folder Structure

✅ Marketing Layout

✅ Navbar

✅ Hero Section

🟨 Hero Responsive Improvements

⬜ Features Section

⬜ Workflow Section

⬜ Pricing

⬜ FAQ

⬜ CTA

⬜ Footer Polish

Progress

75%

---

## Phase 2

Authentication

Status

⬜ Pending

Features

Register

Login

Logout

Protected Routes

Session Management

JWT

Refresh Tokens

Remember Me

Social Login (Future)

Pages

/login

/register

---

## Phase 3

Database

Status

⬜ Pending

Database

PostgreSQL

Prisma ORM

Tables

users

resumes

interview_sessions

interview_messages

settings

history

---

## Phase 4

Resume Library

Status

⬜ Pending

Features

Upload Resume

Multiple Resumes

Default Resume

Preview Resume

Delete Resume

Replace Resume

Resume Parsing

PDF

DOCX

Extracted Text

Storage

Supabase Storage

---

## Phase 5

Interview Session

Status

⬜ Pending

Flow

Click

New Interview

↓

Interview Modal Opens

↓

Company

↓

Position

↓

Paste Job Description

↓

Choose Existing Resume

or

Upload New Resume

↓

Choose AI Model

↓

Choose Interview Type

↓

Start Session

---

Interview Types

Technical

Behavioral

HR

Coding

System Design

Mixed

---

Session Status

Preparing

Listening

Thinking

Generating

Completed

---

## Phase 6

Interview Workspace

Status

⬜ Pending

This becomes the heart of Aegis AI.

Layout

────────────────────────────────────────────

Interview

AI Suggestion

Live Transcript

Keywords

Confidence

Resume Context

Job Context

────────────────────────────────────────────

Features

Live Transcript

Current Question

Answer Button

Generate Answer

Copy Answer

Regenerate

Confidence Score

Keywords

Resume Context

Job Description Context

Session Timer

End Session

---

## Phase 7

AI Integration

Status

⬜ Pending

Pipeline

Speech

↓

Transcript

↓

Question Detection

↓

Retrieve Resume Context

↓

Retrieve Job Description Context

↓

Prompt Builder

↓

LLM

↓

Generate Answer

↓

Display Answer

Supported Models

GPT-5

Claude

Gemini

Future

DeepSeek

Local Models

---

## Phase 8

Interview History

Status

⬜ Pending

Stores

Company

Position

Resume

Job Description

Questions

Generated Answers

Transcript

Duration

AI Model

Date

Actions

Open Session

Delete

Search

Filter

---

## Phase 9

Profile

Status

⬜ Pending

Fields

Name

Email

Years Experience

Preferred Stack

Preferred AI

Language

---

## Phase 10

Settings

Status

⬜ Pending

Theme

Dark

Light

System

Language

AI Provider

Default Resume

Notifications

---

# Landing Page Progress

Hero

✅ Completed

Navbar

✅ Completed

Responsive Hero

🟨 Improving

Features Section

⬜

Workflow

⬜

Pricing

⬜

FAQ

⬜

CTA

⬜

Footer

🟨 Basic

---

# Interview Modal

Current Design

Company

Position

Job Description

Resume

AI Model

Interview Type

Language

Difficulty

──────────────────────

Start Interview

──────────────────────

---

# Interview Workspace

Current Design

┌───────────────────────────────────────────┐

Interview Camera / Screenshot

───────────────────────────────

Live Transcript

───────────────────────────────

Question

───────────────────────────────

AI Suggested Answer

───────────────────────────────

Keywords

Confidence

───────────────────────────────

Answer

Copy

Regenerate

Next Question

End Interview

└───────────────────────────────────────────┘

---

# AI Workflow

Start Session

↓

Load Resume

↓

Load Job Description

↓

Generate Interview Context

↓

Listen

↓

Question Detected

↓

Generate Personalized Answer

↓

Display Answer

↓

Continue Listening

↓

Save Session

---

# Future Features

Browser Extension

Desktop App

Microphone Streaming

Voice Output

Live Screen Detection

ATS Resume Scoring

AI Mock Interviewer

Company Knowledge Base

Interview Analytics

Recruiter Mode

Team Accounts

Realtime Collaboration

---

# Current Priorities

Priority 1

Complete Landing Page

Priority 2

Authentication

Priority 3

Resume Upload

Priority 4

Interview Session Modal

Priority 5

Interview Workspace

Priority 6

AI Integration

Priority 7

Interview History

Priority 8

Deployment

---

# Definition of MVP Complete

The MVP is complete when a user can:

✅ Create an account

✅ Login

✅ Upload a resume

✅ Create an interview session

✅ Paste a job description

✅ Choose a resume

✅ Start an interview

✅ Let Aegis understand the question

✅ Generate contextual answers

✅ Copy the answer

✅ Save the session

✅ View interview history

without relying on external tools.

---

# Development Notes

Current Architecture Philosophy

- Keep components small and reusable.
- Build around the Interview Session, not around CRUD pages.
- Prioritize responsiveness and premium UX.
- Keep business logic inside feature modules.
- Avoid premature optimization and overengineering during the MVP stage.
- Design every new feature so it can evolve into a production-ready SaaS without requiring major rewrites.