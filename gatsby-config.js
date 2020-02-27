module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/tangrams`,
        name: "tangrams",
      },
    },
    "gatsby-transformer-svg",
    "@css-system/gatsby-plugin-css-system",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Amstangram",
        short_name: "Amstangram",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#1DD1A1",
        display: "standalone",
        icons: [
          {
            src: "icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-offline",
      options: {
        debug: true,
      },
    },
    "gatsby-plugin-react-helmet",
  ],
}
