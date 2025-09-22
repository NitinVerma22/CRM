"use client";
import React, { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { uploadLeads } from "../../lib/api";

export default function UploadData() {
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const processFile = async (file: File) => {
    if (!file) return;

    setFileName(file.name);
    setStatus("Parsing file...");
    setIsLoading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // assume columns: Business Name | Address | Phone Number
      const json: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      const rows = json.slice(1); // skip header row

      // map to objects
      const leads = rows.map(r => {
        return {
          "Business Name": r[0] || "",
          "Address": r[1] || "",
          "Phone Number": r[2] || ""
        };
      }).filter(l => (l["Phone Number"] || "").toString().trim() !== "");

      setStatus(`Uploading ${leads.length} leads...`);
      await uploadLeads(leads);
      setStatus(`✅ Successfully uploaded ${leads.length} leads!`);
    } catch (error) {
      setStatus("❌ Error processing file. Please check the format.");
      console.error("File processing error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          📁 Upload Lead Data
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Upload your Excel or CSV file containing leads to get started
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFile}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />

        <div className="space-y-4">
          <div className="text-6xl mb-4">📄</div>
          <div>
            <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              {isDragOver ? 'Drop your file here' : 'Drag & drop your file here'}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              or <span className="text-blue-600 dark:text-blue-400 font-medium">browse files</span>
            </p>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p>Supported formats: Excel (.xlsx, .xls) and CSV files</p>
            <p>Expected columns: Business Name, Address, Phone Number</p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {(fileName || status) && (
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          {fileName && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-2">
              <span>📎</span>
              <span>Selected: <strong>{fileName}</strong></span>
            </div>
          )}
          {status && (
            <div className="flex items-center gap-2 text-sm">
              {isLoading && <div className="spinner"></div>}
              <span>{status}</span>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📋 Instructions:</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Ensure your file has columns: Business Name, Address, Phone Number</li>
          <li>• Phone numbers should be in a consistent format</li>
          <li>• The first row should contain column headers</li>
          <li>• Empty phone numbers will be automatically filtered out</li>
        </ul>
      </div>
    </div>
  );
}
