export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/50 py-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm text-gray-500">
          Prism uses AI to analyze news coverage across the political spectrum.
          <br />
          Always verify important information from primary sources.
        </p>
        {/* Removed footer quick links (Session Summary) per request */}
        {/* The links block previously here has been removed to keep the footer clean. */}
      </div>
    </footer>
  );
}
