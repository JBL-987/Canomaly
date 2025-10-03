"use client";

import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Database,
  Eye,
  Lock,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-4 w-4" />
              <span>AI-Powered Anomaly Detection</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-balance md:text-7xl">
              The fastest platform for{" "}
              <span className="text-primary">train ticket</span> anomaly
              detection
            </h1>
            <p className="mb-8 text-xl text-muted-foreground text-balance md:text-2xl">
              Detect fraudulent transactions and anomalies in real-time with
              industry-leading AI models and comprehensive monitoring tools.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="min-w-[200px]" asChild>
                <Link href="/admin/homepage/1">
                  Start Monitoring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] bg-transparent"
                asChild
              >
                <Link href="#platform">View Platform</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by leading railway operators
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex items-center justify-center text-2xl font-bold text-muted-foreground/60">
              RailCorp
            </div>
            <div className="flex items-center justify-center text-2xl font-bold text-muted-foreground/60">
              MetroLink
            </div>
            <div className="flex items-center justify-center text-2xl font-bold text-muted-foreground/60">
              TransitHub
            </div>
            <div className="flex items-center justify-center text-2xl font-bold text-muted-foreground/60">
              ExpressRail
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
            <div className="flex flex-col items-center justify-center p-8">
              <div className="mb-2 text-4xl font-bold text-balance">99.8%</div>
              <div className="mb-1 text-sm text-muted-foreground text-balance">
                Detection accuracy
              </div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-foreground/60">
                RailCorp
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-8">
              <div className="mb-2 text-4xl font-bold text-balance">
                &lt;100ms
              </div>
              <div className="mb-1 text-sm text-muted-foreground text-balance">
                Response time
              </div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-foreground/60">
                MetroLink
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-8">
              <div className="mb-2 text-4xl font-bold text-balance">85%</div>
              <div className="mb-1 text-sm text-muted-foreground text-balance">
                Fraud reduction
              </div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-foreground/60">
                TransitHub
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-8">
              <div className="mb-2 text-4xl font-bold text-balance">24/7</div>
              <div className="mb-1 text-sm text-muted-foreground text-balance">
                Real-time monitoring
              </div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-foreground/60">
                ExpressRail
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-balance md:text-5xl">
              Comprehensive anomaly detection
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
              Powerful AI-driven tools to detect, analyze, and prevent
              fraudulent ticket transactions across your entire railway network.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-balance">
                Real-time Protection
              </h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Monitor every transaction as it happens with advanced AI
                algorithms that detect suspicious patterns instantly.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-balance">
                Anomaly Detection
              </h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Machine learning models trained on millions of transactions to
                identify fraudulent behavior with 99.8% accuracy.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-balance">
                Advanced Analytics
              </h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Comprehensive dashboards with detailed insights into ticket
                sales, anomalies, and fraud patterns.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-balance">
                Instant Alerts
              </h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Get notified immediately when suspicious activity is detected
                with customizable alert thresholds.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-balance">
                Complete Audit Trail
              </h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Full transaction history with detailed logs for compliance and
                forensic analysis.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-balance">
                Enterprise Security
              </h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Bank-level encryption and security protocols to protect
                sensitive transaction data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section
        id="platform"
        className="border-y border-border bg-muted/30 py-24"
      >
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Eye className="h-3 w-3" />
                Platform Overview
              </div>
              <h2 className="mb-6 text-4xl font-bold text-balance md:text-5xl">
                Built for railway operations teams
              </h2>
              <p className="mb-8 text-lg text-muted-foreground text-pretty">
                A unified platform that brings together anomaly detection,
                ticket monitoring, and comprehensive analytics. Empower your
                team to identify and prevent fraud before it impacts your
                operations.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Predictive Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Forecast potential fraud patterns before they occur using
                      historical data and AI predictions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Live Monitoring</h3>
                    <p className="text-sm text-muted-foreground">
                      Track all ticket transactions in real-time with instant
                      anomaly flagging and alerts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Database className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Complete History</h3>
                    <p className="text-sm text-muted-foreground">
                      Access full transaction logs with advanced filtering and
                      export capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                <div className="border-b border-border bg-muted/50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive/60" />
                    <div className="h-3 w-3 rounded-full bg-accent/60" />
                    <div className="h-3 w-3 rounded-full bg-primary/60" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Anomaly Detection</h3>
                    <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                      12 Active Alerts
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        type: "High Risk",
                        desc: "Multiple tickets from same IP",
                        time: "2m ago",
                      },
                      {
                        type: "Medium Risk",
                        desc: "Unusual purchase pattern detected",
                        time: "5m ago",
                      },
                      {
                        type: "High Risk",
                        desc: "Suspicious payment method",
                        time: "8m ago",
                      },
                    ].map((alert, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                          <Bell className="h-4 w-4 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {alert.type}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {alert.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {alert.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-balance md:text-5xl">
              Start protecting your railway operations today
            </h2>
            <p className="mb-8 text-lg text-muted-foreground text-pretty">
              Join leading railway operators using TrainGuard AI to detect and
              prevent fraudulent ticket transactions.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="min-w-[200px]" asChild>
                <Link href="/admin/homepage/1">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] bg-transparent"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">TrainGuard AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 TrainGuard AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
