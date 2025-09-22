"use client";
import React, { useEffect, useState } from "react";
import { getNextLead, updateLead } from "../../lib/api";

type Lead = {
  businessName: string;
  address: string;
  phone: string;
};

type CallStatus = "Order Confirmed" | "Not Interested" | "Baat Nahi Ho Payi" | "Call Again" | "Busy";

export default function StartCalling() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus | "">("");
  const [notes, setNotes] = useState("");
  const [callCount, setCallCount] = useState(0);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const fetchNext = async () => {
    setLoading(true);
    try {
      const res = await getNextLead();
      if (res.ok && res.lead) {
        setLead(res.lead);
        setCallCount(res.lead.callCount || 0);
        setCallStatus("");
        setNotes("");
      } else {
        setLead(null);
      }
    } catch (error) {
      console.error("Error fetching lead:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNext();
  }, []);

  const onAfterCall = async (statusOption: CallStatus) => {
    if (!lead) return;

    try {
      await updateLead({
        phone: lead.phone,
        status: statusOption,
        notes: notes,
        incrementCall: true,
        updateLastCalled: true
      });
      setShowStatusModal(false);
      await fetchNext();
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleSubmit = () => {
    setShowStatusModal(true);
  };

  const handleCall = () => {
    if (lead?.phone) {
      window.open(`tel:${lead.phone}`, '_self');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-sm text-slate-600 dark:text-slate-300">Loading...</span>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center h-full flex flex-col justify-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No More Leads
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Upload more leads to continue calling.
        </p>
      </div>
    );
  }

  // format phone for tel:
  const tel = lead.phone ? `+${lead.phone}` : "";

  return (
    <div className="h-full flex flex-col">
      {/* Expanded Lead Info */}
      <div className="flex-1 bg-slate-50/50 dark:bg-slate-700/50 rounded-lg p-4 mb-4">
        <div className="h-full flex flex-col justify-center space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Business Name:</span>
            <span className="font-bold text-base text-slate-900 dark:text-white text-right ml-3 flex-1">
              {lead.businessName}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone Number:</span>
            <span className="font-bold text-base text-slate-900 dark:text-white">
              {lead.phone}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Call Count:</span>
            <span className="font-bold text-base text-blue-600 dark:text-blue-400">
              #{callCount + 1}
            </span>
          </div>
          <div className="flex justify-between items-start py-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Address:</span>
            <span className="text-sm text-slate-900 dark:text-white text-right ml-3 flex-1 leading-relaxed">
              {lead.address}
            </span>
          </div>
          
          {/* Notes Section */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Call Notes:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this call..."
              className="w-full px-3 py-3 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Call Actions - Stick to bottom */}
      <div className="grid grid-cols-3 gap-3 pb-2">
        <button
          onClick={handleCall}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:from-green-600 hover:to-green-700 transition-all active:scale-95 flex flex-col items-center gap-1"
        >
          <span className="text-xl">📞</span>
          <span className="text-sm">Call Now</span>
        </button>

        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95 flex flex-col items-center gap-1"
        >
          <span className="text-xl">✅</span>
          <span className="text-sm">Submit</span>
        </button>

        <button
          onClick={fetchNext}
          className="bg-gradient-to-r from-slate-500 to-slate-600 text-white py-4 rounded-xl font-bold shadow-lg hover:from-slate-600 hover:to-slate-700 transition-all active:scale-95 flex flex-col items-center gap-1"
        >
          <span className="text-xl">⏭️</span>
          <span className="text-sm">Skip</span>
        </button>
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 z-50">
          <div className="bg-white/95 backdrop-blur-sm dark:bg-slate-800/95 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-white/20 p-4 w-full max-w-sm animate-slide-up">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Call Status
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAfterCall("Order Confirmed")}
                className="bg-green-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-600 transition-all active:scale-95 flex flex-col items-center gap-1"
              >
                <span>✅</span>
                <span className="text-xs">Confirmed</span>
              </button>

              <button
                onClick={() => onAfterCall("Not Interested")}
                className="bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-all active:scale-95 flex flex-col items-center gap-1"
              >
                <span>❌</span>
                <span className="text-xs">Not Interested</span>
              </button>

              <button
                onClick={() => onAfterCall("Baat Nahi Ho Payi")}
                className="bg-orange-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-all active:scale-95 flex flex-col items-center gap-1"
              >
                <span>💬</span>
                <span className="text-xs">No Talk</span>
              </button>

              <button
                onClick={() => onAfterCall("Call Again")}
                className="bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition-all active:scale-95 flex flex-col items-center gap-1"
              >
                <span>🔄</span>
                <span className="text-xs">Call Again</span>
              </button>

              <button
                onClick={() => onAfterCall("Busy")}
                className="bg-yellow-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-yellow-600 transition-all active:scale-95 flex flex-col items-center gap-1"
              >
                <span>⏰</span>
                <span className="text-xs">Busy</span>
              </button>

              <button
                onClick={() => setShowStatusModal(false)}
                className="bg-slate-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-slate-600 transition-all active:scale-95 flex flex-col items-center gap-1"
              >
                <span>❌</span>
                <span className="text-xs">Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
