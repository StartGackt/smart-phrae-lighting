"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import EnergyChart from '@/components/dashboard/EnergyChart';
import MapWidget from '@/components/dashboard/MapWidget';
import ActivityTable from '@/components/dashboard/ActivityTable';
import { Lightbulb, Wifi, Zap, AlertTriangle } from 'lucide-react';
import { useDevices } from '@/contexts/DeviceContext';

export default function Dashboard() {
  const { controllers, gateways, zones } = useDevices();

  const totalControllers = controllers.length;
  const totalGateways = gateways.length;
  const onlineControllers = controllers.filter(c => c.isOn && c.status !== 'fault').length;
  const faultControllers = controllers.filter(c => c.status === 'fault').length;
  const warningControllers = controllers.filter(c => c.status === 'warning').length;
  const totalPower = controllers.filter(c => c.isOn).reduce((s, c) => s + parseFloat(c.power), 0).toFixed(1);
  const systemUptime = ((totalControllers - faultControllers) / totalControllers * 100).toFixed(1);

  return (
    <MainLayout title="ภาพรวมระบบ (Dashboard)">
      <div className="flex flex-col gap-8">
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="โคมไฟทั้งหมด"
            value={totalControllers.toString()}
            description={`${totalGateways} เกตเวย์ • ${zones.length} โซน`}
            icon={Lightbulb}
            color="blue"
            trend={{ value: `${totalGateways} เกตเวย์หลัก`, isUp: true }}
          />
          <StatCard
            title="ออนไลน์"
            value={onlineControllers.toString()}
            subValue={totalControllers.toString()}
            description={`ความพร้อมใช้งานระบบ ${systemUptime}%`}
            icon={Wifi}
            color="green"
          />
          <StatCard
            title="กำลังไฟ"
            value={totalPower}
            subValue="kW"
            description="ปริมาณการใช้ไฟรวมขณะนี้"
            icon={Zap}
            color="orange"
            trend={{ value: `สว่างอยู่ ${controllers.filter(c => c.isOn).length} ต้น`, isUp: true }}
          />
          <StatCard
            title="แจ้งซ่อม/เฝ้าระวัง"
            value={(faultControllers + warningControllers).toString()}
            description={`${faultControllers} วิกฤต • ${warningControllers} เฝ้าระวัง`}
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
