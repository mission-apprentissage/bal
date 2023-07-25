import { IRequest, IResponse, IRoutes } from "shared";
import { IResErrorJson } from "shared/routes/common.routes";

import { publicConfig } from "../config.public";

const normalisedEndpoint = publicConfig.apiEndpoint.endsWith("/")
  ? publicConfig.apiEndpoint.slice(0, -1)
  : publicConfig.apiEndpoint;

interface ExtraOptions {
  headers?: {
    cookie?: string;
  };
}

type PathParam = Record<string, string>;
type QueryString = Record<string, string | string[]>;
interface WithQueryStringAndPathParam {
  params?: PathParam;
  querystring?: QueryString;
}

/*
 * The following function is inspired from https://github.com/remix-run/react-router/blob/868e5157bbb72fb77f827f264a2b7f6f6106147d/packages/router/utils.ts#L751-L802
 *
 * MIT License
 *
 * Copyright (c) React Training LLC 2015-2019
 * Copyright (c) Remix Software Inc. 2020-2021
 * Copyright (c) Shopify Inc. 2022-2023
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
export function generatePath(
  originalPath: string,
  params: PathParam = {}
): string {
  let path: string = originalPath;
  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    path = path.replace(/\*$/, "/*");
  }
  const prefix = path.startsWith("/") ? "/" : "";

  const stringify = (p: unknown) =>
    p == null ? "" : typeof p === "string" ? p : String(p);

  const segments = path
    .split(/\/+/)
    .map((segment, index, array) => {
      const isLastSegment = index === array.length - 1;

      // only apply the splat if it's the last segment
      if (isLastSegment && segment === "*") {
        const star = "*";
        // Apply the splat
        return stringify(params[star]);
      }

      const keyMatch = segment.match(/^:(\w+)(\??)$/);
      if (keyMatch) {
        const [, key, optional] = keyMatch;
        const param = params[key];
        if (optional !== "?" && param == null) {
          throw new Error(`Missing ":${key}" param`);
        }

        return stringify(param);
      }

      // Remove any optional markers from optional static segments
      return segment.replace(/\?$/g, "");
    })
    // Remove empty segments
    .filter((segment) => !!segment);

  return prefix + segments.join("/");
}

export function generateQueryString(query: QueryString = {}): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else {
      searchParams.append(key, value);
    }
  }

  return `?${searchParams.toString()}`;
}

export function generateUrl(
  path: string,
  options: WithQueryStringAndPathParam = {}
): string {
  return (
    normalisedEndpoint +
    generatePath(path, options.params) +
    generateQueryString(options.querystring)
  );
}

function getBody(headers: Headers, body?: BodyInit): BodyInit | null {
  if (!body) {
    return null;
  }

  return headers.get("Content-Type") === "application/json"
    ? JSON.stringify(body)
    : body;
}

export interface ApiErrorContext {
  path: string;
  params: PathParam;
  querystring: QueryString;
  requestHeaders: Record<string, string | string[]>;
  statusCode: number;
  message: string;
  name: string;
  responseHeaders: Record<string, string | string[]>;
}

export class ApiError extends Error {
  context: ApiErrorContext;

  constructor(context: ApiErrorContext) {
    super();
    this.context = context;
    this.name = context.name;
    this.message = context.message;
  }

  toJSON(): ApiErrorContext {
    return this.context;
  }

  static async build(
    path: string,
    requestHeaders: Headers,
    options: WithQueryStringAndPathParam,
    res: Response
  ): Promise<ApiError> {
    let message = res.status === 0 ? "Network Error" : res.statusText;
    let name = "Api Error";

    if (res.status > 0) {
      try {
        if (res.headers.get("Content-Type")?.startsWith("application/json")) {
          const data: IResErrorJson = await res.json();
          name = data.name;
          message = data.message;
        }
      } catch (error) {
        // ignore
      }
    }

    return new ApiError({
      path,
      params: options.params ?? {},
      querystring: options.querystring ?? {},
      requestHeaders: Object.fromEntries(requestHeaders.entries()),
      statusCode: res.status,
      message,
      name,
      responseHeaders: Object.fromEntries(res.headers.entries()),
    });
  }
}

export async function apiPost<
  P extends keyof IRoutes["post"],
  S extends IRoutes["post"][P] = IRoutes["post"][P]
>(
  path: P,
  options: IRequest<S>,
  extra: ExtraOptions = {}
): Promise<IResponse<S>> {
  // TODO: Use a better cast
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const o: Record<string, any> = options;
  const headers = new Headers({
    ...extra.headers,
    ...o.headers,
  });

  if (!(o.body instanceof FormData)) {
    headers.append("Content-Type", "application/json");
  }

  const res = await fetch(generateUrl(path, o), {
    method: "POST",
    mode: "same-origin",
    credentials: "same-origin",
    body: getBody(headers, o?.body),
    headers,
  });

  if (!res.ok) {
    throw await ApiError.build(path, headers, o, res);
  }

  return res.json();
}

export async function apiGet<
  P extends keyof IRoutes["get"],
  S extends IRoutes["get"][P] = IRoutes["get"][P]
>(
  path: P,
  options: IRequest<S>,
  extra: ExtraOptions = {}
): Promise<IResponse<S>> {
  // TODO: Use a better cast
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const o: Record<string, any> = options;
  const headers = new Headers({
    ...extra.headers,
    ...o.headers,
  });

  const res = await fetch(generateUrl(path, options), {
    method: "GET",
    mode: "same-origin",
    credentials: "same-origin",
    headers,
  });

  if (!res.ok) {
    throw await ApiError.build(path, headers, o, res);
  }

  return res.json();
}

export async function apiDelete<
  P extends keyof IRoutes["delete"],
  S extends IRoutes["delete"][P] = IRoutes["delete"][P]
>(
  path: P,
  options: IRequest<S>,
  extra: ExtraOptions = {}
): Promise<IResponse<S>> {
  // TODO: Use a better cast
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const o: Record<string, any> = options;
  const headers = new Headers({
    ...extra.headers,
    ...o?.headers,
  });

  const res = await fetch(generateUrl(path, options), {
    method: "DELETE",
    mode: "same-origin",
    credentials: "same-origin",
    headers,
  });

  if (!res.ok) {
    throw await ApiError.build(path, headers, o, res);
  }

  return res.json();
}
