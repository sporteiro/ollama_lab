import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from dotenv import load_dotenv
import urllib.request
import urllib.error
import json

load_dotenv()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
PORT = int(os.getenv("LAB_PORT", 8080))

class LabHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('index.html', 'r', encoding='utf-8') as f:
                html = f.read()
            self.wfile.write(html.encode())
        elif self.path.startswith('/api/'):
            self.proxy_request('GET')
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/'):
            self.proxy_request('POST')
        else:
            super().do_POST()

    def proxy_request(self, method):
        target_url = OLLAMA_HOST + self.path
        headers = {k: v for k, v in self.headers.items() if k.lower() != 'host'}
        body = None
        if method == 'POST':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)

        req = urllib.request.Request(target_url, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req) as resp:
                self.send_response(resp.status)
                for k, v in resp.headers.items():
                    if k.lower() != 'transfer-encoding':
                        self.send_header(k, v)
                self.end_headers()
                self.wfile.write(resp.read())
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.end_headers()
            self.wfile.write(e.read())

if __name__ == '__main__':
    print(f"ollama-lab running at http://localhost:{PORT}")
    httpd = HTTPServer(('', PORT), LabHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("Server stopped.")