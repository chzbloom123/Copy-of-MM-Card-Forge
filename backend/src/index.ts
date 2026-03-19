import { Hono } from "hono";
import { cors } from "hono/cors";
import "./env";
import { sampleRouter } from "./routes/sample";
import { cardsRouter } from "./routes/cards";
import { logger } from "hono/logger";

const app = new Hono();

// CORS middleware - validates origin against allowlist
const allowed: RegExp[] = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/[a-z0-9-]+\.railway\.app$/,
  /^https:\/\/[a-z0-9-]+\.up\.railway\.app$/,
];

if (process.env.RAILWAY_PUBLIC_DOMAIN) {
  allowed.push(new RegExp(`^https://${process.env.RAILWAY_PUBLIC_DOMAIN}$`));
}

app.use(
  "*",
  cors({
    origin: (origin) => (origin && allowed.some((re) => re.test(origin)) ? origin : null),
    credentials: true,
  })
);

// Logging
app.use("*", logger());

// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));

// Routes
app.route("/api/sample", sampleRouter);
app.route("/api/cards", cardsRouter);

const port = Number(process.env.PORT) || 3000;

export default {
  port,
  fetch: app.fetch,
};

