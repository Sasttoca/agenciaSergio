# AgencySergio - Dashboard de Gestión Modular

Una aplicación web orientada a la gestión operativa de agencias de marketing digital, diseñada bajo un enfoque de arquitectura limpia y modular basada en características (Features). La interfaz implementa un diseño oscuro optimizado mediante el uso exclusivo de las clases utilitarias de Tailwind CSS v4 y un sistema de iconografía interactiva provisto por Lucide React.

---

## 🚀 Novedades de la Versión:

La aplicación ha sido migrada con éxito de una arquitectura de persistencia volátil local a una **solución en la nube en tiempo real**, utilizando **Firebase** como *Backend-as-a-Service (BaaS)*.

---

##  Nuevas Funcionalidades: Portal de Cliente y Sistema de Sugerencias

Se implementó el flujo completo para el rol de **Cliente (`client`)**, permitiendo un acceso restringido, personalizado y seguro a la plataforma, junto con un canal de comunicación directo entre el cliente y el equipo de trabajo.

---

### 🎨 1. Vista del Cliente (`ClientView.jsx`)
* **Acceso Condicional:** Redirección automática desde `App.jsx` al detectar que el usuario autenticado tiene el rol `client`.
* **Información de la Marca:** Muestra una tarjeta personalizada con los datos principales de la empresa (Nombre, Sector/Industria y Gestor Operativo asignado).
* **Calendario Filtrado:** Integración del componente `CalendarView` restringiendo la visibilidad de tareas exclusivamente a aquellas vinculadas al `businessId` de la empresa del cliente.

---

### 💬 2. Caja de Comentarios y Sugerencias (`SuggestionBox.jsx`)
* **Envío en Tiempo Real:** Permite a los clientes enviar observaciones y comentarios directamente desde su portal.
* **Persistencia en Firestore:** Integración con la colección `suggestions` en la base de datos, almacenando los atributos: `id`, `businessId`, `author`, `text` y `date`.

---

### 📊 3. Gestión de Sugerencias para el Equipo (`SuggestionsWidget.jsx`)
* **Control de Permisos por Rol:**
  * **Gestor / Worker:** Visualiza únicamente las sugerencias enviadas por los clientes de sus empresas asignadas.
  * **Administrador:** Acceso completo al historial global de sugerencias de todas las marcas.
* **Gestión del Histórico:** Función exclusiva para el `admin` que permite reiniciar/limpiar el buzón de sugerencias acumuladas.

---

### Cambios Clave en la Arquitectura:
* **Persistencia en la Nube:** Integración de **Cloud Firestore** para almacenar las colecciones de clientes (`businesses`) y actividades (`tasks`).
* **Servicios Asíncronos:** La capa `services/` ahora consume directamente la SDK de Firebase de manera asíncrona, desacoplando por completo la lógica de consulta y mutación de datos de la interfaz de usuario.
* **Contexto Reactivo Real:** El archivo `AgencyContext.jsx` fue reescrito para sincronizar el estado global de React con los documentos de Firestore mediante llamadas asíncronas e inicialización de estados vacíos (sin datos quemados o por defecto).
* **Seguridad de Credenciales:** Migración y protección de las llaves de acceso del proyecto mediante variables de entorno en Vite.

### Optimizaciones de UI, UX e Integridad de Datos

Además de la migración principal, se implementaron mejoras críticas en el flujo de trabajo y la interfaz de usuario:

*   **Creación de Negocios desde Cero:** Se eliminó la generación automática de tareas predeterminadas rígidas. Ahora, cada negocio se registra completamente vacío en Firestore, agilizando el flujo del sistema.
*   **Gestión de Fechas Optimizada:** El formulario de creación de tareas se inicializa completamente limpio y cuenta con un selector de fecha nativo (`type="date"`) adaptado al tema oscuro mediante `scheme-dark`.
*   **Eliminación en Cascada:** Se implementó el borrado de clientes en la interfaz mediante un botón de papelera. Al ejecutarse, el sistema elimina de forma automática tanto el negocio en `businesses` como todas sus tareas asociadas en `tasks` en la base de datos de Firebase, evitando registros huérfanos.
*   **Modal de Confirmación Personalizado:** Se sustituyó la alerta clásica del navegador por una ventana emergente personalizada en modo oscuro con diseño coherente al dashboard.
*   **Espaciado y Layout Mejorado:** Se integró un contenedor con padding responsivo (`p-6 md:p-8`) en la vista de tarjetas de negocios para evitar que los componentes colisionen con los bordes del dashboard.
---

