import { FiAlertCircle } from "react-icons/fi";

export default function EmptyState({
  icon: Icon = FiAlertCircle,
  title = "Không có dữ liệu",
  description = "",
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-4 max-w-md">{description}</p>
      )}
      {action}
    </div>
  );
}
