export function ArticleImage({ imageUrl }) {
  if (!imageUrl) return null;

  return (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto">
        <img src={imageUrl} alt="" className="w-full h-[500px] object-cover" />
      </div>
    </div>
  );
}
