import { useRef, useState } from "react";
import "./App.css";

// Classe model
class SoundButtonModel {
  /**
   * @param {string} id    identificador único
   * @param {string} name  texto do botão
   * @param {string} asset caminho do arquivo de áudio
   */
  constructor(id, name, asset) {
    this.id = id;
    this.name = name;
    this.asset = asset;
  }
}

// Lista de botões (você só altera os assets)
const SOUND_BUTTONS = [
  new SoundButtonModel("laugh", "Risada", "/sounds/clap.mp3"),
  new SoundButtonModel("applause", "Aplausos", "/sounds/aplausos.mp3"),
  new SoundButtonModel("scream", "Grito", "/sounds/grito.mp3"),
  new SoundButtonModel("boom", "Explosão", "/sounds/boom.mp3"),
  new SoundButtonModel("horn", "Corneta", "/sounds/corneta.mp3"),
  new SoundButtonModel("drumroll", "Rufar de Tambores", "/sounds/drumroll.mp3"),
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
      audio.pause();
      audio.currentTime = 0;
      setPlayingMap((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
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
