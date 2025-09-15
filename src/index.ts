import "dotenv/config";
import express from "express";
import { routes } from "./infra/routes";
import { pageNotFoundHandler } from "./infra/middlewares/page-not-found.middleware";
import { errorHandler } from "./infra/middlewares/error-handler.middleware";
import { connectMongo, disconnectMongo } from "./infra/config/mongodb";

const app = express();

const bootstrap = async () => {
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || "0.0.0.0";

  try {
    console.log("Conectando ao MongoDB...");
    await connectMongo();
    console.log("MongoDB conectado com sucesso");
  } catch (error) {
    console.error(
      "Erro ao conectar no MongoDB:",
      (error as any)?.message || error
    );
    process.exit(1);
  }

  routes(app);
  pageNotFoundHandler(app);
  errorHandler(app);

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });

  const shutdown = async () => {
    console.log("Encerrando aplicação...");
    server.close(async () => {
      await disconnectMongo();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

bootstrap();

export default app;
