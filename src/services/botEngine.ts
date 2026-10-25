import {
  TourPackage,
  Booking,
  AutoReplyTrigger,
  AfterHoursConfig,
  ChatMessage,
  InquiryCustomer,
  FAQItem,
  QualificationQuestion,
  AgencyProfile,
  AdminNotification,
} from '../types/travel-bot';

export interface BotProcessResult {
  replyMessage: ChatMessage;
  matchedTrigger?: AutoReplyTrigger;
  matchedFaq?: FAQItem;
  isAfterHours: boolean;
  pauseBot?: boolean;
  updatedCustomerFields?: Partial<InquiryCustomer>;
  notification?: AdminNotification;
}

export function isCurrentlyAfterHours(config: AfterHoursConfig): boolean {
  if (config.forceSimulateClosed) {
    return true;
  }

  const now = new Date();
  const currentDayOfWeek = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeNumber = currentHour * 60 + currentMinute;

  const todaySchedule = config.schedule.find((s) => s.dayOfWeek === currentDayOfWeek);
  if (!todaySchedule || !todaySchedule.isOpen) {
    return true;
  }

  const [openH, openM] = todaySchedule.openTime.split(':').map(Number);
  const [closeH, closeM] = todaySchedule.closeTime.split(':').map(Number);
  const openTimeNumber = openH * 60 + openM;
  const closeTimeNumber = closeH * 60 + closeM;

  return currentTimeNumber < openTimeNumber || currentTimeNumber >= closeTimeNumber;
}

