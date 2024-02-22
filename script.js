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
  // 使用Oscillator生成渐变音
  const osc = new Tone.Oscillator().toDestination();
  osc.start();

  // 使用Synth逐个播放音符
  const synth = new Tone.Synth().toDestination();

  function charToFrequency(char) {
      const baseFrequency = 10; // A4频率为440Hz
      const alphabet = 'ZXLUOJHRTWBSPKCEFQIGANVDMY';
      const index = alphabet.indexOf(char.toUpperCase());
      if (index !== -1) {
          return baseFrequency + index * 10 ;
      } else if (!isNaN(parseInt(char, 10))) {
        //数字对应频率
          return 60 + parseInt(char, 10) * 10;
      }
      return baseFrequency;
  }

  let currentTime = 0;
  const duration = 0.8; // 每个音符的持续时间
  const noteDuration = "8n"; // 音符持续时间的音乐记号
// 新增：初始化Waveform并连接到Destination
  const waveform = new Tone.Waveform(1024);

  postalCode.split('').forEach((char, index) => {
      const freq = charToFrequency(char);
      const note = Tone.Frequency(freq).toNote();
      // 第一次播放
      synth.triggerAttackRelease(note, noteDuration, Tone.now() + currentTime);
      // 第二次播放
      synth.triggerAttackRelease(note, noteDuration, Tone.now() + currentTime + duration);

      // 设置Oscillator的渐变音
      osc.frequency.linearRampToValueAtTime(freq, Tone.now() + currentTime);
      currentTime += duration * 2; // 因为每个音符播放两遍，所以时间增加的是两倍的持续时间
  });

  osc.stop(Tone.now() + currentTime);
   
  Tone.Destination.connect(waveform);

  drawWaveform(waveform); // 调用绘制波形图的函数
}

function drawWaveform(waveform) {
  const canvas = document.getElementById('waveform');
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  function draw() {
      requestAnimationFrame(draw);
      const data = waveform.getValue();
      context.clearRect(0, 0, width, height);
      context.beginPath();
      context.moveTo(0, height / 2); // 开始于中心线
      // 减小垂直缩放比例，通过调整系数来控制曲线的高度
      const verticalScale = 0.3; // 缩小垂直缩放比例，调整这个值以控制高度
      for (let i = 0; i < data.length; i++) {
          const x = (i / data.length) * width * 2.5;
          // 更新y的计算公式，包含垂直缩放比例
          const y = ((data[i] * verticalScale + 1) / 2) * height;
          context.lineTo(x, y);
      }
      context.lineWidth = 2;
      context.strokeStyle = 'blue';
      context.stroke();
  }

  draw();
}


