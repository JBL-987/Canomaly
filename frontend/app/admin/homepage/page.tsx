"use client";

import { Header } from "@/components/header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type Ticket = {
  id: string;
  status_id: number;
  created_at: string;
  final_price: number;
};

type Anomaly = {
  id: string;
  type: string;
  severity: "low" | "medium" | "high";
  status: "active" | "investigating" | "resolved";
  created_at: string;
};

// --- MOCKUP DATA (for demo only) ---
const mockAnomalies: Anomaly[] = [
  {
    id: "AN-1001",
    type: "Unusual Ticket Surge",
    severity: "high",
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "AN-1002",
    type: "Suspicious Refunds",
    severity: "medium",
    status: "investigating",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "AN-1003",
    type: "Duplicate Booking",
    severity: "low",
    status: "resolved",
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: "AN-1004",
    type: "Multiple Failed Payments",
    severity: "medium",
    status: "resolved",
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "AN-1005",
    type: "High Value Ticket Anomaly",
    severity: "high",
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export default function DashboardPage() {
  const supabase = createClient();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: ticketsData } = await supabase
        .from("tickets")
        .select("id,status_id,created_at,final_price")
        .order("created_at", { ascending: true });

      const { data: anomaliesData } = await supabase
        .from("anomalies")
        .select("*")
        .order("created_at", { ascending: false });

      if (ticketsData) setTickets(ticketsData);

      // Use mock anomalies if no data
      if (anomaliesData && anomaliesData.length > 0) {
        setAnomalies(anomaliesData);
      } else {
        setAnomalies(mockAnomalies);
      }

      setLoading(false);
    }

    fetchData();

    // Realtime subscriptions
    const ticketsChannel = supabase
      .channel("tickets-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tickets" },
        () => fetchData()
      )
      .subscribe();

    const anomaliesChannel = supabase
      .channel("anomalies-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "anomalies" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ticketsChannel);
      supabase.removeChannel(anomaliesChannel);
    };
  }, [supabase]);

  // ---- Stats ----
  const totalTickets = tickets.length;
  const activeAnomalies = anomalies.filter((a) => a.status === "active").length;
  const resolvedToday = anomalies.filter(
    (a) =>
      a.status === "resolved" &&
      new Date(a.created_at).toDateString() === new Date().toDateString()
  ).length;
  const detectionRate =
    anomalies.length > 0
      ? ((resolvedToday / anomalies.length) * 100).toFixed(1) + "%"
      : "0%";

  // ---- Chart Data ----
  const requestsData = tickets.map((t) => ({
    time: new Date(t.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: t.final_price,
  }));

  const anomalyData = Object.values(
    anomalies.reduce((acc: any, a) => {
      const hour =
        new Date(a.created_at).getHours().toString().padStart(2, "0") + ":00";
      if (!acc[hour]) acc[hour] = { time: hour, detected: 0, resolved: 0 };
      acc[hour].detected += 1;
      if (a.status === "resolved") acc[hour].resolved += 1;
      return acc;
    }, {} as Record<string, { time: string; detected: number; resolved: number }>)
  );

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor train ticket anomalies in real-time
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Tickets"
            value={loading ? "..." : totalTickets.toString()}
            change="+12.5% from last week"
            changeType="positive"
            icon={Activity}
          />
          <StatCard
            title="Active Anomalies"
            value={loading ? "..." : activeAnomalies.toString()}
            change="Realtime data"
            changeType={activeAnomalies > 0 ? "negative" : "positive"}
            icon={AlertTriangle}
          />
          <StatCard
            title="Resolved Today"
            value={loading ? "..." : resolvedToday.toString()}
            change="+ compared to yesterday"
            changeType="positive"
            icon={CheckCircle2}
          />
          <StatCard
            title="Detection Rate"
            value={loading ? "..." : detectionRate}
            change="Auto calculated"
            changeType="positive"
            icon={TrendingUp}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Requests (Realtime)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "Requests", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={requestsData}>
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--chart-1))"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection (Realtime)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  detected: { label: "Detected", color: "hsl(var(--chart-2))" },
                  resolved: { label: "Resolved", color: "hsl(var(--chart-4))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={anomalyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="detected"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-4))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Anomalies */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anomalies.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No anomalies yet
                </p>
              ) : (
                anomalies.slice(0, 5).map((anomaly) => (
                  <div
                    key={anomaly.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          anomaly.severity === "high" && "bg-destructive",
                          anomaly.severity === "medium" && "bg-accent",
                          anomaly.severity === "low" && "bg-chart-4"
                        )}
                      />
                      <div>
                        <p className="font-medium text-card-foreground">
                          {anomaly.type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {anomaly.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-muted-foreground">
                        {new Date(anomaly.created_at).toLocaleString()}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          anomaly.status === "active" &&
                            "bg-destructive/10 text-destructive",
                          anomaly.status === "investigating" &&
                            "bg-accent/10 text-accent-foreground",
                          anomaly.status === "resolved" &&
                            "bg-chart-4/10 text-chart-4"
                        )}
                      >
                        {anomaly.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
