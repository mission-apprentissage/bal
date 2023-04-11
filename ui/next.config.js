/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");



function inline(value) {
  return value.replace(/\s{2,}/g, " ").trim();
}

const contentSecurityPolicy = `
      default-src 'self' https://plausible.io;
      base-uri 'self';
      block-all-mixed-content;
      font-src 'self'  https: data:;
      frame-ancestors 'self' https://bal.apprentissage.beta.gouv.fr;
      frame-src 'self' https://plausible.io https://bal.apprentissage.beta.gouv.fr;
      img-src 'self' https://www.notion.so data: ${
        process.env.NEXT_PUBLIC_ENV !== "production" ? "" : ""
      };
      object-src 'none';
      script-src 'self' https://plausible.io ${
        process.env.NEXT_PUBLIC_ENV === "dev" ? "'unsafe-eval' 'unsafe-inline'" : ""
      };
      script-src-attr 'none';
      style-src 'self' https:  https: *.plausible.io 'unsafe-inline';
      connect-src 'self' https://geo.api.gouv.fr/ https://plausible.io;
      upgrade-insecure-requests;
`;

const nextConfig = {
  transpilePackages: ['shared'],
  experimental: {
    appDir: true,
    outputFileTracingRoot: path.join(__dirname, '../')
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

module.exports = nextConfig
