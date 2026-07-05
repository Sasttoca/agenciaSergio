# AgencySergio - Dashboard de Gestión Modular

Una aplicación web orientada a la gestión operativa de agencias de marketing digital, diseñada bajo un enfoque de arquitectura limpia y modular basada en características (Features). La interfaz implementa un diseño oscuro optimizado mediante el uso exclusivo de las clases utilitarias de Tailwind CSS v4 y un sistema de iconografía interactiva provisto por Lucide React.

---

## Arquitectura del Proyecto y Estructura de Directorios

El proyecto se encuentra estructurado de forma modular para mitigar el acoplamiento propio de los modelos monolíticos. El código fuente se organiza en componentes autocontenidos dentro del directorio `src/features/`, garantizando la independencia, escalabilidad y mantenibilidad de cada funcionalidad del negocio.

A continuación se detalla el propósito y la responsabilidad de cada directorio principal:

### Núcleo y Estado Global (`src/`)
* **`components/ui/`**: Centraliza los componentes atómicos y reutilizables de la interfaz de usuario que carecen de lógica de negocio directa (por ejemplo, `CustomModal.jsx`).
* **`context/`**: Contiene el punto de control del estado global de la aplicación (`AgencyContext.jsx`). Distribuye la información de autenticación, la sesión del usuario y las mutaciones de datos a través de la API Context de React.
* **`layouts/`**: Define los componentes estructurales o esquemas visuales compartidos de la interfaz. El archivo `MainLayout.jsx` gestiona la barra de navegación lateral fija y el contenedor dinámico principal.
* **`services/`**: Capa dedicada exclusivamente a la abstracción de la persistencia de datos y utilidades de almacenamiento independiente de la interfaz gráfica (`businessService.js`, `taskService.js`).

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
* **Tailwind CSS v4** (Procesamiento de estilos optimizado mediante escaneo nativo)
* **Lucide React** (Biblioteca de vectores para la iconografía del sistema)

---

## Instalación y Despliegue Local

1. Clonar el repositorio correspondiente.
2. Instalar las dependencias de producción y desarrollo desde la raíz del proyecto:
   ```bash
   npm install