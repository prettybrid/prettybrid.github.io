
var adminMode=false;
var adminClicks=0;
var adminTimer=null;
var pieces=[{img:"/the_desert_speaks_back.png",title:"The Desert Speaks Back",coll:"Altered States of Reality",ed:"1 of 10",price:"0.02 BTC",inscr:"",desc:"The desert does not wait to be photographed. It reads you first."}];
var cur=null;
var tt;
var D=document;

function sc(id){var e=D.getElementById(id);if(e)e.scrollIntoView({behavior:"smooth"});}
function em(s){var a="studio",b="prettybrid.com";window.location.href=a+"@"+b+(s?"?subject="+encodeURIComponent(s):"");}
function toast(m){var t=D.getElementById("tst");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(function(){t.classList.remove("show");},3000);}
function openM(i){cur=i;D.getElementById("mnt").textContent=pieces[i].title;D.getElementById("mod").classList.add("open");}
function closeM(){D.getElementById("mod").classList.remove("open");}

function render(){
  var c=D.getElementById("gp");
  if(!pieces.length){c.innerHTML="<div style='text-align:center;padding:6rem 3rem'><div style='font-size:1.5rem;font-style:italic;color:var(--mist)'>The collection is being assembled</div></div>";return;}
  var h="";
  for(var i=0;i<pieces.length;i++){
    var p=pieces[i];
    var bi=p.inscr?"<span class='pdt'>Inscription <strong>#"+p.inscr.slice(0,8)+"</strong></span>":"<span class='pdt' style='color:var(--gold)'>Inscription pending</span>";
    var di=p.desc?"<p style='font-style:italic;font-size:0.95rem;color:var(--mist);line-height:1.7;margin-bottom:0.75rem'>"+p.desc+"</p>":"";
    var delBtn=adminMode?"<button class='bdel' data-i='"+i+"' style='font-family:Courier Prime,monospace;font-size:0.52rem;letter-spacing:0.15em;text-transform:uppercase;padding:0.5rem 1rem;background:transparent;color:#8b3a2a;border:1px solid #8b3a2a;cursor:pointer;border-radius:2px;margin-top:0.5rem;'>Remove Piece</button>":"";
    h+="<div class='piece'><div class='piw'><img src='"+p.img+"' alt='"+p.title+"' loading='lazy'><div class='pio'></div></div>";
    h+="<div class='pii'><div><div class='pc'>"+p.coll+"</div><h2 class='pt'>"+p.title+"</h2><div class='pd'><span class='pdt'>Edition <strong>"+p.ed+"</strong></span>"+bi+"</div>"+di+"</div>";
    h+="<div class='pa'><div class='pp'><span style='font-size:0.58rem;color:var(--mist)'>Price</span><span class='amt'>"+p.price+"</span></div><button class='bb' data-i='"+i+"'>Acquire</button><button class='be' data-i='"+i+"'>Enquire</button>"+delBtn+"<div class='btcb'>Inscribed on Bitcoin</div></div></div></div>";
  }
  c.innerHTML=h;
  var bs=c.querySelectorAll(".bb");
  for(var j=0;j<bs.length;j++){bs[j].onclick=function(){openM(+this.getAttribute("data-i"));};}
  var es=c.querySelectorAll(".be");
  for(var k=0;k<es.length;k++){es[k].onclick=function(){em("Enquiry: "+pieces[+this.getAttribute("data-i")].title);};}
  var ds=c.querySelectorAll(".bdel");
  for(var d=0;d<ds.length;d++){ds[d].onclick=function(){
    if(confirm("Remove this piece from the gallery?")){
      pieces.splice(+this.getAttribute("data-i"),1);
      render();
      toast("Piece removed");
    }
  };}
}

function enterAdmin(){
  var pw=prompt("Admin password:");
  if(pw==="prettybrid2026"){
    adminMode=true;
    D.getElementById("adminTog").style.display="block";
    toast("Admin mode active");
    render();
  }
}

function previewAdminImage(input){
  if(!input.files||!input.files.length)return;
  var r=new FileReader();
  r.onload=function(e){var p=D.getElementById("aip");p.src=e.target.result;p.style.display="block";};
  r.readAsDataURL(input.files[0]);
}

function addPiece(){
  var f=D.getElementById("ai");
  var t=D.getElementById("at2").value.trim();
  if(!t){toast("Please enter a title");return;}
  if(!f.files||!f.files.length){toast("Please select an image");return;}
  var r=new FileReader();
  r.onload=function(e){
    pieces.unshift({img:e.target.result,title:t,coll:D.getElementById("ac").value.trim(),ed:D.getElementById("ae").value.trim(),price:D.getElementById("apr2").value.trim(),inscr:D.getElementById("ainsc").value.trim(),desc:D.getElementById("ad").value.trim()});
    render();
    D.getElementById("adp").style.display="none";
    toast("Piece added!");
    D.getElementById("at2").value="";D.getElementById("ae").value="";D.getElementById("apr2").value="";D.getElementById("ainsc").value="";D.getElementById("ad").value="";D.getElementById("aip").style.display="none";f.value="";
  };
  r.readAsDataURL(f.files[0]);
}

function openModal(i){cur=i;D.getElementById("mnt").textContent=pieces[i].title;D.getElementById("mod").classList.add("open");}
function closeModal(){D.getElementById("mod").classList.remove("open");}
function purchaseViaBTC(){closeModal();toast("Bitcoin payment coming soon");}
function purchaseViaEmail(){if(cur!==null)em("Enquiry: "+pieces[cur].title);closeModal();}

D.addEventListener("DOMContentLoaded",function(){
  render();
  D.getElementById("eb").onclick=function(){var s=D.getElementById("sp");s.style.opacity="0";setTimeout(function(){s.style.display="none";},1000);};
  D.getElementById("n1").onclick=function(){sc("gallery");};
  D.getElementById("n2").onclick=function(){sc("about");};
  D.getElementById("n3").onclick=function(){em("");};
  D.getElementById("hs").onclick=function(){sc("gallery");};
  D.getElementById("cb").onclick=function(){em("");};
  D.getElementById("f1").onclick=function(){sc("gallery");};
  D.getElementById("f2").onclick=function(){sc("about");};
  D.getElementById("f3").onclick=function(){em("");};
  D.getElementById("cls").onclick=closeModal;
  D.getElementById("ob").onclick=function(){closeModal();toast("Bitcoin payment coming soon");};
  D.getElementById("oe").onclick=function(){if(cur!==null)em("Enquiry: "+pieces[cur].title);closeModal();};
  D.getElementById("apb").onclick=function(){var p=D.getElementById("adp");p.style.display=p.style.display==="block"?"none":"block";};
  D.getElementById("cnb").onclick=function(){D.getElementById("adp").style.display="none";};
  D.getElementById("ai").onchange=function(){if(!this.files||!this.files.length)return;var r=new FileReader();r.onload=function(e){var p=D.getElementById("aip");p.src=e.target.result;p.style.display="block";};r.readAsDataURL(this.files[0]);};
  D.getElementById("svb").onclick=function(){addPiece();};
  
  // Secret admin activation - triple click copyright
  var clicks=0;var timer=null;
  D.getElementById("adminActivate").onclick=function(){
    clicks++;clearTimeout(timer);
    timer=setTimeout(function(){clicks=0;},500);
    if(clicks>=3){clicks=0;enterAdmin();}
  };
});
