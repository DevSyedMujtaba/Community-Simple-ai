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

/**
 * Compliance Alerts Component
 * Displays flagged compliance rules and important notifications
 * Categories include pets, parking, noise, and architectural changes
 */
const ComplianceAlerts = () => {
  // Sample compliance alerts data
  const alerts: ComplianceAlert[] = [{
    id: '1',
    type: 'warning',
    title: 'Pet Registration Required',
    description: 'All pets must be registered with the HOA office within 10 days of moving in. Failure to register may result in fines.',
    category: 'Pets',
    date: '2024-01-15',
    action: 'Register your pets at the management office'
  }, {
    id: '2',
    type: 'info',
    title: 'Guest Parking Restrictions',
    description: 'Guest parking is limited to 72 consecutive hours. Vehicles parked longer may be towed at owner expense.',
    category: 'Parking',
    date: '2024-01-14',
    action: 'Notify guests of parking time limits'
  }, {
    id: '3',
    type: 'pending',
    title: 'Quiet Hours in Effect',
    description: 'Quiet hours are 10 PM to 7 AM on weekdays, 11 PM to 8 AM on weekends. Please be considerate of your neighbors.',
    category: 'Noise',
    date: '2024-01-13'
  }, {
    id: '4',
    type: 'warning',
    title: 'Architectural Approval Required',
    description: 'Any exterior modifications including paint colors, landscaping changes, or installations require board approval.',
    category: 'Architecture',
    date: '2024-01-12',
    action: 'Submit architectural request form before making changes'
  }, {
    id: '5',
    type: 'success',
    title: 'Community Pool Hours Extended',
    description: 'Pool hours have been extended to 10 PM during summer months (June-August). Regular hours 6 AM to 8 PM apply year-round.',
    category: 'Amenities',
    date: '2024-01-10'
  }, {
    id: '6',
    type: 'info',
    title: 'Monthly HOA Dues Reminder',
    description: 'Monthly dues are due by the 1st of each month. Late fees apply after the 15th. Set up autopay to avoid late charges.',
    category: 'Fees',
    date: '2024-01-08',
    action: 'Set up automatic payments online'
  }];

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
  return <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600">Warnings</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <div className="text-sm text-gray-600">Info</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">1</div>
            <div className="text-sm text-gray-600">Updates</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">1</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts by Category */}
      <div className="space-y-6">
        {Object.entries(alertsByCategory).map(([category, categoryAlerts]) => <div key={category}>
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
                          
                          <p className="text-sm text-gray-700 mb-3">
                            {alert.description}
                          </p>
                          
                          {alert.action && <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Action Required:
                              </p>
                              <p className="text-sm text-gray-700">{alert.action}</p>
                            </div>}
                          
                          <div className="mt-3 text-xs text-gray-500">
                            {new Date(alert.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>;
          })}
            </div>
          </div>)}
      </div>

      {/* Quick Actions */}
      
    </div>;
};
export default ComplianceAlerts;