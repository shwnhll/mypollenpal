import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Redirect ZIP-city-state to city-state format
        source: '/:zip(\\d{5})-:city-:state',
        destination: '/:city-:state',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
