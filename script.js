const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const keys = document.querySelectorAll('.key');
const volumeControl = document.getElementById('volume');
const recordBtn = document.getElementById('record');
const playBtn = document.getElementById('play');
const clearBtn = document.getElementById('clear');
const loopCheckbox = document.getElementById('loop');
const bpmInput = document.getElementById('bpm');
const metronomeBtn = document.getElementById('startMetronome');
const metronomeIndicator = document.getElementById('metronomeIndicator');

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

let recordings = [];
let isRecording = false;
let startTime;
let metronomeInterval;

volumeControl.addEventListener('input', () => {
  gainNode.gain.value = volumeControl.value;
});

function playNote(note) {
  const audio = new Audio('sounds/' + note + '.mp3');
  audio.volume = volumeControl.value;
  audio.play();
}

keys.forEach(key => {
  key.addEventListener('click', () => {
    const note = key.dataset.note;
    playNote(note);

    if (isRecording) {
      const timestamp = Date.now() - startTime;
      recordings.push({ note, timestamp });
    }
  });
});

recordBtn.addEventListener('click', () => {
  isRecording = true;
  recordings = [];
  startTime = Date.now();
  recordBtn.disabled = true;
  playBtn.disabled = true;
});

playBtn.addEventListener('click', () => {
  if (recordings.length === 0) return;
  recordings.forEach(event => {
    setTimeout(() => playNote(event.note), event.timestamp);
  });

  if (loopCheckbox.checked) {
    const duration = recordings[recordings.length - 1].timestamp;
    setTimeout(() => playBtn.click(), duration + 100);
  }
});

clearBtn.addEventListener('click', () => {
  recordings = [];
  playBtn.disabled = true;
  recordBtn.disabled = false;
});

recordBtn.addEventListener('click', () => {
  isRecording = true;
  startTime = Date.now();
  recordings = [];
  recordBtn.disabled = true;
  playBtn.disabled = false;
});

metronomeBtn.addEventListener('click', () => {
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
    metronomeIndicator.style.color = 'gray';
    return;
  }
  const bpm = parseInt(bpmInput.value);
  const interval = 60000 / bpm;
  metronomeInterval = setInterval(() => {
    metronomeIndicator.style.color = 'red';
    setTimeout(() => metronomeIndicator.style.color = 'gray', 100);
  }, interval);
});
