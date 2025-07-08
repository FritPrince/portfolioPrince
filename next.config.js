/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Désactive ESLint pendant le build
  },
  images: { 
    unoptimized: true // Désactive l'optimisation des images pour l'export statique
  },
  // Ajoutez votre URI MongoDB ici si nécessaire (optionnel)
};

module.exports = nextConfig;