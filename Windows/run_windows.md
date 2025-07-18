# 🚀 Ejecutar ML Clone (Windows)

Este proyecto incluye un script `.bat` que levanta automáticamente el backend y el frontend en Windows.

---

## Archivo: `ML-Clone-Launcher.bat`

Este script realiza lo siguiente:

1. Verifica si tenés `node` y `live-server`.
2. Instala `live-server` si no está instalado globalmente.
3. Inicia el backend (Node.js + Express) en el puerto **3001**.
4. Inicia el frontend con `live-server` en el puerto **3000**.
5. Muestra tu IP local para que accedas desde navegador o red.
6. Escucha el comando `stop` para cerrar ambos procesos.
7. Guarda los logs en la carpeta `logs`.

---

## Cómo usarlo

### 1. Requisitos previos

- Node.js instalado [https://nodejs.org](https://nodejs.org)
- Acceso a `cmd` o PowerShell
- Conexión a internet para instalar `live-server` si es necesario

### 2. Ejecutar

Hacé doble clic en `ML-Clone-Launcher.bat` o desde consola:

```
start.bat
```

### 3. Acceder al frontend

El script imprimirá direcciones como:

```
http://127.0.0.1:3000
http://192.168.0.10:3000
```

---

##  Detener el sistema

Cuando quieras frenar todo, escribí:

```
stop
```

Esto terminará los procesos de Node.js y `live-server`, y guardará los logs automáticamente.

---

## Estructura del proyecto

```
ml-clone/
├── backend/
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── data/items.json
├── frontend/
│   ├── item.html
│   ├── css/styles.css
│   └── js/script.js
```

---

## Logs generados

Se almacenan en:

```
logs/ml_clone_YYYY-MM-DD_HH-MM.log
```

Incluyen tanto el backend como el frontend.

---

