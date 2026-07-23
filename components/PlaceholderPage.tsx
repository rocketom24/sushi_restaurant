export default function PlaceholderPage({ title, text }: { title: string; text: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-night px-6 py-24">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-4xl text-cream mb-4">{title}</h1>
        <p className="text-gray-400 font-light">{text}</p>
      </div>
    </div>
  );
}
