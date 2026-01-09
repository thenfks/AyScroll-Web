import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';

const stats = [
  { label: 'Total Views', value: '0', icon: Eye, color: 'bg-primary' },
  { label: 'Followers', value: '0', icon: Users, color: 'bg-topic-green' },
  { label: 'Engagement', value: '0%', icon: TrendingUp, color: 'bg-topic-purple' },
  { label: 'Avg. Watch Time', value: '0m', icon: BarChart3, color: 'bg-topic-orange' },
];

const Analysis = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6 animate-fade-in">
            Analysis
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-card rounded-2xl p-5 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Chart Placeholder */}
          <div className="bg-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-semibold text-foreground mb-4">Performance Over Time</h2>
            <div className="h-64 flex items-center justify-center border border-border rounded-xl">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Start posting content to see your analytics!
                </p>
              </div>
            </div>
          </div>

          {/* Content Performance */}
          <div className="mt-6 bg-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-semibold text-foreground mb-4">Top Performing Content</h2>
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No content to analyze yet.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Analysis;
