// next.config.js
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,  // Ativa o uso do diretório 'app'
  },
  async headers() {
    return [
      {
        source: "/api/(.*)", // Para todas as rotas da API
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate", // Garante que não haja cache
          },
        ],
      },
    ];
  },
};
