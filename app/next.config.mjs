import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "60mb",
    },
  },
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
}

export default nextConfig
