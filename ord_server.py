#!/usr/bin/env python3
import http.server,json,base64,os,subprocess,tempfile,ipaddress
from urllib.parse import urlparse

PORT=7777
WORKER_SECRET="prettybrid2026"
ORD_PATH=os.path.expanduser("~/bin/ord")
BTC_RPC_URL="http://127.0.0.1:8332"

CLOUDFLARE_IPS=["173.245.48.0/20","103.21.244.0/22","103.22.200.0/22","103.31.4.0/22","141.101.64.0/18","108.162.192.0/18","190.93.240.0/20","188.114.96.0/20","197.234.240.0/22","198.41.128.0/17","162.158.0.0/15","104.16.0.0/13","104.24.0.0/14","172.64.0.0/13","131.0.72.0/22","127.0.0.1/32"]
CLOUDFLARE_NETS=[ipaddress.ip_network(ip,strict=False) for ip in CLOUDFLARE_IPS]

def is_cf_ip(ip):
    try: return any(ipaddress.ip_address(ip) in n for n in CLOUDFLARE_NETS)
    except: return False

class H(http.server.BaseHTTPRequestHandler):
    def log_message(self,f,*a): print(f"[Prettybrid] {self.client_address[0]} {f%a}")
    def json(self,d,s=200):
        b=json.dumps(d).encode()
        self.send_response(s);self.send_header('Content-Type','application/json');self.send_header('Content-Length',len(b));self.send_header('Access-Control-Allow-Origin','*');self.end_headers();self.wfile.write(b)
    def ok(self):
        if not is_cf_ip(self.client_address[0]): self.json({'error':'Forbidden'},403);return False
        if self.headers.get('Authorization','')!=f"Bearer {WORKER_SECRET}": self.json({'error':'Unauthorized'},401);return False
        return True
    def do_OPTIONS(self):
        self.send_response(200);self.send_header('Access-Control-Allow-Origin','*');self.send_header('Access-Control-Allow-Methods','POST,GET,OPTIONS');self.send_header('Access-Control-Allow-Headers','Content-Type,Authorization');self.end_headers()
    def do_GET(self):
        if not self.ok(): return
        p=urlparse(self.path).path
        if p=='/status':
            r=subprocess.run(['bitcoin-cli','getblockcount'],capture_output=True,text=True,timeout=5)
            self.json({'status':'ok','blocks':r.stdout.strip()})
        elif p=='/balance':
            r=subprocess.run([ORD_PATH,'--bitcoin-rpc-url',BTC_RPC_URL,'wallet','--no-sync','balance'],capture_output=True,text=True,timeout=10)
            self.json({'status':'ok','balance':json.loads(r.stdout)})
        else: self.json({'error':'Not found'},404)
    def do_POST(self):
        if not self.ok(): return
        if urlparse(self.path).path=='/inscribe':
            try:
                body=json.loads(self.rfile.read(int(self.headers.get('Content-Length',0))))
                img=body.get('imageDataUrl','');addr=body.get('receiveAddress','');fee=body.get('feeRate',2);title=body.get('title','untitled')
                if not img or not addr: self.json({'error':'Missing fields'},400);return
                h,enc=img.split(',',1)
                suffix='.png' if 'png' in h else '.jpg'
                tmp=tempfile.NamedTemporaryFile(suffix=suffix,prefix='prettybrid_',delete=False)
                tmp.write(base64.b64decode(enc));tmp.close()
                r=subprocess.run([ORD_PATH,'--bitcoin-rpc-url',BTC_RPC_URL,'wallet','--no-sync','inscribe','--fee-rate',str(fee),'--file',tmp.name,'--destination',addr],capture_output=True,text=True,timeout=120)
                os.unlink(tmp.name)
                if r.returncode==0:
                    out=json.loads(r.stdout);self.json({'status':'ok','inscriptionId':out.get('inscription',''),'reveal':out.get('reveal',''),'commit':out.get('commit','')})
                else: self.json({'error':r.stderr or 'Failed'},500)
            except Exception as e: self.json({'error':str(e)},500)
        else: self.json({'error':'Not found'},404)

print("Prettybrid ord server (Cloudflare-secured) running on port 7777...")
http.server.HTTPServer(('0.0.0.0',PORT),H).serve_forever()
