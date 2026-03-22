const CORS={"Access-Control-Allow-Origin":"https://prettybrid.com","Access-Control-Allow-Methods":"POST,GET,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Authorization","Content-Type":"application/json"};

export default{
  async fetch(request,env,ctx){
    if(request.method==="OPTIONS")return new Response(null,{headers:CORS});
    const url=new URL(request.url);

    // Status check
    if(url.pathname==="/status"){
      try{const r=await fetch(env.ORD_NODE_URL+"/status",{headers:{"Authorization":"Bearer "+env.WORKER_SECRET},signal:AbortSignal.timeout(5000)});return new Response(JSON.stringify(await r.json()),{headers:CORS});}
      catch(e){return new Response(JSON.stringify({error:e.message}),{status:503,headers:CORS});}
    }

    // POST /order — collector submits acquisition request
    if(url.pathname==="/order"&&request.method==="POST"){
      try{
        const b=await request.json();
        if(!b.collectorAddress||!b.pieceTitle||!b.price||!b.inscriptionId)
          return new Response(JSON.stringify({error:"Missing fields"}),{status:400,headers:CORS});
        const orderId="order_"+Date.now()+"_"+Math.random().toString(36).slice(2,8);
        const order={
          id:orderId,
          pieceTitle:b.pieceTitle,
          collection:b.collection||"Altered States of Reality",
          edition:b.edition||"",
          price:b.price,
          inscriptionId:b.inscriptionId,
          collectorAddress:b.collectorAddress,
          paymentAddress:"bc1pqfj7tzlc58k48ha9gkhu4qszwqxckatu9f7ue2amzutjqhgc7uyq7hq8we",
          status:"awaiting_payment",
          createdAt:new Date().toISOString(),
          confirmedAt:null,
          transferredAt:null
        };
        await env.ORDERS.put(orderId,JSON.stringify(order));
        return new Response(JSON.stringify({success:true,orderId,paymentAddress:order.paymentAddress,price:order.price}),{headers:CORS});
      }catch(e){return new Response(JSON.stringify({error:e.message}),{status:500,headers:CORS});}
    }

    // GET /order?id=xxx — check order status
    if(url.pathname==="/order"&&request.method==="GET"){
      const id=url.searchParams.get("id");
      if(!id)return new Response(JSON.stringify({error:"Missing order id"}),{status:400,headers:CORS});
      const order=await env.ORDERS.get(id);
      if(!order)return new Response(JSON.stringify({error:"Order not found"}),{status:404,headers:CORS});
      return new Response(order,{headers:CORS});
    }

    // Scheduled: check payments and auto-transfer
    if(url.pathname==="/process"&&request.method==="POST"){
      const auth=request.headers.get("Authorization")||"";
      if(auth!=="Bearer "+env.WORKER_SECRET)return new Response(JSON.stringify({error:"Unauthorized"}),{status:401,headers:CORS});
      try{
        const list=await env.ORDERS.list({prefix:"order_"});
        let processed=0;
        for(const key of list.keys){
          const raw=await env.ORDERS.get(key.name);
          if(!raw)continue;
          const order=JSON.parse(raw);
          if(order.status!=="awaiting_payment")continue;
          // Check mempool for payment
          const mRes=await fetch("https://mempool.space/api/address/"+order.paymentAddress+"/txs");
          const txs=await mRes.json();
          const confirmed=txs.filter(tx=>tx.status&&tx.status.confirmed);
          if(confirmed.length>0){
            order.status="paid_pending_transfer";
            order.confirmedAt=new Date().toISOString();
            await env.ORDERS.put(key.name,JSON.stringify(order));
            // Auto-transfer inscription to collector
            try{
              const tRes=await fetch(env.ORD_NODE_URL+"/transfer",{
                method:"POST",
                headers:{"Content-Type":"application/json","Authorization":"Bearer "+env.WORKER_SECRET},
                body:JSON.stringify({inscriptionId:order.inscriptionId,toAddress:order.collectorAddress,feeRate:5}),
                signal:AbortSignal.timeout(30000)
              });
              const tData=await tRes.json();
              if(tData.status==="ok"){
                order.status="transferred";
                order.transferredAt=new Date().toISOString();
                order.transferTx=tData.txid||"";
                await env.ORDERS.put(key.name,JSON.stringify(order));
              }
            }catch(te){
              order.status="paid_transfer_failed";
              order.transferError=te.message;
              await env.ORDERS.put(key.name,JSON.stringify(order));
            }
            processed++;
          }
        }
        return new Response(JSON.stringify({success:true,processed}),{headers:CORS});
      }catch(e){return new Response(JSON.stringify({error:e.message}),{status:500,headers:CORS});}
    }

    // GET /orders — admin view
    if(url.pathname==="/orders"){
      const auth=request.headers.get("Authorization")||"";
      if(auth!=="Bearer "+env.WORKER_SECRET)return new Response(JSON.stringify({error:"Unauthorized"}),{status:401,headers:CORS});
      const list=await env.ORDERS.list({prefix:"order_"});
      const orders=[];
      for(const key of list.keys){const o=await env.ORDERS.get(key.name);if(o)orders.push(JSON.parse(o));}
      return new Response(JSON.stringify(orders),{headers:CORS});
    }

    // Keep existing inscription endpoint
    if(url.pathname==="/inscribe"&&request.method==="POST"){
      try{const b=await request.json();const r=await fetch(env.ORD_NODE_URL+"/inscribe",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+env.WORKER_SECRET},body:JSON.stringify(b),signal:AbortSignal.timeout(30000)});return new Response(JSON.stringify(await r.json()),{status:r.status,headers:CORS});}
      catch(e){return new Response(JSON.stringify({error:e.message}),{status:500,headers:CORS});}
    }

    // Balance check
    if(url.pathname==="/balance"){
      try{const r=await fetch(env.ORD_NODE_URL+"/balance",{headers:{"Authorization":"Bearer "+env.WORKER_SECRET},signal:AbortSignal.timeout(5000)});return new Response(JSON.stringify(await r.json()),{headers:CORS});}
      catch(e){return new Response(JSON.stringify({error:e.message}),{status:500,headers:CORS});}
    }

    return new Response(JSON.stringify({error:"Not found"}),{status:404,headers:CORS});
  },

  // Cron job — runs every 5 minutes to check payments
  async scheduled(event,env,ctx){
    ctx.waitUntil(this.fetch(new Request("https://prettybrid-inscription.deletemyinformation8.workers.dev/process",{method:"POST",headers:{"Authorization":"Bearer "+env.WORKER_SECRET}}),env,ctx));
  }
};