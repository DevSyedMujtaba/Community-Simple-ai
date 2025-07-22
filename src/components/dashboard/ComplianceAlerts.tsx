import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";

interface ComplianceAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'pending';
  title: string;
  description: string;
  category: string;
  date: string;
  action?: string;
}

const ComplianceAlerts = ({ hoaId }: { hoaId: string }) => {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hoaId) return;
    setLoading(true);
    supabase
      .from('compliance_alerts')
      .select('*')
      .eq('hoa_id', hoaId)
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setAlerts(data as ComplianceAlert[]);
        setLoading(false);
      });
  }, [hoaId]);

  // Get icon and colors based on alert type
  const getAlertStyles = (type: ComplianceAlert['type']) => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          badgeVariant: 'destructive' as const
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          badgeVariant: 'secondary' as const
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          badgeVariant: 'outline' as const
        };
      case 'pending':
        return {
          icon: Clock,
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          badgeVariant: 'outline' as const
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          badgeVariant: 'outline' as const
        };
    }
  };

  // Group alerts by category
  const alertsByCategory = alerts.reduce((acc, alert) => {
    if (!acc[alert.category]) {
      acc[alert.category] = [];
    }
    acc[alert.category].push(alert);
    return acc;
  }, {} as Record<string, ComplianceAlert[]>);

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading compliance alerts...</div>;
  }

  if (alerts.length === 0) {
    return <div className="text-center text-gray-500 py-8">No compliance alerts found for your community.</div>;
  }

  return <div className="space-y-6">
    {/* Alerts by Category */}
    {Object.entries(alertsByCategory).map(([category, categoryAlerts]) => (
      <div key={category}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
        <div className="space-y-3">
          {categoryAlerts.map(alert => {
            const styles = getAlertStyles(alert.type);
            const IconComponent = styles.icon;
            return <Card key={alert.id} className={`${styles.bgColor} ${styles.borderColor} border`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <IconComponent className={`h-6 w-6 ${styles.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <Badge variant={styles.badgeVariant} className="text-xs">
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                    {alert.action && <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-1">Action Required:</p>
                      <p className="text-sm text-gray-700">{alert.action}</p>
                    </div>}
                    <div className="mt-3 text-xs text-gray-500">
                      {alert.date ? new Date(alert.date).toLocaleDateString() : ''}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>;
          })}
        </div>
      </div>
    ))}
  </div>;
};

export default ComplianceAlerts;