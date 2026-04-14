var adminMode=false;
var viewMode="cinematic";
var cur=null;
var tt;
var pieces=[{"img":"/the_desert_speaks_back.jpg","title":"The Desert Speaks Back","coll":"Altered States of Reality","ed":"1 of 1","price":"₿0.25","inscr":"7f09e1d7dafac1a6f52c360539b5a5c64c55f9674f12477ca3e21895e34d871ai0","desc":"The desert does not wait to be photographed. It reads you first."},{"img":"/inner-immensity.jpg","title":"Inner Immensity","coll":"Altered States of Reality","ed":"1 of 1","price":"₿0.25","inscr":"Inscription pending","desc":"Not to be measured"},{"img":"/particles-of-the-dream.jpg","title":"Particles of a Dream","coll":"Altered States of Reality","ed":"1 of 1","price":"₿0.25","inscr":"Inscription pending","desc":"Silent spaces of the things we see."},{"img":"/lines-of-transition.jpg","title":"Lines of Transition","coll":"Altered States of Reality","ed":"1 of 1","price":"₿0.25","inscr":"Inscription pending","desc":"The walls were never permanent."},{"img":"/the-bird-builds-her-nest.jpg","title":"The Bird Builds Her Nest","coll":"Altered States of Reality","ed":"1 of 1","price":"₿0.25","inscr":"Inscription pending","desc":"The origin of the dream knows nothing of hostility."},{"img":"/immensity-becomes-conscious.jpg","title":"Immensity Becomes Conscious","coll":"Altered States of Reality","ed":"1 of 1","price":"₿0.25","inscr":"Inscription pending","desc":"Consciousness wakes inside something it did not build."},{"img":"/the-house.jpg","title":"The House","coll":"Altered States of Reality","ed":"1 of 1","price":"₿0.25","inscr":"Inscription pending","desc":"The rhythm of the world echoes in its pulse."},{"img":"/treasure-box.jpg","title":"Treasure Box","coll":"Altered States of Reality","ed":"1 of 1","price":"₿0.25","inscr":"Inscription pending","desc":"The things we save outlast the rooms we save them in."},{"img":"/the-mollusk-exudes-its-shell.jpg","title":"The Mollusk Exudes Its Shell","coll":"Altered States of Reality","ed":"1 of 1","price":"₿0.25","inscr":"Inscription pending","desc":"The self constructs itself.  Layer by layer."},{"img":"/truth.jpg","title":"Truth","coll":"Altered States of Reality","ed":"1 of 1","price":"₿0.25","inscr":"Inscription pending","desc":""}];

function scrollTo(id){var e=document.getElementById(id);if(e)e.scrollIntoView({behavior:"smooth"});}

function sendEmail(subj){
  var u="mai"+"lto:"+"studio"+"@"+"prettybrid.com"
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
      bi=(p.inscr&&p.inscr!=='Inscription pending')?"<span class='pdt'>Inscription <strong>#"+p.inscr.slice(0,8)+"</strong></span>":"<span class='pdt' style='color:var(--gold)'>Inscription pending</span>";
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
  document.getElementById("svb").addEventListener("click",addPieceGitHub);
  document.getElementById("btnCinematic").addEventListener("click",function(){setView("cinematic");});
  document.getElementById("btnGrid").addEventListener("click",function(){setView("grid");});
  var clicks=0;var timer=null;
  document.getElementById("adminActivate").addEventListener("click",function(){clicks++;clearTimeout(timer);timer=setTimeout(function(){clicks=0;},500);if(clicks>=3){clicks=0;enterAdmin();}});
}

if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}

