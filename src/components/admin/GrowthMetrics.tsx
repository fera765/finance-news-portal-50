
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricProps {
  title: string;
  value: number;
  previousValue: number;
  description: string;
}

const Metric = ({ title, value, previousValue, description }: MetricProps) => {
  const growthPercentage = previousValue > 0 
    ? Math.round(((value - previousValue) / previousValue) * 100) 
    : 0;
  
  const isPositive = growthPercentage >= 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
            {Math.abs(growthPercentage)}%
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

interface GrowthMetricsProps {
  articlesCount: number;
  previousArticlesCount: number;
  usersCount: number;
  previousUsersCount: number;
  viewsCount: number;
  previousViewsCount: number;
}

const GrowthMetrics = ({
  articlesCount,
  previousArticlesCount,
  usersCount,
  previousUsersCount,
  viewsCount,
  previousViewsCount
}: GrowthMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Metric 
        title="Total Articles" 
        value={articlesCount}
        previousValue={previousArticlesCount} 
        description="Compared to last month"
      />
      <Metric 
        title="Total Users" 
        value={usersCount}
        previousValue={previousUsersCount} 
        description="Compared to last month"
      />
      <Metric 
        title="Total Views" 
        value={viewsCount}
        previousValue={previousViewsCount} 
        description="Compared to last month"
      />
    </div>
  );
};

export default GrowthMetrics;
