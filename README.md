# 🚀 Team Portal - Prueba Técnica Full Stack

Una solución integral Full Stack desarrollada para la gestión de equipos, seguimiento de productividad y organización de tareas en un lienzo libre interactivo. Este proyecto fue construido cumpliendo con estrictos requerimientos de arquitectura, ejecución local mediante contenedores y emulación de servicios en la nube (Serverless).

---

## 🏗 Arquitectura y Tecnologías

El proyecto adopta una arquitectura orientada a microservicios en el backend y una Single Page Application (SPA) con Server-Side Rendering (SSR) en el frontend.

**Frontend:**
*   **Framework:** Angular 17+ (Standalone Components, SSR habilitado).
*   **Estilos:** Bootstrap 5, SCSS, CSS nativo.
*   **Librerías Clave:** `@angular/cdk/drag-drop` (Lienzo interactivo), `Chart.js` (Dashboard de métricas).

**Backend (API Rest):**
*   **Entorno:** Node.js con Express.
*   **Base de Datos:** PostgreSQL 16.
*   **Integración:** Cliente `pg` con consultas parametrizadas para prevenir SQL Injection.

**Emulación Cloud (Serverless):**
*   **AWS Lambda Emulator:** Microservicio independiente en Node.js que emula el comportamiento del API Gateway + AWS Lambda para el procesamiento pesado de métricas, cumpliendo la restricción de cero costos de despliegue en la nube.

**Orquestación y Despliegue:**
*   **Docker & Docker Compose:** Contenerización de la base de datos, la API principal y el emulador Lambda, garantizando reproducibilidad en cualquier entorno.

---

## ✨ Funcionalidades Principales

1.  **🔐 Autenticación y Autorización:**
    *   Login con validación contra la base de datos.
    *   Persistencia de sesión mediante `localStorage` adaptado para compatibilidad con SSR.
    *   Protección de rutas (`Guards`): Acceso restringido al CRUD de usuarios exclusivamente para el rol "Administrador".

2.  **👥 Gestión de Equipo (CRUD):**
    *   Creación, lectura, actualización y desactivación lógica de usuarios.
    *   Regla de negocio implementada: El sistema impide desactivar al último administrador activo.

3.  **📝 Tablero de Notas (Lienzo Libre):**
    *   Interfaz Drag & Drop (Arrastrar y Soltar) sin columnas restrictivas.
    *   Guardado de coordenadas exactas (X, Y) en tiempo real en la base de datos.
    *   Edición *inline* (título, contenido y estado directamente sobre la nota).
    *   Botón de "Rescate de Notas" (Mejora de UX) para devolver notas al área visible tras redimensionar la pantalla.

4.  **📊 Dashboard de Productividad (Serverless):**
    *   Panel de métricas alimentado por una función Lambda emulada.
    *   Cálculo de estados (Pendientes, En Curso, Hechas) delegado a la base de datos (SQL) para optimizar el rendimiento.
    *   Visualización interactiva con gráficas de dona usando Chart.js.

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu máquina:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (o Docker Engine + Docker Compose)
*   [Node.js](https://nodejs.org/) (v18 o superior)
*   [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para levantar el proyecto en tu entorno local sin depender de servicios externos.

### Paso 1: Instalar Angular CLI (Si no lo tienes)
Si es tu primera vez corriendo un proyecto de Angular en esta máquina, instala la herramienta de línea de comandos globalmente:
```bash
npm install -g @angular/cli

### Paso 2: Levantar el Backend y la Base de Datos (Docker)
Abre una terminal en el directorio raíz del proyecto (donde se encuentra el archivo `docker-compose.yml`) y ejecuta:

```bash
docker compose up -d --build
