# Ejecutar ML Clone (Linux / macOS)

Este proyecto incluye un script de automatización para levantar el backend y el frontend con un solo comando.

---

## Archivo: `ml-clone-launcher.sh`

Este script realiza lo siguiente:

1. Verifica que tengas `curl`, `node` y `live-server`.
2. Instala `nvm` y Node.js si no los tenés.
3. Instala `live-server` si no está instalado globalmente.
4. Inicia el backend (Node + Express) en el puerto **3001**.
5. Inicia el frontend (`live-server`) en el puerto **3000**.
6. Muestra la IP local para acceder desde otro dispositivo en red.
7. Escucha el comando `stop` para cerrar ambos procesos y guardar los logs.

---

## ▶Cómo usarlo

### 1. Dar permisos de ejecución al script

```bash
chmod +x start.sh
```

### 2. Ejecutar el script

```bash
./start.sh
```

### 3. Acceder desde el navegador

El script te mostrará enlaces como:

```
http://127.0.0.1:3000
http://192.168.0.101:3000
```

---

## Detener el sistema

Cuando quieras frenar todo, simplemente escribí:

```
stop
```

Esto finalizará los procesos y guardará los logs en la carpeta `/logs`.

---

## Logs generados

Se almacenan en:

```
logs/ml_clone_YYYY-MM-DD_HH-MM-SS.log
```

Incluye tanto la salida del backend como del frontend.

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


## Requisitos mínimos

- bash
- curl
- node / nvm (el script lo instala si no están)
- npm
- live-server (lo instala si no está)

---

