/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "mdx", "tsx", "ts", "md"],
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      "@aws-sdk/signature-v4-multi-region":
        "commonjs @aws-sdk/signature-v4-multi-region",
    });
    return config;
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "false",
          },
          {
            key: "Cach-Control",
            value: "public,max-age=14400,stale-while-revalidate=7200", // Matched parameters can be used in the value
          },

          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },

          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version,XSRF-TOKEN,Access-Control-Allow-Origin",
          },
        ],
      },
      {
        source: "/blog/usershomelinks/:username/:fileID",
        headers: [
          {
            key: "x-username",
            value: ":username", // Matched parameters can be used in the value
          },
          {
            key: "Access-Control-Allow-Origin",
            value:
              "newmasterconnect.herokuapp.com,www.masterconnect.ca,ww.master-connect.ca,www.garymasterconnect.com,cdn.jsdelivr.net,compute-1.amazonaws.com,master-sale.herokuapp.com,awsprismabucket105646-dev.s3.amazonaws.com,localhost:3000,main.dx5wvmbhcdn6z.amplifyapp.com",
          },
          {
            key: "x-fileID",
            value: ":fileID", // Matched parameters can be used in the value
          },
          {
            key: "Access-Control-Allow-Origin",
            value:
              "newmasterconnect.herokuapp.com,www.masterconnect.ca,ww.master-connect.ca,www.garymasterconnect.com,cdn.jsdelivr.net,compute-1.amazonaws.com,master-sale.herokuapp.com,awsprismabucket105646-dev.s3.amazonaws.com,localhost:3000,main.dx5wvmbhcdn6z.amplifyapp.com",
          },
        ],
      },
      {
        source: "/api/getposts",
        headers: [
          {
            key: "Cach-Control",
            value: "public,max-age=14400,stale-while-revalidate=7200", // Matched parameters can be used in the value
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/blog/:fileID",
        headers: [
          {
            key: "x-fileID",
            value: ":fileID", // Matched parameters can be used in the value
          },
          {
            key: "Access-Control-Allow-Origin",
            value:
              "newmasterconnect.herokuapp.com,www.masterconnect.ca,ww.master-connect.ca,www.garymasterconnect.com,cdn.jsdelivr.net,compute-1.amazonaws.com,master-sale.herokuapp.com,awsprismabucket105646-dev.s3.amazonaws.com,localhost:3000,main.dx5wvmbhcdn6z.amplifyapp.com",
          },
        ],
      },
      {
        source: "/posts/:postId(\\d{1,})",
        headers: [
          {
            key: "x-postId",
            value: ":postId", // Matched parameters can be used in the value
          },
          // {
          //   key: "X-Content-Type-Options",
          //   value: "nosniff",
          // },
          {
            key: "Access-Control-Allow-Origin",
            value:
              "newmasterconnect.herokuapp.com,www.masterconnect.ca,ww.master-connect.ca,www.garymasterconnect.com,cdn.jsdelivr.net,compute-1.amazonaws.com,master-sale.herokuapp.com,awsprismabucket105646-dev.s3.amazonaws.com,localhost:3000,main.dx5wvmbhcdn6z.amplifyapp.com",
          },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "new-master.s3.ca-central-1.amazonaws.com",
        port: "",
        // pathname: '/account123/**',
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        // pathname: '/account123/**',
      },
      {
        protocol: "https",
        hostname: "masterultils.com",
        port: "",
        // pathname: '/account123/**',
      },
    ],
  },
};

module.exports = nextConfig;
