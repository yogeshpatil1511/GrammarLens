# GrammarLens ✍️

A web app that checks grammar and spelling mistakes in sentences, paragraphs, and essays, and explains the mistakes.

## Tech Stack
- Backend: Flask (Python)
- Grammar Engine: LanguageTool (self-hosted, free, no API key required)
- Frontend: HTML, CSS, JavaScript
- Containerized with Docker & Docker Compose

## How to Run

### Prerequisites
- Docker and Docker Compose installed
- Git installed

### Steps
```bash
git clone https://github.com/yogeshpatil1511/GrammarLens.git
cd GrammarLens
docker-compose up --build -d
```

Check containers are running:
```bash
docker ps
```

Open in browser:
