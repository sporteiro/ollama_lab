FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .
COPY index.html style.css script.js .

EXPOSE 8080

ENV OLLAMA_HOST=http://host.docker.internal:11434
ENV LAB_PORT=8080

CMD ["python", "server.py"]
