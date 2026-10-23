import { useRef, useEffect } from "react";
import "./App.css";
export default function App() {
  const canvasRef = useRef(null);
  // Usamos una referencia para saber si el usuario está pulsando el botón del ratón
  // (useRef evita re-renderizados innecesarios de React mientras se dibuja)
  const isDrawingRef = useRef(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // 1. Configuración de estilo del trazo
    ctx.strokeStyle = "#38bdf8"; // Color cian
    ctx.lineWidth = 4;
    ctx.lineCap = "round"; // Extremos redondeados para trazos fluidos
    ctx.lineJoin = "round"; // Uniones suaves en esquinas
    // Fondo inicial oscuro
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 2. Función para traducir coordenadas del evento de ventana al buffer del Canvas
    function getCanvasCoords(event) {
      const rect = canvas.getBoundingClientRect();
      // Factor de escala entre el tamaño CSS en pantalla y la resolución interna real
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      };
    }
    // 3. Manejadores de eventos de puntero (Mouse / Stylus / Touch)
    function handlePointerDown(event) {
      isDrawingRef.current = true;
      const { x, y } = getCanvasCoords(event);
      // Iniciamos un nuevo sub-trazado vectorial
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    function handlePointerMove(event) {
      if (!isDrawingRef.current) return;
      const { x, y } = getCanvasCoords(event);
      // Trazamos una línea hasta la nueva posición y la pintamos
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    function handlePointerUp() {
      isDrawingRef.current = false;
      ctx.closePath();
    }
    // Usamos eventos de tipo 'pointer' para compatibilidad con ratón, lápiz óptico y táctil
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  // 4. Función de borrado completo
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // fillRect sobreescribe todo el bitmap con el color de fondo
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  return (
    <main className="container">
      <h1>Pizarra Interactiva en Canvas 2D</h1>
      <div className="toolbar">
        <button onClick={handleClear} className="btn-clear">
          Borrar Canvas
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className="canvas-view"
      />
    </main>
  );
}
