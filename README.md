# ollama-lab

A local prompt lab built with a single HTML file. No frameworks, no API keys, no cloud costs. Just you, your browser, and an Ollama server running on your machine.

## Why this exists

I was learning to integrate a commercial AI API and hit a wall. The API required paid credits to work, and I did not want to pay just to learn.

After trying several free API gateways and running into rate limits, broken endpoints, and missing credits, I realized I already had powerful models running locally via Ollama. What I needed was not another cloud service, but a simple local interface that let me test prompts, measure speed, and understand how the model behaves under the hood.

Most existing interfaces try to clone ChatGPT or Claude. This one focuses on learning. It shows real-time generation metrics so you can see exactly how fast tokens appear, how long the model takes to start responding, and how context length affects performance.

## Features

- Works with any model you have pulled in Ollama
- Real-time streaming of the model response
- Live metrics: tokens per second, time to first token, token counts
- Editable system prompt
- Single HTML file, no build step, no dependencies
- Retro-futuristic CRT aesthetic (because terminal vibes matter)
- Docker support for easy setup

## Prerequisites

- [Ollama](https://ollama.com) installed and running
- At least one model pulled (e.g., `ollama pull deepseek-r1:latest`)
- A modern web browser
- Docker and Docker Compose (optional, for containerized setup)

## Usage

### With Docker Compose (recommended)

```bash
docker-compose up --build