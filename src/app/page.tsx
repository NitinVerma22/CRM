"use client";
import UploadData from "./components/UploadData";
import StartCalling from "./components/StartCalling";
import Reports from "./components/Reports";
import DailyAuth from "./components/DailyAuth";
import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("upload");

  const tabs = [
    {
      id: "upload",
      name: "Upload",
      icon: "📁",
      description: "Import leads"
    },
    {
      id: "call",
      name: "Calling",
      icon: "📞",
      description: "Make calls"
    },
    {
      id: "reports",
      name: "Reports",
      icon: "📊",
      description: "Analytics"
    }
  ];

  return (
    <DailyAuth>
      <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
        <div className="flex-1 flex flex-col px-2 py-1 sm:px-4 sm:py-4">
          {/* Compact Header - Mobile Only */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-3 mb-2 sm:mb-4">
            <div className="flex items-center justify-between">
              {/* Left: Logo and Text */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">📞</span>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">
                  Call Manager
                </h1>
              </div>
              
              {/* Right: Menu/Profile */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">⚙️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation Tabs */}
          <div className="mb-2 sm:mb-4">
            <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-xl shadow-lg border border-white/20 p-1">
              <div className="grid grid-cols-3 gap-1">
                {tabs.map((tabItem) => (
                  <button
                    key={tabItem.id}
                    onClick={() => setTab(tabItem.id)}
                    className={`relative p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                      tab === tabItem.id 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-lg sm:text-xl">{tabItem.icon}</span>
                      <div className="text-xs font-semibold text-center">
                        {tabItem.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Takes remaining space */}
          <div className="flex-1 bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 rounded-xl shadow-lg border border-white/20 p-3 sm:p-4 overflow-hidden">
            {tab === "upload" && <UploadData />}
            {tab === "call" && <StartCalling />}
            {tab === "reports" && <Reports />}
          </div>
        </div>
      </div>
    </DailyAuth>
  );
}
