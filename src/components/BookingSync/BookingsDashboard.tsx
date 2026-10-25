import React, { useState } from 'react';
import { Booking, TourPackage } from '../../types/travel-bot';
import {
  CalendarCheck,
  Search,
  Plus,
  Plane,
  Hotel,
  DollarSign,
  FileCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface BookingsDashboardProps {
  bookings: Booking[];
  packages: TourPackage[];
  onSaveBookings: (bookings: Booking[]) => void;
  onSavePackages: (packages: TourPackage[]) => void;
}

export const BookingsDashboard: React.FC<BookingsDashboardProps> = ({
  bookings,
  packages,
  onSaveBookings,
  onSavePackages,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  // New Booking form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [packageId, setPackageId] = useState(packages[0]?.id || '');
  const [departureDate, setDepartureDate] = useState('2026-11-20');
  const [returnDate, setReturnDate] = useState('2026-11-25');
  const [paxCount, setPaxCount] = useState(2);
  const [totalPrice, setTotalPrice] = useState(1498);
  const [paidAmount, setPaidAmount] = useState(1498);
  const [bookingStatus, setBookingStatus] = useState<Booking['bookingStatus']>('Confirmed');

  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch =
      b.id.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.customerPhone.toLowerCase().includes(q) ||
      b.packageName.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filterStatus !== 'all' && b.bookingStatus !== filterStatus) return false;
    return true;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = packages.find((p) => p.id === packageId) || packages[0];
    const newRef = `VOY-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: newRef,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      packageId: pkg.id,
      packageName: pkg.title,
      departureDate,
      returnDate,
      paxCount,
      totalPrice,
      paidAmount,
      paymentStatus: paidAmount >= totalPrice ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Pending',
      bookingStatus,
      flightConfirmed: true,
      hotelVoucherIssued: true,
      notes: 'Created via agency management console.',
    };

    onSaveBookings([newBooking, ...bookings]);

    // Deduct available slot from package
    const updatedPackages = packages.map((p) =>
      p.id === pkg.id ? { ...p, availableSlots: Math.max(0, p.availableSlots - paxCount) } : p
    );
    onSavePackages(updatedPackages);

    setShowNewBookingModal(false);
    // Reset form
    setCustomerName('');
    setCustomerPhone('');
  };

  const handleToggleVoucher = (bookingId: string) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, hotelVoucherIssued: !b.hotelVoucherIssued } : b
    );
    onSaveBookings(updated);
  };

  const handleToggleFlight = (bookingId: string) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, flightConfirmed: !b.flightConfirmed } : b
    );
    onSaveBookings(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Central Booking System & Live Reservations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time synchronization with tour seat allocations. WhatsApp bot directly answers traveler status queries by PNR reference.
          </p>
        </div>

        <button
          onClick={() => setShowNewBookingModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Tour Packages Live Catalog (4 items) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            Available Tour Packages & Inventory
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Synced with WhatsApp triggers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors flex flex-col"
            >
              <div className="relative h-36">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                  {pkg.duration}
                </span>
                <span className="absolute bottom-2 right-2 bg-emerald-600 text-white font-mono font-bold text-xs px-2 py-0.5 rounded shadow-xs">
                  ${pkg.pricePerPerson} / pax
                </span>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{pkg.title}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">{pkg.destination}</div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Available Slots:</span>
                  <span
                    className={`font-mono font-bold ${
                      pkg.availableSlots <= 4 ? 'text-amber-600' : 'text-emerald-700'
                    }`}
                  >
                    {pkg.availableSlots} of {pkg.totalSlots} left
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-mono">
                  Next Departure: {pkg.nextDeparture}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Active Bookings List <span className="font-mono text-slate-500 text-xs">({filteredBookings.length})</span>
            </h3>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by PNR, traveler, package..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Deposit Paid">Deposit Paid</option>
              <option value="Pending Documents">Pending Documents</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">PNR Ref</th>
                <th className="py-2.5 px-3">Traveler</th>
                <th className="py-2.5 px-3">Tour Package</th>
                <th className="py-2.5 px-3">Travel Dates</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Flight / Voucher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                      {b.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{b.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{b.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 truncate max-w-[200px]">
                        {b.packageName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{b.paxCount} Travelers</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {b.departureDate}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <div className="font-semibold text-slate-900">
                        ${b.totalPrice.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-emerald-700">
                        Paid: ${b.paidAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          b.bookingStatus === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFlight(b.id)}
                          className={`p-1 rounded text-[10px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                            b.flightConfirmed
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                          title="Toggle Flight Confirmation Status"
                        >
                          <Plane className="w-3 h-3" />
                          <span>{b.flightConfirmed ? 'Flight' : 'No Flight'}</span>
                        </button>

                        <button
                          onClick={() => handleToggleVoucher(b.id)}
                          className={`p-1 rounded text-[10px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                            b.hotelVoucherIssued
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                          title="Toggle Hotel Voucher Status"
                        >
                          <Hotel className="w-3 h-3" />
                          <span>{b.hotelVoucherIssued ? 'Voucher' : 'Pending'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Create New Reservation</h3>
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Traveler Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Liam Gallagher"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">WhatsApp Phone</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 234-5678"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tour Package</label>
                <select
                  value={packageId}
                  onChange={(e) => {
                    setPackageId(e.target.value);
                    const selected = packages.find((p) => p.id === e.target.value);
                    if (selected) {
                      setTotalPrice(selected.pricePerPerson * paxCount);
                      setPaidAmount(selected.pricePerPerson * paxCount);
                    }
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (${p.pricePerPerson}/pax) - {p.availableSlots} slots left
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Travelers (Pax)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={paxCount}
                    onChange={(e) => {
                      const count = Number(e.target.value);
                      setPaxCount(count);
                      const selected = packages.find((p) => p.id === packageId);
                      if (selected) {
                        setTotalPrice(selected.pricePerPerson * count);
                      }
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Departure Date</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Total Price (USD)</label>
                  <input
                    type="number"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Paid Amount (USD)</label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Booking Status</label>
                <select
                  value={bookingStatus}
                  onChange={(e) =>
                    setBookingStatus(e.target.value as Booking['bookingStatus'])
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Deposit Paid">Deposit Paid (Pending Final)</option>
                  <option value="Pending Documents">Pending Documents</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium shadow-xs cursor-pointer"
                >
                  Generate PNR & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
