import { Bell, User } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">Graduate Thesis System</h2>
      </div>
      <div className="flex items-center gap-4">
        
        <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <User className="h-5 w-5" />
          <span className="text-sm font-medium">Admin</span>
        </button>
      </div>
    </div>
  );
}



