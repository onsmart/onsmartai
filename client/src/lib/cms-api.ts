export class CmsApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

async function requestCms<T>(
  path: string,
  method: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {};
  if (method !== "GET") {
    headers["Content-Type"] = "application/json";
    headers["X-CMS-Request"] = "1";
  }
  if (path !== "/public") {
    try {
      const value = sessionStorage.getItem("manus-cookie");
      if (value) headers.Authorization = `Bearer ${value}`;
    } catch {
      /* Cookies continuam sendo a sessão principal. */
    }
  }
  const response = await fetch(`/api/cms${path}`, {
    method,
    credentials: "include",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let result: { data?: T; error?: string };
  try {
    result = await response.json();
  } catch {
    throw new CmsApiError(
      response.status,
      "O servidor não retornou uma resposta válida."
    );
  }
  if (!response.ok) {
    throw new CmsApiError(
      response.status,
      result.error || "Não foi possível concluir a operação."
    );
  }
  return result.data as T;
}

async function requestCmsPublicStatic<T>(): Promise<T> {
  const response = await fetch("/cms/public.json", {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new CmsApiError(response.status, "cms-public-static-missing");
  }
  const body = (await response.json()) as { data?: T } | T;
  if (body && typeof body === "object" && "data" in body && body.data) {
    return body.data as T;
  }
  return body as T;
}

export async function apiCms<T>(
  path: string,
  method = "GET",
  body?: unknown
): Promise<T> {
  if (path === "/public" && method === "GET") {
    try {
      return await requestCms<T>(path, method, body);
    } catch {
      return requestCmsPublicStatic<T>();
    }
  }
  return requestCms<T>(path, method, body);
}
