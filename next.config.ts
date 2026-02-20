import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/comedians/login", destination: "/artists/login", permanent: true },
      { source: "/comedians/join", destination: "/artists/join", permanent: true },
      { source: "/comedians/profile", destination: "/artists/profile", permanent: true },
      { source: "/comedians/bookings", destination: "/artists/bookings", permanent: true },
      { source: "/admin/comedians", destination: "/admin/artists", permanent: true },
    ];
  },
};

export default nextConfig;
