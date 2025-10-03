"use client";

import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
  // ✨ ADDED: Price property to the type definition
  final_price: number;
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
        .select(
          "id, anomaly_score, num_tickets, review_status, created_at, anomaly_label_id, total_amount"
        )
        .eq("fraud_flag", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching anomalies:", error.message);
      } else if (data) {
        const mapped: Anomaly[] = data.map((row: any) => ({
          id: row.id,
          title: row.anomaly_label_id
            ? `Pattern: ${row.anomaly_label_id}`
            : "Unusual Transaction Pattern",
          description: "Automatically flagged by anomaly detection system",
          severity:
            row.anomaly_score > 0.8
              ? "High"
              : row.anomaly_score > 0.5
              ? "Medium"
              : "Low",
          status:
            (row.review_status as "active" | "investigating" | "resolved") ||
            "active",
          detected_at: new Date(row.created_at).toLocaleString("en-GB", {
            timeZone: "Asia/Jakarta",
          }),
          affected_tickets: row.num_tickets ?? 0,
          confidence: row.anomaly_score ? Math.round(row.anomaly_score) : 0,
          final_price: row.total_amount ?? 0,
        }));

        setAnomalies(mapped);
      }

      setLoading(false);
    }

    fetchAnomalies();
  }, [supabase]);

  const activeCount = anomalies.filter((a) => a.status === "active").length;
  const investigatingCount = anomalies.filter(
    (a) => a.status === "investigating"
  ).length;
  const resolvedCount = anomalies.filter((a) => a.status === "resolved").length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-auto p-6 lg:p-8 space-y-6">
        {/* Header and Stats Cards (No changes here) */}
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
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-red-500/10 p-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
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
          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-yellow-500/10 p-3">
                <Clock className="h-6 w-6 text-yellow-500" />
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
          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolved
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  {resolvedCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Anomalies Log Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Detected Anomalies Log</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">
                Loading anomalies...
              </p>
            ) : anomalies.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No anomalies detected.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="p-4 text-left font-medium">Transaction</th>
                      <th className="p-4 text-left font-medium">Detected At</th>
                      <th className="p-4 text-center font-medium">Tickets</th>
                      {/* ✨ ADDED: Price column header */}
                      <th className="p-4 text-right font-medium">Price</th>
                      <th className="p-4 text-center font-medium">Severity</th>
                      <th className="p-4 text-center font-medium">Status</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {anomalies.map((anomaly) => (
                      <motion.tr
                        key={anomaly.id}
                        variants={itemVariants}
                        className="border-b transition-colors hover:bg-muted/30"
                      >
                        <td className="p-4 text-left">
                          <div className="font-medium text-foreground">
                            {anomaly.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {anomaly.id}
                          </div>
                        </td>
                        <td className="p-4 text-left text-muted-foreground">
                          {anomaly.detected_at}
                        </td>
                        <td className="p-4 text-center font-medium text-foreground">
                          {anomaly.affected_tickets}
                        </td>
                        {/* ✨ ADDED: Price column data, formatted as IDR */}
                        <td className="p-4 text-right font-medium text-foreground">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(anomaly.final_price)}
                        </td>
                        <td className="p-4 text-center">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-semibold capitalize",
                              anomaly.severity === "High" &&
                                "border-destructive/50 text-destructive",
                              anomaly.severity === "Medium" &&
                                "border-yellow-500/50 text-yellow-600",
                              anomaly.severity === "Low" &&
                                "border-blue-500/50 text-blue-600"
                            )}
                          >
                            {anomaly.severity} ({anomaly.confidence}%)
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge
                            className={cn(
                              "w-32 justify-center capitalize",
                              anomaly.status === "active" &&
                                "bg-destructive text-destructive-foreground hover:bg-destructive/80",
                              anomaly.status === "investigating" &&
                                "bg-yellow-500 text-yellow-900 hover:bg-yellow-500/80",
                              anomaly.status === "resolved" &&
                                "bg-green-600 text-green-50 hover:bg-green-600/80"
                            )}
                          >
                            {anomaly.status === "active" && (
                              <XCircle className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            {anomaly.status === "investigating" && (
                              <Clock className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            {anomaly.status === "resolved" && (
                              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            {anomaly.status}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}