import * as XLSX from 'xlsx';
import { InquiryCustomer, Booking } from '../types/travel-bot';

export function exportInquiriesToExcel(inquiries: InquiryCustomer[]): void {
  const data = inquiries.map((inq) => ({
    'Lead ID': inq.id,
    'Customer Name': inq.name,
    'Phone Number': inq.phone,
    'Lead Source': inq.leadSource,
    'Meta Ad Campaign': inq.adCampaign || 'N/A',
    'Ad ID': inq.adId || 'N/A',
    'Target Destination': inq.targetDestination || 'General Inquiry',
    'Preferred Travel Dates': inq.travelDates || 'Flexible',
    'Pax Count': inq.pax || 1,
    'Budget Range': inq.budgetRange || 'Standard',
    'Lead Status': inq.status,
    'Bot Auto-Reply': inq.botStatus,
    'After-Hours Inquiry': inq.isAfterHours ? 'YES' : 'NO',
    'Assigned Travel Agent': inq.assignedAgent,
    'Internal Notes': inq.notes,
    'Total Messages Exchanged': inq.messages.length,
    'Active Booking Ref': inq.bookingRef || 'None',
    'Exported At': new Date().toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Travel Leads & Inquiries');

  // Auto-size columns
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length + 4, 16),
  }));
  worksheet['!cols'] = colWidths;

  const fileName = `VoyageCraft_WhatsApp_Leads_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export function exportBookingsToExcel(bookings: Booking[]): void {
  const data = bookings.map((b) => ({
    'Booking Ref (PNR)': b.id,
    'Customer Name': b.customerName,
    'Phone Number': b.customerPhone,
    'Tour Package': b.packageName,
    'Departure Date': b.departureDate,
    'Return Date': b.returnDate,
    'Travelers (Pax)': b.paxCount,
    'Total Price (USD)': b.totalPrice,
    'Paid Amount (USD)': b.paidAmount,
    'Balance Due (USD)': b.totalPrice - b.paidAmount,
    'Payment Status': b.paymentStatus,
    'Booking Status': b.bookingStatus,
    'Flight Confirmed': b.flightConfirmed ? 'Confirmed' : 'Pending',
    'Hotel Voucher Issued': b.hotelVoucherIssued ? 'Issued' : 'Pending',
    'Booking Notes': b.notes || '',
    'Export Date': new Date().toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Confirmed Bookings');

  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length + 4, 18),
  }));
  worksheet['!cols'] = colWidths;

  const fileName = `VoyageCraft_Tour_Bookings_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export function exportInquiriesToCSV(inquiries: InquiryCustomer[]): void {
  const headers = [
    'Lead ID',
    'Customer Name',
    'Phone',
    'Source',
    'Campaign',
    'Destination',
    'Travel Dates',
    'Pax',
    'Status',
    'Bot Status',
    'After Hours',
    'Agent',
    'Notes',
  ];

  const rows = inquiries.map((inq) => [
    inq.id,
    `"${(inq.name || '').replace(/"/g, '""')}"`,
    `"${inq.phone || ''}"`,
    `"${inq.leadSource || ''}"`,
    `"${(inq.adCampaign || '').replace(/"/g, '""')}"`,
    `"${(inq.targetDestination || '').replace(/"/g, '""')}"`,
    `"${(inq.travelDates || '').replace(/"/g, '""')}"`,
    inq.pax || 1,
    `"${inq.status}"`,
    `"${inq.botStatus}"`,
    inq.isAfterHours ? 'Yes' : 'No',
    `"${(inq.assignedAgent || '').replace(/"/g, '""')}"`,
    `"${(inq.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `VoyageCraft_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
