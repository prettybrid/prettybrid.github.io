var pieces=[{imageUrl:"/the_desert_speaks_back.png",title:"The Desert Speaks Back",collection:"Altered States of Reality",edition:"1 of 10",price:"0.02 BTC",inscription:"",description:"The desert does not wait to be photographed. It reads you first."}];
var currentPieceForPurchase=null;

function renderGallery(){
  var container=document.getElementById("galleryPieces");
  if(!pieces.length){
    container.innerHTML="<div style='text-align:center;padding:6rem 3rem'><span style='font-size:3rem;opacity:0.2;display:block;margin-bottom:1.5rem'>&#9675;</span><div style='font-size:1.5rem;font-style:italic;color:#c8c2b4'>The collection is being assembled</div></div>";
    return;
  }
  var html="";
  for(var i=0;i<pieces.length;i++){
    var p=pieces[i];
    var inscriptionBadge=p.inscription?"<span class='piece-detail'>Inscription <strong>#"+p.inscription.slice(0,8)+"</strong></span>":"<span class='piece-detail' style='color:#b8934a'>Inscription pending</span>";
    var descHtml=p.description?"<p style='font-style:italic;font-size:0.95rem;color:#c8c2b4;line-height:1.7;margin-bottom:0.75rem'>"+p.description+"</p>":"";
    html+="<div class='piece'>";
    html+="<div class='piece-image-wrap'><img src='"+p.imageUrl+"' alt='"+p.title+"' loading='lazy'><div class='piece-overlay'></div></div>";
    html+="<div class='piece-info'><div class='piece-meta'>";
    html+="<div class='piece-collection'>"+p.collection+"</div>";
    html+="<h2 class='piece-title'>"+p.title+"</h2>";
    html+="<div class='piece-details'><span class='piece-detail'>Edition <strong>"+p.edition+"</strong></span>"+inscriptionBadge+"</div>";
    html+=descHtml;
    html+="</div>";
    html+="<div class='piece-actions'>";
    html+="<div class='piece-price'><span style='font-size:0.58rem;color:#c8c2b4'>Price</span><span class='amount'>"+p.price+"</span></div>";
    html+="<button class='btn-purchase' onclick='openModal("+i+")'>Acquire</button>";
    html+="<button class='btn-inquire' onclick='enquire("+i+")'>Enquire</button>";
    html+="<div class='piece-btc-badge'>Inscribed on Bitcoin</div>";
    html+="</div></div></div>";
  }
  container.innerHTML=html;
}

function enquire(i){
  var p=pieces[i];
  var m="studio";
  var d="prettybrid.com";
  var s=encodeURIComponent("Enquiry: "+p.title);
  window.location.href=m+"@"+d+"?subject="+s;
}

function openModal(i){
  currentPieceForPurchase=pieces[i];
  document.getElementById("modalPieceTitle").textContent=pieces[i].title;
  document.getElementById("purchaseModal").classList.add("visible");
}

function closeModal(){document.getElementById("purchaseModal").classList.remove("visible");}

function purchaseViaBTC(){closeModal();showToast("Bitcoin payment coming soon");}

function purchaseViaEmail(){
  if(currentPieceForPurchase){
    var idx=pieces.indexOf(currentPieceForPurchase);
    enquire(idx);
  }
  closeModal();
}

var toastTimer;
function showToast(msg){
  var t=document.getElementById("toast");
  t.textContent=msg;t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){t.classList.remove("show");},3000);
}

function previewAdminImage(input){
  if(!input.files||!input.files.length)return;
  var reader=new FileReader();
  reader.onload=function(e){
    var p=document.getElementById("adminImagePreview");
    p.src=e.target.result;p.style.display="block";
  };
  reader.readAsDataURL(input.files[0]);
}

function addPiece(){
  var f=document.getElementById("adminImageFile");
  var title=document.getElementById("adminTitle").value.trim();
  if(!title){showToast("Please enter a title");return;}
  if(!f.files||!f.files.length){showToast("Please select an image");return;}
  var reader=new FileReader();
  reader.onload=function(e){
    pieces.unshift({
      imageUrl:e.target.result,
      title:title,
      collection:document.getElementById("adminCollection").value.trim(),
      edition:document.getElementById("adminEdition").value.trim(),
      price:document.getElementById("adminPrice").value.trim(),
      inscription:document.getElementById("adminInscription").value.trim(),
      description:document.getElementById("adminDescription").value.trim()
    });
    renderGallery();
    document.getElementById("adminPanel").style.display="none";
    showToast("Piece added!");
    document.getElementById("adminTitle").value="";
    document.getElementById("adminEdition").value="";
    document.getElementById("adminPrice").value="";
    document.getElementById("adminInscription").value="";
    document.getElementById("adminDescription").value="";
    document.getElementById("adminImagePreview").style.display="none";
    f.value="";
  };
  reader.readAsDataURL(f.files[0]);
}

document.addEventListener("DOMContentLoaded",function(){renderGallery();});
