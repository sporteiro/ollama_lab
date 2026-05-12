# ollama-lab

A local prompt lab built with a single HTML file. No frameworks, no API keys, no cloud costs. Just you, your browser, and an Ollama server running on your machine.

## Why this exists

I was taking the "Building with the Claude API" course and hit a wall. The Anthropic API requires credits to work. I did not want to pay just to learn.

After trying several free API gateways and running into rate limits, broken endpoints, and missing credits, I realized I already had powerful models running locally via Ollama. What I needed was not another cloud service, but a simple local interface that let me test prompts, measure speed, and understand how the model behaves under the hood.

Most existing interfaces try to clone ChatGPT or Claude. This one focuses on learning. It shows real-time generation metrics so you can see exactly how fast tokens appear, how long the model takes to start responding, and how context length affects performance.

## Features

- Works with any model you have pulled in Ollama
- Real-time streaming of the model response
- Live metrics: tokens per second, time to first token, token counts
- Editable system prompt
- Single HTML file, no build step, no dependencies
- Retro-futuristic CRT aesthetic (because terminal vibes matter)

## Prerequisites

- [Ollama](https://ollama.com) installed and running (`ollama serve`)
- At least one model pulled (e.g., `ollama pull deepseek-r1:latest`)
- A modern web browser

## Usage

1. Start Ollama if it is not already running:

2. Open `index.html` in your browser. No server required.

3. Select a model from the dropdown, type a system prompt if desired, and start chatting.

## How it works

The page sends requests to Ollama's local API at `http://localhost:11434/api/chat`. Responses are streamed token by token, and the UI calculates timing metrics on the fly. Everything stays inside your machine.

## Why "lab" and not just "chat"?

Most chat interfaces only care about the conversation. This one adds a small metrics panel that tells you:
- How many tokens you sent
- How many tokens the model generated
- The speed in tokens per second
- The time it took for the first token to appear

This turns every prompt into a tiny experiment, which is exactly what I needed for the course, and maybe what others need too.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.