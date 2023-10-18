// Função para iniciar o jogo
function startGame() {
  // Substitui o botão Iniciar jogo por uma contagem regressiva e depois cria um botão para chamar a promessa player
  const gameContainer = document.getElementById("game-container");
  const startButton = document.getElementById("start-game");
  const playerButton = document.getElementById("play-music");
  const lblResposta = document.getElementById("lbl-resposta");
  const resposta = document.getElementById("resposta");
  const btnResposta = document.getElementById("btn-resposta");
  startButton.remove();
  const countdown = document.createElement("h1");
  countdown.innerText = "3";
  gameContainer.appendChild(countdown);
  setTimeout(() => {
    countdown.innerText = "2";
    setTimeout(() => {
      countdown.innerText = "1";
      setTimeout(() => {
        countdown.remove();
        playerButton.classList.remove("hidden");
        resposta.classList.remove("hidden");
        lblResposta.classList.remove("hidden");
        btnResposta.classList.remove("hidden");
      }, 1000);
    }, 1000);
  }, 1000);
}
let player;
let trackName;
let pontos = 0;


window.onSpotifyWebPlaybackSDKReady = () => {
  // Trocar o token abaixo a cada hora, precisa estar logado, através do link https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started 
  const token = "BQC5bvbwFPbG5CBPHICRx8jCuuc3xYDKTtHftKQku6I4WAnOQvr3jLU1cxBi628_5nzZ1x_gjoRX9JL9_jobf_rnlX21YZIZl3B1pcsWAPqcKClqQgNUdPKk5r9kEXXoSqUERW_KucJcXYCtGLQBjI8Gzm5INvgGkoj4LOkVuufw1i6yWer2zCNdTqTT1hjsAvywyEWNZ5MUcS2-bF2WkncNfLU7" 
  player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    const connect_to_device = () => {
      let album_uri = "spotify:playlist:7zY8LrzayzDhWIMOfxdser"
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: "PUT",
        body: JSON.stringify({
          context_uri: album_uri,
          play: false,
        }),
        headers: new Headers({
          "Authorization": "Bearer " + token,
        }),
      }).then(response => console.log(response))
        .then(data => {
          // Adicionar listener para o evento de mudança de estado de reprodução
          player.addListener('player_state_changed', ({
            track_window
          }) => {
            trackName = track_window.current_track.name;
            trackName = trackName.toLowerCase();
            console.log('Current Track:', trackName);
          });
        })
    }
    connect_to_device();
  });

  // Botão play music para tocar a música por 13 segundos
  document.getElementById("play-music").addEventListener('click', () => {
    player.togglePlay();
    setTimeout(() => {
      player.pause();
    }, 13000);
  });

  // Botão resposta para verificar se a resposta está correta, apagar a resposta e mudar a música do play-music para a próxima
  document.getElementById("btn-resposta").addEventListener('click', (event) => {
    event.preventDefault();
    let resposta = document.getElementById("resposta").value;
    resposta = resposta.toLowerCase();
    if (resposta == trackName) {
      alert("Você Acertou, Parabéns!");
      incrementarPontuacao();
      document.getElementById("resposta").value = "";
      player.nextTrack();
      setTimeout(() => {
        player.pause();
      }, 1300);
    } else {
      alert("Você errou, tente novamente!");
      decrementarPontos();
    }
  });
  player.connect();
};

function decrementarPontos() {
  pontos -= 5;
  if (pontos < 0) {
    pontos = 0;  // Garante que a pontuação não seja negativa
  }
  document.getElementById("pontos").textContent = pontos;
}

function incrementarPontuacao() {
  pontos += 10;
  document.getElementById("pontos").textContent = pontos;
}

