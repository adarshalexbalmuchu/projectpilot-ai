# RiskMind AI

AI-powered project risk analysis assistant built with Python, Streamlit, and Groq.

## Overview

RiskMind AI turns unstructured project input (descriptions, notes, scope text, uploaded documents) into a structured PMBOK-style risk register.

The app can:

- Identify project risks from free-form text.
- Classify risks into standard PMBOK categories.
- Score each risk using Probability x Impact (1-9).
- Suggest practical mitigation actions.
- Export the register to CSV.

## Features

| Feature | Description |
| --- | --- |
| AI risk extraction | Uses LLaMA models via Groq to identify risks from text. |
| Structured risk register | Normalized table with category, evidence, probability, impact, and priority. |
| Priority scoring | Computes Probability x Impact score for each risk. |
| Visual overview | Risk score chart for quick prioritization. |
| Detailed breakdown | Expandable cards with evidence and mitigation guidance. |
| CSV export | One-click export of the generated register. |

## Tech Stack

| Component | Technology |
| --- | --- |
| UI | Streamlit |
| LLM Inference | Groq API |
| Models | llama-3.1-8b-instant, llama-3.3-70b-versatile |
| Data Processing | pandas |
| Config | python-dotenv |
| Language | Python 3.10+ |

## Project Structure

```text
riskmind-ai/
├── app.py
├── requirements.txt
├── .env.example
└── README.md
```

## Quick Start

1. Clone the repository and enter the project folder.

```bash
git clone https://github.com/adarshalexbalmuchu/riskmind-ai.git
cd riskmind-ai
```

1. Create and activate a virtual environment.

```bash
python -m venv .venv
source .venv/bin/activate
```

1. Install dependencies.

```bash
pip install -r requirements.txt
```

1. Configure environment variables.

```bash
cp .env.example .env
```

Edit `.env` and add your Groq key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

1. Run the app.

```bash
streamlit run app.py
```

## Example Input

Use this kind of input for best output quality:

```text
Project Title: E-Commerce Platform Relaunch

We are migrating our legacy PHP commerce stack to React/Node.js in 4 months,
integrating Stripe, PayPal, and a regional gateway before holiday season.
Budget may be cut by 15%. Two contractors leave in 6 weeks. Vendor API docs
are delayed. Change requests are frequent and no formal change control exists.
```

## Risk Categories

- Schedule Risk
- Cost Risk
- Scope Creep Risk
- Resource Risk
- Vendor / Procurement Risk
- Technical Risk
- Communication Risk
- Stakeholder Risk
- Quality Risk

## Priority Matrix

| Probability \ Impact | Low (1) | Medium (2) | High (3) |
| --- | --- | --- | --- |
| Low (1) | 1 | 2 | 3 |
| Medium (2) | 2 | 4 | 6 |
| High (3) | 3 | 6 | 9 |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| GROQ_API_KEY not found | Ensure `.env` exists and contains a valid key. |
| JSON parsing error | Retry with more complete input or switch to the 70B model. |
| App fails to start | Reinstall dependencies with `pip install -r requirements.txt`. |
| Weak analysis output | Provide clearer project scope, constraints, and stakeholders. |

## Notes

- Results are persisted in session state so reruns do not lose output.
- User/model text is escaped before HTML rendering in rich cards.
- UI uses centralized CSS tokens for easier design maintenance.
