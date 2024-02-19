document.getElementById('getPostalCode').addEventListener('click', function() {
    // 模拟获取邮政编码
    const postalCode = '96382'; // 假设的邮政编码
    setPostalCode(postalCode);
});

function setPostalCode(postalCode) {
    document.getElementById('postalCode').textContent = postalCode;
    playPostalCodeSound(postalCode);
}

function playPostalCodeSound(postalCode) {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    let delayTime = 0;

    postalCode.split('').forEach((char, index) => {
        let note = '';
        switch(char.toUpperCase()) {
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
            // 添加更多映射关系...
            default: note = 'C4';
        }
        synth.triggerAttackRelease(note, "8n", now + delayTime);
        delayTime += 0.5;
    });
}
