import { Shield, Compass, Bookmark } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Prism</h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/guide"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md transform rotate-3 hidden sm:block">
              Essential
            </div>
            <Compass size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              How It Works
            </span>
          </a>
          {/* Removed Saved link from header per request */}
          {/**
          <a
            href="/saved"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bookmark size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              Saved
            </span>
          </a>
          **/}
          {/* Removed Session Summary quick link from header per request */}
          {/* <a
            href="/session-summary"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-gray-100 text-gray-900 hover:bg-gray-200"
          >
            <span className="text-sm font-medium">Session Summary</span>
          </a> */}
          {/* Removed Download Log button */}
          <p className="text-sm text-gray-500 hidden md:block">
            Investigate news from all perspectives
          </p>
        </div>
      </div>
    </header>
  );
}

// Also export as named export for compatibility
export { Header };
