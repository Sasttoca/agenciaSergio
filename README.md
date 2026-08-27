# AgencySergio - Dashboard de Gestión Modular

Una aplicación web orientada a la gestión operativa de agencias de marketing digital, diseñada bajo un enfoque de arquitectura limpia y modular basada en características (Features). La interfaz implementa un diseño oscuro optimizado mediante el uso exclusivo de las clases utilitarias de Tailwind CSS v4 y un sistema de iconografía interactiva provisto por Lucide React.

---

## 🚀 Novedades de la Versión Actual

### 💳 1. Control de Suscripciones y Cobros Quincenales

El sistema estandariza la facturación y el acceso de los clientes bajo ciclos quincenales automáticos, garantizando un control riguroso sobre las coberturas activas:

* **Fechas de Corte Fijas:** Los cobros y renovaciones se calculan automáticamente los días **15** y el **último día de cada mes** (28, 29, 30 o 31 días).
* **Gestión de Estados de Suscripción:**
  * **Al día (`active`):** Cobertura vigente con cálculo dinámico de días restantes en tiempo real.
  * **Periodo de Gracia (`grace_period`):** Tolerancia operativa de 48 horas (2 días) tras la fecha límite con un banner preventivo de advertencia dentro del portal del cliente.
  * **Suspendido por Pago (`suspended`):** Bloqueo total de la interfaz del cliente (calendario, sugerencias y entregables), desplegando una pantalla de aviso con instrucciones para regularizar la cuenta.
* **Confirmación de Pago (`Admin`):** Modal interactivo de confirmación en `BusinessGrid.jsx` para registrar el abono recibido y extender la vigencia (+1 quincena) de forma inmediata en Firestore.

---

### 👥 2. Gestión Integral de Usuarios y Asignación de Empresas

Se incorpora un módulo completo (`users/`) para la administración granular de identidades y accesos del sistema:

* **Directorio Reactivo con Filtros Multivariable (`UserGrid.jsx`):** Búsqueda instantánea por ID o nombre visible, combinada con selectores por Rol, Empresa vinculada y Estado de cuenta.
* **Vinculación Dinámica de Clientes:** Capacidad desde el modal de edición de asignar o reasignar la empresa cliente asociada en caso de desvinculación accidental.
* **Exportación a Hojas de Cálculo (`Excel`):** Generación y descarga instantánea del directorio filtrado en formato `.xlsx` con anchos de columna estructurados mediante la librería `xlsx`.
* **Suspensión y Reactivación Controlada:** Modal de confirmación para alternar el acceso de cualquier usuario (`isSuspended`) sin eliminar su registro de Firestore.

---

### 📌 3. Gestión y Depuración Automática de Tareas

El sistema incluye funcionalidades avanzadas para la gestión del ciclo de vida de las tareas dentro del módulo de calendario, permitiendo un control granular según los roles de usuario y garantizando el rendimiento de la base de datos mediante depuración automática.

#### 🛠️ Gestión Manual de Tareas (Edición y Eliminación)

Dentro de la vista de calendario (`CalendarView.jsx`), al hacer clic sobre un día específico se despliega una ventana emergente (modal) con la lista detallada de tareas programadas.

* **Edición Inline (`Admin`):** Los usuarios con rol de administrador pueden modificar el título y las notas/descripciones de cualquier tarea en tiempo real directo desde el modal.
* **Eliminación Manual (`Admin`):** Se habilita la opción de eliminar tareas individuales mediante confirmación previa.
* **Cambio de Estado (`Admin` / `Worker`):** Los administradores y trabajadores asignados pueden alternar el estado de las tareas entre `Pendiente` y `Realizada`.
* **Restricción de Rol (`Client`):** Los usuarios con rol de cliente disponen de vista de solo lectura, impidiendo la modificación o eliminación de tareas.

#### 🧹 Depuración Automática a los 15 Días (`Spark Plan Friendly`)

Para evitar el consumo innecesario de almacenamiento en Firestore y mantener la aplicación dentro de los límites del plan gratuito de Firebase:

* **Marca de Tiempo (`createdAt`):** Al registrar una nueva tarea a través de `taskService.addTask()`, el sistema guarda automáticamente la fecha y hora de creación en formato ISO (`YYYY-MM-DDTHH:mm:ss.sssZ`).
* **Verificación al Iniciar:** En la carga inicial de datos dentro de `AgencyContext.jsx`, se ejecuta el método `taskService.cleanOldTasks()`.
* **Cálculo de Antigüedad:** El sistema compara la fecha actual contra la propiedad `createdAt` de cada tarea. Aquellas que superen los 15 días ($15 \times 24 \times 60 \times 60 \times 1000 \text{ ms}$) son identificadas.
* **Eliminación en Lote:** Se ejecutan las peticiones de eliminación directa en Firestore en paralelo (`Promise.all`) y se remueven del estado local reactivo de React de forma transparente para el usuario.

