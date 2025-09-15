#!/bin/bash

echo "🚀 Deploy FIAP SUB2 Sales no Kubernetes"
echo "=================================="

# Verificar se estamos no diretório correto
if [ ! -f "k8s/deployment.yaml" ]; then
    echo "❌ Arquivo k8s/deployment.yaml não encontrado!"
    echo "Execute este script na raiz do projeto"
    exit 1
fi

# Verificar se o Minikube está rodando
if ! minikube status > /dev/null 2>&1; then
    echo "🔄 Iniciando Minikube..."
    minikube start
fi

# Configurar Docker para usar o Docker do Minikube
echo "🐳 Configurando Docker environment..."
eval $(minikube docker-env)

# Build da imagem no Docker do Minikube
echo "🏗️  Fazendo build da imagem..."
docker build -t fiapsub2-sales:latest .

# Aplicar ConfigMaps
echo "⚙️  Aplicando ConfigMaps..."
kubectl apply -f k8s/configmap.yaml

# Subir fiapsub2-core (usando imagem pública) pelo repo do sales
echo "🧩 Preparando fiapsub2-core (imagem pública) ..."
# Secret do Firebase para o core
if ! kubectl get secret firebase-adminsdk > /dev/null 2>&1; then
    echo "🔐 Criando secret do Firebase para o core..."
    if [ -f "fiapsub2-firebase-sdk.json" ]; then
        kubectl create secret generic firebase-adminsdk \
          --from-file=fiapsub2-firebase-sdk.json=./fiapsub2-firebase-sdk.json
    else
        echo "❌ Arquivo fiapsub2-firebase-sdk.json não encontrado na raiz do fiapsub2-sales."
        echo "   Coloque o JSON do Firebase aqui ou crie manualmente a secret firebase-adminsdk."
        echo "   Prosseguindo sem criar a secret pode falhar o core."
    fi
fi
echo "🚀 Aplicando Core Service/Deployment..."
kubectl apply -f k8s/core-service.yaml
kubectl apply -f k8s/core-deployment.yaml

# Criar Secret do MongoDB se não existir
if ! kubectl get secret mongodb-secret > /dev/null 2>&1; then
    echo "🔐 Criando secret do MongoDB..."
    # Tenta usar variável de ambiente; caso não tenha, tenta carregar do .env
        if [ -z "$MONGODB_URI" ]; then
                if [ -f ".env" ]; then
                        echo "📄 Carregando .env"
                        set -a
                        # shellcheck disable=SC1091
                        . ./.env
                        set +a
                        # Fallback: aceitar chaves em minúsculas
                        if [ -z "$MONGODB_URI" ] && [ -n "$mongodb_uri" ]; then
                            export MONGODB_URI="$mongodb_uri"
                        fi
                        if [ -z "$MONGODB_DB_NAME" ] && [ -n "$mongodb_db_name" ]; then
                            export MONGODB_DB_NAME="$mongodb_db_name"
                        fi
                            # Fallback extra: parse direto do .env em caso de incompatibilidade de shell
                            if [ -z "$MONGODB_URI" ]; then
                                parsed_uri=$(grep -E '^(MONGODB_URI|mongodb_uri)=' .env | tail -n1 | cut -d= -f2- | tr -d '\r')
                                # remove aspas simples/duplas se houver
                                parsed_uri="${parsed_uri%\"}"; parsed_uri="${parsed_uri#\"}"
                                parsed_uri="${parsed_uri%\'}"; parsed_uri="${parsed_uri#\'}"
                                if [ -n "$parsed_uri" ]; then export MONGODB_URI="$parsed_uri"; fi
                            fi
                            if [ -z "$MONGODB_DB_NAME" ]; then
                                parsed_db=$(grep -E '^(MONGODB_DB_NAME|mongodb_db_name)=' .env | tail -n1 | cut -d= -f2- | tr -d '\r')
                                parsed_db="${parsed_db%\"}"; parsed_db="${parsed_db#\"}"
                                parsed_db="${parsed_db%\'}"; parsed_db="${parsed_db#\'}"
                                if [ -n "$parsed_db" ]; then export MONGODB_DB_NAME="$parsed_db"; fi
                            fi
                fi
        fi
    if [ -z "$MONGODB_URI" ]; then
        echo "❌ MONGODB_URI não definida."
        echo "Defina a variável de ambiente MONGODB_URI ou inclua no arquivo .env antes de executar."
        exit 1
    fi
    kubectl create secret generic mongodb-secret \
      --from-literal=MONGODB_URI="$MONGODB_URI"
else
    echo "✅ Secret mongodb-secret já existe"
fi

# Aplicar Deployment
echo "🚀 Aplicando Deployment..."
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/core-deployment.yaml

# Aplicar Services
echo "🌐 Aplicando Services..."
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/core-service.yaml

# Aguardar pods ficarem prontos
echo "⏳ Aguardando pods ficarem prontos..."
kubectl wait --for=condition=ready pod -l app=fiapsub2-sales --timeout=120s

# Mostrar status
echo ""
echo "📊 Status do Deploy:"
echo "==================="
kubectl get pods -l app=fiapsub2-sales
kubectl get pods -l app=fiapsub2
echo ""
kubectl get services
echo ""

# Instruções finais
echo "🎉 Deploy concluído com sucesso!"
echo ""
echo "📱 Para acessar a aplicação:"
echo "   kubectl port-forward service/fiapsub2-sales-service 3001:80"
echo ""
echo "🌐 URLs disponíveis:"
echo "   • Health Check: http://localhost:3001/health"
echo "   • API Docs:     http://localhost:3001/api-docs"
echo "   • Vehicles API: http://localhost:3001/vehicles"
echo ""
echo "🔍 Para ver logs:"
echo "   kubectl logs -l app=fiapsub2 -f"
echo ""
echo "🧹 Para limpar tudo:"
echo "   kubectl delete -f k8s/"
