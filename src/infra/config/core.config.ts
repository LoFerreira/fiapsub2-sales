// Centraliza a URL base do fiapsub2-core
export const coreApiBaseUrl: string =
  process.env.CORE_API_BASE_URL ||
  process.env.CORE_API_URL ||
  // Fallback seguro para Minikube NodePort do fiapsub2-core (ajuste conforme seu ambiente)
  "http://192.168.49.2:30930";
