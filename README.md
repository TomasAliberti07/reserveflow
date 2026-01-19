ReserveFlow

Sistema de **gestión y reservas de salones de eventos orientado a pequeños y medianos emprendimientos.

El objetivo del proyecto es construir un motor de reservas robusto, escalable y defendible a nivel técnico, separando claramente el núcleo del negocio de las funcionalidades complementarias.

Estado actual del proyecto

Backend (NestJS + MySQL + TypeORM)

El backend se encuentra en una primera etapa funcional , enfocada en el núcleo del sistema.

 Núcleo implementado

* Gestión de usuarios
* Gestión de salones
* Gestión de eventos (reservas)
* Validaciones de negocio críticas

Reglas de negocio implementadas

* Un usuario puede administrar múltiples salones
* Cada salón posee:
* Capacidad mínima y máxima
* Estado lógico (activo / inactivo)

* Un evento:
  * Se asocia a un salón
  * Valida cantidad de invitados según la capacidad del salón
  * Valida rango de fechas (inicio < fin)
  * Evita solapamiento de horarios para el mismo salón

Estas validaciones se realizan en el backend, garantizando consistencia independientemente del frontend.

Decisiones de diseño

Separación por capas: primero se desarrolló el núcleo del sistema antes de agregar módulos secundarios.
TypeORM con synchronize deshabilitado** para evitar modificaciones automáticas en la base de datos.
Estados lógicos en lugar de eliminaciones físicas para preservar historial.
Uso de entidades mapeadas a una base existente**, no generadas automáticamente.

Este enfoque permite:

* Escalabilidad
* Mayor control del esquema
* Argumentación clara en contextos profesionales

 🗂️ Estructura del proyecto

reserveflow/
├── backend/        # API REST con NestJS
├── frontend/       # (En desarrollo)
├── database/       # Scripts SQL y modelado
└── README.md

Tecnologías utilizadas

Backend

* NestJS
* TypeScript
* MySQL
* TypeORM

### Frontend 

* React
* HTML / CSS / JavaScript

Funcionalidades planificadas

Estas funcionalidades están **diseñadas pero aún no implementadas**:

* Gestión de menús
* Gestión de bebidas
* Asociación de eventos con menús y bebidas (tablas compuestas)
* Dashboard de reservas
* Frontend completo en React

La implementación se realizará manteniendo la misma arquitectura modular.

Enfoque de desarrollo

El desarrollo del proyecto se realiza de forma incremental:

1. Núcleo del negocio
2. Extensiones del dominio
3. Interfaz de usuario

Este enfoque prioriza la **calidad del diseño** y la **claridad de las reglas de negocio** por sobre la cantidad de funcionalidades iniciales.

 Autor

Tomás Aliberti

Proyecto personal orientado a portfolio profesional.
