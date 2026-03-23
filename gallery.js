var adminMode=false;
var viewMode="cinematic";
var cur=null;
var tt;
var pieces=[{img: '/the_desert_speaks_back.jpg',title:"The Desert Speaks Back",coll:"Altered States of Reality",ed: '1 of 1',price: '₿0.10 BTC',inscr: 'Inscription pending',desc:"The desert does not wait to be photographed. It reads you first."}];

function scrollTo(id){var e=document.getElementById(id);if(e)e.scrollIntoView({behavior:"smooth"});}

function sendEmail(subj){
  var u="mai"+"lto:"+"studio"+"@"+"prettybrid.com";
  if(subj)u+="?subject="+encodeURIComponent(subj);
  window.location.href=u;
}

function showToast(m){
  var t=document.getElementById("tst");
  t.textContent=m;t.classList.add("show");
  clearTimeout(tt);
  tt=setTimeout(function(){t.classList.remove("show");},3000);
}

function openModal(i){
  cur=i;
  var p=pieces[i];
  var btcAddr="bc1pqfj7tzlc58k48ha9gkhu4qszwqxckatu9f7ue2amzutjqhgc7uyq7hq8we";
  document.getElementById("mnt").textContent=p.title;
  document.getElementById("pay-collection").textContent=p.coll||"Altered States of Reality";
  document.getElementById("pay-edition").textContent=p.ed||"1 of 10";
  document.getElementById("pay-price").textContent=p.price||"0.02 BTC";
  document.getElementById("pay-inscr").textContent=p.inscr?p.inscr.slice(0,20)+"...":"Pending confirmation";
  document.getElementById("pay-address").textContent=btcAddr;
  var amt=(p.price||"0.02 BTC").replace(" BTC","");
  document.getElementById("pay-qr").src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=bitcoin:"+btcAddr+"?amount="+amt+"&label="+encodeURIComponent(p.title);
  document.getElementById("pay-collector-addr").value="";
  document.getElementById("pay-success").style.display="none";
  document.getElementById("pay-form").style.display="block";
  document.getElementById("mod").classList.add("open");
}
function closeModal(){document.getElementById("mod").classList.remove("open");}

function setView(v){
  viewMode=v;
  var bc=document.getElementById("btnCinematic");
  var bg=document.getElementById("btnGrid");
  bc.style.borderColor=v==="cinematic"?"var(--gold)":"var(--charcoal)";
  bc.style.color=v==="cinematic"?"var(--gold)":"var(--mist)";
  bg.style.borderColor=v==="grid"?"var(--gold)":"var(--charcoal)";
  bg.style.color=v==="grid"?"var(--gold)":"var(--mist)";
  render();
}

function makeAcquireHandler(i){return function(){openModal(i);};}
function makeEnquireHandler(i){return function(){sendEmail("Enquiry: "+pieces[i].title);};}
function makeDeleteHandler(i){
  return function(e){
    e.stopPropagation();
    if(confirm("Remove piece?")){pieces.splice(i,1);render();showToast("Piece removed");}
  };
}
function makeGridHandler(i){
  return function(e){
    if(!e.target.classList.contains("bdel"))openModal(i);
  };
}

