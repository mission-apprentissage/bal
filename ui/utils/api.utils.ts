import type { IDeleteRoutes, IGetRoutes, IPostRoutes, IPutRoutes, IRequest, IResponse } from "shared";
import type { IResErrorJson, IRouteSchema, IRouteSchemaWrite } from "shared/routes/common.routes";
import type { EmptyObject } from "type-fest";
import type { z } from "zod/v4-mini";

import type { $ZodType } from "zod/v4/core";
import { publicConfig } from "@/config.public";

type PathParam = Record<string, string>;
type QueryString = Record<string, string | string[]>;
type WithQueryStringAndPathParam =
  | Readonly<{
      params?: Readonly<PathParam>;
      querystring?: Readonly<QueryString>;
    }>
  | EmptyObject;

type OptionsGet = {
  [Prop in keyof Pick<IRouteSchema, "params" | "querystring" | "headers">]: IRouteSchema[Prop] extends $ZodType
    ? z.input<IRouteSchema[Prop]>
    : never;
};

type OptionsWrite = {
  [Prop in keyof Pick<
    IRouteSchemaWrite,
    "params" | "querystring" | "headers" | "body"
  >]: IRouteSchemaWrite[Prop] extends $ZodType ? z.input<IRouteSchemaWrite[Prop]> : never;
};

type IRequestOptions = OptionsGet | OptionsWrite | EmptyObject;

async function optionsToFetchParams(
  method: RequestInit["method"],
  options: IRequestOptions,
  rawOptions?: Pick<RequestInit, "cache">
) {
  const headers = await getHeaders(options);

  let body: BodyInit | undefined = undefined;
  if ("body" in options && method !== "GET") {
    // @ts-expect-error
    if (options.body instanceof FormData) {
      body = options.body;
    } else {
      body = JSON.stringify(options.body);
      headers.append("Content-Type", "application/json");
    }
  }

  const requestInit: RequestInit = {
    mode: publicConfig.env === "local" ? "cors" : "same-origin",
    credentials: publicConfig.env === "local" ? "include" : "same-origin",
    body,
    method,
    headers,
  };

  if (rawOptions) {
    Object.assign(requestInit, rawOptions);
  }

  return { requestInit, headers };
}

async function getHeaders(options: IRequestOptions) {
  const headers = new Headers();

  if ("headers" in options && options.headers) {
    const h = options.headers;
    Object.keys(h).forEach((name) => {
      headers.append(name, h[name]);
    });
  }

  try {
    if (!global.window) {
      // By default server-side we don't use headers
      // But we need them for the api, as all routes are authenticated
      const { headers: nextHeaders } = await import("next/headers");
      const h = await nextHeaders();
      const cookie = h.get("cookie");
      if (cookie) {
        headers.append("cookie", cookie);
      }
    }
  } catch (_error) {
    // We're in client, cookies will be includes
  }

  return headers;
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
export function generatePath(originalPath: string, params: PathParam = {}): string {
  let path: string = originalPath;
  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    path = path.replace(/\*$/, "/*");
  }
  const prefix = path.startsWith("/") ? "/" : "";

  const stringify = (p: unknown) => (p == null ? "" : typeof p === "string" ? p : String(p));

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

const removeAtEnd = (url: string, removed: string): string =>
  url.endsWith(removed) ? url.slice(0, -removed.length) : url;

export function generateUrl(path: string, options: WithQueryStringAndPathParam = {}): string {
  let normalisedEndpoint = removeAtEnd(publicConfig.apiEndpoint, "/");
  normalisedEndpoint += generatePath(path, "params" in options ? options.params : {});
  if ("querystring" in options) {
    normalisedEndpoint += generateQueryString(options.querystring);
  }
  return normalisedEndpoint;
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
  errorData: unknown;
}

export class ApiError extends Error {
  context: ApiErrorContext;

  constructor(context: ApiErrorContext) {
    super();
    this.context = context;
    this.name = context.name ?? "ApiError";
    this.message = context.message ?? `code ${context.statusCode}`;
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
    let errorData: IResErrorJson["data"] | null = null;

    if (res.status > 0) {
      try {
        if (res.headers.get("Content-Type")?.startsWith("application/json")) {
          const data: IResErrorJson = await res.json();
          name = data.name;
          message = data.message;
          errorData = data.data;
        }
      } catch (_error) {
        // ignore
      }
    }

    return new ApiError({
      path,
      params: "params" in options && options.params ? options.params : {},
      querystring: "querystring" in options && options.querystring ? options.querystring : {},
      requestHeaders: Object.fromEntries(requestHeaders.entries()),
      statusCode: res.status,
      message,
      name,
      responseHeaders: Object.fromEntries(res.headers.entries()),
      errorData,
    });
  }
}

export async function apiPost<P extends keyof IPostRoutes, S extends IPostRoutes[P] = IPostRoutes[P]>(
  path: P,
  options: IRequest<S>
): Promise<IResponse<S>> {
  const { requestInit, headers } = await optionsToFetchParams("POST", options);

  const res = await fetch(generateUrl(path, options), requestInit);

  if (!res.ok) {
    throw await ApiError.build(path, headers, options, res);
  }

  return res.json();
}

export async function apiGet<P extends keyof IGetRoutes, S extends IGetRoutes[P] = IGetRoutes[P]>(
  path: P,
  options: IRequest<S>,
  rawOptions?: Pick<RequestInit, "cache">
): Promise<IResponse<S>> {
  const { requestInit, headers } = await optionsToFetchParams("GET", options, rawOptions);

  const res = await fetch(generateUrl(path, options), requestInit);

  if (!res.ok) {
    throw await ApiError.build(path, headers, options, res);
  }

  return res.json();
}

export async function apiPut<P extends keyof IPutRoutes, S extends IPutRoutes[P] = IPutRoutes[P]>(
  path: P,
  options: IRequest<S>
): Promise<IResponse<S>> {
  const { requestInit, headers } = await optionsToFetchParams("PUT", options);

  const res = await fetch(generateUrl(path, options), requestInit);

  if (!res.ok) {
    throw await ApiError.build(path, headers, options, res);
  }

  return res.json();
}

export async function apiDelete<P extends keyof IDeleteRoutes, S extends IDeleteRoutes[P] = IDeleteRoutes[P]>(
  path: P,
  options: IRequest<S>
): Promise<IResponse<S>> {
  const { requestInit, headers } = await optionsToFetchParams("DELETE", options);

  const res = await fetch(generateUrl(path, options), requestInit);

  if (!res.ok) {
    throw await ApiError.build(path, headers, options, res);
  }

  return res.json();
}
