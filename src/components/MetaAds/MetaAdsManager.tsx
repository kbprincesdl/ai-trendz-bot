import React, { useState } from 'react';
import {
  MetaAdCampaign,
  TourPackage,
  InquiryCustomer,
} from '../../types/travel-bot';
import {
  Megaphone,
  Sparkles,
  Play,
  CheckCircle,
  ExternalLink,
  Code,
  ArrowRight,
  TrendingUp,
  MousePointer,
  Users,
  DollarSign,
  Copy,
  Plus,
} from 'lucide-react';

interface MetaAdsManagerProps {
  campaigns: MetaAdCampaign[];
  packages: TourPackage[];
  onSaveCampaigns: (campaigns: MetaAdCampaign[]) => void;
  onSimulateAdClick: (campaign: MetaAdCampaign) => void;
}

export const MetaAdsManager: React.FC<MetaAdsManagerProps> = ({
  campaigns,
  packages,
  onSaveCampaigns,
  onSimulateAdClick,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [showWebhookJson, setShowWebhookJson] = useState(false);

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
  const associatedPackage = packages.find((p) => p.id === selectedCampaign?.associatedPackageId);

  const webhookEndpoint = `${window.location.origin}/api/webhook/meta-ctwa`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const sampleMetaPayload = {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '+18005558728',
                phone_number_id: '10928374650192',
              },
              contacts: [
                {
                  profile: { name: 'Sarah Jenkins' },
                  wa_id: '14158924102',
                },
              ],
              messages: [
                {
                  from: '14158924102',
                  id: 'wamid.HBgLMTQxNTg5MjQxMDIVAgASGBQzQT...',
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  text: {
                    body: `Hi, I saw your Facebook ad for ${selectedCampaign?.name}! Can I get packages and pricing?`,
                  },
                  type: 'text',
                  referral: {
                    source_url: 'https://fb.me/ad-campaign',
                    source_type: 'ad',
                    source_id: selectedCampaign?.campaignId,
                    headline: selectedCampaign?.headline,
                    body: 'Click to WhatsApp Sponsored Ad',
                    media_type: 'image',
                  },
                },
              ],
            },
            field: 'messages',
          },
        ],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Meta Ads (Facebook & Instagram) Auto Follow-Up
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Capture high-intent Click-to-WhatsApp (CTWA) ad leads. Instant automated follow-up with customized package brochures and limited-time offer vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSimulateAdClick(selectedCampaign)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Customer Ad Click</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
            <MousePointer className="w-4 h-4 text-blue-500" />
            <span>Total Ad Clicks</span>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {campaigns.reduce((acc, c) => acc + c.clicksCount, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Click-to-WhatsApp taps</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>WhatsApp Leads</span>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {campaigns.reduce((acc, c) => acc + c.leadsGenerated, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-mono mt-0.5">10.4% Avg Conversion</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span>Ad Spend</span>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            ${campaigns.reduce((acc, c) => acc + c.spendAmount, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Meta Ads Manager sync</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Cost per Lead</span>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            $2.71
          </div>
          <div className="text-[11px] text-purple-700 font-mono mt-0.5">Industry Avg: $6.40</div>
        </div>
      </div>

      {/* Main Campaign Selector & Follow-Up Sequencer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Campaign List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            Active Meta Campaigns
          </h3>
          <div className="space-y-2.5">
            {campaigns.map((camp) => {
              const isSelected = camp.id === selectedCampaign.id;
              return (
                <div
                  key={camp.id}
                  onClick={() => setSelectedCampaignId(camp.id)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer bg-white ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-blue-600 font-medium">
                      {camp.platform} Sponsored
                    </span>
                    <span className="font-mono tabular-nums text-slate-500 text-[10px]">
                      {camp.clicksCount} clicks
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-slate-900 mt-1 line-clamp-1">
                    {camp.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {camp.headline}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-emerald-700 font-semibold">
                      Code: {camp.promoCode} ({camp.discountPercentage}% OFF)
                    </span>
                    <span className="text-blue-600 font-medium hover:underline flex items-center gap-0.5">
                      Test Click →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Campaign Follow-up Configuration (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  {selectedCampaign.name}
                </h3>
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Campaign ID: {selectedCampaign.campaignId}
              </div>
            </div>

            <button
              onClick={() => onSimulateAdClick(selectedCampaign)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Fire Test Ad Webhook</span>
            </button>
          </div>

          {/* Follow-up Sequence preview */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span>Automated WhatsApp Follow-Up Sequence</span>
              <span className="text-[10px] font-normal text-slate-500">
                (Dispatched immediately when traveler clicks your Meta Ad)
              </span>
            </h4>

            {/* Step 1: Greeting */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                1
              </div>
              <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div className="font-semibold text-slate-800 mb-1">
                  Step 1: Instant Ad Attribution Greeting (within 3 seconds)
                </div>
                <div className="bg-[#D9FDD3] p-2.5 rounded text-slate-900 whitespace-pre-line border border-emerald-200 font-sans">
                  {selectedCampaign.greetingMessage.replace('{customer_name}', 'Traveler')}
                </div>
              </div>
            </div>

            {/* Step 2: Brochure & Coupon */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                2
              </div>
              <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="font-semibold text-slate-800">
                  Step 2: Exclusive Promo Offer & Destination Package Card
                </div>
                <div className="bg-[#D9FDD3] p-2.5 rounded text-slate-900 whitespace-pre-line border border-emerald-200 font-sans">
                  {selectedCampaign.offerMessage}
                </div>

                {associatedPackage && (
                  <div className="bg-white p-2.5 rounded border border-slate-200 flex items-center gap-3">
                    <img
                      src={associatedPackage.image}
                      alt={associatedPackage.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-14 rounded object-cover"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">
                        {associatedPackage.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        ${associatedPackage.pricePerPerson}/pax · {associatedPackage.duration}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">
                        {associatedPackage.availableSlots} seats available for {associatedPackage.nextDeparture}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Interactive Quick Reply Buttons */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                3
              </div>
              <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div className="font-semibold text-slate-800 mb-1.5">
                  Step 3: WhatsApp Interactive Call-to-Action Chips
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-white border border-emerald-300 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                    Check Nov/Dec Dates
                  </span>
                  <span className="bg-white border border-emerald-300 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                    Download Full PDF Itinerary
                  </span>
                  <span className="bg-white border border-emerald-300 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                    Apply Promo {selectedCampaign.promoCode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Configuration for Meta Developer Console */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">
                Meta Graph API Webhook Callback URL
              </span>
              <button
                onClick={() => setShowWebhookJson(!showWebhookJson)}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                {showWebhookJson ? 'Hide Payload Sample' : 'View Payload Schema'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={webhookEndpoint}
                className="flex-1 bg-slate-50 p-2 font-mono text-[11px] text-slate-700 border border-slate-200 rounded"
              />
              <button
                onClick={handleCopyWebhook}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedWebhook ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {showWebhookJson && (
              <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-[10px] font-mono overflow-x-auto max-h-48">
                {JSON.stringify(sampleMetaPayload, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
