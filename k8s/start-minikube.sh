#!/usr/bin/env bash
set -euo pipefail

# Script para iniciar Minikube, construir a imagem, aplicar manifests
# e fazer port-forward para a API.

APP_NAME="fiapsub2"
NAMESPACE="default"
IMAGE_TAG="${APP_NAME}:latest"
SERVICE_NAME="fiapsub2-service"
CONFIGMAP_FILE="k8s/configmap.yaml"
DEPLOYMENT_FILE="k8s/deployment.yaml"
SERVICE_FILE="k8s/service.yaml"
## Sem dependências de Firebase
#!/usr/bin/env bash
set -euo pipefail

# Script para iniciar Minikube, construir a imagem, aplicar manifests,
# criar Secret com o JSON do Firebase e fazer port-forward para a API.
# Portável para macOS e Windows (Git Bash/WSL).

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

APP_NAME="fiapsub2"
NAMESPACE="default"
IMAGE_TAG="${APP_NAME}:latest"
SERVICE_NAME="fiapsub2-service"
CONFIGMAP_FILE="k8s/configmap.yaml"
DEPLOYMENT_FILE="k8s/deployment.yaml"
SERVICE_FILE="k8s/service.yaml"
PF_PID_FILE="${ROOT_DIR}/.pf-${APP_NAME}.pid"

bold() { echo -e "\033[1m$*\033[0m"; }
info() { echo -e "🔹 $*"; }
ok() { echo -e "✅ $*"; }
warn() { echo -e "⚠️  $*"; }
err() { echo -e "❌ $*"; }

bold "🚀 Start ${APP_NAME} no Minikube"
echo "=================================="

# 1) Validar arquivos
[[ -f "${DEPLOYMENT_FILE}" && -f "${SERVICE_FILE}" && -f "${CONFIGMAP_FILE}" ]] || {
  err "Manifests k8s não encontrados (deployment/service/configmap)."; exit 1; }

# 2) Garantir Minikube em execução (driver docker por padrão)
if ! minikube status >/dev/null 2>&1; then
  info "Iniciando Minikube (driver=docker)..."
  minikube start --driver=docker
else
  ok "Minikube já está em execução"
fi

# 3) Usar Docker do Minikube
info "Configurando Docker environment do Minikube..."
eval "$(minikube docker-env)"

# 4) Construir imagem dentro do Minikube
bold "🏗️  Build da imagem ${IMAGE_TAG}"
docker build -t "${IMAGE_TAG}" .

# 5) ConfigMap
bold "⚙️  Aplicando ConfigMap"
kubectl apply -f "${CONFIGMAP_FILE}"

# 6) Deployment e Service
bold "🚀 Aplicando Deployment e Service"
kubectl apply -f "${DEPLOYMENT_FILE}"
kubectl apply -f "${SERVICE_FILE}"

# 8) Aguardar pods prontos
bold "⏳ Aguardando pods ficarem prontos"
kubectl rollout status deployment/fiapsub2-sales-deployment -n "${NAMESPACE}" --timeout=180s || true

# 9) Mostrar status
bold "📊 Status do Deploy"
kubectl get pods -l app="${APP_NAME}" -n "${NAMESPACE}"
kubectl get svc -n "${NAMESPACE}"

# 10) Port-forward (derruba PF anterior se existir)
bold "🔌 Iniciando port-forward (localhost:3000 -> service/${SERVICE_NAME}:80)"
if [[ -f "${PF_PID_FILE}" ]]; then
  OLD_PID="$(cat "${PF_PID_FILE}" || true)"
  if [[ -n "${OLD_PID}" ]] && ps -p "${OLD_PID}" >/dev/null 2>&1; then
    warn "Encerrando port-forward anterior (PID ${OLD_PID})"
    kill "${OLD_PID}" || true
    sleep 1
  fi
fi

# Iniciar port-forward em background de forma portável (nohup)
nohup kubectl port-forward svc/${SERVICE_NAME} 3000:80 -n "${NAMESPACE}" >/dev/null 2>&1 &
echo $! > "${PF_PID_FILE}"
sleep 1
if ps -p "$(cat "${PF_PID_FILE}" 2>/dev/null || echo 0)" >/dev/null 2>&1; then
  ok "Port-forward ativo em http://localhost:3000"
else
  warn "Não foi possível iniciar o port-forward automaticamente."
  echo "Você pode rodar manualmente: kubectl port-forward service/${SERVICE_NAME} 3000:80 -n ${NAMESPACE}"
fi

cat <<EOF

🎉 Ambiente pronto!

URLs:
  • Health:   http://localhost:3000/health
  • API Docs: http://localhost:3000/api-docs
  • Vehicles: http://localhost:3000/vehicles

Limpeza e parada:
  • Parar e limpar recursos (mantém Minikube rodando):
      k8s/stop-minikube.sh
  • Parar tudo (inclui parar o Minikube):
      k8s/stop-minikube.sh --full

Comandos úteis:
  • Logs:  kubectl logs -l app=${APP_NAME} -f -n ${NAMESPACE}
  • Pods:  kubectl get pods -l app=${APP_NAME} -n ${NAMESPACE}
  • Svc:   kubectl get svc -n ${NAMESPACE}

EOF
