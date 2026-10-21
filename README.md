# EAMM · Entornos para el Desarrollo de Apps Multimedia Multiplataforma

Prácticas y ejemplos de la asignatura **Entornos para el Desarrollo de Apps Multimedia Multiplataforma** (Máster, UPV).
Todos los proyectos están hechos con **React 19 + Vite** y JavaScript moderno (ESM).

## Contenido

| Carpeta | Qué es | Conceptos que trabaja |
| --- | --- | --- |
| [`Tema1/actividad01`](Tema1/actividad01) | Catálogo de contenidos multimedia (tipo plataforma de streaming) | Componentes React, `useState`/`useEffect`, `fetch` de JSON, estados de carga y error, routing por URL (`?action=`), PWA (manifest, iconos, service worker, notificaciones) |
| [`Tema2/tema2`](Tema2/tema2) | Lienzo de dibujo con Canvas 2D | Integración de APIs nativas del navegador con React mediante `useRef`, ciclo de vida con `useEffect` |

> El material de teoría (PDFs de clase) no se incluye en el repositorio.

## Requisitos

- Node.js 20 o superior
- npm

## Cómo ejecutar los proyectos

Cada carpeta es un proyecto independiente con su propio `package.json`.

### Tema 1 · actividad01

```bash
cd Tema1/actividad01
npm install
npm run dev      # http://localhost:3001
```

Scripts disponibles: `dev`, `build`, `preview`, `lint`.

Notas:
- El catálogo se carga desde `public/media_data.json`, por lo que los datos se pueden editar sin tocar el código.
- El service worker (`public/sw-simple.js`) y el manifest solo se activan sirviendo la app en modo build/preview o sobre HTTPS.
- Para ver los atajos del manifest (`Quickplay`, `Latest`) hay que instalar la app como PWA.

### Tema 2 · tema2

```bash
cd Tema2/tema2
npm install
npm run dev      # http://localhost:5173
```

Scripts disponibles: `dev`, `build`, `preview`, `lint`.

## Estructura

```
.
├── Tema1/
│   └── actividad01/     # app React + Vite + PWA
└── Tema2/
    └── tema2/           # demo de Canvas 2D con React
```

Los `node_modules` y las carpetas `dist` (resultado de `npm run build`) no se versionan: se regeneran con `npm install` y `npm run build`.

## Autora

Irene Medina García ([@irenemg8](https://github.com/irenemg8))
