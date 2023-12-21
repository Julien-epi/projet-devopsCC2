import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import billetRoutes from "./routes/billetRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();

class Server {
  private app: express.Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      process.exit(1);
    }
  }

  private initializeMiddleware(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    const swaggerOptions = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'API Billetterie',
          version: '1.0.0',
          description: 'API pour la gestion des billets d\'événements',
        },
        servers: [
          {
            url: `http://localhost:${this.port}`,
          },
        ],
      },
      apis: ['./src/routes/*.ts'],
    };

    const swaggerDocs = swaggerJSDoc(swaggerOptions);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }

  private initializeRoutes(): void {
    this.app.use("/billet", billetRoutes);
  }

  private initializeErrorHandling(): void {
    this.app.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.status(500).send({ error: err.message });
      }
    );
  }

  public async start(): Promise<void> {
    await this.initializeDatabase();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();

    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

const server = new Server(3001);
server.start();