## Arquitectura del Proyecto y Estructura de Directorios

El proyecto se encuentra estructurado de forma modular para mitigar el acoplamiento propio de los modelos monolíticos. El código fuente se organiza en componentes autocontenidos dentro del directorio `src/features/`, garantizando la independencia, escalabilidad y mantenibilidad de cada funcionalidad del negocio.

A continuación se detalla el propósito y la responsabilidad de cada directorio principal:

### Núcleo y Estado Global (`src/`)
* **`components/ui/`**: Centraliza los componentes atómicos y reutilizables de la interfaz gráfica (`CustomModal.jsx`).
* **`context/`**: Contiene el punto de control del estado global de la aplicación (`AgencyContext.jsx`). Distribuye la sesión activa, empresas, tareas y sugerencias.
* **`layouts/`**: Define los esquemas visuales compartidos. `MainLayout.jsx` gestiona la navegación lateral y el contenedor principal.
* **`services/`**: Capa de abstracción y persistencia asíncrona con Firebase Firestore (`businessService.js`, `firebase.js`, `taskService.js`, `suggestionService.js`).
---

### Módulos por Características (`src/features/`)

Cada directorio en `features/` representa un dominio de negocio aislado con sus propios componentes y hooks:

#### 1. `admin/` (Módulo de Administración)
* **Propósito**: Gestión global y administración restringida de la agencia.
* **Componentes clave**: `AdminView.jsx`, `BusinessForm.jsx` (Alta de clientes) y `TaskForm.jsx` (Asignación de tareas).

#### 2. `auth/` (Módulo de Autenticación)
* **Propósito**: Control de acceso seguro, gestión de sesión y roles.
* **Componentes y Hooks**: `LoginView.jsx` y `useAuth.js` (Custom hook para abstraer la lógica de inicio de sesión).

#### 3. `businesses/` (Módulo de Negocios)
* **Propósito**: Visualización y gestión del catálogo de clientes de la agencia.
* **Componentes clave**: `BusinessGrid.jsx` (Cuadrícula de empresas con modal de eliminación en cascada).

#### 4. `client/` (Módulo del Portal de Cliente)
* **Propósito**: Experiencia dedicada y restringida para el rol de cliente.
* **Componentes clave**: `ClientView.jsx` (Vista general de marca) y `SuggestionBox.jsx` (Caja de envío de sugerencias en tiempo real).

#### 5. `dashboard/` (Módulo de Métricas y Flujo Operativo)
* **Propósito**: Consolidación de indicadores, tareas del día a día y supervisión general.
* **Componentes clave**: `DashboardOverview.jsx`, `MetricCards.jsx`, `WorkerWorkflow.jsx` (Acordeón de avance por empresa), `AdminInternalTasks.jsx` y `SuggestionsWidget.jsx` (Buzón de sugerencias recibidas).

#### 6. `tasks/` (Módulo de Calendario y Entregables)
* **Propósito**: Organización temporal y control de estados de las actividades programadas.
* **Componentes clave**: `CalendarView.jsx`, `CalendarHeader.jsx` y `CalendarGrid.jsx` (Cuadrícula mensual/semanal reactiva).

---

## Tecnologías Utilizadas

* **React** (Estructura basada en Hooks, Context API y Arquitectura Modular)
* **Vite** (Entorno de ejecución y construcción del proyecto)
* **Firebase & Cloud Firestore** (Persistencia, backend y base de datos en tiempo real)
* **Tailwind CSS v4** (Procesamiento de estilos optimizado mediante escaneo nativo)
* **Lucide React** (Biblioteca de vectores para la iconografía del sistema)

---

## Instalación y Despliegue Local

1. Clonar el repositorio correspondiente.
2. Instalar las dependencias de producción y desarrollo desde la raíz del proyecto:
   ```bash
   npm install
