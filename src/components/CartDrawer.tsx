import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Truck,
  Store,
  CreditCard,
  MessageCircle,
  Phone,
  User,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Business, CartItem, Order, PaymentMethod } from '../types/index.ts';
import { formatMWK } from '../utils/formatters.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, selectedSize: string | undefined, newQty: number) => void;
  onRemoveItem: (productId: string, selectedSize: string | undefined) => void;
  onClearCart: () => void;
  onPlaceOrder: (orderData: Omit<Order, 'id'>) => Promise<string>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  business,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('airtel_money');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderRef, setPlacedOrderRef] = useState<string>('');

  if (!isOpen) return null;

  const deliveryFee = deliveryOption === 'delivery' ? 2500 : 0;
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    setIsSubmitting(true);
    try {
      const orderRef = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderPayload: Omit<Order, 'id'> = {
        orderRef,
        businessId: business.id,
        businessName: business.name,
        businessSlug: business.slug,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          image: item.product.image,
        })),
        subtotal,
        deliveryFee,
        total,
        currency: 'MWK',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        deliveryOption,
        deliveryAddress: deliveryOption === 'delivery' ? deliveryAddress.trim() : undefined,
        paymentMethod,
        notes: orderNotes.trim() || undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await onPlaceOrder(orderPayload);
      setPlacedOrderRef(orderRef);
      setStep('success');
      onClearCart();
    } catch (err) {
      console.error('Failed to submit order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!business.whatsapp) return;
    const phoneNum = business.whatsapp.replace(/\D/g, '');
    
    let msg = `*NEW ORDER - ${business.name}*\n`;
    msg += `--------------------------------\n`;
    cartItems.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.product.name}* ${item.selectedSize ? `(${item.selectedSize})` : ''}\n`;
      msg += `   Qty: ${item.quantity} x ${formatMWK(item.product.price)} = ${formatMWK(item.product.price * item.quantity)}\n`;
    });
    msg += `--------------------------------\n`;
    msg += `*Subtotal:* ${formatMWK(subtotal)}\n`;
    if (deliveryOption === 'delivery') {
      msg += `*Delivery Fee:* ${formatMWK(deliveryFee)}\n`;
      msg += `*Delivery Address:* ${deliveryAddress || 'To be specified'}\n`;
    } else {
      msg += `*Pickup:* In-store pick up\n`;
    }
    msg += `*Total Amount:* ${formatMWK(total)}\n`;
    if (customerName) msg += `*Customer:* ${customerName}\n`;
    if (customerPhone) msg += `*Phone:* ${customerPhone}\n`;
    if (orderNotes) msg += `*Notes:* ${orderNotes}\n`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phoneNum}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-white flex items-center gap-1.5">
                <span>Your Shopping Cart</span>
                <span className="text-xs font-normal text-amber-300">
                  ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)
                </span>
              </h2>
              <p className="text-[11px] text-stone-400 truncate max-w-[200px]">
                {business.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="py-16 text-center text-stone-500 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-stone-800 text-lg">Your cart is empty</h3>
                  <p className="text-xs max-w-xs mx-auto text-stone-500">
                    Browse {business.name}'s collection and add items to your cart for direct pickup or local delivery.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Item List */}
                  <div className="divide-y divide-stone-100">
                    {cartItems.map((item, idx) => (
                      <div key={`${item.product.id}-${item.selectedSize || ''}-${idx}`} className="py-3.5 flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover bg-stone-100 flex-shrink-0 border border-stone-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-bold text-stone-900 text-xs truncate">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                              className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {item.selectedSize && (
                            <span className="inline-block mt-0.5 px-2 py-0.2 bg-stone-100 text-stone-600 rounded text-[10px] font-medium">
                              Size / Option: {item.selectedSize}
                            </span>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-amber-800 text-xs">
                              {formatMWK(item.product.price)}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-stone-50">
                              <button
                                onClick={() =>
                                  onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)
                                }
                                className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-bold text-stone-900 min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                                }
                                className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={onClearCart}
                      className="text-xs text-stone-500 hover:text-rose-600 transition-colors"
                    >
                      Clear All Items
                    </button>
                    <span className="text-xs text-stone-400">
                      All prices in Malawian Kwacha (MWK)
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200/70 flex items-center gap-2 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Completing order directly with <strong>{business.name}</strong></span>
              </div>

              {/* Delivery Option Toggle */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Fulfillment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption('pickup')}
                    className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
                      deliveryOption === 'pickup'
                        ? 'border-amber-600 bg-amber-50/40 text-stone-900 font-semibold ring-1 ring-amber-600'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Store className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-bold">In-Store Pickup</span>
                      <span className="text-[10px] text-stone-500">Free • {business.city}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryOption('delivery')}
                    className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
                      deliveryOption === 'delivery'
                        ? 'border-amber-600 bg-amber-50/40 text-stone-900 font-semibold ring-1 ring-amber-600'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block font-bold">Local Delivery</span>
                      <span className="text-[10px] text-stone-500">MWK 2,500 courier</span>
                    </div>
                  </button>
                </div>
              </div>

              {deliveryOption === 'delivery' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Delivery Address in {business.city} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Area 10, Plot 42 / Sunnyside Near St. Andrews"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                  />
                </div>
              )}

              {/* Customer Contact */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kondwani Chirwa"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Phone Number (Airtel / TNM) *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+265 999 123 456"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 font-mono"
                  />
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Payment Preference
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'airtel_money', label: 'Airtel Money', note: 'Pay on merchant prompt' },
                    { id: 'tnm_mpamba', label: 'TNM Mpamba', note: 'Pay on merchant prompt' },
                    { id: 'cash_on_delivery', label: 'Cash on Pickup / Delivery', note: 'Pay when receiving goods' },
                  ].map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer ${
                        paymentMethod === p.id
                          ? 'border-amber-600 bg-amber-50/40 text-stone-900 ring-1 ring-amber-600'
                          : 'border-stone-200 bg-stone-50 text-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={p.id}
                          checked={paymentMethod === p.id}
                          onChange={() => setPaymentMethod(p.id as PaymentMethod)}
                          className="accent-amber-600"
                        />
                        <span className="font-semibold text-xs">{p.label}</span>
                      </div>
                      <span className="text-[10px] text-stone-500">{p.note}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Special Notes / Sizing Details (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Any gift wrap, alternative phone number, specific delivery hour..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-stone-900 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Placing Order...' : `Confirm & Place Order (${formatMWK(total)})`}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep('cart')}
                className="w-full text-center text-xs text-stone-500 hover:text-stone-900 mt-1"
              >
                ← Back to Cart Review
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  Order Received!
                </h3>
                <p className="text-xs text-stone-600">
                  Your order reference is{' '}
                  <span className="font-mono font-bold text-amber-700 px-2 py-0.5 bg-amber-50 rounded border border-amber-200">
                    {placedOrderRef}
                  </span>
                </p>
                <p className="text-xs text-stone-500 max-w-xs mx-auto pt-2">
                  <strong>{business.name}</strong> staff have received your items and will contact you via phone / SMS at <strong>{customerPhone}</strong>.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Merchant:</span>
                  <span className="font-semibold text-stone-900">{business.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fulfillment:</span>
                  <span className="capitalize text-stone-900">{deliveryOption}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-stone-200 text-stone-900">
                  <span>Total Due:</span>
                  <span className="text-amber-700">{formatMWK(total)}</span>
                </div>
              </div>

              {business.whatsapp && (
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order Summary via WhatsApp</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
              >
                Done / Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer (Only on 'cart' step) */}
        {step === 'cart' && cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span className="font-semibold text-stone-900">{formatMWK(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-stone-500 text-[11px]">
                <span>Fulfillment (Pickup or City Delivery)</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>Estimated Total</span>
                <span className="text-amber-800 text-base">{formatMWK(subtotal)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-2.5 bg-stone-900 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {business.whatsapp && (
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct WhatsApp Order</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
