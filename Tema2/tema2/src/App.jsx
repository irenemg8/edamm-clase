import { useRef, useEffect } from 'react';
import './App.css';
export default function App() {
 const canvasRef = useRef(null);
 useEffect(() => {
 // 1. Obtenemos el elemento del DOM a través de la referencia
 const canvas = canvasRef.current;
 if (!canvas) return;
 // 2. Solicitamos el contexto de dibujo 2D
 const ctx = canvas.getContext('2d');
 // 3. Dibujamos una figura básica para verificar el funcionamiento
 // Fondo general del lienzo
 ctx.fillStyle = '#1e293b'; // Slate oscuro
 ctx.fillRect(0, 0, canvas.width, canvas.height);
 // Rectángulo de prueba en coordenadas (x: 50, y: 50, w: 100, h: 80)
 ctx.fillStyle = '#38bdf8'; // Azul claro
 ctx.fillRect(50, 50, 100, 80);
 // Texto demostrativo
 ctx.fillStyle = '#ffffff';
 ctx.font = '16px sans-serif';
 ctx.fillText('Canvas 2D Inicializado', 50, 160);
 }, []); // Array vacío: se ejecuta una sola vez tras el primer render
  return (
    <>
      <canvas 
        ref={canvasRef}
        width={640}
        height={360}
        className="canvas-view"
      />
    </>
  );
}