function render(){
  var c=document.getElementById("gp");
  if(!pieces.length){
    c.innerHTML="<div style='text-align:center;padding:6rem 3rem'><div style='font-size:1.5rem;font-style:italic;color:var(--mist)'>The collection is being assembled</div></div>";
    return;
  }
  var h="";
  var i,p,bi,di,del;
  if(viewMode==="grid"){
    h="<div style='display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;padding:0 3rem;max-width:1400px;margin:0 auto;'>";
    for(i=0;i<pieces.length;i++){
      p=pieces[i];
      del=adminMode?"<button class='bdel' data-idx='"+i+"' style='font-family:Courier Prime,monospace;font-size:0.5rem;padding:0.35rem 0.75rem;background:transparent;color:#8b3a2a;border:1px solid #8b3a2a;cursor:pointer;border-radius:2px;margin-top:0.5rem;width:100%;'>Remove</button>":"";
      h+="<div class='grid-piece' data-idx='"+i+"' style='cursor:pointer;'>";
      h+="<div style='width:100%;position:relative;overflow:hidden;background:var(--charcoal);aspect-ratio:16/9;'>";
      h+="<img src='"+p.img+"' alt='"+p.title+"' style='width:100%;height:100%;object-fit:cover;display:block;'>";
      h+="</div><div style='padding:0.75rem 0;'>";
      h+="<div style='font-family:Courier Prime,monospace;font-size:0.52rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:0.25rem;'>"+p.coll+"</div>";
      h+="<div style='font-size:1.1rem;font-style:italic;color:var(--paper);margin-bottom:0.25rem;'>"+p.title+"</div>";
      h+="<div style='font-family:Courier Prime,monospace;font-size:0.55rem;color:var(--mist);'>"+p.ed+" &middot; "+p.price+"</div>";
      h+=del+"</div></div>";
    }
    h+="</div>";
  } else {
    for(i=0;i<pieces.length;i++){
      p=pieces[i];
      bi=p.inscr?"<span class='pdt'>Inscription <strong>#"+p.inscr.slice(0,8)+"</strong></span>":"<span class='pdt' style='color:var(--gold)'>Inscription pending</span>";
      di=p.desc?"<p style='font-style:italic;font-size:0.95rem;color:var(--mist);line-height:1.7;margin-bottom:0.75rem'>"+p.desc+"</p>":"";
      del=adminMode?"<button class='bdel' data-idx='"+i+"' style='font-family:Courier Prime,monospace;font-size:0.52rem;letter-spacing:0.15em;text-transform:uppercase;padding:0.5rem 1rem;background:transparent;color:#8b3a2a;border:1px solid #8b3a2a;cursor:pointer;border-radius:2px;margin-top:0.5rem;'>Remove Piece</button>":"";
      h+="<div class='piece'><div class='piw'><img src='"+p.img+"' alt='"+p.title+"' loading='lazy'><div class='pio'></div></div>";
      h+="<div class='pii'><div><div class='pc'>"+p.coll+"</div><h2 class='pt'>"+p.title+"</h2>";
      h+="<div class='pd'><span class='pdt'>Edition <strong>"+p.ed+"</strong></span>"+bi+"</div>"+di+"</div>";
      h+="<div class='pa'><div class='pp'><span style='font-size:0.58rem;color:var(--mist)'>Price</span><span class='amt'>"+p.price+"</span></div>";
      h+="<button class='bb' data-idx='"+i+"'>Acquire</button>";
      h+="<button class='be' data-idx='"+i+"'>Enquire</button>";
      h+=del+"<div class='btcb'>Inscribed on Bitcoin</div></div></div></div>";
    }
  }
  c.innerHTML=h;
  var bb=c.querySelectorAll(".bb");
  for(i=0;i<bb.length;i++)bb[i].addEventListener("click",makeAcquireHandler(+bb[i].getAttribute("data-idx")));
  var be=c.querySelectorAll(".be");
  for(i=0;i<be.length;i++)be[i].addEventListener("click",makeEnquireHandler(+be[i].getAttribute("data-idx")));
  var bd=c.querySelectorAll(".bdel");
  for(i=0;i<bd.length;i++)bd[i].addEventListener("click",makeDeleteHandler(+bd[i].getAttribute("data-idx")));
  var gp=c.querySelectorAll(".grid-piece");
  for(i=0;i<gp.length;i++)gp[i].addEventListener("click",makeGridHandler(+gp[i].getAttribute("data-idx")));
}

function enterAdmin(){
  var pw=prompt("Admin password:");
  if(pw==="prettybrid2026"){
    adminMode=true;
    document.getElementById("adminTog").style.display="block";
    showToast("Admin mode active");
    render();
  }
}