---

## 🔐 Autenticación y Control de Acceso (RBAC)

El sistema utiliza un esquema de autenticación asíncrona basado en la colección `users` de **Firebase Firestore**, permitiendo el acceso rápido mediante aliases de prueba sin exponer credenciales dentro del código fuente de la aplicación.

### 👤 Usuarios y Roles Configurables
Los accesos y permisos se gestionan dinámicamente desde Firestore según la siguiente estructura:

| Usuario (`ID`) | Rol (`role`) | Descripción y Alcance |
| :--- | :--- | :--- |
| `admin` | `admin` | **Administrador Global:** Acceso total al panel operativo, métricas, cobros quincenales, catálogo de negocios, directorio de usuarios y asignación de tareas internas. |
| `ana` | `worker` | **Miembro del Equipo:** Acceso filtrado únicamente a los negocios y tareas donde figura como responsable asignada. |
| `carlos` | `worker` | **Miembro del Equipo:** Acceso filtrado a su flujo de trabajo específico de medios y contenido. |
| `cliente` | `client` | **Cliente Externo:** Vista simplificada enfocada en el estado de sus proyectos, contador quincenal de corte y módulo para envío de sugerencias. |

---

## 📌 Funcionalidades Principales del Sistema

### 1. Portal Exclusivo para Clientes (`ClientView`)
* **Panel Personalizado:** Muestra la información de la marca asociada, sector operativo y gestor de cuenta asignado.
* **Widget de Suscripción:** Indicador visual de la fecha de corte y contador de días restantes.
* **Seguimiento de Proyecto:** Vista restringida de entregables y actividades del calendario vinculadas únicamente al ID de su empresa.
* **Modo Solo Lectura:** Permite visualizar estados de tareas y detalles sin opción de modificación operativa.

### 2. Buzón de Sugerencias e Interacción en Tiempo Real (`SuggestionBox` & `SuggestionsWidget`)
* **Envío Directo:** Los clientes pueden registrar comentarios y observaciones directo a Firestore.
* **Filtro por Gestor:** Cada colaborador visualiza únicamente los comentarios de las marcas a su cargo.
* **Gestión Centralizada:** El administrador dispone de un panel global con opción de reinicio/limpieza del histórico acumulado.

### 3. Calendario Operativo e Interactivo (`CalendarView` & `CalendarGrid`)
* **Navegación Mensual y Semanal:** Organización visual del flujo de entregables y actividades programadas.
* **Modal Emergente de Detalles:** Detalla títulos, notas explicativas y permite la actualización instantánea de estados (`Pendiente` / `Realizada`).
* **Visualización Inteligente:** Activación condicional de detalles únicamente en días con actividades asignadas.

### 4. Administración Operativa y Flujo en Cascada (`AdminView` & `BusinessGrid`)
* **Alta de Marcas:** Registro de nuevos clientes en `BusinessForm.jsx` con asignación múltiple de Community Managers y fecha inicial de cobro.
* **Gestión de Pagos:** Botón con confirmación modal para registrar renovaciones de servicio quincenal.
* **Eliminación en Cascada:** Al suprimir un cliente, el sistema remueve automáticamente el registro de la marca y sus tareas asociadas en Firestore para garantizar la integridad de datos.

### 5. Directorio y Creación de Usuarios (`UsersView`, `UserForm` & `UserGrid`)
* **Formulario de Registro:** Alta de nuevos colaboradores y clientes con asignación de empresa opcional.
* **Tabla de Gestión:** Panel con filtros combinados, modal de suspensión, edición de roles/contraseñas y exportación a Excel.

---

## 🛠️ Cambios Clave en la Arquitectura

* **Persistencia en la Nube:** Integración de **Cloud Firestore** para almacenar las colecciones de clientes (`businesses`), actividades (`tasks`), sugerencias (`suggestions`) y usuarios (`users`).
* **Servicios Asíncronos:** La capa `services/` consume directamente la SDK de Firebase de manera asíncrona (`authService.js`, `businessService.js`, `taskService.js`, `suggestionService.js`, `userService.js`), desacoplando la lógica de datos de la interfaz de usuario.
* **Contexto Reactivo Real:** `AgencyContext.jsx` sincroniza el estado global de React con Firestore mediante peticiones asíncronas, cálculo dinámico de vigencias y carga centralizada.
* **Seguridad y Configuración:** Protección de llaves de API mediante variables de entorno en Vite (`.env.local`) y configuración de enrutamiento para despliegues en la nube (`vercel.json`).

