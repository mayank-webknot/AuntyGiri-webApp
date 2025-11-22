import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: LucideIcon;
  description?: string;
  colorClass?: string;
}

export const MetricCard = ({
  title,
  value,
  trend,
  icon: Icon,
  description,
  colorClass = 'text-primary',
}: MetricCardProps) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn('rounded-lg bg-primary/10 p-2', colorClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
        {trend !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            {isPositive ? (
              <ArrowUp className="h-4 w-4 text-success" />
            ) : isNegative ? (
              <ArrowDown className="h-4 w-4 text-destructive" />
            ) : null}
            <span
              className={cn(
                'text-sm font-medium',
                isPositive && 'text-success',
                isNegative && 'text-destructive',
                !isPositive && !isNegative && 'text-muted-foreground'
              )}
            >
              {Math.abs(trend)}% vs last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
