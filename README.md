# 💊 Mi Farmacia - Tienda de Farmacia Online

Plataforma de e-commerce para venta de productos farmacéuticos con carrito de compras, autenticación y catálogo organizado.

## 🏗️ Estructura del Proyecto

```
mi-farmacia/
├── src/                    # Frontend (React + Vite)
│   ├── components/        # Componentes reutilizables
│   ├── pages/             # Páginas (Home, Productos, Carrito)
│   ├── context/           # Contextos (Auth, Cart, UI)
│   ├── hooks/             # Hooks personalizados
│   ├── utils/             # Utilidades y funciones
│   └── App.jsx           # Componente principal
├── backend/               # API REST (Express + PostgreSQL)
│   ├── server.js         # Configuración del servidor
│   └── database.sql      # Esquema de base de datos
├── public/               # Assets estáticos
├── vercel.json          # Configuración para Vercel
└── package.json         # Dependencias del frontend
```

## 🛠️ Tecnologías

### Frontend
- **React 19** - Librería de UI
- **Vite** - Build tool ultra rápido
- **TailwindCSS** - Estilos
- **React Router** - Navegación
- **Firebase** - Autenticación
- **Framer Motion** - Animaciones

### Backend
- **Node.js + Express** - API REST
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **CORS** - Control de solicitudes

## 🚀 Instalación Local

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

**Variables de entorno** (crear `.env` en backend/):
```
DB_USER=tu_usuario
DB_HOST=localhost
DB_NAME=farmacia
DB_PASSWORD=tu_contraseña
DB_PORT=5432
PORT=5000
```

## 📦 Scripts Disponibles

```bash
# Frontend
npm run dev        # Desarrollo
npm run build      # Producción
npm run preview    # Vista previa del build
npm run lint       # Verificar código
npm run test       # Tests

# Backend
npm run start      # Producción
npm run dev        # Desarrollo con nodemon
```

## 🌐 Despliegue

- **Frontend**: Vercel (automático desde GitHub)
- **Backend**: Railway, Render o tu servidor preferido

## 📄 Licencia

MIT - Libre para usar en proyectos personales y comerciales

---

**¿Preguntas o sugerencias?** Abre un issue en el repositorio.