---

## 📁 Arquitectura del Proyecto y Estructura de Directorios

El proyecto se encuentra estructurado de forma modular bajo el patrón de características (*feature-based architecture*). El código fuente se organiza en componentes autocontenidos dentro del directorio `src/features/`.

### Núcleo y Estado Global (`src/`)
* **`assets/`**: Logotipos y recursos gráficos de la aplicación (`logo.webp`).
* **`components/ui/`**: Centraliza componentes atómicos y reutilizables de la interfaz gráfica (`CustomModal.jsx`).
* **`context/`**: Punto de control del estado global de la aplicación (`AgencyContext.jsx`). Distribuye sesión activa, empresas, tareas, sugerencias, usuarios y lógica de quincenas.
* **`layouts/`**: Define esquemas visuales compartidos. `MainLayout.jsx` gestiona la navegación lateral y el contenedor principal.
* **`services/`**: Capa de abstracción y persistencia asíncrona con Firebase Firestore (`authService.js`, `businessService.js`, `firebase.js`, `suggestionService.js`, `taskService.js`, `userService.js`).

---

### Módulos por Características (`src/features/`)

#### 1. `admin/` (Módulo de Administración)
* **Propósito**: Gestión global y administración restringida de la agencia.
* **Componentes clave**: `AdminView.jsx`, `BusinessForm.jsx` (Alta de clientes) y `TaskForm.jsx` (Asignación de tareas).

#### 2. `auth/` (Módulo de Autenticación)
* **Propósito**: Control de acceso seguro, verificación en Firestore y gestión de sesión por roles.
* **Componentes y Hooks**: `LoginView.jsx` y `useAuth.js` (Custom hook para abstraer la verificación de roles y sesión activa).

#### 3. `businesses/` (Módulo de Negocios)
* **Propósito**: Visualización y gestión del catálogo de clientes de la agencia y control de pagos.
* **Componentes clave**: `BusinessGrid.jsx` (Cuadrícula de empresas con renovación quincenal y modal de eliminación en cascada).

#### 4. `client/` (Módulo del Portal de Cliente)
* **Propósito**: Experiencia dedicada y restringida para el rol de cliente con validación de pago.
* **Componentes clave**: `ClientView.jsx` (Vista general de marca con widget de suscripción y bloqueo por corte) y `SuggestionBox.jsx` (Caja de envío de sugerencias en tiempo real).

#### 5. `dashboard/` (Módulo de Métricas y Flujo Operativo)
* **Propósito**: Consolidación de indicadores, tareas del día a día y supervisión general.
* **Componentes clave**: `DashboardOverview.jsx`, `MetricCards.jsx`, `WorkerWorkflow.jsx` (Acordeón de avance por empresa), `AdminInternalTasks.jsx` y `SuggestionsWidget.jsx` (Buzón de sugerencias recibidas).

#### 6. `tasks/` (Módulo de Calendario y Entregables)
* **Propósito**: Organización temporal y control de estados de las actividades programadas.
* **Componentes clave**: `CalendarView.jsx`, `CalendarHeader.jsx` y `CalendarGrid.jsx` (Cuadrícula mensual/semanal reactiva).

#### 7. `users/` (Módulo de Gestión de Usuarios)
* **Propósito**: Registro de cuentas, control de accesos, reasignación de empresas y descarga de reportes.
* **Componentes clave**: `UsersView.jsx`, `UserForm.jsx` (Alta de usuarios) y `UserGrid.jsx` (Tabla de directorio con filtros, edición y exportación a Excel).

---

## 🛠️ Tecnologías Utilizadas

* **React** (Estructura basada en Hooks, Context API y Arquitectura Modular)
* **Vite** (Entorno de ejecución y construcción rápida de assets)
* **Node.js** (Entorno de desarrollo y gestión de paquetes)
* **Firebase & Cloud Firestore** (Persistencia en tiempo real, backend y autenticación mediante base de datos)
* **Tailwind CSS v4** (Procesamiento de estilos optimizado mediante escaneo nativo)
* **Lucide React** (Biblioteca de vectores para iconografía dinámica)
* **XLSX (SheetJS)** (Generación y exportación de archivos estructurados en formato Excel)

---

## 💻 Instalación y Despliegue Local

1. Clonar el repositorio correspondiente:
   ```bash
   git clone <https://github.com/Sasttoca/agenciaSergio.git>
   cd agenciaSergio