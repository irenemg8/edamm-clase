//fetch

// condiciones que queramos interceptar

// return

const CACHE_NAME = "media-cache-v1";

self.addEventListener('install', (event) => {
    console.log("[SW] Instalado");
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log("[SW] Activado");
    event.waitUntil(self.clients.claim());
});


async function cacheFirst(request){
   const cache = await caches.open(CACHE_NAME);
   const cacheResponse = await cache.match(request);
   if (cacheResponse !== undefined) {
      return cacheResponse;
    }
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    return networkResponse;
}

async function networkFirst(request){
    // 1 abrir cache
    // 2 decidir usar fetch o cache match
    // 3 guardar cache.put
    // 4 devolver response
    // requisito: hacerlo como hicimos cacheFirst y no usar try catch error
    const cache = await caches.open(CACHE_NAME);
    try {
        const networkResponse = await fetch(request);
        cache.put(request, networkResponse.clone());      // si no falla la petición (tenemos internet), guardamos en cache y devolvemos la respuesta de la red
        return networkResponse;
    }
    catch (error) {
        const cacheResponse = await cache.match(request);  // si falla la petición (no tenemos internet), buscamos en cache y devolvemos la respuesta de cache
        if (cacheResponse){
            return cacheResponse;
        }
        return new Response("No hay conexión a internet, no disponible", {
            status: 503, 
            statusText: "Service Unavailable"
        });
    }
}   


async function updateCache(request){
   try{
    const cache = await caches.open(CACHE_NAME);            // hay que abrir la cache antes de guardar
    const networkResponse = await fetch(request);
    if(networkResponse){
        await cache.put(request, networkResponse.clone());  // caches.put NO existe -> es cache.put
    }
    return networkResponse; 
   }

   catch(error){
    console.log("No se pudo actualizar la cache", error);
    return null;
   }
}

async function staleWhileRevalidate(request){
    const cache = await caches.open(CACHE_NAME);
    const cacheResponse = await cache.match(request);
    const actualizacionDeFondo =updateCache(request);  // hay que pasarle la petición (antes iba vacío)

    if (cacheResponse){   // si tengo cache, la devuelvo y actualizo en segundo plano
        return cacheResponse;
    }

    const freshResponse =await actualizacionDeFondo;  // si no tengo cache, espero a la respuesta de la red y la devuelvo

    if(freshResponse){
        return freshResponse;
    }

    return new Response("No disponible", {
        status: 503, 
        statusText: "Servidor no disponible"
    });
}



self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // En desarrollo, Vite sirve los módulos desde estas rutas. NO se cachean
    // para que el navegador no se quede con código antiguo ni rompa el HMR.
    const esInternoDeVite =
        url.origin === self.location.origin &&
        (url.pathname.startsWith("/@vite") ||
         url.pathname.startsWith("/@react-refresh") ||
         url.pathname.startsWith("/src/") ||
         url.pathname.startsWith("/node_modules/") ||
         url.pathname === "/" ||
         url.pathname.endsWith(".html"));

    if(event.request.method === "GET" && !esInternoDeVite){
       // event.respondWith(cacheFirst(event.request));
       // event.respondWith(networkFirst(event.request));
       event.respondWith(staleWhileRevalidate(event.request));
    }
});


self.addEventListener('push', (event) => {
    let data = {title: "Nueva", body: "Notificación", icon: "/icon-192.png"};  // si no hay datos, ponemos un valor por defecto
    if(event.data){
       data = event.data.json();  // si hay datos, los pasamos a json
    }
    console.log("Datos de la notificación:", data);

    const options = {
        body: data.body,
        icon: data.icon,
        data: {url: data.url || "/"}  // si no hay url, ponemos la raíz
    };

    event.waitUntil(self.registration.showNotification("Hola", options));  //el service worker tiene un objeto que tiene registration y tiene show notification
});


self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Sacamos la url con la que se mostró la notificación (con valor por defecto "/")
    const url = (event.notification.data && event.notification.data.url) || "/";

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Si ya hay una pestaña de la app abierta, la reutilizamos y navegamos
            for (const client of clientList) {
                if (client.url.startsWith(self.location.origin)) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            // Si no hay ninguna pestaña abierta, abrimos una nueva
            return self.clients.openWindow(url);
        })
    );
});