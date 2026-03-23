const pieces = [
  {
    img: '/the_desert_speaks_back.jpg',
    title: 'The Desert Speaks Back',
    coll: 'Altered States of Reality',
    ed: '1 of 1',
    price: '\u20bf0.10 BTC',
    inscr: 'Inscription pending',
    desc: 'The desert does not wait to be photographed. It reads you first.'
  }
];

function renderGallery() {
  var gp = document.getElementById('gp');
  if(!gp || !pieces) return;
  gp.innerHTML = pieces.map(function(p, i) {
    return '<div class="gc" onclick="openModal(' + i + ')" style="cursor:pointer;">' +
      '<div class="gi" style="background:#111;aspect-ratio:16/9;overflow:hidden;">' +
        '<img src="' + p.img + '" alt="' + p.title + '" style="width:100%;height:100%;object-fit:cover;">' +
      '</div>' +
      '<div class="gm" style="padding:1rem;">' +
        '<div style="font-family:\'Courier Prime\',monospace;font-size:0.55rem;letter-spacing:0.2em;color:#B8934A;text-transform:uppercase;">' + p.coll + '</div>' +
        '<div style="font-size:1.1rem;color:#e8e4dc;margin:0.3rem 0;">' + p.title + '</div>' +
        '<div style="font-size:0.75rem;color:#888;">' + p.ed + ' &bull; ' + p.price + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderGallery);
} else {
  renderGallery();
}