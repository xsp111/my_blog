import type { NextConfig } from "next";
import removeImports from "next-remove-imports";


const nextConfig: NextConfig = {
  /* config options here */
};

export default removeImports(nextConfig as any);
// export default nextConfig;
