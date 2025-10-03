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
import { motion } from "framer-motion";
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

// Type for ticket data, used in the main chart
type Ticket = {
  id: string;
  status_id: number;
  created_at: string;
  final_price: number;
};

// Type for anomaly data, used for stats and recent anomalies list
type Anomaly = {
  id: string;
  type: string;
  severity: "low" | "medium" | "high";
  status: "active" | "investigating" | "resolved";
  created_at: string;
};

export default function DashboardPage() {
  const supabase = createClient();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch ticket data for the main chart
      const { data: ticketsData } = await supabase
        .from("tickets")
        .select("id,status_id,created_at,final_price")
        .order("created_at", { ascending: true });

      if (ticketsData) setTickets(ticketsData);

      // Fetch real-time anomalies from the transactions table where fraud_flag is true
      const { data: anomaliesData, error: anomaliesError } = await supabase
        .from("transactions")
        .select(
          "id, anomaly_score, review_status, created_at, anomaly_label_id"
        )
        .eq("fraud_flag", true)
        .order("created_at", { ascending: false });

      if (anomaliesError) {
        console.error("Error fetching anomalies:", anomaliesError.message);
      } else if (anomaliesData) {
        // Map the raw transaction data to the Anomaly type required by the UI
        const mappedAnomalies: Anomaly[] = anomaliesData.map((row: any) => ({
          id: row.id,
          type: row.anomaly_label_id
            ? `Pattern: ${row.anomaly_label_id}`
            : "Unusual Transaction",
          severity:
            row.anomaly_score > 0.8
              ? "high"
              : row.anomaly_score > 0.5
              ? "medium"
              : "low",
          status:
            (row.review_status as "active" | "investigating" | "resolved") ||
            "active",
          created_at: row.created_at,
        }));
        setAnomalies(mappedAnomalies);
      }

      setLoading(false);
    }

    fetchData();

    // Set up a single real-time channel for both tickets and transactions
    const channel = supabase
      .channel("dashboard-realtime-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tickets" },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // ---- Stat Calculations ----
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

  // ---- Chart Data Preparation ----
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
  ).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-slate-">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Monitor train ticket anomalies in real-time
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {},
          }}
        >
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
        </motion.div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-lg shadow-slate-200/50 dark:shadow-black/50">
            <CardHeader>
              <CardTitle>Ticket Requests (Realtime)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
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
                          stopColor="var(--color-requests)"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-requests)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-slate-200 dark:stroke-slate-800"
                    />
                    <XAxis dataKey="time" className="text-xs fill-slate-500" />
                    <YAxis
                      className="text-xs fill-slate-500"
                      domain={[0, "dataMax + 100000"]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-requests)"
                      fill="url(#colorValue)"
                      strokeWidth={2}
                      className="[--color-requests:theme(colors.blue.500)]"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-slate-200/50 dark:shadow-black/50">
            <CardHeader>
              <CardTitle>Anomaly Detection (Realtime)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={anomalyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-slate-200 dark:stroke-slate-800"
                    />
                    <XAxis dataKey="time" className="text-xs fill-slate-500" />
                    <YAxis
                      className="text-xs fill-slate-500"
                      allowDecimals={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="detected"
                      stroke="var(--color-detected)"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                      className="[--color-detected:theme(colors.red.500)]"
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="var(--color-resolved)"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                      className="[--color-resolved:theme(colors.green.500)]"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Anomalies List */}
        <Card className="shadow-lg shadow-slate-200/50 dark:shadow-black/50">
          <CardHeader>
            <CardTitle>Recent Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-slate-500 text-sm">Loading anomalies...</p>
              ) : anomalies.length === 0 ? (
                <p className="text-slate-500 text-sm py-4 text-center">
                  No anomalies detected yet.
                </p>
              ) : (
                anomalies.slice(0, 5).map((anomaly) => (
                  <div
                    key={anomaly.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          anomaly.severity === "high" && "bg-red-500",
                          anomaly.severity === "medium" && "bg-yellow-500",
                          anomaly.severity === "low" && "bg-blue-500"
                        )}
                      />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {anomaly.type}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          ID: {anomaly.id.split("-")[0]}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                        {new Date(anomaly.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                          anomaly.status === "active" &&
                            "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
                          anomaly.status === "investigating" &&
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
                          anomaly.status === "resolved" &&
                            "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
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