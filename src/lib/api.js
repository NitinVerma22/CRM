// lib/api.js
// Frontend should call the local Next.js API (proxy), NOT the external Apps Script URL.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export async function uploadLeads(leads) {
  try {
    const url = `${API_BASE}?action=upload`;
    console.log("Making request to:", url);
    console.log("Request payload sample:", { leads: leads.slice(0, 2) }); // debug

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leads }),
    });

    console.log("Response status:", res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Response error:", errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    return {
      ok: false,
      message: `Upload failed: ${error.message}`,
      error: error.message,
    };
  }
}

export async function getNextLead() {
  try {
    const url = `${API_BASE}?action=next`;
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error("Get next lead error:", error);
    return { ok: false, message: "Failed to get next lead" };
  }
}

export async function updateLead(payload) {
  try {
    const url = `${API_BASE}?action=update`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("Update lead error:", error);
    return { ok: false, message: "Update failed" };
  }
}

export async function getReports() {
  try {
    const url = `${API_BASE}?action=reports`;
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error("Get reports error:", error);
    return { ok: false, message: "Failed to get reports" };
  }
}

export function getExportUrl() {
  return `${API_BASE}?action=export`;
}
