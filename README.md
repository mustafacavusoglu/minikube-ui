# Minikube UI

An OpenShift-style Kubernetes dashboard for Minikube clusters. Provides a modern web UI for managing and monitoring your local Kubernetes resources — pods, deployments, services, ingresses, configmaps, secrets, and more — with real-time log streaming and interactive terminal access.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Express](https://img.shields.io/badge/Express-4-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Resource Management** — View, edit, and manage pods, deployments, statefulsets, daemonsets, jobs, cronjobs, services, ingresses, PVCs, configmaps, secrets, and custom resources
- **Live Log Streaming** — Stream pod logs in real time via WebSocket
- **Interactive Terminal** — Exec into pods directly from the browser (xterm.js)
- **YAML Editor** — Edit and apply raw Kubernetes YAML
- **Namespace Switcher** — Navigate across namespaces
- **Cluster Metrics** — Basic cluster health and resource usage (requires metrics-server)
- **Dark / Light Theme** — Tailwind CSS + Radix UI components

## Architecture

```
minikube-ui/
├── backend/     # Express.js + @kubernetes/client-node
└── frontend/    # Next.js (App Router) + Tailwind CSS
```

The backend connects to your local Kubernetes cluster via kubeconfig (default context: `minikube`) and exposes a REST + WebSocket API. The frontend proxies all `/api/*` and `/ws/*` requests to the backend.

| Service   | Default URL                    |
|-----------|--------------------------------|
| Frontend  | http://localhost:3000          |
| Backend   | http://localhost:3001          |
| WS Terminal | ws://localhost:3001/ws/terminal |
| WS Logs   | ws://localhost:3001/ws/logs    |

## Prerequisites

- **Node.js** v18+
- **npm** v9+
- **Minikube** running locally (`minikube start`)
- `kubectl` configured with a valid kubeconfig (typically `~/.kube/config`)

Optionally, enable the metrics server for resource usage stats:

```bash
minikube addons enable metrics-server
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mustafacavusoglu/minikube-ui.git
cd minikube-ui
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure the backend (optional)

Copy the example env file and adjust values if needed:

```bash
cp backend/.env.example backend/.env
```

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Path to your kubeconfig file. Leave empty to use the default (~/.kube/config)
KUBECONFIG=

# Kubernetes context to use. Defaults to "minikube"
K8S_CONTEXT=minikube

# Set to true if metrics-server addon is enabled in Minikube
METRICS_SERVER_ENABLED=false

# Shell used for interactive terminal sessions
TERMINAL_SHELL=/bin/sh

# Maximum number of concurrent terminal sessions
MAX_TERMINAL_SESSIONS=10
```

### 4. Configure the frontend (optional)

```bash
cp frontend/.env.local.example frontend/.env.local
```

```env
# URL of the backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Start development servers

```bash
npm run dev
```

Or use the provided shell script:

```bash
./start.sh
```

Both servers start concurrently. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies for both backend and frontend |
| `npm run dev` | Start both servers in development mode (with hot reload) |
| `npm run build` | Build backend and frontend for production |

### Backend only

```bash
cd backend
npm run dev      # development with nodemon
npm run build    # compile TypeScript
npm start        # run compiled output
```

### Frontend only

```bash
cd frontend
npm run dev      # Next.js dev server
npm run build    # production build
npm start        # serve production build
```

## Connecting to a Different Cluster

By default the backend targets the `minikube` context in your kubeconfig. To use a different cluster or context, update `backend/.env`:

```env
KUBECONFIG=/path/to/your/kubeconfig
K8S_CONTEXT=your-context-name
```

## API Overview

All endpoints are served at `http://localhost:3001/api/v1/`.

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /namespaces` | List namespaces |
| `GET /pods` | List pods |
| `GET /deployments` | List deployments |
| `GET /services` | List services |
| `GET /ingresses` | List ingresses |
| `GET /nodes` | List nodes |
| `GET /metrics` | Cluster metrics |
| `GET /events` | Cluster events |
| `POST /yaml` | Apply YAML |

**WebSocket:**

```
ws://localhost:3001/ws/terminal?namespace=<ns>&pod=<pod>&container=<container>
ws://localhost:3001/ws/logs?namespace=<ns>&pod=<pod>&container=<container>&tailLines=100
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Radix UI |
| Backend | Express.js, TypeScript, @kubernetes/client-node |
| Real-time | WebSocket (ws), xterm.js |
| Data Fetching | SWR |
| Charts | Recharts |
| Forms | React Hook Form + Zod |

## License

MIT
