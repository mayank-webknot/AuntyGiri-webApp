import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, TrendingUp, TrendingDown, Minus, Lightbulb, AlertTriangle, Target, Clock } from 'lucide-react';
import { useGetActivityPredictionsQuery } from '@/store/api/dashboardApi';
import { format } from 'date-fns';

const BehavioralAnalysis = () => {
  const { data, isLoading, error } = useGetActivityPredictionsQuery();

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 px-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load behavioral analysis. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const analysis = data?.data;

  if (!analysis) {
    return (
      <div className="container py-8 px-4">
        <Alert>
          <AlertDescription>
            No behavioral analysis data available.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-yellow-500" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-500';
      case 'decreasing':
        return 'text-red-500';
      case 'stable':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const confidencePercentage = Math.round(analysis.ai_analysis.confidence_score * 100);

  return (
    <div className="container py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Behavioral Analysis</h1>
        </div>
        <p className="text-muted-foreground">
          AI-powered insights and predictions based on your activity patterns
        </p>
      </div>

      {/* User Profile & Summary */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-2xl font-bold">{analysis.user_profile.username}</p>
                <p className="text-sm text-muted-foreground">
                  Standard {analysis.user_profile.student_standard} • {analysis.user_profile.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{analysis.activity_summary.total_activities.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Over {analysis.activity_summary.time_range.daysTracked} days tracked
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{analysis.activity_summary.total_time_hours} hrs</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(analysis.activity_summary.time_range.start), 'MMM d')} - {format(new Date(analysis.activity_summary.time_range.end), 'MMM d, yyyy')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Productivity Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Productivity Trend</CardTitle>
                <CardDescription>Overall productivity direction</CardDescription>
              </div>
              {getTrendIcon(analysis.ai_analysis.productivity_trend)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold capitalize ${getTrendColor(analysis.ai_analysis.productivity_trend)}`}>
                  {analysis.ai_analysis.productivity_trend}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confidence Score</span>
                  <span className="font-medium">{confidencePercentage}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all" 
                    style={{ width: `${confidencePercentage}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <h4 className="text-sm font-medium">Category Breakdown</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Productive</span>
                    <span className="font-medium text-green-600">{analysis.activity_summary.category_breakdown.productive_hours} hrs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Neutral</span>
                    <span className="font-medium text-yellow-600">{analysis.activity_summary.category_breakdown.neutral_hours} hrs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Distracting</span>
                    <span className="font-medium text-red-600">{analysis.activity_summary.category_breakdown.distracting_hours} hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Apps */}
        <Card>
          <CardHeader>
            <CardTitle>Top Applications</CardTitle>
            <CardDescription>Most frequently used apps</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {analysis.activity_summary.top_apps.map((app, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{app.app}</p>
                      <p className="text-sm text-muted-foreground">{app.sessions} sessions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{app.usageHours} hrs</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Predictions - Next Week */}
        <Card className="border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/20 dark:to-background">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base">Predictions - Next Week</CardTitle>
                <CardDescription className="text-xs">AI-powered behavior forecasts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.ai_analysis.predictions.next_week.map((prediction, index) => (
                <li key={index} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-blue-500 dark:text-blue-400 mt-0.5 text-lg leading-none">•</span>
                  <span className="flex-1">{prediction}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Predictions - Next Month */}
        <Card className="border-purple-100 dark:border-purple-900 bg-gradient-to-br from-purple-50/50 to-background dark:from-purple-950/20 dark:to-background">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-base">Predictions - Next Month</CardTitle>
                <CardDescription className="text-xs">Long-term projections</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.ai_analysis.predictions.next_month.map((prediction, index) => (
                <li key={index} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-purple-500 dark:text-purple-400 mt-0.5 text-lg leading-none">•</span>
                  <span className="flex-1">{prediction}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Behavioral Patterns */}
        <Card className="border-amber-100 dark:border-amber-900 bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20 dark:to-background">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Behavioral Patterns</CardTitle>
            <CardDescription className="text-xs">Observed activity patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.ai_analysis.behavioral_patterns.map((pattern, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800 px-3 py-1 text-xs font-medium"
                >
                  {pattern}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-green-100 dark:border-green-900 bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/20 dark:to-background">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <Lightbulb className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-base">Recommendations</CardTitle>
                <CardDescription className="text-xs">AI suggestions for improvement</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.ai_analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-green-500 dark:text-green-400 mt-0.5 text-base leading-none">✓</span>
                  <span className="flex-1">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Concerns Section - Only show if there are concerns */}
      {analysis.ai_analysis.concerns.length > 0 && (
        <Card className="mt-6 border-orange-200 dark:border-orange-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <CardTitle className="text-orange-600 dark:text-orange-400">Areas of Concern</CardTitle>
                <CardDescription>Potential issues requiring attention</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.ai_analysis.concerns.map((concern, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-orange-500 mt-1">⚠</span>
                  <span className="text-sm">{concern}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Analysis Info Footer */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Analysis generated on {format(new Date(analysis.ai_analysis.analysis_date), 'MMMM d, yyyy \'at\' h:mm a')}
      </div>
    </div>
  );
};

export default BehavioralAnalysis;
