import assert from "node:assert/strict";
import test from "node:test";
import { createGalleryCategory } from "../lib/gallery-categories.ts";

test("creates a category with JSON and trims the name", async () => {
  let request;
  const category = await createGalleryCategory(
    async (url, options) => {
      request = { url, options };
      return new Response(JSON.stringify({ id: 7, name: "Campus West" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    },
    "  Campus West  ",
  );

  assert.deepEqual(category, { id: 7, name: "Campus West" });
  assert.equal(request.url, "/api/media/gallery/categories/");
  assert.equal(request.options.method, "POST");
  assert.equal(request.options.headers["Content-Type"], "application/json");
  assert.equal(request.options.body, JSON.stringify({ name: "Campus West" }));
});

test("rejects an API failure without accepting a local category", async () => {
  await assert.rejects(
    () =>
      createGalleryCategory(
        async () =>
          new Response(JSON.stringify({ detail: "Category already exists." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }),
        "Campus",
      ),
    { message: "Category already exists." },
  );
});

test("rejects a malformed success response", async () => {
  await assert.rejects(
    () =>
      createGalleryCategory(
        async () => new Response(JSON.stringify({ name: "Missing id" }), { status: 201 }),
        "Campus",
      ),
    { message: "The server returned an invalid gallery category." },
  );
});
