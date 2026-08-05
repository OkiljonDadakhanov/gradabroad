export interface CreatedGalleryCategory {
  id: number;
  name: string;
}

type CategoryRequest = (
  url: string,
  options: RequestInit,
) => Promise<Response>;

function parseCreatedGalleryCategory(data: unknown): CreatedGalleryCategory {
  if (!data || typeof data !== "object") {
    throw new Error("The server returned an invalid gallery category.");
  }

  const category = data as { id?: unknown; name?: unknown };
  if (
    typeof category.id !== "number" ||
    !Number.isInteger(category.id) ||
    category.id < 1 ||
    typeof category.name !== "string" ||
    !category.name.trim()
  ) {
    throw new Error("The server returned an invalid gallery category.");
  }

  return { id: category.id, name: category.name };
}

async function responseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { detail?: unknown };
    if (typeof data.detail === "string" && data.detail.trim()) {
      return data.detail;
    }
  } catch {
    // Keep a stable client error when the API does not return JSON.
  }

  return `Failed to add new category (${response.status}).`;
}

export async function createGalleryCategory(
  request: CategoryRequest,
  name: string,
): Promise<CreatedGalleryCategory> {
  const categoryName = name.trim();
  if (!categoryName) {
    throw new Error("Category name is required.");
  }

  const response = await request("/api/media/gallery/categories/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: categoryName }),
  });

  if (!response.ok) {
    throw new Error(await responseError(response));
  }

  return parseCreatedGalleryCategory(await response.json());
}
