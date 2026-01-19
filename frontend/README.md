# ReserveFlow – Frontend

Frontend de la aplicación **ReserveFlow**, desarrollado con **React + TypeScript + Vite**.

La aplicación está orientada a la gestión de reservas para salones de eventos, consumiendo una API REST desarrollada en NestJS.

 Estructura del proyecto

La arquitectura del frontend está organizada por dominios de negocio para favorecer la escalabilidad y el mantenimiento.

```txt
src/
├── api/                    # Comunicación con el backend (HTTP, Axios)
├── components/
│   └── ui/                 # Componentes de UI reutilizables
├── features/               # Módulos por dominio
│   ├── auth/               # Autenticación
│   ├── salons/             # Gestión de salones
│   └── events/             # Gestión de eventos
├── layouts/                # Layouts generales
├── pages/                  # Vistas asociadas a rutas
├── routes/                 # Configuración de rutas
├── hooks/                  # Hooks personalizados
├── utils/                  # Funciones utilitarias
├── types/                  # Tipos e interfaces compartidas
├── styles/                 # Estilos globales
├── App.tsx                 # Componente raíz
└── main.tsx                # Punto de entrada
