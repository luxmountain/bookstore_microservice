export default function Loading({ text = "Đang tải..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      <p className="mt-4 text-gray-500">{text}</p>
    </div>
  );
}
