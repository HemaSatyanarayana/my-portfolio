export default function GridLayout({ children }) {
  return (
    <div className="border-gray-800 border-x px-8">
      <div className="border-gray-800 border-x px-8">
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
}
