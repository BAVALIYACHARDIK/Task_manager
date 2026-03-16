import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Badge } from '../components/ui/badge.tsx';
import { Loader2 } from 'lucide-react';
import {
  getRecentActivities,
  ActivityLog,
  getActionColor,
  formatActivityTimestamp,
} from '../service/activityService';

interface ActivityLogProps {
  limit?: number;
}

const ActivityLogComponent: React.FC<ActivityLogProps> = ({ limit = 20 }) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRecentActivities(limit);

      if (response.success && response.data) {
        setActivities(response.data);
      } else {
        setError(response.error || 'Failed to load activities');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mr-2" />
            <p className="text-gray-600 dark:text-gray-400">Loading activities...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No activities yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b last:border-b-0 dark:border-gray-700"
              >
                {/* Action Badge */}
                <div className="flex-shrink-0 mt-1">
                  <Badge className={getActionColor(activity.action)}>
                    {activity.action.replace(/_/g, ' ')}
                  </Badge>
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {activity.user && (
                      <>
                        <span>{activity.user.fullName}</span>
                        <span>•</span>
                      </>
                    )}
                    {activity.task && (
                      <>
                        <span>{activity.task.title}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{formatActivityTimestamp(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLogComponent;
