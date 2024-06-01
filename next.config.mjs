/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core"],
    outputFileTracingIncludes: {
      "/generate": [
        "./app/generate/Generic.pass/**/*",
        "./app/generate/certs/*.pem",
      ],
    },
  },
};

export default nextConfig;
