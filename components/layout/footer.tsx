export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Background avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 animate-gradient" />
      
      {/* Éléments décoratifs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full animate-float blur-xl" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-red-500/20 rounded-full animate-float blur-xl" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Prince ONILOU
                </span>
              </h3>
              <p className="text-gray-300">Développeur Web Fullstack</p>
            </div>
            
            <div className="border-t border-white/20 pt-6">
              <p className="text-gray-400 mb-2">
                © {currentYear} Prince ONILOU. Tous droits réservés.
              </p>
              <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                Développé avec 
                <span className="text-red-400 animate-pulse">❤️</span> 
                en Next.js et Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}