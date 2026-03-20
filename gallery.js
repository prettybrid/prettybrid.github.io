var adminMode=false;
var viewMode="cinematic";
var cur=null;
var tt;
var pieces=[{img:"/the_desert_speaks_back.png",title:"The Desert Speaks Back",coll:"Altered States of Reality",ed:"1 of 10",price:"0.02 BTC",inscr:"",desc:"The desert does not wait to be photographed. It reads you first."}];

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
  document.getElementById("mnt").textContent=pieces[i].title;
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
      h+="</div>";
      h+="<div style='padding:0.75rem 0;'>";
      h+="<div style='font-family:Courier Prime,monospace;font-size:0.52rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:0.25rem;'>"+p.coll+"</div>";
      h+="<div style='font-size:1.1rem;font-style:italic;color:var(--paper);margin-bottom:0.25rem;'>"+p.title+"</div>";
      h+="<div style='font-family:Courier Prime,monospace;font-size:0.55rem;color:var(--mist);'>"+p.ed+" &middot; "+p.price+"</div>";
      h+=del;
      h+="</div></div>";
    }
    h+="</div>";
  } else {
    for(i=0;i<pieces.length;i++){
      p=pieces[i];
      bi=p.inscr?"<span class='pdt'>Inscription <strong>#"+p.inscr.slice(0,8)+"</strong></span>":"<span class='pdt' style='color:var(--gold)'>Inscription pending</span>";
      di=p.desc?"<p style='font-style:italic;font-size:0.95rem;color:var(--mist);line-height:1.7;margin-bottom:0.75rem'>"+p.desc+"</p>":"";
      del=adminMode?"<button class='bdel' data-idx='"+i+"' style='font-family:Courier Prime,monospace;font-size:0.52rem;letter-spacing:0.15em;text-transform:uppercase;padding:0.5rem 1rem;background:transparent;color:#8b3a2a;border:1px solid #8b3a2a;cursor:pointer;border-radius:2px;margin-top:0.5rem;'>Remove Piece</button>":"";
      h+="<div class='piece'>";
      h+="<div class='piw'><img src='"+p.img+"' alt='"+p.title+"' loading='lazy'><div class='pio'></div></div>";
      h+="<div class='pii'>";
      h+="<div><div class='pc'>"+p.coll+"</div><h2 class='pt'>"+p.title+"</h2>";
      h+="<div class='pd'><span class='pdt'>Edition <strong>"+p.ed+"</strong></span>"+bi+"</div>"+di+"</div>";
      h+="<div class='pa'>";
      h+="<div class='pp'><span style='font-size:0.58rem;color:var(--mist)'>Price</span><span class='amt'>"+p.price+"</span></div>";
      h+="<button class='bb' data-idx='"+i+"'>Acquire</button>";
      h+="<button class='be' data-idx='"+i+"'>Enquire</button>";
      h+=del;
      h+="<div class='btcb'>Inscribed on Bitcoin</div>";
      h+="</div></div></div>";
    }
  }
  c.innerHTML=h;
  bindButtons();
}

function bindButtons(){
  var c=document.getElementById("gp");
  var i,el;
  
  var bb=c.querySelectorAll(".bb");
  for(i=0;i<bb.length;i++){
    el=bb[i];
    el.addEventListener("click",function(){openModal(+this.getAttribute("data-idx"));});
  }
  
  var be=c.querySelectorAll(".be");
  for(i=0;i<be.length;i++){
    el=be[i];
    el.addEventListener("click",function(){sendEmail("Enquiry: "+pieces[+this.getAttribute("data-idx")].title);});
  }
  
  var gp=c.querySelectorAll(".grid-piece");
  for(i=0;i<gp.length;i++){
    el=gp[i];
    el.addEventListener("click",function(e){
      if(!e.target.classList.contains("bdel")){
        openModal(+this.getAttribute("data-idx"));
      }
    });
  }
  
  var bd=c.querySelectorAll(".bdel");
  for(i=0;i<bd.length;i++){
    el=bd[i];
    el.addEventListener("click",function(e){
      e.stopPropagation();
      var idx=+this.getAttribute("data-idx");
      if(confirm("Remove this piece?")){
        pieces.splice(idx,1);
        render();
        showToast("Piece removed");
      }
    });
  }
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
    pieces.unshift({
      img:e.target.result,
      title:t,
      coll:document.getElementById("ac").value.trim(),
      ed:document.getElementById("ae").value.trim(),
      price:document.getElementById("apr2").value.trim(),
      inscr:document.getElementById("ainsc").value.trim(),
      desc:document.getElementById("ad").value.trim()
    });
    render();
    document.getElementById("adp").style.display="none";
    showToast("Piece added!");
    document.getElementById("at2").value="";
    document.getElementById("ae").value="";
    document.getElementById("apr2").value="";
    document.getElementById("ainsc").value="";
    document.getElementById("ad").value="";
    document.getElementById("aip").style.display="none";
    f.value="";
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
  document.getElementById("ob").addEventListener("click",function(){closeModal();showToast("Bitcoin payment coming soon");});
  document.getElementById("oe").addEventListener("click",function(){if(cur!==null)sendEmail("Enquiry: "+pieces[cur].title);closeModal();});
  document.getElementById("apb").addEventListener("click",function(){var p=document.getElementById("adp");p.style.display=p.style.display==="block"?"none":"block";});
  document.getElementById("cnb").addEventListener("click",function(){document.getElementById("adp").style.display="none";});
  document.getElementById("ai").addEventListener("change",function(){
    var f=document.getElementById("ai");
    if(!f.files||!f.files.length)return;
    var reader=new FileReader();
    reader.onload=function(e){var p=document.getElementById("aip");p.src=e.target.result;p.style.display="block";};
    reader.readAsDataURL(f.files[0]);
  });
  document.getElementById("svb").addEventListener("click",addPiece);
  document.getElementById("btnCinematic").addEventListener("click",function(){setView("cinematic");});
  document.getElementById("btnGrid").addEventListener("click",function(){setView("grid");});
  
  var clicks=0;var timer=null;
  document.getElementById("adminActivate").addEventListener("click",function(){
    clicks++;
    clearTimeout(timer);
    timer=setTimeout(function(){clicks=0;},500);
    if(clicks>=3){clicks=0;enterAdmin();}
  });
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",init);
} else {
  init();
}
