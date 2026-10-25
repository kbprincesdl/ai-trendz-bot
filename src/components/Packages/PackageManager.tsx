import React, { useState } from 'react';
import { TourPackage } from '../../types/travel-bot';
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  Tag,
  Search,
  Sparkles,
} from 'lucide-react';

interface PackageManagerProps {
  packages: TourPackage[];
  onSavePackages: (packages: TourPackage[]) => void;
}

export const PackageManager: React.FC<PackageManagerProps> = ({
  packages,
  onSavePackages,
}) => {
  const [search, setSearch] = useState('');
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDestination, setFormDestination] = useState('');
  const [formDuration, setFormDuration] = useState('5 Days / 4 Nights');
  const [formPrice, setFormPrice] = useState(799);
  const [formTotalSlots, setFormTotalSlots] = useState(20);
  const [formAvailableSlots, setFormAvailableSlots] = useState(10);
  const [formDeparture, setFormDeparture] = useState('2026-11-20');
  const [formImage, setFormImage] = useState('/src/assets/images/tour_bali_tropical_1792918136609.jpg');
  const [formHighlights, setFormHighlights] = useState('');
  const [formInclusions, setFormInclusions] = useState('');
  const [formBadge, setFormBadge] = useState('Featured');

  const presetImages = [
    { label: 'Bali Tropical', url: '/src/assets/images/tour_bali_tropical_1792918136609.jpg' },
    { label: 'Swiss Alps', url: '/src/assets/images/tour_swiss_alps_1792918136765.jpg' },
    { label: 'Dubai Luxury', url: '/src/assets/images/tour_dubai_luxury_1792918136643.jpg' },
    { label: 'Kyoto Blossom', url: '/src/assets/images/tour_kyoto_japan_1792918137211.jpg' },
  ];

  const handleStartEdit = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setFormTitle(pkg.title);
    setFormDestination(pkg.destination);
    setFormDuration(pkg.duration);
    setFormPrice(pkg.pricePerPerson);
    setFormTotalSlots(pkg.totalSlots);
    setFormAvailableSlots(pkg.availableSlots);
    setFormDeparture(pkg.nextDeparture);
    setFormImage(pkg.image);
    setFormHighlights(pkg.highlights.join(', '));
    setFormInclusions(pkg.inclusions.join(', '));
    setFormBadge(pkg.badge || 'Featured');
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setEditingPackage(null);
    setFormTitle('');
    setFormDestination('');
    setFormDuration('5 Days / 4 Nights');
    setFormPrice(899);
    setFormTotalSlots(20);
    setFormAvailableSlots(12);
    setFormDeparture('2026-12-01');
    setFormImage('/src/assets/images/tour_bali_tropical_1792918136609.jpg');
    setFormHighlights('Private Sunset Villa Dinner, Guided Sightseeing, Luxury Speedboat');
    setFormInclusions('4-Star Resort Accommodations, Daily Buffet Breakfast, Airport Chauffeur Transfers');
    setFormBadge('New Package');
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tour package?')) {
      const updated = packages.filter((p) => p.id !== id);
      onSavePackages(updated);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDestination.trim()) return;

    const highlightsList = formHighlights
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    const inclusionsList = formInclusions
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    if (editingPackage) {
      const updated = packages.map((p) =>
        p.id === editingPackage.id
          ? {
              ...p,
              title: formTitle.trim(),
              destination: formDestination.trim(),
              duration: formDuration.trim(),
              pricePerPerson: formPrice,
              totalSlots: formTotalSlots,
              availableSlots: formAvailableSlots,
              nextDeparture: formDeparture,
              image: formImage,
              highlights: highlightsList,
              inclusions: inclusionsList,
              badge: formBadge.trim() || undefined,
            }
          : p
      );
      onSavePackages(updated);
    } else {
      const newPackage: TourPackage = {
        id: `pkg-${Date.now()}`,
        title: formTitle.trim(),
        destination: formDestination.trim(),
        duration: formDuration.trim(),
        pricePerPerson: formPrice,
        currency: 'USD',
        totalSlots: formTotalSlots,
        availableSlots: formAvailableSlots,
        nextDeparture: formDeparture,
        image: formImage,
        highlights: highlightsList,
        inclusions: inclusionsList,
        badge: formBadge.trim() || 'New Destination',
      };
      onSavePackages([...packages, newPackage]);
    }

    setEditingPackage(null);
    setIsCreating(false);
  };

  const handleAdjustSlots = (pkgId: string, delta: number) => {
    const updated = packages.map((p) =>
      p.id === pkgId
        ? {
            ...p,
            availableSlots: Math.max(0, Math.min(p.totalSlots, p.availableSlots + delta)),
          }
        : p
    );
    onSavePackages(updated);
  };

  const filtered = packages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Tour Packages & Destinations Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add new holiday destinations, edit package pricing, manage seat slot availability, and update itineraries.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination Package</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destinations, packages, or country..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                  {pkg.duration}
                </span>
                {pkg.badge && (
                  <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {pkg.badge}
                  </span>
                )}
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                  ${pkg.pricePerPerson} / person
                </div>
              </div>

              <div className="p-4 space-y-2.5 text-xs">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{pkg.title}</h3>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    📍 {pkg.destination}
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-700">Highlights:</span>
                  <div className="flex flex-wrap gap-1">
                    {pkg.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inclusions */}
                <div className="text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Inclusions: </span>
                  {pkg.inclusions.join(' · ')}
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="p-4 pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  Next Departure: <span className="font-mono text-slate-800">{pkg.nextDeparture}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500">Slots:</span>
                  <button
                    onClick={() => handleAdjustSlots(pkg.id, -1)}
                    className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-mono font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-emerald-700 px-1">
                    {pkg.availableSlots} / {pkg.totalSlots}
                  </span>
                  <button
                    onClick={() => handleAdjustSlots(pkg.id, 1)}
                    className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-mono font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleStartEdit(pkg)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {(isCreating || editingPackage) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingPackage ? 'Edit Tour Package Details' : 'Add New Tour Package'}
              </h3>
              <button
                onClick={() => {
                  setEditingPackage(null);
                  setIsCreating(false);
                }}
                className="text-slate-400 hover:text-slate-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Package Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Bali 5D4N Tropical Escape"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Destination (City & Country)
                  </label>
                  <input
                    type="text"
                    required
                    value={formDestination}
                    onChange={(e) => setFormDestination(e.target.value)}
                    placeholder="e.g. Bali, Indonesia"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g. 5 Days / 4 Nights"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Price Per Person (USD)
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Next Departure Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDeparture}
                    onChange={(e) => setFormDeparture(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Total Slots
                  </label>
                  <input
                    type="number"
                    required
                    value={formTotalSlots}
                    onChange={(e) => setFormTotalSlots(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Available Slots Left
                  </label>
                  <input
                    type="number"
                    required
                    value={formAvailableSlots}
                    onChange={(e) => setFormAvailableSlots(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Card Badge
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. Best Seller"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md"
                  />
                </div>
              </div>

              {/* Image Selection */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Destination Cover Image
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {presetImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormImage(img.url)}
                      className={`relative rounded-md overflow-hidden h-16 border-2 transition-colors cursor-pointer ${
                        formImage === img.url ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center py-0.5 truncate px-1">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="Or paste custom image URL..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tour Highlights (Comma separated)
                </label>
                <input
                  type="text"
                  value={formHighlights}
                  onChange={(e) => setFormHighlights(e.target.value)}
                  placeholder="e.g. Rice Terraces, Sunset Villa, VIP Speedboat"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Package Inclusions (Comma separated)
                </label>
                <input
                  type="text"
                  value={formInclusions}
                  onChange={(e) => setFormInclusions(e.target.value)}
                  placeholder="e.g. 4-Star Resort, Daily Breakfast, Chauffeur Transfers, Guided Excursions"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPackage(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium shadow-xs cursor-pointer"
                >
                  Save Tour Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
