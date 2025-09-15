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
docker build -t fiapsub2:latest .

# Aplicar ConfigMaps
echo "⚙️  Aplicando ConfigMaps..."
kubectl apply -f k8s/configmap.yaml

# Sem dependências de Firebase; nenhuma secret adicional necessária

# Aplicar Deployment
echo "🚀 Aplicando Deployment..."
kubectl apply -f k8s/deployment.yaml

# Aplicar Services
echo "🌐 Aplicando Services..."
kubectl apply -f k8s/service.yaml

# Aguardar pods ficarem prontos
echo "⏳ Aguardando pods ficarem prontos..."
kubectl wait --for=condition=ready pod -l app=fiapsub2-sales --timeout=120s

# Mostrar status
echo ""
echo "📊 Status do Deploy:"
echo "==================="
kubectl get pods -l app=fiapsub2-sales
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
