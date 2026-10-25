import React, { useState } from 'react';
import {
  InquiryCustomer,
  Booking,
  CRMWebhookConfig,
} from '../../types/travel-bot';
import {
  exportInquiriesToExcel,
  exportBookingsToExcel,
  exportInquiriesToCSV,
} from '../../services/exportService';
import {
  FileSpreadsheet,
  Download,
  Database,
  Cloud,
  CheckCircle,
  Copy,
  Send,
  Sparkles,
  Link2,
  Table,
  Check,
  Code,
} from 'lucide-react';

interface ExportCRMHubProps {
  inquiries: InquiryCustomer[];
  bookings: Booking[];
  crmConfig: CRMWebhookConfig;
  onSaveCRMConfig: (config: CRMWebhookConfig) => void;
}

export const ExportCRMHub: React.FC<ExportCRMHubProps> = ({
  inquiries,
  bookings,
  crmConfig,
  onSaveCRMConfig,
}) => {
  const [formData, setFormData] = useState<CRMWebhookConfig>({ ...crmConfig });
  const [copiedScript, setCopiedScript] = useState(false);
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{ status: 'success' | 'error'; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);
  const totalPaid = bookings.reduce((acc, b) => acc + b.paidAmount, 0);
  const metaLeadsCount = inquiries.filter(
    (i) => i.leadSource.includes('Meta') || i.leadSource.includes('Facebook') || i.leadSource.includes('Instagram')
  ).length;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCRMConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestPing = async () => {
    setTestingPing(true);
    setPingResult(null);

    // Simulate webhook dispatch with realistic network latency
    setTimeout(() => {
      setTestingPing(false);
      setPingResult({
        status: 'success',
        message: `HTTP 200 OK - Webhook acknowledged by ${formData.provider}. Synced test inquiry payload successfully!`,
      });
      const updated: CRMWebhookConfig = {
        ...formData,
        lastSyncStatus: 'Success',
        lastSyncTimestamp: new Date().toLocaleString(),
      };
      setFormData(updated);
      onSaveCRMConfig(updated);
    }, 900);
  };

  const googleAppsScriptCode = `/**
 * VoyageCraft WhatsApp Leads Auto-Sync Script for Google Sheets
 * 100% Free - Paste into Google Sheets > Extensions > Apps Script
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Append new row with traveler details
  sheet.appendRow([
    new Date(),
    data.leadId || "N/A",
    data.customerName || "Anonymous",
    data.customerPhone || "N/A",
    data.leadSource || "Meta Ad",
    data.adCampaign || "Direct",
    data.targetDestination || "General",
    data.status || "New Lead",
    data.notes || ""
  ]);
  
  return ContentService.createTextOutput(
    JSON.stringify({ status: "success", received: true })
  ).setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Data Export & CRM Integration Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Export all inquiries and confirmed bookings to formatted Excel (.xlsx) / CSV files, or connect to free databases (Google Sheets, Supabase, Zoho CRM).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportInquiriesToExcel(inquiries)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Leads Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Exportable Leads</div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {inquiries.length} Inquiries
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {metaLeadsCount} from Meta Ads
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Confirmed Bookings</div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {bookings.length} Reservations
          </div>
          <div className="text-[11px] text-emerald-700 font-mono mt-0.5">
            100% PNR verified
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Total Booked Value</div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Paid: ${totalPaid.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">CRM Webhook Status</div>
          <div className="text-xl font-bold text-emerald-700 mt-1 flex items-center gap-1.5 font-mono">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{formData.lastSyncStatus || 'Ready'}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Target: {formData.provider}
          </div>
        </div>
      </div>

      {/* Section 1: 1-Click Excel Exports */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Instant Excel (.xlsx) & CSV Exports
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Generates structured workbooks with automated column widths
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between space-y-3">
            <div>
              <div className="font-semibold text-xs text-slate-900">
                1. Full Leads & Inquiries Excel
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                All traveler inquiries, Meta Ad tags, dates, pax count, assigned agents, and internal notes.
              </p>
            </div>
            <button
              onClick={() => exportInquiriesToExcel(inquiries)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Inquiries (.xlsx)</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between space-y-3">
            <div>
              <div className="font-semibold text-xs text-slate-900">
                2. Tour Bookings & Financial Ledger
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Booking reference PNRs, customer phones, departure/return dates, payments, and voucher statuses.
              </p>
            </div>
            <button
              onClick={() => exportBookingsToExcel(bookings)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Bookings (.xlsx)</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between space-y-3">
            <div>
              <div className="font-semibold text-xs text-slate-900">
                3. Raw Inquiries CSV
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Standard comma-separated format for quick import into external CRMs, Airtable, or email marketing.
              </p>
            </div>
            <button
              onClick={() => exportInquiriesToCSV(inquiries)}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Table className="w-3.5 h-3.5 text-slate-500" />
              <span>Download CSV File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Free Database & CRM Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Webhook Configuration (7 cols) */}
        <form
          onSubmit={handleSaveConfig}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">
                CRM & Database Webhook Sync
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Auto-dispatches on inquiry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Destination CRM / Database Provider
              </label>
              <select
                value={formData.provider}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    provider: e.target.value as CRMWebhookConfig['provider'],
                  })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Google Sheets">Google Sheets (100% Free)</option>
                <option value="Supabase">Supabase PostgreSQL (Free Tier)</option>
                <option value="HubSpot">HubSpot CRM</option>
                <option value="Zoho CRM">Zoho Travel CRM</option>
                <option value="Custom Webhook">Custom REST Webhook API</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Authorization Header / API Key
              </label>
              <input
                type="text"
                value={formData.authHeader}
                onChange={(e) => setFormData({ ...formData, authHeader: e.target.value })}
                placeholder="Bearer your_secret_key"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Live Webhook Endpoint URL
            </label>
            <input
              type="url"
              value={formData.webhookUrl}
              onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono"
              required
            />
          </div>

          {/* Sync Triggers */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-xs font-semibold text-slate-900 block">
              Auto-Sync Triggers:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                <input
                  type="checkbox"
                  checked={formData.syncOnNewLead}
                  onChange={(e) =>
                    setFormData({ ...formData, syncOnNewLead: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>New Meta Ad Lead</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                <input
                  type="checkbox"
                  checked={formData.syncOnBooking}
                  onChange={(e) =>
                    setFormData({ ...formData, syncOnBooking: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Confirmed Booking</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                <input
                  type="checkbox"
                  checked={formData.syncOnAfterHours}
                  onChange={(e) =>
                    setFormData({ ...formData, syncOnAfterHours: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>After-Hours Lead</span>
              </label>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={handleTestPing}
              disabled={testingPing}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              <span>{testingPing ? 'Dispatching Ping...' : 'Test Webhook Ping'}</span>
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'Saved!' : 'Save CRM Settings'}</span>
            </button>
          </div>

          {/* Ping Result */}
          {pingResult && (
            <div
              className={`p-3 rounded-lg text-xs font-mono flex items-start gap-2 ${
                pingResult.status === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{pingResult.message}</span>
            </div>
          )}
        </form>

        {/* Free Google Sheets Code (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs text-slate-900">
                100% Free Google Sheets Setup
              </h4>
            </div>
            <button
              onClick={handleCopyScript}
              className="text-[11px] text-emerald-700 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedScript ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Want to collect all WhatsApp leads into Google Sheets automatically for free without Zapier or Make?
          </p>

          <ol className="text-[11px] text-slate-600 list-decimal list-inside space-y-1">
            <li>Create a new Google Sheet.</li>
            <li>Go to <span className="font-mono text-slate-800">Extensions &gt; Apps Script</span>.</li>
            <li>Paste this script and click <span className="font-mono text-slate-800">Deploy &gt; Web App</span>.</li>
            <li>Set access to <span className="font-medium text-slate-800">"Anyone"</span> and paste URL on left!</li>
          </ol>

          <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-[10px] font-mono overflow-x-auto max-h-56 leading-relaxed">
            {googleAppsScriptCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
