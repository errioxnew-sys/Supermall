import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Tag,
  DollarSign,
  Filter,
  Image as ImageIcon,
  Sparkles,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import { ProductItem } from '../types/index.ts';
import { formatMWK } from '../utils/formatters.ts';
import { StorageImageUpload } from './StorageImageUpload.tsx';

interface InventoryManagerProps {
  businessId: string;
  businessName: string;
  businessCategory: string;
  products: ProductItem[];
  onSaveProducts: (updatedProducts: ProductItem[]) => Promise<void>;
}

// Preset photo options tailored for Malawian boutique, fashion, and beauty businesses
const PRESET_PRODUCT_IMAGES = [
  {
    label: 'Chitenje Maxi Dress',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=700&q=80',
  },
  {
    label: 'African Wax Blazer',
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&q=80',
  },
  {
    label: 'Tailored Linen Shirt',
    url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&q=80',
  },
  {
    label: 'Organic Shea Butter Cream',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=700&q=80',
  },
  {
    label: 'Grooming Beard Oil',
    url: 'https://images.unsplash.com/photo-1608248597359-07973d47a469?w=700&q=80',
  },
  {
    label: 'Botanical Hair & Scalp Mist',
    url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700&q=80',
  },
  {
    label: 'Artisan Beaded Handbag',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=80',
  },
  {
    label: 'Leather Dress Loafers',
    url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=700&q=80',
  },
];

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  businessId,
  businessName,
  businessCategory,
  products = [],
  onSaveProducts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [isSaving, setIsSaving] = useState(false);

  // Form modal state (both for create and edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState<number>(15000);
  const [formStock, setFormStock] = useState<number>(10);
  const [formSku, setFormSku] = useState('');
  const [formSizes, setFormSizes] = useState('');
  const [formImage, setFormImage] = useState(PRESET_PRODUCT_IMAGES[0].url);
  const [formDescription, setFormDescription] = useState('');
  const [formInStock, setFormInStock] = useState(true);

  // Derive categories from current inventory
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  // Inventory Analytics
  const totalItems = products.length;
  const inStockCount = products.filter((p) => p.inStock && p.stock > 0).length;
  const outOfStockCount = totalItems - inStockCount;
  const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' ? p.inStock && p.stock > 0 : !p.inStock || p.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setFormName('');
    setFormCategory(businessCategory.includes('Fashion') ? 'Fashion' : 'Beauty & Care');
    setFormPrice(25000);
    setFormStock(12);
    setFormSku(`SKU-${Math.floor(100 + Math.random() * 900)}`);
    setFormSizes('S, M, L, XL');
    setFormImage(PRESET_PRODUCT_IMAGES[0].url);
    setFormDescription('Crafted with premium materials for discerning clients.');
    setFormInStock(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductItem) => {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormStock(product.stock);
    setFormSku(product.sku || '');
    setFormSizes(product.sizes ? product.sizes.join(', ') : '');
    setFormImage(product.image);
    setFormDescription(product.description || '');
    setFormInStock(product.inStock);
    setIsModalOpen(true);
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) return;

    setIsSaving(true);
    try {
      const parsedSizes = formSizes
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      let updatedList: ProductItem[];

      if (editingProductId) {
        // Edit existing product
        updatedList = products.map((p) =>
          p.id === editingProductId
            ? {
                ...p,
                name: formName.trim(),
                category: formCategory.trim() || 'General',
                price: Number(formPrice),
                stock: Number(formStock),
                sku: formSku.trim() || undefined,
                sizes: parsedSizes.length > 0 ? parsedSizes : undefined,
                image: formImage.trim() || PRESET_PRODUCT_IMAGES[0].url,
                description: formDescription.trim(),
                inStock: formInStock && Number(formStock) > 0,
              }
            : p
        );
      } else {
        // Post new product
        const newProduct: ProductItem = {
          id: `prod-${Date.now()}`,
          name: formName.trim(),
          category: formCategory.trim() || 'General',
          price: Number(formPrice),
          currency: 'MWK',
          stock: Number(formStock),
          sku: formSku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
          sizes: parsedSizes.length > 0 ? parsedSizes : undefined,
          image: formImage.trim() || PRESET_PRODUCT_IMAGES[0].url,
          description: formDescription.trim(),
          inStock: formInStock && Number(formStock) > 0,
        };
        updatedList = [newProduct, ...products];
      }

      await onSaveProducts(updatedList);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to remove "${productName}" from your store inventory?`)) {
      return;
    }
    const updated = products.filter((p) => p.id !== productId);
    await onSaveProducts(updated);
  };

  const handleToggleStockStatus = async (product: ProductItem) => {
    const updated = products.map((p) =>
      p.id === product.id
        ? {
            ...p,
            inStock: !p.inStock,
            stock: !p.inStock && p.stock === 0 ? 5 : p.stock,
          }
        : p
    );
    await onSaveProducts(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Analytics */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-1">
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>Staff & Owner Inventory Management</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {businessName} Inventory & Stock
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Post new items, update prices, manage sizing options, and control stock availability for online shoppers.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-stone-900 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Post New Product</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-5 text-xs">
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-stone-500 font-medium block">Total Items Listed</span>
            <span className="text-2xl font-bold font-serif text-stone-900 mt-1 block">
              {totalItems}
            </span>
            <span className="text-[10px] text-stone-400">In shop catalog</span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-stone-500 font-medium block">In-Stock Status</span>
            <span className="text-2xl font-bold font-serif text-emerald-700 mt-1 block">
              {inStockCount}
            </span>
            <span className="text-[10px] text-stone-400">Available for customer cart</span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-stone-500 font-medium block">Total Units Count</span>
            <span className="text-2xl font-bold font-serif text-stone-900 mt-1 block">
              {totalUnits}
            </span>
            <span className="text-[10px] text-stone-400">Physical pieces tracked</span>
          </div>

          <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/70">
            <span className="text-amber-800 font-medium block">Inventory Asset Value</span>
            <span className="text-xl font-bold font-serif text-amber-900 mt-1 block">
              {formatMWK(totalInventoryValue)}
            </span>
            <span className="text-[10px] text-amber-700/80">Malawian Kwacha (MWK)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search products by title, category, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock Only</option>
            <option value="out_of_stock">Out of Stock Only</option>
          </select>
        </div>
      </div>

      {/* Inventory Items List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-stone-800 text-base">No inventory items found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'all' || stockFilter !== 'all'
              ? 'No products matched your search filters. Try clearing your filters.'
              : 'Your store has no products listed yet. Click "Post New Product" to add your first item!'}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-stone-900 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Post Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all"
            >
              {/* Product Header & Image */}
              <div>
                <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                    {product.category}
                  </span>
                  {product.sku && (
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-stone-900/70 backdrop-blur-xs text-stone-200 text-[10px] font-mono">
                      {product.sku}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-stone-900 text-base leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Sizing tags */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      <span className="text-stone-400 font-medium">Sizes:</span>
                      {product.sizes.map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded border border-stone-200 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Pricing and Stock count */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">
                        Unit Price
                      </span>
                      <span className="text-base font-bold text-amber-800">
                        {formatMWK(product.price)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">
                        Stock Count
                      </span>
                      <span className="text-sm font-bold text-stone-900">
                        {product.stock} units
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-100">
                  {/* Stock Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleStockStatus(product)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      product.inStock && product.stock > 0
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {product.inStock && product.stock > 0 ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Out of Stock</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(product)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 transition-colors cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xl max-w-lg w-full text-xs space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {editingProductId ? 'Edit Inventory Item' : 'Post New Inventory Item'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {businessName} Storefront Catalog
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Product / Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chitenje A-Line Maxi Dress"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dresses, Grooming, Suits"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">SKU / Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CTJ-001"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Price in MWK *
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    step={500}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Sizes / Variant Options (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. S, M, L, XL or 50ml, 100ml"
                  value={formSizes}
                  onChange={(e) => setFormSizes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-xs"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  Shoppers will see these as selectable buttons in their shopping bag.
                </span>
              </div>

              <StorageImageUpload
                label="Product Photo"
                value={formImage}
                onChange={setFormImage}
                aspectRatio="square"
                required
                helperText="Select product photo from internal device storage (PNG, JPG, WEBP)"
              />

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Item Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Details regarding the fabric, origin, fit, care instructions..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formInStock"
                  checked={formInStock}
                  onChange={(e) => setFormInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer"
                />
                <label htmlFor="formInStock" className="font-semibold text-stone-800 cursor-pointer">
                  Mark as Available for Sale Online
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-stone-900 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingProductId ? 'Save Product Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