function addPiece(){
  var f=document.getElementById("ai");
  var t=document.getElementById("at2").value.trim();
  if(!t){showToast("Please enter a title");return;}
  if(!f.files||!f.files.length){showToast("Please select an image");return;}
  var reader=new FileReader();
  reader.onload=function(e){
    pieces.unshift({img:e.target.result,title:t,coll:document.getElementById("ac").value.trim(),ed:document.getElementById("ae").value.trim(),price:document.getElementById("apr2").value.trim(),inscr:document.getElementById("ainsc").value.trim(),desc:document.getElementById("ad").value.trim()});
    render();
    document.getElementById("adp").style.display="none";
    showToast("Piece added!");
    document.getElementById("at2").value="";document.getElementById("ae").value="";document.getElementById("apr2").value="";document.getElementById("ainsc").value="";document.getElementById("ad").value="";document.getElementById("aip").style.display="none";f.value="";
  };
  reader.readAsDataURL(f.files[0]);
}

function init(){
  render();
  document.getElementById("n1").addEventListener("click",function(){scrollTo("gallery");});
  document.getElementById("n2").addEventListener("click",function(){scrollTo("about");});
  document.getElementById("n3").addEventListener("click",function(){sendEmail("");});
  document.getElementById("hs").addEventListener("click",function(){scrollTo("gallery");});
  document.getElementById("cb").addEventListener("click",function(){sendEmail("");});
  document.getElementById("f1").addEventListener("click",function(){scrollTo("gallery");});
  document.getElementById("f2").addEventListener("click",function(){scrollTo("about");});
  document.getElementById("f3").addEventListener("click",function(){sendEmail("");});
  document.getElementById("cls").addEventListener("click",closeModal);
  document.getElementById("ob").addEventListener("click",async function(){
  var ca=document.getElementById("pay-collector-addr").value.trim();
  var pc=pieces[cur];
  if(!ca){showToast("Please enter your Bitcoin wallet address");document.getElementById("pay-collector-addr").focus();return;}
  if(!ca.startsWith("bc1")){showToast("Enter a valid Bitcoin address starting with bc1");return;}
  if(!pc.inscr){showToast("Inscription pending — check back soon");return;}
  document.getElementById("ob").textContent="Processing...";
  document.getElementById("ob").disabled=true;
  try{
    var resp=await fetch("https://prettybrid-inscription.deletemyinformation8.workers.dev/order",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        pieceTitle:pc.title,
        collection:pc.coll,
        edition:pc.ed,
        price:pc.price,
        inscriptionId:pc.inscr,
        collectorAddress:ca
      })
    });
    var data=await resp.json();
    if(data.orderId){
      document.getElementById("pay-form").style.display="none";
      document.getElementById("pay-success").style.display="block";
      document.getElementById("pay-success-title").textContent=pc.title;
      document.getElementById("pay-order-id").textContent="Order ID: "+data.orderId;
    }else{
      showToast("Error: "+(data.error||"Please try again"));
    }
  }catch(e){
    showToast("Error: "+e.message);
  }
  document.getElementById("ob").textContent="Confirm Acquisition Request";
  document.getElementById("ob").disabled=false;
});
  document.getElementById("oe").addEventListener("click",function(){if(cur!==null)sendEmail("Enquiry: "+pieces[cur].title);closeModal();});
  document.getElementById("apb").addEventListener("click",function(){var p=document.getElementById("adp");p.style.display=p.style.display==="block"?"none":"block";});
  document.getElementById("cnb").addEventListener("click",function(){document.getElementById("adp").style.display="none";});
  document.getElementById("ai").addEventListener("change",function(){var f=document.getElementById("ai");if(!f.files||!f.files.length)return;var reader=new FileReader();reader.onload=function(e){var p=document.getElementById("aip");p.src=e.target.result;p.style.display="block";};reader.readAsDataURL(f.files[0]);});
  document.getElementById("svb").addEventListener("click",addPiece);
  document.getElementById("btnCinematic").addEventListener("click",function(){setView("cinematic");});
  document.getElementById("btnGrid").addEventListener("click",function(){setView("grid");});
  var clicks=0;var timer=null;
  document.getElementById("adminActivate").addEventListener("click",function(){clicks++;clearTimeout(timer);timer=setTimeout(function(){clicks=0;},500);if(clicks>=3){clicks=0;enterAdmin();}});
}

if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
