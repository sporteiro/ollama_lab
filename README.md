
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