# Aegis AI

Version: 1.0

Author: Jefferson Arnado

---

# AI Development Context

This document is the single source of truth for the Aegis AI project.

Every AI assistant working on this project must read this document before making changes.

If another document conflicts with assumptions, always follow the documentation.

Never assume requirements that are not written.

---

# Project Overview

Aegis AI is an AI-powered Interview Copilot built specifically for software engineers.

It is inspired by products like Parakeet AI but is NOT intended to be a chatbot.

Everything revolves around an Interview Session.

Users

• Upload Resume

• Paste Job Description

• Generate Interview Context

• Start Interview

• AI listens

• Generate personalized interview answers

---

# Product Philosophy

Aegis is NOT ChatGPT.

Aegis is NOT Claude.

Aegis is NOT an AI chatbot.

It is an Interview Workspace.

Every feature should support that vision.

---

# Primary Goal

Help software engineers answer interview questions using their own experience.

Never fabricate experience.

Always prioritize authenticity.

---

# Tech Stack

Frontend

Next.js 15

React 19

TypeScript

Tailwind CSS v4

shadcn/ui

Framer Motion

Backend

Next.js Route Handlers

Database

PostgreSQL

Prisma

Authentication

Better Auth

Storage

Supabase Storage

State

Zustand

Server State

TanStack Query

AI

OpenAI

Gemini

Claude

Deployment

Vercel

---

# Folder Structure

Never redesign the folder structure without approval.

Current architecture follows:

app

components

features

services

hooks

store

providers

styles

lib

utils

types

---

# Design Philosophy

Dark Theme

Glassmorphism

Premium SaaS

Cyber Professional

Minimal

Modern

The landing page should resemble Linear, Raycast, Vercel, and Parakeet AI.

Avoid excessive gradients.

Avoid bright colors.

Use subtle cyan accents.

---

# Component Philosophy

Keep components small.

Prefer composition.

Avoid components larger than ~300 lines.

Avoid duplicated UI.

Reusable components belong inside:

components/shared

---

# Coding Rules

Always explain architectural decisions before writing code.

Never rewrite working code unless requested.

Never rename files without approval.

Never introduce unnecessary abstractions.

Do not overengineer the MVP.

Build incrementally.

---

# Current Progress

Landing Page

Completed

✔ Navbar

✔ Hero

In Progress

Responsive Hero

Next

Workflow Section

Features Section

Pricing

FAQ

CTA

Footer

---

# Future Milestones

Authentication

Resume Library

Interview Modal

Interview Workspace

AI Integration

History

Settings

Deployment

---

# Product Differentiators

Resume Evidence Mode

Job Description Intelligence

Missing Experience Warning

Interview Templates

Company Context

Follow-up Predictor

Confidence Breakdown

Personal Knowledge Base

Interview Coach

---

# Things That Must Never Change

The application is Interview Session centered.

It is not a chatbot.

The Interview Workspace is the main product.

Glassmorphism remains the primary design language.

Folder structure should remain stable.

---

# How AI Should Respond

Before writing code

Explain

Architecture

Files affected

Reasoning

Then wait for approval if major changes are involved.

If requirements are unclear

Ask questions.

Never invent missing requirements.

---

# Current Task

Finish the Landing Page.

Current section

Workflow Section.