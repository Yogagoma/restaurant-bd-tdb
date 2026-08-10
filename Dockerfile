# ==============================================================================
# Dockerfile - Backend Node.js Express (Restaurante Tradición y Sabor)
# Base Image: node:20-alpine (Ligera, segura y optimizada para producción)
# ==============================================================================

FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar manifiestos de dependencias
COPY package*.json ./

# Instalación de dependencias de producción
RUN npm ci || npm install

# Copiar el código fuente de la aplicación
COPY . .

# Exponer el puerto interno de la API (3000)
EXPOSE 3000

# Comando de inicio del servidor Node.js
CMD ["npm", "run", "start"]
