/**
 * SuperMall Interactive Shopping Bag & Checkout Engine (Vanilla JS)
 */
const Cart = {
  items: [],
  currentBusinessId: null,
  currentBusinessName: '',

  init(businessId, businessName) {
    this.currentBusinessId = businessId;
    this.currentBusinessName = businessName;
    const stored = localStorage.getItem(`supermall_cart_${businessId}`);
    if (stored) {
      try {
        this.items = JSON.parse(stored);
      } catch (e) {
        this.items = [];
      }
    }
    this.render();
  },

  save() {
    if (this.currentBusinessId) {
      localStorage.setItem(`supermall_cart_${this.currentBusinessId}`, JSON.stringify(this.items));
    }
    this.render();
  },

  addItem(productId, name, price, image, selectedSize = '') {
    const existing = this.items.find(i => i.productId === productId && i.selectedSize === selectedSize);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        productId,
        productName: name,
        price: parseInt(price),
        image: image || '',
        selectedSize: selectedSize || '',
        quantity: 1,
      });
    }
    this.save();
    this.openDrawer();
    this.showToast(`Added "${name}" to shopping bag`);
  },

  updateQuantity(productId, selectedSize, newQty) {
    if (newQty <= 0) {
      this.removeItem(productId, selectedSize);
      return;
    }
    const item = this.items.find(i => i.productId === productId && i.selectedSize === selectedSize);
    if (item) {
      item.quantity = newQty;
      this.save();
    }
  },

  removeItem(productId, selectedSize) {
    this.items = this.items.filter(i => !(i.productId === productId && i.selectedSize === selectedSize));
    this.save();
  },

  clear() {
    this.items = [];
    this.save();
  },

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  openDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  },

  closeDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.add('translate-x-full');
    if (overlay) overlay.classList.add('hidden');
    document.body.style.overflow = '';
  },

  render() {
    const count = this.getTotalCount();
    const subtotal = this.getSubtotal();

    // Update floating shopping bag pill
    const floatingPill = document.getElementById('floatingCartPill');
    const pillCount = document.getElementById('pillCartCount');
    const pillTotal = document.getElementById('pillCartTotal');
    if (floatingPill) {
      if (count > 0) {
        floatingPill.classList.remove('hidden');
        if (pillCount) pillCount.textContent = count;
        if (pillTotal) pillTotal.textContent = `MWK ${subtotal.toLocaleString()}`;
      } else {
        floatingPill.classList.add('hidden');
      }
    }

    // Render items in Drawer
    const itemsList = document.getElementById('cartItemsList');
    const emptyState = document.getElementById('cartEmptyState');
    const drawerSubtotal = document.getElementById('drawerSubtotal');
    const drawerTotal = document.getElementById('drawerTotal');
    const drawerDelivery = document.getElementById('drawerDelivery');

    if (!itemsList) return;

    if (this.items.length === 0) {
      itemsList.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      if (drawerSubtotal) drawerSubtotal.textContent = 'MWK 0';
      if (drawerTotal) drawerTotal.textContent = 'MWK 0';
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    const deliveryOption = document.querySelector('input[name="cart_delivery_option"]:checked')?.value || 'delivery';
    const deliveryFee = deliveryOption === 'delivery' ? 3500 : 0;
    const total = subtotal + deliveryFee;

    if (drawerSubtotal) drawerSubtotal.textContent = `MWK ${subtotal.toLocaleString()}`;
    if (drawerDelivery) drawerDelivery.textContent = deliveryFee > 0 ? `MWK ${deliveryFee.toLocaleString()}` : 'Free (Pickup)';
    if (drawerTotal) drawerTotal.textContent = `MWK ${total.toLocaleString()}`;

    itemsList.innerHTML = this.items.map(item => `
      <div class="flex items-center gap-3 py-3 border-b border-stone-100">
        <img src="${item.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=150&q=80'}" class="w-14 h-14 object-cover rounded-lg border border-stone-200" alt="${item.productName}">
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-xs text-stone-900 truncate">${item.productName}</h4>
          ${item.selectedSize ? `<span class="inline-block text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono">Size: ${item.selectedSize}</span>` : ''}
          <div class="text-xs font-bold text-amber-900 mt-1">MWK ${(item.price * item.quantity).toLocaleString()}</div>
        </div>
        <div class="flex items-center border border-stone-200 rounded-lg bg-stone-50">
          <button onclick="Cart.updateQuantity('${item.productId}', '${item.selectedSize}', ${item.quantity - 1})" class="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold">-</button>
          <span class="px-2 text-xs font-semibold">${item.quantity}</span>
          <button onclick="Cart.updateQuantity('${item.productId}', '${item.selectedSize}', ${item.quantity + 1})" class="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold">+</button>
        </div>
        <button onclick="Cart.removeItem('${item.productId}', '${item.selectedSize}')" class="text-stone-400 hover:text-rose-600 p-1" title="Remove">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    `).join('');
  },

  async checkout() {
    if (this.items.length === 0) return;

    const name = document.getElementById('checkoutName')?.value.trim();
    const phone = document.getElementById('checkoutPhone')?.value.trim();
    const address = document.getElementById('checkoutAddress')?.value.trim();
    const deliveryOption = document.querySelector('input[name="cart_delivery_option"]:checked')?.value || 'delivery';
    const paymentMethod = document.querySelector('input[name="cart_payment_method"]:checked')?.value || 'airtel_money';
    const notes = document.getElementById('checkoutNotes')?.value.trim();

    if (!name || !phone) {
      alert('Please provide your name and phone number for order verification.');
      return;
    }

    if (deliveryOption === 'delivery' && !address) {
      alert('Please enter your delivery street address or area.');
      return;
    }

    const subtotal = this.getSubtotal();
    const deliveryFee = deliveryOption === 'delivery' ? 3500 : 0;
    const total = subtotal + deliveryFee;

    const checkoutBtn = document.getElementById('checkoutSubmitBtn');
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = 'Processing Order...';
    }

    try {
      const resp = await fetch('/api/orders/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: this.currentBusinessId,
          customerName: name,
          customerPhone: phone,
          deliveryAddress: address,
          deliveryOption,
          paymentMethod,
          notes,
          subtotal,
          deliveryFee,
          total,
          items: this.items,
        }),
      });

      const res = await resp.json();
      if (res.success) {
        this.clear();
        this.closeDrawer();
        this.showReceiptModal(res.orderRef, total, phone, paymentMethod);
      } else {
        alert('Order submission error: ' + (res.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error placing order: ' + err.message);
    } finally {
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = 'Complete Order';
      }
    }
  },

  showReceiptModal(orderRef, total, phone, paymentMethod) {
    const modal = document.getElementById('orderSuccessModal');
    if (!modal) return;
    document.getElementById('receiptOrderRef').textContent = orderRef;
    document.getElementById('receiptTotal').textContent = `MWK ${total.toLocaleString()}`;
    document.getElementById('receiptPhone').textContent = phone;
    document.getElementById('receiptPayment').textContent = paymentMethod.replace('_', ' ').toUpperCase();
    modal.classList.remove('hidden');
  },

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl z-50 transition-opacity duration-300';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
};
