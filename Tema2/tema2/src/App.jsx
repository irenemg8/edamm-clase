import { useRef, useEffect } from 'react';
import './App.css';

export default function App() {
  const canvasRef = useRef(null);  //canvasRef.current = null;

  useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 // 1. Variables de estado gráfico (viven fuera del ciclo de render de React)
 let x = 50;
 let speedX = 3;
 const rectWidth = 100;
 const rectHeight = 80;
 let animationFrameId;
 // 2. Definición del bucle de renderizado continuo
 function render() {
 // PASO A: Limpieza del fotograma anterior (evita el efecto "estela")
 ctx.fillStyle = '#1e293b';
 //ctx.fillRect(0, 0, canvas.width, canvas.height);
 // PASO B: Actualización de la física / posición
 x += speedX;
 // Detección de colisión con los bordes izquierdo y derecho
 if (x + rectWidth >= canvas.width || x <= 0) {
speedX = -speedX; // Invertir dirección
 }
 // PASO C: Dibujado de los elementos en su nueva posición
 ctx.fillStyle = '#38bdf8';
 ctx.fillRect(x, 140, rectWidth, rectHeight);
 // Texto informativo en pantalla
 ctx.fillStyle = '#94a3b8';
 ctx.font = '14px monospace';
 ctx.fillText(`Posición X: ${Math.round(x)}px`, 20, 30);
 ctx.fillText('Bucle activo con requestAnimationFrame', 20, 50);
 
 const img = new Image();
 img.src = '/favicon.svg';
 if(img.complete) {
  ctx.drawImage(img, 5, canvas.height - 25, 20, 20);
 }
 // PASO D: Solicitar al navegador el siguiente refresco de pantalla
 animationFrameId = requestAnimationFrame(render);
 }
 // 3. Arrancar el bucle
 animationFrameId = requestAnimationFrame(render);
 // 4. FUNCIÓN DE LIMPIEZA: Cancela el bucle si el componente se desmonta
 return () => {
 cancelAnimationFrame(animationFrameId);
 };
 }, []);


    return (
      <>
        <canvas 
          ref={canvasRef}  //canvasRef.current = <canvas>
          width={640}  // ancho fijo
          height={360} // alto fijo
          className="canvas-view"
        />
      </>
    );
}