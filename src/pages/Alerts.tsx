import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Alerts = () => {
  return (
    <div className="container py-8 px-4 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Alerts</h1>
        <p className="text-muted-foreground">
          View and manage all student alerts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alerts Timeline</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent className="flex h-96 items-center justify-center text-muted-foreground">
          Alert management interface will appear here
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
