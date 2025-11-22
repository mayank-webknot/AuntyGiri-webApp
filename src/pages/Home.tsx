import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, AlertCircle, LayoutDashboard, ArrowRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      title: 'Dashboard',
      description: 'View comprehensive analytics with real-time metrics, productivity trends, and activity overview',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Students',
      description: 'Monitor all students with live status, productivity scores, and detailed activity tracking',
      icon: Users,
      href: '/students',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Alerts',
      description: 'Manage notifications and warnings with severity-based filtering and real-time updates',
      icon: AlertCircle,
      href: '/alerts',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="text-lg">Analytics Dashboard</span>
          </div>
          <div className="ml-auto">
            <Button variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Real-time Student Analytics
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Teacher & Parent
            <span className="block bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Analytics Dashboard
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor student productivity, track activities, and manage alerts in real-time. 
            Comprehensive analytics to support student success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="text-lg h-12 px-8">
              <Link to="/dashboard">
                Explore Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg h-12 px-8">
              <Link to="/students">View Students</Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-3 mt-20 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Link key={feature.href} to={feature.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base pt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group">
                    Open {feature.title}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid gap-8 md:grid-cols-3 max-w-4xl mx-auto text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">156</div>
            <div className="text-sm text-muted-foreground">Students Monitored</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-success">85%</div>
            <div className="text-sm text-muted-foreground">Average Productivity</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-warning">24/7</div>
            <div className="text-sm text-muted-foreground">Real-time Monitoring</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8 mt-20">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>Analytics Dashboard - Monitor and support student success</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
