"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import EnergyChart from '@/components/dashboard/EnergyChart';
import MapWidget from '@/components/dashboard/MapWidget';
import ActivityTable from '@/components/dashboard/ActivityTable';
import { Lightbulb, Wifi, Zap, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  return (
    <MainLayout title="Dashboard Overview">
      <div className="flex flex-col gap-8">
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total"
            value="860"
            description="Light Poles Managed"
            icon={Lightbulb}
            color="blue"
            trend={{ value: "+12 new this month", isUp: true }}
          />
          <StatCard
            title="Network"
            value="842"
            subValue="860"
            description="97.9% System Uptime"
            icon={Wifi}
            color="green"
          />
          <StatCard
            title="Consumption"
            value="142"
            subValue="kW"
            description="8% higher than average"
            icon={Zap}
            color="orange"
            trend={{ value: "8% higher than average", isUp: false }}
          />
          <StatCard
            title="Maintenance"
            value="3"
            description="Requires Attention"
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Middle Section: Chart and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EnergyChart />
          </div>
          <div className="lg:col-span-1">
            <MapWidget />
          </div>
        </div>

        {/* Bottom Section: Activity Table */}
        <ActivityTable />
      </div>
    </MainLayout>
  );
}
