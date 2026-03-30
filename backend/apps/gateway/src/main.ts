import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { GatewayModule } from "./gateway.module";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";

const isProd = process.env.NODE_ENV === "production";

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {
    logger: ["error", "warn", "log"],
    // Required for Stripe webhook signature verification
    rawBody: true,
  });

  // ── Security headers (V-11) ─────────────────────────────────────
  // Explicit CSP and HSTS — bare helmet() uses defaults that allow
  // unsafe-inline scripts and omit HSTS on non-HTTPS environments.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://js.stripe.com"],
          frameSrc: ["'self'", "https://js.stripe.com"],
          connectSrc: [
            "'self'",
            "https://api.stripe.com",
            process.env.FRONTEND_URL ?? "http://localhost:3000",
          ],
          imgSrc: ["'self'", "data:", "https:"],
          styleSrc: ["'self'", "'unsafe-inline'"], // required for Stripe Elements
          fontSrc: ["'self'", "https:", "data:"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: isProd ? [] : null,
        },
      },
      hsts: isProd
        ? { maxAge: 31_536_000, includeSubDomains: true, preload: true }
        : false,
      crossOriginEmbedderPolicy: false, // disabled — Stripe iframes require relaxed COEP
    }),
  );

  // Stripe webhook needs raw body BEFORE global JSON parsing
  app.use(
    "/api/v1/orders/webhook/stripe",
    express.raw({ type: "application/json" }),
  );

  app.use(compression());
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.FRONTEND_URL ?? "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // Versioning
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix("api");

  // Swagger (dev only)
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Modulas API")
      .setDescription("Luxury Furniture Ecommerce API")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  await app.listen(process.env.PORT ?? 4000);
  console.log(`Gateway running on port ${process.env.PORT ?? 4000}`);
}

bootstrap();