export function evaluateCustomerMessage(
  customerText: string,
  customer: InquiryCustomer,
  triggers: AutoReplyTrigger[],
  packages: TourPackage[],
  bookings: Booking[],
  afterHoursConfig: AfterHoursConfig,
  faqs: FAQItem[] = [],
  qualificationQuestions: QualificationQuestion[] = [],
  agencyProfile?: AgencyProfile
): BotProcessResult | null {
  const cleanInput = customerText.trim().toLowerCase();
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const agencyName = agencyProfile?.agencyName || 'VoyageCraft Ops';
  const strictFaqMode = agencyProfile?.strictFaqMode ?? true;

  // 1. Check for explicit Booking Reference (e.g. VOY-8421 or voy-xxxx)
  const pnrMatch = cleanInput.match(/\bvoy-\d{4}\b/i);
  if (pnrMatch) {
    const pnrCode = pnrMatch[0].toUpperCase();
    const foundBooking = bookings.find((b) => b.id.toUpperCase() === pnrCode);

    if (foundBooking) {
      const replyText = `✅ *Live Booking Status: ${foundBooking.bookingStatus.toUpperCase()}* (Ref: *${foundBooking.id}*)

👤 *Lead Traveler:* ${foundBooking.customerName} (${foundBooking.paxCount} Travelers)
✈️ *Package:* ${foundBooking.packageName}
📅 *Departure:* ${foundBooking.departureDate} (Return: ${foundBooking.returnDate})
💳 *Payment Status:* ${foundBooking.paymentStatus} ($${foundBooking.paidAmount.toLocaleString()} of $${foundBooking.totalPrice.toLocaleString()})
📄 *Hotel Voucher:* ${foundBooking.hotelVoucherIssued ? 'Issued & Ready' : 'Processing (Ready 7 days prior)'}
🎫 *Flight Status:* ${foundBooking.flightConfirmed ? 'Confirmed & Ticketed' : 'Pending Airlines Assignment'}

Need to amend dates, add travel insurance, or download official tax invoice? Click below:`;

      return {
        replyMessage: {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          timestamp: nowStr,
          status: 'delivered',
          bookingCard: foundBooking,
          quickReplies: ['Download Hotel Voucher', 'Airport Transfer Details', 'Speak to Reservations Desk'],
        },
        isAfterHours: false,
        notification: {
          id: `notif-${Date.now()}`,
          title: `Bot Verified Booking ${foundBooking.id}`,
          message: `Auto-replied to ${customer.name || customer.phone} with live reservation status.`,
          timestamp: nowStr,
          type: 'booking',
          isRead: false,
          customerId: customer.id,
        },
      };
    } else {
      return {
        replyMessage: {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `⚠️ *Booking Reference Not Found*\n\nWe couldn't locate active booking *${pnrCode}* in our central reservations system. Please double check the 4-digit code (e.g., *VOY-8421*) or send your registered mobile number for manual verification.`,
          timestamp: nowStr,
          status: 'delivered',
          quickReplies: ['Status VOY-8421', 'Status VOY-9902', 'Connect to Agent'],
        },
        isAfterHours: false,
        notification: {
          id: `notif-${Date.now()}`,
          title: `Unrecognized PNR Query (${pnrCode})`,
          message: `${customer.name || customer.phone} queried an unknown booking code.`,
          timestamp: nowStr,
          type: 'bot_reply',
          isRead: false,
          customerId: customer.id,
        },
      };
    }
  }

  // 2. Check After-Hours Business Logic
  const afterHours = isCurrentlyAfterHours(afterHoursConfig);
  if (afterHours) {
    return {
      replyMessage: {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: afterHoursConfig.autoReplyText,
        timestamp: nowStr,
        status: 'delivered',
        isAfterHoursReply: true,
        quickReplies: ['Browse 2026 Packages', 'Schedule Morning Callback', 'Check Existing Booking'],
      },
      isAfterHours: true,
      notification: {
        id: `notif-${Date.now()}`,
        title: `After-Hours Auto-Response Sent`,
        message: `${customer.name || customer.phone} inquired outside operating hours. Queued for morning callback.`,
        timestamp: nowStr,
        type: 'after_hours',
        isRead: false,
        customerId: customer.id,
      },
    };
  }

  // 3. Multi-Step Inquiry Questionnaire in Progress
  const sortedQuestions = [...qualificationQuestions].sort((a, b) => a.order - b.order);
  const qState = customer.qualificationState;

  if (qState && !qState.isCompleted && sortedQuestions.length > 0) {
    const currentIndex = qState.currentQuestionIndex;
    const currentQ = sortedQuestions[currentIndex];

    // Save previous answer
    const updatedData = { ...qState.collectedData };
    const updatedFields: Partial<InquiryCustomer> = {};

    if (currentQ) {
      updatedData[currentQ.fieldKey] = customerText.trim();

      if (currentQ.fieldKey === 'targetDestination') {
        updatedFields.targetDestination = customerText.trim();
      } else if (currentQ.fieldKey === 'travelDates') {
        updatedFields.travelDates = customerText.trim();
      } else if (currentQ.fieldKey === 'pax') {
        const parsedPax = parseInt(customerText.replace(/\D/g, ''), 10) || 2;
        updatedFields.pax = parsedPax;
      } else if (currentQ.fieldKey === 'durationDays') {
        updatedFields.durationDays = customerText.trim();
      }
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex < sortedQuestions.length) {
      // Advance to next question
      const nextQ = sortedQuestions[nextIndex];
      const replyText = `✨ Got it! Saved: *${customerText.trim()}*\n\n📋 *Step ${nextIndex + 1} of ${sortedQuestions.length}:*\n${nextQ.questionText}${nextQ.hintText ? `\n_(${nextQ.hintText})_` : ''}`;

      return {
        replyMessage: {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          timestamp: nowStr,
          status: 'delivered',
          isQuestionnaireStep: true,
          quickReplies: nextQ.quickReplies,
        },
        isAfterHours: false,
        updatedCustomerFields: {
          ...updatedFields,
          qualificationState: {
            currentQuestionIndex: nextIndex,
            isCompleted: false,
            collectedData: updatedData,
          },
        },
        notification: {
          id: `notif-${Date.now()}`,
          title: `Inquiry Questionnaire (Step ${nextIndex + 1})`,
          message: `${customer.name || customer.phone} answered: ${customerText.trim()}`,
          timestamp: nowStr,
          type: 'bot_reply',
          isRead: false,
          customerId: customer.id,
        },
      };
    } else {
      // Completed all questions!
      const finalDest = updatedData.targetDestination || customer.targetDestination || 'International Tour';
      const finalDates = updatedData.travelDates || customer.travelDates || 'Flexible';
      const finalPax = updatedData.pax || customer.pax || 2;
      const finalDays = updatedData.durationDays || '5 Days';

      const completionReply = `🎉 *Thank you, ${customer.name || 'Traveler'}! Your travel inquiry is fully logged:*

📍 *Destination:* ${finalDest}
📅 *Travel Dates:* ${finalDates}
👥 *Travelers:* ${finalPax} Pax
⏱️ *Duration:* ${finalDays}

Our senior travel counselor has received your exact requirements and is preparing your personalized quotation and hotel options right now!`;

      return {
        replyMessage: {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: completionReply,
          timestamp: nowStr,
          status: 'delivered',
          isQuestionnaireStep: true,
          quickReplies: ['Download Brochure PDF', 'Hold Tentative Slots', 'Talk to Senior Agent'],
        },
        isAfterHours: false,
        updatedCustomerFields: {
          ...updatedFields,
          status: 'In Discussion',
          notes: `${customer.notes || ''}\n[Bot Inquiry Completed]: ${finalDest}, ${finalDates}, ${finalPax} pax, ${finalDays}.`,
          qualificationState: {
            currentQuestionIndex: nextIndex,
            isCompleted: true,
            collectedData: updatedData,
          },
        },
        notification: {
          id: `notif-${Date.now()}`,
          title: `🎯 Qualified Lead Completed: ${finalDest}`,
          message: `${customer.name || customer.phone} submitted travel plan: ${finalPax} pax, ${finalDates}, ${finalDays}.`,
          timestamp: nowStr,
          type: 'lead',
          isRead: false,
          customerId: customer.id,
        },
      };
    }
  }

  // 4. Exact / Keyword FAQ Matching
  // "the Bot should only respond with the answers from the FAQ provide by me."
  const enabledFaqs = faqs.filter((f) => f.isEnabled);
  let matchedFaq: FAQItem | undefined;

  for (const faq of enabledFaqs) {
    const qLower = faq.question.toLowerCase();
    const hasKeyword = faq.keywords.some((k) => cleanInput.includes(k.trim().toLowerCase()));
    const questionMatch = cleanInput.includes(qLower) || qLower.includes(cleanInput);

    if (hasKeyword || questionMatch) {
      matchedFaq = faq;
      break;
    }
  }

  if (matchedFaq) {
    return {
      replyMessage: {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: matchedFaq.answer,
        timestamp: nowStr,
        status: 'delivered',
        isFaqReply: true,
        quickReplies: ['Start Trip Inquiry', 'Browse Tour Packages', 'Speak to Travel Agent'],
      },
      matchedFaq,
      isAfterHours: false,
      notification: {
        id: `notif-${Date.now()}`,
        title: `FAQ Auto-Replied: "${matchedFaq.question.slice(0, 35)}..."`,
        message: `Answered question for ${customer.name || customer.phone} using verified FAQ database.`,
        timestamp: nowStr,
        type: 'bot_reply',
        isRead: false,
        customerId: customer.id,
      },
    };
  }

  // 5. Check if user wants to initiate an inquiry or ask about packages
  const isTripInquiryTrigger =
    cleanInput.includes('package') ||
    cleanInput.includes('tours') ||
    cleanInput.includes('holiday') ||
    cleanInput.includes('trip') ||
    cleanInput.includes('book') ||
    cleanInput.includes('bali') ||
    cleanInput.includes('swiss') ||
    cleanInput.includes('dubai') ||
    cleanInput.includes('japan') ||
    cleanInput.includes('inquiry') ||
    cleanInput.includes('quote') ||
    cleanInput.includes('hi') ||
    cleanInput.includes('hello');

  if (isTripInquiryTrigger && sortedQuestions.length > 0 && (!qState || qState.isCompleted)) {
    // Initiate qualification questionnaire flow!
    const firstQ = sortedQuestions[0];
    const greetingText = `👋 Hello ${customer.name || 'Traveler'}! Welcome to *${agencyName}*! ✈️

I would love to help you plan your journey. To provide the best options, available dates, and exact package rates, please answer a few quick questions:

📋 *Step 1 of ${sortedQuestions.length}:*
${firstQ.questionText}${firstQ.hintText ? `\n_(${firstQ.hintText})_` : ''}`;

    return {
      replyMessage: {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: greetingText,
        timestamp: nowStr,
        status: 'delivered',
        isQuestionnaireStep: true,
        quickReplies: firstQ.quickReplies,
      },
      isAfterHours: false,
      updatedCustomerFields: {
        qualificationState: {
          currentQuestionIndex: 0,
          isCompleted: false,
          collectedData: {},
        },
      },
      notification: {
        id: `notif-${Date.now()}`,
        title: `Started Trip Inquiry Questionnaire`,
        message: `Inquiry flow initiated with ${customer.name || customer.phone}.`,
        timestamp: nowStr,
        type: 'bot_reply',
        isRead: false,
        customerId: customer.id,
      },
    };
  }

  // 6. Active Custom Triggers (if not in strict mode, or general triggers)
  if (!strictFaqMode) {
    for (const trigger of triggers) {
      if (!trigger.isActive) continue;

      let matched = false;
      if (trigger.matchType === 'exact') {
        matched = trigger.keywords.some((kw) => cleanInput === kw.trim().toLowerCase());
      } else if (trigger.matchType === 'starts_with') {
        matched = trigger.keywords.some((kw) => cleanInput.startsWith(kw.trim().toLowerCase()));
      } else if (trigger.matchType === 'regex') {
        matched = trigger.keywords.some((pattern) => {
          try {
            return new RegExp(pattern, 'i').test(cleanInput);
          } catch {
            return false;
          }
        });
      } else {
        matched = trigger.keywords.some((kw) => cleanInput.includes(kw.trim().toLowerCase()));
      }

      if (matched) {
        let replyText = trigger.responseTemplate;
        replyText = replyText.replace(/{customer_name}/g, customer.name || 'Traveler');

        let matchedPackage: TourPackage | undefined;
        if (trigger.includePackageId) {
          matchedPackage = packages.find((p) => p.id === trigger.includePackageId);
          if (matchedPackage) {
            replyText = replyText.replace(/{package_name}/g, matchedPackage.title);
            replyText = replyText.replace(/{package_price}/g, `$${matchedPackage.pricePerPerson}`);
          }
        }

        return {
          replyMessage: {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: replyText,
            timestamp: nowStr,
            status: 'delivered',
            packageCard: matchedPackage,
            quickReplies: trigger.includeQuickReplies,
          },
          matchedTrigger: trigger,
          isAfterHours: false,
          pauseBot: trigger.pauseBotAfterTrigger,
          notification: {
            id: `notif-${Date.now()}`,
            title: `Trigger Fired: ${trigger.name}`,
            message: `Auto-replied to ${customer.name || customer.phone}.`,
            timestamp: nowStr,
            type: 'bot_reply',
            isRead: false,
            customerId: customer.id,
          },
        };
      }
    }
  }

  // 7. Strict FAQ Fallback Response
  // "the Bot should only respond with the answers from the FAQ provide by me."
  const strictFallbackText = `ℹ️ *${agencyName} Travel Assistant*

I am programmed to provide verified answers from our official agency FAQ database or assist with your trip dates and passenger requirements.

💡 *What would you like to know?*
• Payment modes & cancellation policy
• Flight & visa assistance
• Start a customized trip inquiry
• Check active reservation (Status VOY-XXXX)`;

  return {
    replyMessage: {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: strictFallbackText,
      timestamp: nowStr,
      status: 'delivered',
      quickReplies: ['Start Trip Inquiry', 'Cancellation Policy', 'Visa Assistance', 'Speak to Agent'],
    },
    isAfterHours: false,
    notification: {
      id: `notif-${Date.now()}`,
      title: `Bot Fallback (Non-FAQ Question)`,
      message: `Traveler asked: "${customerText.slice(0, 30)}...". Bot provided FAQ choices.`,
      timestamp: nowStr,
      type: 'bot_reply',
      isRead: false,
      customerId: customer.id,
    },
  };
}
