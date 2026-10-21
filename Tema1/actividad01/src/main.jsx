import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
 // <StrictMode> Carga 2 veces la página (carga y descarga de nuevo) por si hay errores en el código y se refresca la página, para que no se quede con errores de compilación.
  <StrictMode>  
    <App />
  </StrictMode>,
)

 /*if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw-simple.js')  //cuando se registre le ponemos el .then
        .then((reg) => console.log('[SW] Service Worker registrado', reg))
        .catch((err) => console.log('[SW] Error al registrar el Service Worker', err))
      });
    }*/


if('serviceWorker' in navigator){
  window.addEventListener('load', async () => {  //async () porque vamos a usar await dentro de la función
    try{
    const reg = await navigator.serviceWorker.register('/sw-simple.js')
    console.log('[SW] Service Worker registrado', reg)

      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('[SW] Permiso de notificaciones concedido');
      } else {
        console.log('[SW] Permiso de notificaciones denegado');
      }

    }
        catch(err) {
           console.log('[SW] Error al registrar el Service Worker', err);
      } 
    });
}