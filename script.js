document.getElementById('getPostalCode').addEventListener('click', function() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBbrGOproJ4hTb-rsKwiLXo5MaDFRCoTPU`)
              .then(response => response.json())
              .then(data => {
                  const postalCode = data.results[0].address_components.find(component => component.types.includes('postal_code')).long_name;
                  setPostalCode(postalCode);
              })
              .catch(error => console.error('Error:', error));
      }, function() {
          alert('Geolocation is not supported by this browser.');
      });
  } else {
      alert('Geolocation is not supported by this browser.');
  }
});

function setPostalCode(postalCode) {
  document.getElementById('postalCode').textContent = postalCode;
  playPostalCodeSound(postalCode);
}

function playPostalCodeSound(postalCode) {
  const synth = new Tone.Synth().toDestination();
  const now = Tone.now();

const osc = new Tone.Oscillator().toDestination();
// start at "C4"
osc.frequency.value = "C4";
// ramp to "C2" over 2 seconds
osc.frequency.rampTo("C2", 2);
// start the oscillator for 2 seconds
osc.start().stop("+1");

  let delayTime = 0;

  postalCode.split('').forEach((char, index) => {
      let note = '';
      switch(char.toUpperCase()) {
          // 映射关系
          case '0': case 'A': note = 'C4'; break;
          case '1': case 'B': note = 'D4'; break;
          case '2': case 'C': note = 'E4'; break;
          case '3': case 'D': note = 'F4'; break;
          case '4': case 'E': note = 'G4'; break;
          case '5': case 'F': note = 'A4'; break; 
          case '6': case 'G': note = 'B4'; break;
          case '7': case 'H': note = 'C5'; break;
          case '8': case 'I': note = 'D5'; break;
          case '9': case 'J': note = 'E5'; break;
          default: note = 'C4';
      }
      synth.triggerAttackRelease(note, "8n", now + delayTime);
      delayTime += 0.5;
    
    
  });
}

