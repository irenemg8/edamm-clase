import { useRef, useEffect } from 'react';
import './App.css';
export default function App() {
 const videoRef = useRef(null);
 const canvasRef = useRef(null);
 useEffect(() => {
 const video = videoRef.current;
 const canvas = canvasRef.current;
 if (!video || !canvas) return;
 const ctx = canvas.getContext('2d');
 let animationFrameId;
 // Bucle continuo sincronizado con la pantalla
 function render() {
 // readyState >= 2 (HAVE_CURRENT_DATA): asegura que ya hay un fotograma listo para pintar
 if (video.readyState >= 2) {
 // Volcamos el fotograma actual del vídeo directamente al lienzo
 ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
 }
 animationFrameId = requestAnimationFrame(render);
 }
 // Iniciar bucle
 animationFrameId = requestAnimationFrame(render);
 // Limpieza al desmontar
 return () => {
 cancelAnimationFrame(animationFrameId);
 };
 }, []);
 return (
 <>

 {/* Fuente: El reproductor de vídeo nativo */}
 <div>
 <h3>1. Fuente nativa (&lt;video&gt;)</h3>
 <video
 ref={videoRef}
 src="/wingit.mp4"
 controls
 playsInline
 muted
 className="media-box"
 />
 </div>
 {/* Destino: El lienzo donde manipularemos los píxeles */}
 <div>
 <h3>2. Lienzo destino (&lt;canvas&gt;)</h3>
 <canvas
 ref={canvasRef}
 width={480}
 height={270}
 className="media-box"
 />
 </div>
 </>
 );
}