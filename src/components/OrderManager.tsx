import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Filter,
} from 'lucide-react';
import { Order, OrderStatus } from '../types/index.ts';
import { formatMWK, formatDate } from '../utils/formatters.ts';

interface OrderManagerProps {
  businessId: string;
  businessName: string;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const OrderManager: React.FC<OrderManagerProps> = ({
  businessId,
  businessName,
  orders = [],
  onUpdateOrderStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Filter orders for this business
  const businessOrders = orders.filter((o) => o.businessId === businessId);

  const filteredOrders = businessOrders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  // Metrics
  const totalOrders = businessOrders.length;
  const pendingOrders = businessOrders.filter((o) => o.status === 'pending').length;
  const confirmedOrders = businessOrders.filter((o) => o.status === 'confirmed').length;
  const dispatchedOrders = businessOrders.filter((o) => o.status === 'dispatched').length;
  const completedOrders = businessOrders.filter((o) => o.status === 'completed').length;
  const totalSalesValue = businessOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await onUpdateOrderStatus(orderId, newStatus);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-1">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Customer Cart & Order Fulfillment</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {businessName} Customer Orders
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Review incoming shopping bag orders, fulfill delivery or pickup requests, and communicate with buyers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Filter by Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 cursor-pointer focus:outline-none"
            >
              <option value="all">All Orders ({totalOrders})</option>
              <option value="pending">Pending ({pendingOrders})</option>
              <option value="confirmed">Confirmed ({confirmedOrders})</option>
              <option value="dispatched">Dispatched / Ready ({dispatchedOrders})</option>
              <option value="completed">Completed / Delivered ({completedOrders})</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Order Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-5 text-xs">
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-stone-500 font-medium block">Total Bag Orders</span>
            <span className="text-2xl font-bold font-serif text-stone-900 mt-1 block">
              {totalOrders}
            </span>
            <span className="text-[10px] text-stone-400">All-time customer checkouts</span>
          </div>

          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80">
            <span className="text-amber-800 font-medium block">Pending Action</span>
            <span className="text-2xl font-bold font-serif text-amber-900 mt-1 block">
              {pendingOrders}
            </span>
            <span className="text-[10px] text-amber-700">Awaiting confirmation</span>
          </div>

          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
            <span className="text-emerald-800 font-medium block">Delivered Orders</span>
            <span className="text-2xl font-bold font-serif text-emerald-900 mt-1 block">
              {completedOrders}
            </span>
            <span className="text-[10px] text-emerald-700">Successfully completed</span>
          </div>

          <div className="p-3.5 bg-stone-900 text-white rounded-xl">
            <span className="text-stone-400 font-medium block">Gross Bag Sales</span>
            <span className="text-xl font-bold font-serif text-amber-400 mt-1 block">
              {formatMWK(totalSalesValue)}
            </span>
            <span className="text-[10px] text-stone-400">Excluding cancellations</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-stone-800 text-base">No orders in this view</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {statusFilter !== 'all'
              ? `There are currently no orders with status "${statusFilter}".`
              : 'Your store has not received any shopping bag orders yet. Customer orders will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
            const whatsappMsg = encodeURIComponent(
              `Hello ${order.customerName}! This is ${businessName} regarding your order #${order.orderNumber || order.id.slice(-6).toUpperCase()}.`
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-4 text-xs transition-all hover:border-amber-400/50"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded text-xs">
                      #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-500">{order.date}</span>
                    <span className="text-stone-400">•</span>
                    <span className="capitalize font-semibold text-stone-700 flex items-center gap-1">
                      {order.deliveryOption === 'delivery' ? (
                        <>
                          <Truck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Delivery ({order.deliveryCity})</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-stone-600" />
                          <span>Store Pickup</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        order.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : order.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'dispatched'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Customer & Fulfillment Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-50 p-3.5 rounded-xl text-stone-700">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      Buyer Info
                    </span>
                    <p className="font-bold text-stone-900 mt-0.5">{order.customerName}</p>
                    <p className="text-stone-500 font-mono text-[11px]">{order.customerPhone}</p>
                    {order.customerEmail && (
                      <p className="text-stone-500 text-[11px]">{order.customerEmail}</p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      Fulfillment Address
                    </span>
                    {order.deliveryOption === 'delivery' ? (
                      <p className="text-stone-800 mt-0.5">
                        {order.deliveryAddress || 'No street specified'}
                        <span className="block text-stone-500 text-[11px]">
                          {order.deliveryCity}, Malawi
                        </span>
                      </p>
                    ) : (
                      <p className="text-stone-800 mt-0.5">
                        Customer will pick up at store front.
                      </p>
                    )}
                    {order.notes && (
                      <p className="text-amber-800 text-[11px] mt-1 italic">
                        Note: "{order.notes}"
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      Payment Details
                    </span>
                    <p className="font-bold text-stone-900 mt-0.5 capitalize">
                      {order.paymentMethod === 'airtel_money'
                        ? 'Airtel Money'
                        : order.paymentMethod === 'tnm_mpamba'
                        ? 'TNM Mpamba'
                        : 'Cash on Handover'}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Payment {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items Breakdown Table */}
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                      <tr>
                        <th className="px-4 py-2">Item</th>
                        <th className="px-4 py-2">Size / Variant</th>
                        <th className="px-4 py-2 text-center">Qty</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 rounded object-cover border border-stone-200"
                                />
                              )}
                              <span className="font-semibold text-stone-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-stone-600">
                            {item.selectedSize ? (
                              <span className="px-1.5 py-0.5 bg-stone-100 rounded text-[11px] font-medium border border-stone-200">
                                {item.selectedSize}
                              </span>
                            ) : (
                              'Standard'
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-center font-bold text-stone-800">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2.5 text-right text-stone-600">
                            {formatMWK(item.price)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold text-stone-900">
                            {formatMWK(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-stone-50 font-semibold border-t border-stone-200 text-stone-800">
                      {order.deliveryFee > 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-1.5 text-right text-stone-500">
                            Local Delivery Fee:
                          </td>
                          <td className="px-4 py-1.5 text-right text-stone-700">
                            {formatMWK(order.deliveryFee)}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={4} className="px-4 py-2 text-right font-bold text-stone-900">
                          Total Order MWK:
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-base text-amber-800">
                          {formatMWK(order.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Status Transitions & Contact Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-stone-500" />
                      <span>Call Buyer</span>
                    </a>
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${whatsappMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Buyer</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-stone-500">Update Status:</span>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'confirmed')}
                        disabled={updatingOrderId === order.id}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-xs cursor-pointer"
                      >
                        Confirm Order
                      </button>
                    )}

                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'dispatched')}
                        disabled={updatingOrderId === order.id}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors shadow-xs cursor-pointer"
                      >
                        {order.deliveryOption === 'delivery' ? 'Dispatch Courier' : 'Mark Ready for Pickup'}
                      </button>
                    )}

                    {order.status === 'dispatched' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'completed')}
                        disabled={updatingOrderId === order.id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors shadow-xs cursor-pointer"
                      >
                        Mark Delivered / Complete
                      </button>
                    )}

                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        disabled={updatingOrderId === order.id}
                        className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
