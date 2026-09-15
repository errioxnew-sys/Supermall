import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Scissors,
  DollarSign,
  MapPin,
} from 'lucide-react';
import { Business, ServiceItem, Booking } from '../types/index.ts';
import { formatMWK } from '../utils/formatters.ts';

interface BookingModalProps {
  business: Business;
  selectedService?: ServiceItem | null;
  existingBookings?: Booking[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitBooking: (bookingData: {
    businessId: string;
    businessName: string;
    serviceId: string;
    serviceName: string;
    price: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }) => Promise<Booking | null>;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  business,
  selectedService,
  existingBookings = [],
  isOpen,
  onClose,
  onSubmitBooking,
}) => {
  if (!isOpen) return null;

  const [chosenServiceId, setChosenServiceId] = useState<string>(
    selectedService?.id || business.services[0]?.id || ''
  );

  // Tomorrow as default date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateString = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState<string>(defaultDateString);
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [slotWarning, setSlotWarning] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const availableSlots = [
    '08:30 AM',
    '09:30 AM',
    '10:30 AM',
    '11:30 AM',
    '01:00 PM',
    '02:00 PM',
    '03:30 PM',
    '04:30 PM',
    '05:30 PM',
  ];

  // Calculate slots that are already booked for this business and date
  const bookedSlotsSet = React.useMemo(() => {
    const booked = new Set<string>();
    if (!existingBookings || !date) return booked;
    existingBookings.forEach((b) => {
      if (
        b.businessId === business.id &&
        b.date === date &&
        b.status !== 'rejected'
      ) {
        booked.add(b.timeSlot);
      }
    });
    return booked;
  }, [existingBookings, business.id, date]);

  const isSelectedSlotBooked = Boolean(timeSlot && bookedSlotsSet.has(timeSlot));
  const isFullyBookedDate = availableSlots.length > 0 && bookedSlotsSet.size >= availableSlots.length;

  React.useEffect(() => {
    if (timeSlot && bookedSlotsSet.has(timeSlot)) {
      const firstAvailable = availableSlots.find((s) => !bookedSlotsSet.has(s));
      if (firstAvailable) {
        setTimeSlot(firstAvailable);
        setSlotWarning(`The slot on ${date} was already booked by another customer. We switched your selection to the nearest open slot (${firstAvailable}).`);
      } else {
        setTimeSlot('');
        setSlotWarning(`All slots on ${date} are completely booked. Please select another date.`);
      }
    }
  }, [date, bookedSlotsSet]);

  const currentService = business.services.find((s) => s.id === chosenServiceId) || business.services[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService || !customerName.trim() || !customerPhone.trim() || !date) return;

    if (bookedSlotsSet.has(timeSlot)) {
      setSlotWarning(`The time slot "${timeSlot}" on ${date} has already been reserved by another customer. Please choose another date or time.`);
      return;
    }

    setSubmitting(true);
    setSlotWarning(null);
    try {
      const result = await onSubmitBooking({
        businessId: business.id,
        businessName: business.name,
        serviceId: currentService.id,
        serviceName: currentService.name,
        price: currentService.price,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || 'customer@example.mw',
        date,
        timeSlot,
        notes: notes.trim(),
      });

      if (result) {
        setConfirmedBooking(result);
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-xl w-full overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={business.logo}
              alt={business.name}
              className="w-8 h-8 rounded-lg object-cover bg-white"
            />
            <div>
              <h3 className="font-serif font-bold text-base leading-tight">
                {confirmedBooking ? 'Booking Confirmed!' : `Book at ${business.name}`}
              </h3>
              <p className="text-[11px] text-stone-300">
                {business.location}, {business.city}
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseAndReset}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmed Screen */}
        {confirmedBooking ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Appointment Scheduled
              </span>
              <h4 className="text-2xl font-serif font-bold text-stone-900 mt-2">
                Booking Reference: {confirmedBooking.bookingRef}
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Your appointment request has been transmitted directly to {business.name}.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-left space-y-2 text-xs">
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Business:</span>
                <span className="font-bold text-stone-900">{business.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Service:</span>
                <span className="font-bold text-stone-900">{confirmedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Price:</span>
                <span className="font-bold text-amber-800">{formatMWK(confirmedBooking.price)}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Date & Time:</span>
                <span className="font-bold text-stone-900">
                  {confirmedBooking.date} at {confirmedBooking.timeSlot}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500 font-medium">Customer:</span>
                <span className="font-semibold text-stone-800">
                  {confirmedBooking.customerName} ({confirmedBooking.customerPhone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">Payment:</span>
                <span className="text-emerald-700 font-semibold">Pay at Venue upon arrival</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                Please arrive 5–10 minutes before your slot at <strong>{business.location}</strong>. You can pay with Cash, Airtel Money, TNM Mpamba, or Card.
              </span>
            </div>

            <button
              onClick={handleCloseAndReset}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Service Picker */}
            <div>
              <label className="block font-bold text-stone-800 mb-1.5">
                1. Select Desired Service
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {business.services.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => setChosenServiceId(svc.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      chosenServiceId === svc.id
                        ? 'border-amber-600 bg-amber-50/60 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-stone-900 text-xs">{svc.name}</p>
                      <p className="text-[11px] text-stone-500">{svc.durationMinutes} minutes</p>
                    </div>
                    <span className="font-bold text-stone-900 text-xs">{formatMWK(svc.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <div>
                <label className="block font-bold text-stone-800 mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>2. Choose Date</span>
                  </span>
                  <span className="text-stone-500 font-normal text-[11px]">
                    {bookedSlotsSet.size > 0 ? `${bookedSlotsSet.size} slot(s) booked` : 'All slots available'}
                  </span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setDate(newDate);
                    setSlotWarning(null);
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 font-medium text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>3. Available Time Slots</span>
                  </span>
                  <span className="text-[11px] text-stone-500 font-normal">
                    Selected: <strong className="text-amber-700">{timeSlot || 'None'}</strong>
                  </span>
                </label>

                {/* Conflict Notification Banner if date is fully booked */}
                {isFullyBookedDate && (
                  <div className="mb-2.5 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                    <span className="text-base leading-none">🚫</span>
                    <div>
                      <strong className="block font-semibold">Date Fully Booked</strong>
                      <span>All appointment slots for {date} are currently taken. Please select another date from the calendar above.</span>
                    </div>
                  </div>
                )}

                {/* Conflict Notification Banner if selected slot is booked */}
                {isSelectedSlotBooked && !isFullyBookedDate && (
                  <div className="mb-2.5 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                    <span className="text-base leading-none">⚠️</span>
                    <div>
                      <strong className="block font-semibold">Slot Already Reserved</strong>
                      <span>The slot <strong>{timeSlot}</strong> on {date} has already been reserved by another customer. Please select another slot below.</span>
                    </div>
                  </div>
                )}

                {slotWarning && (
                  <div className="mb-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                    <span className="text-base leading-none">ℹ️</span>
                    <span>{slotWarning}</span>
                  </div>
                )}

                {/* Slots Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => {
                    const isBooked = bookedSlotsSet.has(slot);
                    const isSelected = timeSlot === slot && !isBooked;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => {
                          if (isBooked) {
                            setSlotWarning(`"${slot}" on ${date} is already booked. Please choose an open slot.`);
                            return;
                          }
                          setTimeSlot(slot);
                          setSlotWarning(null);
                        }}
                        className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center relative ${
                          isBooked
                            ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60 line-through decoration-rose-500/70'
                            : isSelected
                            ? 'bg-amber-600 text-white border-amber-700 shadow-xs ring-2 ring-amber-500/20'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 cursor-pointer'
                        }`}
                        title={isBooked ? `Slot ${slot} is already booked on ${date}. Please choose another time.` : `Select ${slot}`}
                      >
                        <div>{slot}</div>
                        {isBooked && (
                          <span className="block text-[9px] uppercase tracking-wider text-rose-600 no-underline font-bold mt-0.5">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <span className="block font-bold text-stone-800">
                4. Your Contact Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name (e.g. Chisomo Banda)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Phone (e.g. +265 99 123 4567)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Special instructions or styling preferences (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                />
              </div>
            </div>

            {/* Summary Banner */}
            <div className="p-3 rounded-xl bg-stone-100 flex items-center justify-between text-xs">
              <div>
                <p className="text-stone-500">Estimated Total:</p>
                <p className="font-bold text-stone-900 text-sm">{formatMWK(currentService?.price || 0)}</p>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                No advance deposit • Pay in shop
              </span>
            </div>

            {/* Submit */}
            <button
              id="submit-booking-btn"
              type="submit"
              disabled={submitting || isSelectedSlotBooked || !timeSlot}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-900/10 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {submitting
                  ? 'Confirming...'
                  : isSelectedSlotBooked
                  ? 'Selected Slot Unavailable'
                  : 'Confirm Appointment'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
