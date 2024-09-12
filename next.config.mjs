/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    Domain: process.env.NEXT_PUBLIC_DOMAIN,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
