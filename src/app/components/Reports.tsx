"use client";
import React, { useEffect, useState } from "react";
import { getReports, getExportUrl } from "../../lib/api";

type ReportsType = {
  total: number;
  called: number;
  pending: number;
  confirmed: number;
  notInterested: number;
  followUp: number;
  busy: number;
  totalCallAttempts: number;
};

export default function Reports() {
  const [reports, setReports] = useState<ReportsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getReports();
      if (res.ok) setReports(res.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
        <span className="ml-3 text-slate-600 dark:text-slate-300">Loading reports...</span>
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No Reports Available
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          Start uploading leads and making calls to see reports.
        </p>
      </div>
    );
  }

  const conversionRate = reports.total > 0 ? ((reports.confirmed / reports.total) * 100).toFixed(1) : "0";
  const callCompletionRate = reports.total > 0 ? ((reports.called / reports.total) * 100).toFixed(1) : "0";

  const statusData = [
    { name: "Confirmed", value: reports.confirmed, color: "bg-green-500", icon: "✅" },
    { name: "Not Interested", value: reports.notInterested, color: "bg-red-500", icon: "❌" },
    { name: "Follow Up", value: reports.followUp, color: "bg-blue-500", icon: "🔄" },
    { name: "Busy", value: reports.busy, color: "bg-yellow-500", icon: "⏰" },
    { name: "Pending", value: reports.pending, color: "bg-gray-500", icon: "⏳" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          📊 Reports & Analytics
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Track your calling performance and lead conversion
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-3xl mb-2">📞</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {reports.total}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Total Leads</div>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">
            {reports.confirmed}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Confirmed Orders</div>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-blue-600">
            {conversionRate}%
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Conversion Rate</div>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-purple-600">
            {callCompletionRate}%
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Call Completion</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Lead Status Breakdown
          </h3>
        </div>

        <div className="space-y-4">
          {statusData.map((status) => (
            <div key={status.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{status.icon}</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {status.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${status.color}`}
                    style={{
                      width: `${reports.total > 0 ? (status.value / reports.total) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 min-w-[3rem]">
                  {status.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              📊 Call Statistics
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Total Call Attempts:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {reports.totalCallAttempts}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Calls Made:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {reports.called}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Pending Calls:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {reports.pending}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              🎯 Performance Metrics
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Success Rate:</span>
              <span className="font-semibold text-green-600">
                {conversionRate}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Response Rate:</span>
              <span className="font-semibold text-blue-600">
                {callCompletionRate}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Avg. Calls per Lead:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {reports.total > 0 ? (reports.totalCallAttempts / reports.total).toFixed(1) : "0"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="text-center">
        <a
          href={getExportUrl()}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <span>📥</span>
          Export to CSV
        </a>
      </div>
    </div>
  );
}
