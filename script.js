// Mappa con Leaflet e modale descrittiva
(function(){
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const descriptions = {
    monaco: {
      title: 'Principato di Monaco',
      html: '<p>Viaggio tra i castelli della Costa Azzurra con un ospite speciale <em>(in auto)</em>.</p>'
    },
    bucarest: {
      title: 'Bucarest',
      html: '<p>Terme coi fiori 🌺</p>'
    },
    vienna: {
      title: 'Vienna',
      html: '<p>La città del Natale e dei würstel 🌭</p>'
    }
  };

  // Apri modale helper
  function openModal(key){
    const data = descriptions[key];
    if(!data) return;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.html;
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      // Fallback se dialog non supportato
      alert(data.title + '\n\n' + modalBody.textContent);
    }
  }

  // Bottoni legenda
  document.querySelectorAll('.linklike[data-city]').forEach(btn=>{
    btn.addEventListener('click', ()=> openModal(btn.dataset.city));
  });

  // Chiudi modale
  modal?.querySelector('.close')?.addEventListener('click', ()=> modal.close());

  // Inizializza mappa
  function initMap(){
    const map = L.map('map',{zoomControl:true, attributionControl:true});
    // Vista generale Europa
    map.setView([50.5, 12], 4);

    // Tile layer (Carto basemap chiaro per contrasto)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Dati città
    const cities = [
      { key:'monaco',   name:'Principato di Monaco',   coords:[43.7384, 7.4246] },
      { key:'bucarest', name:'Bucarest',               coords:[44.4268, 26.1025] },
      { key:'vienna',   name:'Vienna',                 coords:[48.2082, 16.3738] }
    ];

    // Marker e cerchi evidenziati
    cities.forEach(c=>{
      const marker = L.marker(c.coords).addTo(map).bindTooltip(c.name);
      marker.on('click', ()=> openModal(c.key));

      // Cerchio soft per evidenziare la zona
      L.circle(c.coords, {
        radius: 120000, // 120 km
        color: '#4f7cff',
        weight: 1,
        fillColor: '#4f7cff',
        fillOpacity: 0.15
      }).addTo(map);
    });

    // Fit bounds su tutti i marker
    const bounds = L.latLngBounds(cities.map(c=>c.coords));
    map.fitBounds(bounds.pad(0.6));
  }

  if (window.L) { initMap(); }
  else { window.addEventListener('load', initMap); }
})();