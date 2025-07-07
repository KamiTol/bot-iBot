# bot-iBot

**InactiveWatcher** es un bot de moderación para Discord que detecta automáticamente a los usuarios inactivos de un servidor, ayudando a mantener comunidades limpias, activas y organizadas.

Está diseñado para servidores con un enfoque competitivo, social o de gestión de membresía, donde la participación constante es clave.

---

## 🚀 Características

- 🔍 Detecta usuarios inactivos según su actividad de mensajes.
- 🗃️ Almacena los datos de actividad en un archivo `.json`.
- 📆 Comando `/inactivos` para listar miembros inactivos por días.
- 🧠 Comando `/syncdb` para sincronizar usuarios nuevos al sistema.
- 📂 Organización modular (`commands`, `events`, `data`, etc.).
- 🛠 Compatible con PM2 para ejecución en segundo plano.

---

## 📦 Requisitos

- Node.js v18 o superior
- Un bot registrado en el [Portal de Desarrolladores de Discord](https://discord.com/developers/applications)
- Archivo `.env` con el token del bot

---

## 🔧 Instalación

```bash
git clone https://github.com/tuusuario/bot-iBot.git
cd bot-iBot
npm install
```

Crea un archivo `.env` con el siguiente contenido:

```env
TOKEN=TU_TOKEN_DEL_BOT
```

---

## ▶️ Ejecución

### 🔹 Modo normal:

```bash
node index.js
```

### 🔹 Modo segundo plano con PM2 (recomendado):

```bash
pm2 start index.js --name bot-inactivo
```

Para guardar la configuración de PM2 tras reinicios:

```bash
pm2 startup
pm2 save
```

---

## 📁 Estructura del Proyecto

```bash
├── commands/
│   ├── inactivos.js       # Comando para ver usuarios inactivos
│   ├── syncdb.js          # Comando para sincronizar la base de datos
│   └── escanear.js        # (opcional) Escanea mensajes pasados
│
├── data/
│   └── usersActivity.json # Base de datos de usuarios y actividad
│
├── events/
│   ├── messageCreate.js   # Evento que rastrea actividad
│   ├── trackActivity.js   # Funciones auxiliares para actividad
│   └── checkActivity.js   # Función que filtra inactivos
│
├── .env                   # Token del bot
├── index.js               # Código principal del bot
├── package.json
├── iniciar.bat            # Script para ejecutar con PM2 (opcional)
```

---

## 🧪 Comandos Disponibles

| Comando             | Descripción                                                              |
|---------------------|--------------------------------------------------------------------------|
| `/syncdb`           | Sincroniza todos los miembros del servidor a `usersActivity.json`       |
| `/inactivos [días]` | Muestra los usuarios inactivos según el número de días (por defecto: 7)  |

---

## 💡 Ejemplo de Respuesta

```txt
Usuarios inactivos (≥ 7 días)

@Usuario1
Inactivo hace 14 días
Mensajes: 0

@Usuario2
Inactivo hace 9 días
Mensajes: 5

...
```

---

## 📸 Logo

> Basado en el Banhammer de Roblox, con un estilo oscuro y moderador.

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👤 Autor

Desarrollado por [KamiTol](https://github.com/KamiTol)
