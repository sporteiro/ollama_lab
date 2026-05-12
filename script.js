const modelSelect = document.getElementById('model');
const refreshBtn = document.getElementById('refresh-models');
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const systemPrompt = document.getElementById('system-prompt');

const sentEl = document.getElementById('metric-sent');
const genEl = document.getElementById('metric-gen');
const tpsEl = document.getElementById('metric-tps');
const ttftEl = document.getElementById('metric-ttft');

let conversation = [];

async function fetchModels() {
    try {
        const resp = await fetch(`/api/tags`);
        const data = await resp.json();
        const models = data.models || [];
        modelSelect.innerHTML = '';
        models.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.name;
            opt.textContent = m.name;
            modelSelect.appendChild(opt);
        });
        if (models.length > 0) {
            modelSelect.value = models[0].name;
        }
    } catch (err) {
        console.error('Error fetching models:', err);
        modelSelect.innerHTML = '<option>Could not load models</option>';
    }
}

function addMessage(role, content) {
    const div = document.createElement('div');
    div.classList.add('message', role === 'user' ? 'user-msg' : 'assistant-msg');
    div.textContent = content;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function resetMetrics() {
    sentEl.textContent = '0';
    genEl.textContent = '0';
    tpsEl.textContent = '0';
    ttftEl.textContent = '0';
}

async function sendMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;

    sendBtn.disabled = true;
    userInput.disabled = true;
    userInput.value = '';

    addMessage('user', userText);
    conversation.push({ role: 'user', content: userText });

    const sysText = systemPrompt.value.trim();
    const messagesPayload = [];
    if (sysText) {
        messagesPayload.push({ role: 'system', content: sysText });
    }
    messagesPayload.push(...conversation);

    addMessage('assistant', '');
    resetMetrics();

    const startTime = performance.now();
    let firstTokenReceived = false;
    let totalTokens = 0;
    let generatedText = '';

    try {
        const response = await fetch(`/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: modelSelect.value,
                messages: messagesPayload,
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const json = JSON.parse(line);
                    if (json.message && json.message.content) {
                        const token = json.message.content;
                        generatedText += token;
                        totalTokens++;

                        if (!firstTokenReceived) {
                            firstTokenReceived = true;
                            const ttft = performance.now() - startTime;
                            ttftEl.textContent = Math.round(ttft);
                        }

                        const lastMsg = messagesDiv.lastElementChild;
                        if (lastMsg && lastMsg.classList.contains('assistant-msg')) {
                            lastMsg.textContent = generatedText;
                        }
                        messagesDiv.scrollTop = messagesDiv.scrollHeight;
                    }
                } catch (e) {
                    console.error('JSON parse error:', e);
                }
            }
        }

        const endTime = performance.now();
        const totalTimeSec = (endTime - startTime) / 1000;
        if (totalTokens > 0 && totalTimeSec > 0) {
            tpsEl.textContent = Math.round(totalTokens / totalTimeSec);
        }
        sentEl.textContent = messagesPayload.reduce((acc, m) => acc + m.content.length, 0);
        genEl.textContent = totalTokens;

        conversation.push({ role: 'assistant', content: generatedText });

    } catch (err) {
        console.error('Error:', err);
        const lastMsg = messagesDiv.lastElementChild;
        if (lastMsg && lastMsg.classList.contains('assistant-msg')) {
            lastMsg.textContent = 'Error: could not reach Ollama.';
        }
    } finally {
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});
refreshBtn.addEventListener('click', fetchModels);

fetchModels();