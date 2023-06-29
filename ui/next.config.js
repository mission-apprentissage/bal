/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const path = require("path");
const { withPlausibleProxy } = require("next-plausible");

function inline(value) {
  return value.replace(/\s{2,}/g, " ").trim();
}

const contentSecurityPolicy = `
      default-src 'self' https://plausible.io;
      base-uri 'self';
      block-all-mixed-content;
      font-src 'self'  https: data:;
      frame-ancestors 'self' https://${process.env.NEXT_PUBLIC_BASE_HOST};
      frame-src 'self' https://plausible.io https://${process.env.NEXT_PUBLIC_BASE_HOST};
      img-src 'self' https://www.notion.so data: ${
        process.env.NEXT_PUBLIC_ENV !== "production" ? "" : ""
      };
      object-src 'none';
      script-src 'self' https://plausible.io 'unsafe-inline' ${
        process.env.NEXT_PUBLIC_ENV === "local" ? "'unsafe-eval'" : ""
      };
      script-src-attr 'none';
      style-src 'self' https:  https: *.plausible.io 'unsafe-inline';
      connect-src 'self' https://geo.api.gouv.fr/ https://plausible.io;
      upgrade-insecure-requests;
`;

const nextConfig = {
  transpilePackages: ['shared'],
  poweredByHeader: false,
  swcMinify: true,
  experimental: {
    appDir: true,
    outputFileTracingRoot: path.join(__dirname, '../'),
    // typedRoutes: true,
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: inline(contentSecurityPolicy),
          },
        ],
      },
    ];
  },
}


module.exports = withPlausibleProxy()(nextConfig);

