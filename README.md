# AgencySergio - Dashboard de Gestión Modular

Una aplicación web orientada a la gestión operativa de agencias de marketing digital, diseñada bajo un enfoque de arquitectura limpia y modular basada en características (Features). La interfaz implementa un diseño oscuro optimizado mediante el uso exclusivo de las clases utilitarias de Tailwind CSS v4 y un sistema de iconografía interactiva provisto por Lucide React.

---

## 🚀 Novedades de la Versión:

La aplicación ha sido migrada con éxito de una arquitectura de persistencia volátil local a una **solución en la nube en tiempo real**, utilizando **Firebase** como *Backend-as-a-Service (BaaS)*.

---

## 🚀 Nuevas Funcionalidades: Portal de Cliente y Sistema de Sugerencias

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
* **`components/ui/`**: Centraliza los componentes atómicos y reutilizables de la interfaz de usuario que carecen de lógica de negocio directa (por ejemplo, `CustomModal.jsx`).
* **`context/`**: Contiene el punto de control del estado global de la aplicación (`AgencyContext.jsx`). Distribuye la información de autenticación, la sesión del usuario y las mutaciones de datos a través de la API Context de React.
* **`layouts/`**: Define los componentes estructurales o esquemas visuales compartidos de la interfaz. El archivo `MainLayout.jsx` gestiona la barra de navegación lateral fija y el contenedor dinámico principal.
* **`services/`**: Capa dedicada exclusivamente a la abstracción de la persistencia de datos y utilidades de almacenamiento independiente de la interfaz gráfica (`businessService.js`, `firebase.js`, `taskService.js`).

---

### Módulos por Características (`src/features/`)

Cada directorio representa un dominio o funcionalidad de negocio específica y cuenta con sus propios componentes aislados:

#### 1. `businesses/` (Módulo de Negocios)
* **Propósito**: Gestión y visualización de las empresas o cuentas de clientes que pertenecen a la agencia.
* **Componente clave**: `BusinessGrid.jsx` (Renderiza los negocios asignados en formato de cuadrícula detallando el trabajador encargado).

#### 2. `dashboard/` (Módulo del Panel Principal)
* **Propósito**: Consolidación y presentación de las métricas diarias del sistema, las tareas internas del administrador y el flujo operativo general.
* **Componente clave**: `WorkerWorkflow.jsx` (Despliega un sistema de acordeones dinámicos por unidad de negocio e incluye una barra de progreso que calcula el porcentaje de tareas completadas en tiempo real).

#### 3. `tasks/` (Módulo de Calendario)
* **Propósito**: Organización temporal de los entregables y actividades operativas en función de sus fechas límite de entrega.
* **Componente clave**: `CalendarView.jsx` (Orquesta la cuadrícula del calendario mensual abstrayendo la lógica en subcomponentes especializados).

#### 4. `admin/` (Módulo de Administración)
* **Propósito**: Proveer herramientas y vistas exclusivas para usuarios con privilegios de administrador.
* **Componente clave**: `BusinessForm.jsx` y `TaskForm.jsx` (Formularios restringidos para la creación de clientes y asignación de actividades).

#### 5. `auth/` (Módulo de Autenticación)
* **Propósito**: Administrar el control de acceso seguro a la plataforma y gestionar el ciclo de vida de la sesión activa del usuario.
* **Componente clave**: `LoginView.jsx` (Formulario de inicio de sesión vinculado directamente al contexto de autenticación global).

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
