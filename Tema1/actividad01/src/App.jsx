import { useEffect, useState } from 'react'
import CardGrid from './components/CardGrid.jsx'
import Contador from './components/Contador.jsx'
import './App.css'

//const CONTENTS = [   Lo hemos movido a media_data.json
  /* JSON me pide que lleve COMILLAS */
  //{ "id": "m1", "title": "Peliculón", "description": "La mejor del mundo", "duration": 120, coverUrl: "https://placehold.co/300x180/1a1a1a/ffffff?text=Vídeo+1" },
  //{ "id": "m2", "title": "Una peli", "description": "Esto es una peli", "duration": 80, coverUrl: "https://placehold.co/300x180/1a1a1a/ffffff?text=Vídeo+2" },
  //{ "id": "m3", "title": "Otra peli", "description": "Esto es otra peli", "duration": 100, coverUrl: "https://placehold.co/300x180/1a1a1a/ffffff?text=Vídeo+3" }
//]

function App() {

  const [view, setView] = useState("home");  

  const [isLoading, setIsLoading] = useState(false);  //crear estado que está cargando y que abajo visualizaremos algo que está cargando o no
  
  const [error, setError] = useState(null); // para los errores, si hay un error, lo guardamos en este estado y lo visualizamos en el return

  //const delay2 = ms => new Promise(res => setTimeout(res, ms)); 
 
  const delay = function (ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  useEffect(() => {
    const leerVistaDeUrl = () => {
      const parametros = new URLSearchParams(window.location.search);
      const action = parametros.get("action");

      if (action === "quickplay") {
        setView("quickplay");
      }
      else if (action === "latest") {
        setView("latest");
      }
      else {
        setView("home");
      }
    };

    leerVistaDeUrl(); // Primera vez que se cargue la página

    // Botones atrás/adelante del navegador
    window.addEventListener("popstate", leerVistaDeUrl);

    return () => {
      window.removeEventListener("popstate", leerVistaDeUrl);
    };
  }, []);

  const [catalog, setCatalog] = useState([]); /* Hook */

  // Fetch de datos nada más arrancar la app
  useEffect(() => {
    async function fetchMedia () {
      try{
      setIsLoading(true);
      const response = await fetch('/media_data.json');
      await delay(3000);
      const data = await response.json();
      setCatalog(data);   // NO SE PUEDE HACER catalog = data
      setIsLoading(false);
      }
      catch (error) {
        console.error('Error al cargar el catálogo:', error);
        setError(error);
        setError(error.message);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchMedia();
  }, []);
  


if (error != null) {
  return <> <div className="catalog-container"> <p>Se ha producido un error al cargar el catálogo... </p> <p>El error es {error}</p></div> </>
}

if (isLoading) {
  return <> <div className="catalog-container"> <p>Cargando catálogo...</p> </div> </>
}

const navigateTo = (route) => {
  window.history.pushState({}, "", `?action=${route}`);
  //setView(route);
  setView(route || "home");
}


let componenteActual;
  if (view === "quickplay") {
    componenteActual = <h1>Estamos en quickplay</h1>
  } 
  else if (view === "latest") {
    componenteActual = <h1>Estamos en latest</h1>
  }
  else {
    componenteActual = <CardGrid catalog={catalog}></CardGrid>
  }


  async function descargarSaludo() {
    const res = await fetch("/saludo.txt");
    const mensaje = await res.text();
    alert(mensaje);
  }


  return (
    <>
   
    <div className="catalog-container">
      <header>
        <h1>Contenidos</h1>
      </header>

      <nav>
        <button onClick={() => navigateTo("home")}>Home</button>
        <button onClick={() => navigateTo("quickplay")}>Quickplay</button>
        <button onClick={() => navigateTo("latest")}>Latest</button>
        <button onClick={descargarSaludo}>Descargar saludo</button>

          {/* CONTADOR */}
          <Contador className="contador" />

      </nav>

    

      {/* CATALOG LIST */}
      <section className="catalog-list">
       {/* { view === "quickplay" && <h1>Estamos en quickplay</h1> || <h1>No estoy en quickplay</h1> }*/}
        {componenteActual}
      </section>
    </div>
    </>
  )
}

export default App
