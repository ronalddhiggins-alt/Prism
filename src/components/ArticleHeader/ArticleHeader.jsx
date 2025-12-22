import { ArrowLeft, Share2, BookmarkPlus, Bookmark } from "lucide-react";

export function ArticleHeader({ isSaved, onToggleSave, isLoading }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Feed</span>
        </a>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 size={20} className="text-gray-600" />
          </button>
          <button
            onClick={onToggleSave}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaved ? (
              <Bookmark size={20} className="text-blue-600 fill-blue-600" />
            ) : (
              <BookmarkPlus size={20} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
