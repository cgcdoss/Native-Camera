var stream;
var videoContainer = document.querySelector('#webcam');
var videoSelect = document.querySelector('#cameras');
var botoes = {
  iniciar: document.querySelector('#iniciar'),
  parar: document.querySelector('#parar'),
};

// Ao carregar o DOM, as funções serão inicializadas
document.addEventListener('DOMContentLoaded', (ev) => carregarCameras());

videoSelect.onchange = (ev) => initCamera(ev.value);
// videoSelect.addEventListener('change', (ev) => initCamera(ev.value)); // Dá pra fazer dessa forma também

async function carregarCameras() {
  alternarExibicaoVideo(false);

  const devices = await navigator.mediaDevices.enumerateDevices();
  for (const d of devices) {
    if (d.kind === 'videoinput') {
      setNomeCamera(d);
    }
  }

  // initCamera(); // comentado para não iniciar as câmeras logo de inicio
}

async function setNomeCamera(camera) {
  const option = document.createElement('option');
  option.value = camera.deviceId;
  option.text = camera.label;
  if (!camera.label) {
    await solicitarPermissao();
    await carregarCameras();
    return;
  }
  videoSelect.appendChild(option);
}

async function solicitarPermissao() {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  mediaStream.getTracks().forEach(t => t.stop());
}

async function initCamera(idCamera = videoSelect.value) {
  pararCamera();

  const constrains = {
    video: {
      deviceId: idCamera ? { exact: idCamera } : undefined
    }
  };
  stream = await navigator.mediaDevices.getUserMedia(constrains);

  videoContainer.srcObject = stream;
  alternarExibicaoVideo(true);
}

function pararCamera() {
  stream?.getTracks().forEach(t => {
    // console.log('Parando o video', t, t.getCapabilities());
    t.stop();
  });

  alternarExibicaoVideo(false);
}

function alternarExibicaoVideo(exibir) {
  if (exibir) {
    videoContainer.removeAttribute('hidden');
    botoes.iniciar.disabled = true;
    botoes.parar.disabled = false;
  } else {
    videoContainer.setAttribute('hidden', true);
    botoes.iniciar.disabled = false;
    botoes.parar.disabled = true;
  }
}