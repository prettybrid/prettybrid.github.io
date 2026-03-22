#!/bin/bash
# Prettybrid startup script
# This runs on login to ensure all services are running

# Enable auto-restart after power failure (requires admin - do once manually)
# sudo systemsetup -setrestartpowerfailure on

# Wait for bitcoind to be ready
sleep 10

# Check and start ord index server if not running
if ! pgrep -f "ord.*server" > /dev/null; then
  /Users/prettybrid/bin/ord --bitcoin-rpc-url http://127.0.0.1:8332 server &
fi

# Check and start ord_server.py if not running  
if ! pgrep -f "ord_server.py" > /dev/null; then
  python3 /Users/prettybrid/ord_server.py &
fi

# Check and start ngrok if not running
if ! pgrep -f "ngrok" > /dev/null; then
  /Users/prettybrid/bin/ngrok http --url=prettybrid.ngrok.app 7777 &
fi

# Keep Mac awake
if ! pgrep -f "caffeinate" > /dev/null; then
  caffeinate -i &
fi

echo "Prettybrid services started"
