import { useRef, useEffect } from "react";
import "./App.css";
export default function App() {
  const bgVideoRef = useRef(null);
  const fgVideoRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const bgVideo = bgVideoRef.current;
    const fgVideo = fgVideoRef.current;
    const canvas = canvasRef.current;
    if (!bgVideo || !fgVideo || !canvas) return;
    const ctx = canvas.getContext("2d");
    // 1. LIENZO EN MEMORIA (Offscreen / Scratchpad Canvas)
    // No está en el DOM. Sirve exclusivamente como mesa de trabajo intermedia.
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    let animationFrameId;
    function render() {
      // Comprobar que ambos vídeos tienen fotogramas listos
      if (bgVideo.readyState >= 2 && fgVideo.readyState >= 2) {
        const w = canvas.width;
        const h = canvas.height;
        // PASO 1: Volcar el vídeo del croma en el lienzo auxiliar
        offscreenCtx.drawImage(fgVideo, 0, 0, w, h);
        // PASO 2: Extraer píxeles del croma y aplicar el filtro
        const frame = offscreenCtx.getImageData(0, 0, w, h);
        const data = frame.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Algoritmo de detección de verde:
          // El verde debe ser predominante y superar un mínimo de intensidad
          if (g > 90 && g > r * 1.3 && g > b * 1.3) {
            data[i + 3] = 0; // Canal Alfa a 0 = Completamente transparente
          }
        }
        // PASO 3: Devolver los píxeles con transparencia al lienzo auxiliar
        offscreenCtx.putImageData(frame, 0, 0);
        // PASO 4: Composición en el Canvas Principal
        // A) Dibujamos el fondo
        ctx.drawImage(bgVideo, 0, 0, w, h);
        // B) Dibujamos encima el lienzo auxiliar procesado
        // (drawImage respeta el canal alfa y funde ambas capas)
        ctx.drawImage(offscreenCanvas, 0, 0, w, h);
      }
      animationFrameId = requestAnimationFrame(render);
    }
    animationFrameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  // Función auxiliar para pausar o reproducir ambos a la vez
  const togglePlay = () => {
    if (bgVideoRef.current.paused) {
      bgVideoRef.current.play();
      fgVideoRef.current.play();
    } else {
      bgVideoRef.current.pause();
      fgVideoRef.current.pause();
    }
  };
  return (
    <main className="container">
      <h1>Composición Chroma Key en Tiempo Real</h1>
      <button onClick={togglePlay} className="btn-play">
        Play / Pause Ambos Vídeos
      </button>
      {/* Canvas final con la mezcla */}
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} width={640} height={360} />
      </div>
      {/* Vídeos fuente (ocultos o reducidos como monitores de depuración) */}
      <div className="debug-sources">
        <div>
          <p>Fondo (Background)</p>
          <video
            ref={bgVideoRef}
            src="/wingit.mp4"
            loop
            muted
            playsInline
            width={240}
          />
        </div>
        <div>
          <p>Green Screen</p>
          <video
            ref={fgVideoRef}
            src="/chroma.mp4"
            loop
            muted
            playsInline
            width={240}
          />
        </div>
      </div>
    </main>
  );
}
