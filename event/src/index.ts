import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import eventRoutes from "./routes/eventRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
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
  }

  private initializeRoutes(): void {
    this.app.use("/events", eventRoutes);
  }

  private initializeErrorHandling(): void {
    this.app.use(
      (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(500).send({ error: err.message });
      }
    );
  }

  private initializeSwagger(): void {
    const swaggerOptions = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'API Événement',
          version: '1.0.0',
          description: 'API pour la gestion des événements',
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

  public async start(): Promise<void> {
    await this.initializeDatabase(); // Connexion à la base de données
    this.initializeMiddleware(); // Middleware
    this.initializeRoutes(); // Routes
    this.initializeErrorHandling(); // Gestion des erreurs
    this.initializeSwagger();

    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

const server = new Server(3000);
server.start();
