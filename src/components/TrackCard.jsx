export default function TrackCard({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-6 border border-gray-200 rounded-lg hover:shadow-lg cursor-pointer transition-all bg-white"
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
