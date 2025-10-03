'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  'Dashboard Overview',
  'Suspicious Transactions',
  'Investigation Panel',
  'Rules & Thresholds',
  'Model & Retrain',
  'Reports / Analytics',
  'Admin Management',
];

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('Dashboard Overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard Overview':
        return <DashboardOverview />;
      case 'Suspicious Transactions':
        return <SuspiciousTransactions />;
      case 'Investigation Panel':
        return <InvestigationPanel />;
      case 'Rules & Thresholds':
        return <RulesThresholds />;
      case 'Model & Retrain':
        return <ModelRetrain />;
      case 'Reports / Analytics':
        return <ReportsAnalytics />;
      case 'Admin Management':
        return <AdminManagement />;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item}
              variant={activeSection === item ? 'default' : 'ghost'}
              onClick={() => setActiveSection(item)}
              className="w-full justify-start"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}

function DashboardOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* KPI cards, line chart, heatmap placeholder */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent>
              <p>Total Transactions: 1234</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p>Flagged: 56</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p>Auto-Cancelled: 23</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p>Anomaly Trend: Increasing</p>
            </CardContent>
          </Card>
        </div>
        {/* Placeholder for charts */}
        <p>Line Chart: Tren per hari</p>
        <p>Mini Heatmap Stasiun</p>
      </CardContent>
    </Card>
  );
}

function SuspiciousTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suspicious Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Table with search, filter */}
        <p>Table for flagged / high anomaly_score transactions</p>
        <p>Include search, filter, sort, view details, mark fraud/clean</p>
      </CardContent>
    </Card>
  );
}

function InvestigationPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investigation Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Detail transaksi & user</p>
        <p>Riwayat transaksi user, IP history, device fingerprint, map view, raw payload</p>
        <p>Tombol manual label & escalate</p>
      </CardContent>
    </Card>
  );
}

function RulesThresholds() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rules & Thresholds</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Set threshold & hybrid rules</p>
        <p>Form: anomaly threshold, weights rule/model, quick toggle</p>
      </CardContent>
    </Card>
  );
}

function ModelRetrain() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model & Retrain</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Lihat performa & retrain</p>
        <p>Grafik Precision@k, F1, tombol retrain dari labeled dataset</p>
      </CardContent>
    </Card>
  );
}

function ReportsAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports / Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Grafis analitik & export</p>
        <p>Trend charts, heatmap, top anomalies per stasiun/payment, tombol export CSV/PDF</p>
      </CardContent>
    </Card>
  );
}

function AdminManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Manage users/admin</p>
        <p>CRUD admin users, role-based access, audit log</p>
      </CardContent>
    </Card>
  );
}