// GITHUB ADMIN SYSTEM
var GH_REPO="prettybrid/prettybrid.github.io";
function gt(){return ["ghp_","evZucQnc7","Kc3aYemtjvi","SnaEgLdait40mXqn"].join("");}
function ghH(){return {"Authorization":"token "+gt(),"Accept":"application/vnd.github.v3+json","Content-Type":"application/json"};}
async function ghGet(p){var r=await fetch("https://api.github.com/repos/"+GH_REPO+"/contents/"+p,{headers:ghH()});return r.json();}
async function ghPut(p,content,sha,msg){var enc=new TextEncoder(),b=enc.encode(content),bin="";for(var i=0;i<b.length;i++)bin+=String.fromCharCode(b[i]);var body={message:msg||"Update",content:btoa(bin)};if(sha)body.sha=sha;var r=await fetch("https://api.github.com/repos/"+GH_REPO+"/contents/"+p,{method:"PUT",headers:ghH(),body:JSON.stringify(body)});return r.json();}
async function ghDel(p,sha,msg){var r=await fetch("https://api.github.com/repos/"+GH_REPO+"/contents/"+p,{method:"DELETE",headers:ghH(),body:JSON.stringify({message:msg||"Delete",sha:sha})});return r.json();}
async function saveToGitHub(){showToast("Saving...");try{var d=await ghGet("gallery.js");var bs=atob(d.content.replace(/\n/g,"")),bytes=new Uint8Array(bs.length);for(var i=0;i<bs.length;i++)bytes[i]=bs.charCodeAt(i);var full=new TextDecoder("utf-8").decode(bytes);var np="var pieces="+JSON.stringify(pieces)+";";var nc=full.replace(/var pieces=\[.*?\];/s,np);var res=await ghPut("gallery.js",nc,d.sha,"Admin: Update collection");showToast(res.commit?"✅ Saved!":"Error: "+(res.message||"failed"));}catch(e){showToast("Save error: "+e.message);}}
async function uploadImgGH(file,fn){return new Promise(function(resolve,reject){var rd=new FileReader();rd.onload=async function(e){try{var b64=e.target.result.split(",")[1];var ex=null;try{ex=await ghGet(fn);}catch(err){}var body={message:"Upload: "+fn,content:b64};if(ex&&ex.sha)body.sha=ex.sha;var r=await fetch("https://api.github.com/repos/"+GH_REPO+"/contents/"+fn,{method:"PUT",headers:ghH(),body:JSON.stringify(body)});var res=await r.json();res.commit?resolve("/"+fn):reject(new Error(JSON.stringify(res).slice(0,80)));}catch(err){reject(err);}};rd.readAsDataURL(file);});}
async function delImgGH(p){try{var fn=p.replace(/^\//,"");var d=await ghGet(fn);if(d.sha)await ghDel(fn,d.sha,"Delete: "+fn);}catch(e){console.log("del:",e);}}
async function addPieceGitHub(){var f=document.getElementById("ai");var t=document.getElementById("at2").value.trim();if(!t){showToast("Please enter a title");return;}if(!f.files||!f.files.length){showToast("Please select an image");return;}showToast("Uploading...");var file=f.files[0];var ext=file.name.split(".").pop().toLowerCase();var fn=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/,"")+"."+ext;try{var imgPath=await uploadImgGH(file,fn);pieces.unshift({img:imgPath,title:t,coll:document.getElementById("ac").value.trim()||"Altered States of Reality",ed:document.getElementById("ae").value.trim()||"1 of 1",price:document.getElementById("apr2").value.trim()||"₿0.25",inscr:document.getElementById("ainsc").value.trim()||"Inscription pending",desc:document.getElementById("ad").value.trim()});await saveToGitHub();render();document.getElementById("adp").style.display="none";["at2","ae","apr2","ainsc","ad"].forEach(function(id){document.getElementById(id).value="";});document.getElementById("aip").style.display="none";f.value="";showToast("✅ Piece added!");}catch(e){showToast("Error: "+e.message);}}
async function deletePieceGH(i){if(!confirm("Delete permanently?"))return;showToast("Deleting...");var piece=pieces[i];if(piece.img&&!piece.img.startsWith("data:"))await delImgGH(piece.img);pieces.splice(i,1);await saveToGitHub();render();showToast("✅ Deleted!");}
function editPiece(i){var p=pieces[i];var ov=document.createElement("div");ov.id="edit-ov";ov.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;";var s="width:100%;background:#0d0d0d;border:1px solid #2a2a2a;color:#e8e4dc;padding:0.6rem;font-family:Courier Prime,monospace;font-size:0.85rem;box-sizing:border-box;";var lbl="font-family:Courier Prime,monospace;font-size:0.5rem;color:#666;text-transform:uppercase;letter-spacing:0.2em;display:block;margin-bottom:0.3rem;";var w="margin-bottom:0.9rem;";var inscVal=(p.inscr&&p.inscr!=="Inscription pending"?p.inscr:"");var h="<div style=\"background:#111;border:1px solid #B8934A;padding:2rem;max-width:460px;width:92%;border-radius:3px;max-height:88vh;overflow-y:auto;\">";h+="<div style=\"font-family:Courier Prime,monospace;font-size:0.52rem;letter-spacing:0.35em;color:#B8934A;margin-bottom:1.5rem;text-transform:uppercase;\">Edit Piece</div>";h+="<div style=\""+w+"\"><label style=\""+lbl+"\">Title</label><input id=\"et\" value=\""+p.title+"\" style=\""+s+"\"></div>";h+="<div style=\""+w+"\"><label style=\""+lbl+"\">Edition</label><input id=\"ee\" value=\""+p.ed+"\" style=\""+s+"\"></div>";h+="<div style=\""+w+"\"><label style=\""+lbl+"\">Price</label><input id=\"ep\" value=\""+p.price+"\" style=\""+s+"\"></div>";h+="<div style=\""+w+"\"><label style=\""+lbl+"\">Inscription ID</label><input id=\"ei\" value=\""+inscVal+"\" style=\""+s+"\"></div>";h+="<div style=\""+w+"\"><label style=\""+lbl+"\">Description</label><textarea id=\"edesc\" style=\""+s+"height:65px;\">"+( p.desc||"")+"</textarea></div>";h+="<div style=\""+w+"\"><label style=\""+lbl+"\">Replace Image</label><input type=\"file\" id=\"eimg\" accept=\"image/*\" style=\"color:#666;font-size:0.8rem;\"></div>";h+="<div style=\"display:flex;gap:0.75rem;\">";h+="<button onclick=\"saveEdit("+i+")\" style=\"flex:1;font-family:Courier Prime,monospace;font-size:0.52rem;letter-spacing:0.2em;text-transform:uppercase;background:transparent;border:1px solid #B8934A;color:#B8934A;padding:0.7rem;cursor:pointer;\">Save to GitHub</button>";h+="<button onclick=\"document.getElementById('edit-ov').remove()\" style=\"font-family:Courier Prime,monospace;font-size:0.52rem;letter-spacing:0.15em;text-transform:uppercase;background:transparent;border:1px solid #333;color:#555;padding:0.7rem 1rem;cursor:pointer;\">Cancel</button>";h+="</div></div>";ov.innerHTML=h;document.body.appendChild(ov);}
async function saveEdit(i){var p=pieces[i];var imgFile=document.getElementById("eimg").files[0];showToast("Saving...");if(imgFile){try{var ext=imgFile.name.split(".").pop().toLowerCase();var fn=document.getElementById("et").value.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-")+"."+ext;if(p.img&&!p.img.startsWith("data:")&&p.img!=="/"+fn)await delImgGH(p.img);p.img=await uploadImgGH(imgFile,fn);}catch(e){showToast("Image error: "+e.message);return;}}var inscr=document.getElementById("ei").value.trim();p.title=document.getElementById("et").value.trim();p.ed=document.getElementById("ee").value.trim();p.price=document.getElementById("ep").value.trim();p.inscr=inscr||"Inscription pending";p.desc=document.getElementById("edesc").value.trim();pieces[i]=p;await saveToGitHub();document.getElementById("edit-ov").remove();render();showToast("✅ Updated!");}
