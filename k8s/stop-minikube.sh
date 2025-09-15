#!/usr/bin/env bash
set -euo pipefail

# Script para encerrar o port-forward, remover recursos do k8s
# (deployment/service/configmap/secret) e opcionalmente parar o Minikube.
# Uso: k8s/stop-minikube.sh [--full]

APP_NAME="fiapsub2"
NAMESPACE="default"
SERVICE_NAME="fiapsub2-service"
CONFIGMAP_FILE="k8s/configmap.yaml"
DEPLOYMENT_FILE="k8s/deployment.yaml"
SERVICE_FILE="k8s/service.yaml"
PF_PID_FILE=".pf-${APP_NAME}.pid"

bold() { echo -e "\033[1m$*\033[0m"; }
info() { echo -e "🔹 $*"; }
ok() { echo -e "✅ $*"; }
warn() { echo -e "⚠️  $*"; }
err() { echo -e "❌ $*"; }

FULL_STOP=false
if [[ "${1:-}" == "--full" ]]; then
  FULL_STOP=true
fi

bold "🛑 Parando ambiente ${APP_NAME}"

# 1) Encerrar port-forward se estiver ativo
if [[ -f "${PF_PID_FILE}" ]]; then
  PF_PID=$(cat "${PF_PID_FILE}" || echo "")
  if [[ -n "${PF_PID}" && $(ps -p "${PF_PID}" -o pid= || true) ]]; then
    info "Encerrando port-forward (PID ${PF_PID})"
    kill "${PF_PID}" || true
    rm -f "${PF_PID_FILE}"
    ok "Port-forward encerrado"
  else
    warn "Arquivo de PID encontrado, mas processo não está ativo"
    rm -f "${PF_PID_FILE}"
  fi
else
  info "Nenhum port-forward PID file encontrado (${PF_PID_FILE})"
fi

# 2) Remover recursos do k8s
info "Removendo recursos do Kubernetes"
# Aplica delete em ordem: service -> deployment -> configmap
kubectl delete -f "${SERVICE_FILE}" -n "${NAMESPACE}" --ignore-not-found
kubectl delete -f "${DEPLOYMENT_FILE}" -n "${NAMESPACE}" --ignore-not-found
kubectl delete -f "${CONFIGMAP_FILE}" -n "${NAMESPACE}" --ignore-not-found

## Sem secret do Firebase para remover

ok "Recursos removidos"

# 3) Parar Minikube (opcional)
if [[ "${FULL_STOP}" == true ]]; then
  info "Parando Minikube..."
  minikube stop || warn "Falha ao parar Minikube"
  ok "Minikube parado"
else
  info "Minikube permanece em execução. Use --full para parar."
fi

bold "✨ Limpeza concluída"
