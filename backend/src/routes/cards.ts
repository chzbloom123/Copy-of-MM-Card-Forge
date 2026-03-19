import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { CreateCardSchema, UpdateCardSchema } from "../types";

const cardsRouter = new Hono();

// List all cards
cardsRouter.get("/", async (c) => {
  const cards = await db.card.findMany({ orderBy: { updatedAt: "desc" } });
  return c.json({
    data: cards.map((card: { data: string; createdAt: Date; updatedAt: Date }) => ({
      ...card,
      data: JSON.parse(card.data),
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    })),
  });
});

// Get single card
cardsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const card = await db.card.findUnique({ where: { id } });
  if (!card) return c.json({ error: { message: "Not found", code: "NOT_FOUND" } }, 404);
  return c.json({
    data: {
      ...card,
      data: JSON.parse(card.data),
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    },
  });
});

// Create card
cardsRouter.post(
  "/",
  zValidator("json", CreateCardSchema),
  async (c) => {
    const { data } = c.req.valid("json");
    const card = await db.card.create({
      data: {
        name: data.entityName || "Unnamed Entity",
        cardClass: data.cardClass,
        data: JSON.stringify(data),
      },
    });
    return c.json(
      {
        data: {
          ...card,
          data: JSON.parse(card.data),
          createdAt: card.createdAt.toISOString(),
          updatedAt: card.updatedAt.toISOString(),
        },
      },
      201
    );
  }
);

// Update card
cardsRouter.put(
  "/:id",
  zValidator("json", UpdateCardSchema),
  async (c) => {
    const id = c.req.param("id");
    const { data } = c.req.valid("json");
    try {
      const card = await db.card.update({
        where: { id },
        data: {
          name: data.entityName || "Unnamed Entity",
          cardClass: data.cardClass,
          data: JSON.stringify(data),
        },
      });
      return c.json({
        data: {
          ...card,
          data: JSON.parse(card.data),
          createdAt: card.createdAt.toISOString(),
          updatedAt: card.updatedAt.toISOString(),
        },
      });
    } catch {
      return c.json({ error: { message: "Not found", code: "NOT_FOUND" } }, 404);
    }
  }
);

// Delete card
cardsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    await db.card.delete({ where: { id } });
    return c.body(null, 204);
  } catch {
    return c.json({ error: { message: "Not found", code: "NOT_FOUND" } }, 404);
  }
});

export { cardsRouter };
