import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <TopBar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

