# 🚗 Plataforma de Revenda de Veículos - Tech Challenge SOAT

API para revenda de veículos construída com Node.js, Express, TypeScript e MongoDB Atlas.

## 📌 Funcionalidades

- Cadastrar/editar veículos
- Vender veículos e registrar comprador/data
- Listar disponíveis e vendidos por preço (asc)
- Webhook de pagamento (efetuado/cancelado)

## 📁 Estrutura do Projeto

```
src/
├── domain/              # Entidades e erros
├── infra/               # Controllers, repos, rotas, middlewares
├── useCases/            # Regras de negócio
└── index.ts             # Bootstrap do app (MongoDB + Express)

k8s/
├── configmap.yaml       # Configuração básica
├── deployment.yaml      # Deployment do app
├── service.yaml         # Service (NodePort/ClusterIP)
├── start-minikube.sh    # Sobe tudo no Minikube e faz port-forward
└── stop-minikube.sh     # Encerra port-forward e limpa recursos

docker-compose.yml       # Dev/Prod local com bind do JSON
Dockerfile               # Build multi-stage
```

## 🔑 Configuração do MongoDB (obrigatório)

Defina as variáveis de ambiente para conexão:

```
MONGODB_URI="<sua_connection_string>"
MONGODB_DB_NAME="fiapsub2-sales"
```

## 🚀 Executar local (sem Docker)

```bash
npm install

npm start
```

Swagger endpoint:

- Docs: http://localhost:3000/api-docs

## 🧪 Testes

```bash
npm test
```

Os testes de integração cobrem apenas os endpoints existentes neste serviço:

- `GET /vehicles` (com `filter=sold|available`)
- `GET /sales`
- `POST /sales`
- `POST /webhook/payment`

## 🐳 Docker

```bash
# Build da imagem
docker build -t fiapsub2 .

# Rodar container
docker run -p 3000:3000 \
  -e MONGODB_URI="<sua_connection_string>" \
  -e MONGODB_DB_NAME="fiapsub2-sales" \
  fiapsub2

# Docker Compose (já faz o bind e seta a env automaticamente)
docker compose up -d --build
```

## ☸️ Minikube (Kubernetes)

```bash
minikube start

# Usar Docker do Minikube
minikube docker-env | Invoke-Expression

docker build -t fiapsub2-sales:latest .

kubectl apply -f k8s/

kubectl port-forward service/fiapsub2-service 3000:80
kubectl port-forward service/fiapsub2-sales-service 3005:80
```

## 🔧 Tecnologias

- Node.js + TypeScript
- Express.js
- MongoDB (mongodb atlas)
- Jest (testes)
- Docker, Kubernetes (Minikube)
- GitHub Actions (CI/CD)
