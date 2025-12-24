import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { GraduationCap, Building2, Users, BookOpen } from 'lucide-react';
import { dashboardService } from '../services/apiServices';
import { type DashboardStats } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const cards = [
    {
      title: 'Total Theses',
      value: stats?.totalTheses || 0,
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Universities',
      value: stats?.totalUniversities || 0,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'People',
      value: stats?.totalPeople || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Institutes',
      value: stats?.totalInstitutes || 0,
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

