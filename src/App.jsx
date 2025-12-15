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

const SOUND_BUTTONS = [
  new SoundButtonModel("introducao-natal", "Introdução Natal", "/sounds/intro-cena-1-v2.mp3"),
  new SoundButtonModel("filho-pai-natal", "Filho e pai discutindo no Natal", "/sounds/filho-pai-natal.mp3"),
  new SoundButtonModel("acordando-na-epoca", "Acordando na época", "/sounds/acordando-na-epoca.mp3"),
  new SoundButtonModel("pessoas-conversando", "Pessoas Conversando", "/sounds/pessoas-conversando.mp3"),
  new SoundButtonModel("anjos", "Anjos", "/sounds/anjos.mp3"),
  new SoundButtonModel("anjo-aparece-maria", "Anjo Aparece Maria", "/sounds/anjo-aparece-maria.mp3"),
  new SoundButtonModel("musica-das-criancas", "Música das Crianças", "/sounds/musica-das-criancas.mp3"),
  new SoundButtonModel("procurando-quarto", "Procurando Quarto", "/sounds/procurando-quarto.mp3"),
  new SoundButtonModel("estalagem", "Estalagem", "/sounds/estalagem.mp3"),
  new SoundButtonModel("jesus-crianca", "Jesus Criança", "/sounds/jesus-crianca.mp3"),
  new SoundButtonModel("criancas-brincando", "Crianças Brincando", "/sounds/criancas-brincando.mp3"),
  new SoundButtonModel("jesus-ensinando-no-templo", "Jesus ensina no Templo", "/sounds/jesus-no-templo.mp3"),
  new SoundButtonModel("musica-casamento", "Música Casamento", "/sounds/musica-casamento.mp3"),
  new SoundButtonModel("milagre-do-casamento", "Milagre do Casamento", "/sounds/milagre-do-casamento.mp3"),
  new SoundButtonModel("tempestade", "Tempestade", "/sounds/tempestade.mp3"),
  new SoundButtonModel("ventos", "Ventos", "/sounds/ventos.mp3"),
  new SoundButtonModel("jesus-aparece-na-agua", "Jesus Aparece na Água", "/sounds/jesus-aparece-na-agua.mp3"),
  new SoundButtonModel("mulher-lava-os-pes-jesus", "Mulher lava os pés de Jesus", "/sounds/mulher-lava-os-pes-jesus.mp3"),
  new SoundButtonModel("jesus-sermao-fariseu", "Jesus Sermão Fariseu", "/sounds/jesus-sermao-fariseu.mp3"),
  new SoundButtonModel("marta-e-maria", "Marta e Maria", "/sounds/marta-maria.mp3"),
  new SoundButtonModel("marta-e-maria-discurso-jesus", "Marta e Maria Discurso Jesus", "/sounds/marta-e-maria.mp3"),
  new SoundButtonModel("quebro-meu-vaso", "Quebro meu vaso", "/sounds/quebro-meu-vaso.webm"),
  new SoundButtonModel("santa-ceia", "Santa Ceia", "/sounds/santa-ceia.mp3"),
  new SoundButtonModel("jesus-calvario", "Jesus orando no Getsêmani", "/sounds/jesus-calvario.mp3"),
  new SoundButtonModel("soldados-no-getsemani", "Soldados no Getsêmani", "/sounds/soldados-no-getsemani.mp3"),
  new SoundButtonModel("cena-cruz", "Cena Cruz", "/sounds/cena-cruz.mp3"),
];

function App() {
  // Mapa id -> HTMLAudioElement
  const audioRefs = useRef({});
  // Mapa id -> boolean (se está tocando ou não)
  const [playingMap, setPlayingMap] = useState({});
  // Mapa id -> number (volume de 0 a 1)
  const [volumeMap, setVolumeMap] = useState({});

  const toggleSound = (button) => {
    const { id, asset } = button;

    // Se ainda não existe Audio para esse botão, cria
    if (!audioRefs.current[id]) {
      audioRefs.current[id] = new Audio(asset);
      audioRefs.current[id].volume = volumeMap[id] ?? 1; // Define volume inicial
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

  const handleVolumeChange = (id, newVolume) => {
    const volume = parseFloat(newVolume);
    
    // Atualiza o estado do volume
    setVolumeMap((prev) => ({
      ...prev,
      [id]: volume,
    }));

    // Atualiza o volume do áudio se existir
    if (audioRefs.current[id]) {
      audioRefs.current[id].volume = volume;
    }
  };

  return (
    <div className="page">
      <h1>Sons da Cantata de Natal</h1>
      <div className="grid">
        {SOUND_BUTTONS.map((button) => {
          const isPlaying = !!playingMap[button.id];
          const volume = volumeMap[button.id] ?? 1;
          
          return (
            <div key={button.id} className="sound-button-container">
              <button
                className={`sound-button ${isPlaying ? "playing" : ""}`}
                onClick={() => toggleSound(button)}
              >
                <span className="label">{button.name}</span>
                <span className="status">
                  {isPlaying ? "Parar" : "Tocar"}
                </span>
              </button>
              
              {isPlaying && (
                <div className="volume-control">
                  <span className="volume-icon">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => handleVolumeChange(button.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="volume-slider"
                  />
                  <span className="volume-value">{Math.round(volume * 100)}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
