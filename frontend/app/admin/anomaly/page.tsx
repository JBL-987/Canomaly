"use client";

import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type Anomaly = {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  status: "active" | "investigating" | "resolved";
  detected_at: string;
  affected_tickets: number;
  confidence: number;
};

export default function AnomalyDetectionPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAnomalies() {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("fraud_flag", true);

      if (error) {
        console.error("Error fetching anomalies:", error.message);
      } else {
        setAnomalies(data || []);
      }
      setLoading(false);
    }

    fetchAnomalies();
  }, []);

  // Count anomalies by status
  const activeCount = anomalies.filter((a) => a.status === "active").length;
  const investigatingCount = anomalies.filter(
    (a) => a.status === "investigating"
  ).length;
  const resolvedCount = anomalies.filter((a) => a.status === "resolved").length;

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Anomaly Detection
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring and analysis of ticket anomalies
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Last 24 Hours
            </Button>
            <Button>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Run Analysis
            </Button>
          </div>
        </div>

        {/* Status Counters */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Anomalies
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  {activeCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-accent/10 p-3">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Under Investigation
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  {investigatingCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-chart-4/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolved Today
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  {resolvedCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Anomalies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detected Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading anomalies...</p>
            ) : anomalies.length === 0 ? (
              <p className="text-muted-foreground">No anomalies detected.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted-foreground">
                    <th className="p-2">TransactionID</th>
                    <th className="p-2">Severity</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Detected At</th>
                    <th className="p-2">Affected Tickets</th>
                    <th className="p-2">Confidence (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {anomalies.map((anomaly) => (
                    <tr
                      key={anomaly.id}
                      className="border-b border-border hover:bg-accent/5 transition-colors"
                    >
                      <td className="p-2">{anomaly.id}</td>
                      <td className="p-2">{anomaly.title}</td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            anomaly.severity === "high" &&
                              "border-destructive text-destructive",
                            anomaly.severity === "medium" &&
                              "border-accent text-accent-foreground",
                            anomaly.severity === "low" &&
                              "border-chart-4 text-chart-4"
                          )}
                        >
                          {anomaly.severity}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge
                          className={cn(
                            anomaly.status === "active" &&
                              "bg-destructive text-destructive-foreground",
                            anomaly.status === "investigating" &&
                              "bg-accent text-accent-foreground",
                            anomaly.status === "resolved" &&
                              "bg-chart-4 text-background"
                          )}
                        >
                          {anomaly.status === "active" && (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {anomaly.status === "investigating" && (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {anomaly.status === "resolved" && (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          )}
                          {anomaly.status}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {anomaly.detected_at}
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {anomaly.affected_tickets}
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {anomaly.confidence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
