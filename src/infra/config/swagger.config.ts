import swaggerJsdoc from "swagger-jsdoc";

const port = process.env.PORT || "3001";
const host = process.env.HOST || "localhost";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "FIAP Substitutiva fase-2 API",
    version: "1.0.0",
    description: "API para gerenciamento de veículos e pagamentos",
    contact: {
      name: "Leonardo Ferreira",
      email: "leonardo10sp@gmail.com",
    },
  },
  servers: [
    // Usa a mesma origem do servidor atual (funciona em localhost, Docker e K8s)
    {
      url: "/",
      description: "Same origin",
    },
    {
      url: `http://${host}:${port}`,
      description: "💻 Local explicit",
    },
  ],
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./src/infra/routes/*.ts", "./lib/infra/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
