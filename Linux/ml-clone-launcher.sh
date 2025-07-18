#!/bin/bash

echo "============================="
echo " Iniciando ML Clone"
echo "============================="

# Crear carpeta de logs si no existe
mkdir -p logs

# Fecha y hora para el nombre del log
timestamp=$(date '+%Y-%m-%d_%H-%M-%S')
logfile="logs/ml_clone_${timestamp}.log"

# Verificar si curl está instalado
if ! command -v curl &> /dev/null; then
  echo "[!] curl no está instalado. Instalándolo..."
  sudo apt-get update
  sudo apt-get install -y curl
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
  echo "[!] Node.js no está instalado. Instalando NVM y Node.js..."

  # Descargar e instalar nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash

  # Cargar NVM en la shell actual
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

  # Instalar Node.js versión LTS
  nvm install --lts

  echo "[✔] Node.js instalado correctamente con NVM."
fi

# Verificar live-server
if ! command -v live-server &> /dev/null; then
  echo "[!] Instalando live-server globalmente..."
  npm install -g live-server
fi

# Iniciar backend en segundo plano
echo "[1/2] Iniciando backend en puerto 3001..."
cd backend
nohup node app.js > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar un poco
sleep 2

# Iniciar frontend con live-server
echo "[2/2] Iniciando frontend en puerto 3000..."
cd frontend
nohup live-server --port=3000 --host=0.0.0.0 > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Mostrar IP local
echo "-----------------------------"
echo "Accedé desde tu navegador:"
hostname -I | awk '{for(i=1;i<=NF;i++) print "    http://" $i ":3000"}'
echo "-----------------------------"
echo
echo "Para detener el sistema escribí: stop"
echo

# Bucle interactivo
while true; do
  read -p "> " input
  if [[ "$input" == "stop" ]]; then
    echo "Cerrando procesos..."
    kill -9 $BACKEND_PID $FRONTEND_PID 2>/dev/null
    break
  fi
done

# Combinar logs
cat backend.log > "$logfile"
cat frontend.log >> "$logfile"
rm -f backend.log frontend.log

echo "Logs guardados en $logfile"
echo "Listo. Sesión finalizada."
