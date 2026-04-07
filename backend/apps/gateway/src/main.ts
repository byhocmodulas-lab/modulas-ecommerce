import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { GatewayModule } from "./gateway.module";
import { GlobalExceptionFilter } from "../../../libs/common/src/filters/http-exception.filter";
import helmet from "helmet";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as express from "express";

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
            "https://checkout.razorpay.com",
            "https://*.railway.app",
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
  const allowedOrigins = [
    process.env.FRONTEND_URL ?? "http://localhost:3000",
    // Allow all Vercel preview deployments
    /^https:\/\/modulas(-[a-z0-9]+)?\.vercel\.app$/,
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // Versioning
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  // Global exception filter — prevents stack trace leaks in production
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix — exclude root so AppController's GET / still responds
  app.setGlobalPrefix("api", { exclude: ["/"] });

  // Swagger (dev only)
  if (process.env.NODE_ENV !== "production") {
    try {
      const config = new DocumentBuilder()
        .setTitle("Modulas API")
        .setDescription("Luxury Furniture Ecommerce API")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup("api/docs", app, document);
    } catch (e: unknown) {
      console.warn("Swagger setup skipped:", e instanceof Error ? e.message : e);
    }
  }

  await app.listen(process.env.PORT ?? 4000);
  console.log(`Gateway running on port ${process.env.PORT ?? 4000}`);
}

bootstrap();
