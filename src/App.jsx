import { useRef, useState } from "react";
import "./App.css";

// Classe model
class SoundButtonModel {
  /**
   * @param {string} id    identificador único
   * @param {string} name  texto do botão
   * @param {string} asset caminho do arquivo de áudio
   */
  constructor(id, name, asset, scene) {
    this.id = id;
    this.name = name;
    this.asset = asset;
    this.scene = scene;
  }
}

// Lista de botões (você só altera os assets)
const SOUND_BUTTONS = [
  new SoundButtonModel("acordando-na-epoca", "Acordando na época", "/sounds/acordando-na-epoca.mp3"),
  new SoundButtonModel("cena-calvario", "Cena Calvário", "/sounds/cena-calvario.mp3"),
  new SoundButtonModel("cena-cruz", "Cena Cruz", "/sounds/cena-cruz.mp3"),
  new SoundButtonModel("comico-farao", "Cômico Faraó", "/sounds/comico-farao.mp3"),
  new SoundButtonModel("intro-cena-1", "Intro Cena 1", "/sounds/intro-cena-1.mp3"),
  new SoundButtonModel("jesus-calvario", "Jesus Calvario", "/sounds/jesus-calvario.mp3"),
  new SoundButtonModel("jesus-no-templo", "Jesus no Templo", "/sounds/jesus-no-templo.mp3"),
  new SoundButtonModel("milagre-do-casamento", "Milagre do Casamento", "/sounds/milagre-do-casamento.mp3"),
  new SoundButtonModel("musica-da-epoca", "Música da Época", "/sounds/musica-de-epoca.mp3"),
  new SoundButtonModel("estalagem", "Estalagem", "/sounds/estalagem.mp3"),
];

function App() {
  // Mapa id -> HTMLAudioElement
  const audioRefs = useRef({});
  // Mapa id -> boolean (se está tocando ou não)
  const [playingMap, setPlayingMap] = useState({});

  const toggleSound = (button) => {
    const { id, asset } = button;

    // Se ainda não existe Audio para esse botão, cria
    if (!audioRefs.current[id]) {
      audioRefs.current[id] = new Audio(asset);
    }

    const audio = audioRefs.current[id];
    const isPlaying = !!playingMap[id];

    if (!isPlaying) {
      // Começar a tocar
      audio.currentTime = 0;
      audio.play();
      audio.loop = true;

      setPlayingMap((prev) => ({
        ...prev,
        [id]: true,
      }));

      // Quando o áudio terminar sozinho, marca como parado
      audio.onended = () => {
        setPlayingMap((prev) => ({
          ...prev,
          [id]: false,
        }));
      };
    } else {
      // Parar o som
      // Fade out gradual
      const fadeOutDuration = 2500; // duração do fade out em ms
      const fadeOutSteps = 20;
      const fadeOutInterval = fadeOutDuration / fadeOutSteps;
      const volumeDecrement = audio.volume / fadeOutSteps;

      const fadeOut = setInterval(() => {
        if (audio.volume > volumeDecrement) {
          audio.volume = Math.max(0, audio.volume - volumeDecrement);
        } else {
          audio.volume = 0;
          clearInterval(fadeOut);
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 1; // Restaura o volume para próxima vez
        }
      }, fadeOutInterval);

      setPlayingMap((prev) => ({
        ...prev,
        [id]: false,
      }));

      return; // Não executa o pause imediato abaixo
    //   audio.pause();
    //   audio.currentTime = 0;
    //   setPlayingMap((prev) => ({
    //     ...prev,
    //     [id]: false,
    //   }));
    // }
  };
  };

  return (
    <div className="page">
      <h1>Sons da Cantata de Natal</h1>
      <div className="grid">
        {SOUND_BUTTONS.map((button) => {
          const isPlaying = !!playingMap[button.id];
          return (
            <button
              key={button.id}
              className={`sound-button ${isPlaying ? "playing" : ""}`}
              onClick={() => toggleSound(button)}
            >
              <span className="label">{button.name}</span>
              <span className="status">
                {isPlaying ? "Parar" : "Tocar"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
