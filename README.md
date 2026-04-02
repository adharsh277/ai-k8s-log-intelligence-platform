# ai-k8s-log-intelligence-platform

Production-ready Express microservice with TypeScript, structured JSON logging, and a futuristic landing page on `GET /`.

## Features

- `GET /` returns a styled app-like UI with randomized success or failure
- `GET /health` always returns `200`
- Structured JSON logs include timestamp, service, level, message, and requestId
- Request ID and request logging middleware are built in
- Randomized latency and simulated failures for observability testing

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

## Build and Start

```bash
npm run build
npm start
```

## Environment Variables

- `PORT` defaults to `3000`
- `SERVICE_NAME` defaults to `node-app`

## Docker

```bash
docker build -t node-app:latest .
docker run --rm -p 3000:3000 -e SERVICE_NAME=node-app node-app:latest
```

## Kubernetes

The manifests in `k8s/` are aligned to the app on port `3000` and include a namespace, deployment, service, network policy, and HPA.

## Project Structure

```text
src/
├── server.ts
├── app.ts
├── routes/
├── middleware/
└── utils/
```