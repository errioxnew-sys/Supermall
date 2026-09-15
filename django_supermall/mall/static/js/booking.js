/**
 * SuperMall Interactive Booking Modal Handler
 */
const BookingApp = {
  currentBusinessId: null,
  currentService: null,

  open(businessId, serviceName, price) {
    this.currentBusinessId = businessId;
    this.currentService = { name: serviceName, price: parseInt(price) };

    const modal = document.getElementById('bookingModal');
    if (!modal) return;

    document.getElementById('bookingServiceName').textContent = serviceName;
    document.getElementById('bookingServicePrice').textContent = `MWK ${parseInt(price).toLocaleString()}`;
    
    // Set min date to today
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  },

  close() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
  },

  async submit() {
    const name = document.getElementById('bookingCustomerName')?.value.trim();
    const phone = document.getElementById('bookingCustomerPhone')?.value.trim();
    const email = document.getElementById('bookingCustomerEmail')?.value.trim();
    const date = document.getElementById('bookingDate')?.value;
    const timeSlot = document.getElementById('bookingTimeSlot')?.value;
    const notes = document.getElementById('bookingNotes')?.value.trim();

    if (!name || !phone || !date) {
      alert('Please fill in your name, contact phone, and preferred date.');
      return;
    }

    const btn = document.getElementById('bookingSubmitBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = 'Confirming Reservation...';
    }

    try {
      const resp = await fetch('/api/bookings/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: this.currentBusinessId,
          serviceName: this.currentService.name,
          price: this.currentService.price,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          date: date,
          timeSlot: timeSlot,
          notes: notes,
        })
      });

      const res = await resp.json();
      if (res.success) {
        this.close();
        alert(`Booking reserved successfully! Reference code: #${res.bookingRef}. The merchant has been notified.`);
      } else {
        alert('Booking error: ' + (res.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error submitting booking: ' + err.message);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Confirm Appointment';
      }
    }
  }
};
