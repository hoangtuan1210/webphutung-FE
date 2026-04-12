"use client";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import { cartService } from "@/services/cartService";

const CartContext = createContext(null);

// Helper: kiểm tra user đã đăng nhập chưa
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
};

// Normalize item từ API response sang format nội bộ
const normalizeApiItem = (item) => ({
  id: item.id,           // itemId trong cart (không phải productId)
  productId: item.productId,
  name: item.productName ?? item.name ?? "Sản phẩm",
  price: parseFloat(item.price ?? item.unitPrice ?? 0),
  image: item.productImage ?? item.image ?? "/placeholder.jpg",
  qty: item.quantity ?? item.qty ?? 1,
});

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [cartId, setCartId] = useState(null);

  // ─── Khởi tạo: load cart từ API (nếu đã login) hoặc localStorage (guest) ───
  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn()) {
        try {
          const res = await cartService.getCart();
          if (res?.success && res.data) {
            const serverItems = (res.data.items ?? []).map(normalizeApiItem);
            setCartId(res.data.id);
            setItems(serverItems);
            setSelectedIds(serverItems.map((i) => i.id));
          }
        } catch (e) {
          console.error("Failed to load server cart", e);
        }
      } else {
        // Guest: đọc từ localStorage
        const saved = localStorage.getItem("cart");
        if (saved) {
          try {
            const parsedItems = JSON.parse(saved);
            setItems(parsedItems);
            setSelectedIds(parsedItems.map((i) => i.id));
          } catch (e) {
            console.error("Failed to parse cart", e);
          }
        }
      }
    };

    loadCart();
  }, []);

  // ─── Persist localStorage cho guest ───
  useEffect(() => {
    if (!isLoggedIn()) {
      if (items.length > 0 || localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify(items));
      }
    }
  }, [items]);

  // ─── Thêm vào giỏ ───
  const addToCart = useCallback(async (product, qty = 1) => {
    if (isLoggedIn()) {
      try {
        // Gọi API: productId thật sự của sản phẩm
        const res = await cartService.addItem(product.id, qty);
        if (res?.success && res.data) {
          // Re-fetch cart để đảm bảo sync
          const cartRes = await cartService.getCart();
          if (cartRes?.success && cartRes.data) {
            const serverItems = (cartRes.data.items ?? []).map(normalizeApiItem);
            setCartId(cartRes.data.id);
            setItems(serverItems);
            setSelectedIds((prev) => {
              const newIds = serverItems.map((i) => i.id);
              return [...new Set([...prev, ...newIds])];
            });
          }
        }
      } catch (e) {
        console.error("Failed to add item to server cart", e);
        toast.error("Không thể thêm vào giỏ hàng");
        return;
      }
    } else {
      // Guest: dùng localStorage
      setItems((prev) => {
        const exist = prev.find((i) => i.id === product.id);
        if (exist) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + qty } : i,
          );
        }
        return [...prev, { ...product, qty }];
      });
      setSelectedIds((prev) =>
        prev.includes(product.id) ? prev : [...prev, product.id]
      );
    }

    toast.success(`${product.name} đã được thêm vào giỏ hàng`, {
      duration: 2200,
      position: "top-right",
    });
  }, []);

  // ─── Xoá 1 item ───
  const removeItem = useCallback(async (id) => {
    if (isLoggedIn()) {
      try {
        await cartService.removeItem(id);
      } catch (e) {
        console.error("Failed to remove cart item", e);
      }
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedIds((prev) => prev.filter((sId) => sId !== id));
  }, []);

  // ─── Cập nhật số lượng ───
  const updateQty = useCallback(async (id, qty) => {
    if (qty < 1) return removeItem(id);
    if (isLoggedIn()) {
      try {
        await cartService.updateItem(id, qty);
      } catch (e) {
        console.error("Failed to update cart item qty", e);
      }
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, [removeItem]);

  // ─── Xoá toàn bộ ───
  const clearCart = useCallback(async () => {
    if (isLoggedIn()) {
      try {
        await cartService.clearCart();
      } catch (e) {
        console.error("Failed to clear server cart", e);
      }
    }
    setItems([]);
    setSelectedIds([]);
    localStorage.removeItem("cart");
  }, []);

  // ─── Chọn / bỏ chọn ───
  const toggleItemSelection = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback((checkAll) => {
    if (checkAll) {
      setSelectedIds(items.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  }, [items]);

  // ─── Computed ───
  const selectedItems = useMemo(() =>
    items.filter((item) => selectedIds.includes(item.id)),
  [items, selectedIds]);

  const totalQty = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const selectedQty = useMemo(() => selectedItems.reduce((sum, i) => sum + i.qty, 0), [selectedItems]);
  const selectedTotalPrice = useMemo(() => selectedItems.reduce((sum, i) => sum + i.price * i.qty, 0), [selectedItems]);

  const contextValue = useMemo(() => ({
    items,
    cartId,
    isOpen,
    setIsOpen,
    selectedIds,
    selectedItems,
    toggleItemSelection,
    toggleSelectAll,
    addToCart,
    removeItem,
    updateQty,
    clearCart,
    totalQty,
    selectedQty,
    selectedTotalPrice,
    totalPrice: selectedTotalPrice,
  }), [
    items, cartId, isOpen, selectedIds, selectedItems,
    toggleItemSelection, toggleSelectAll, addToCart,
    removeItem, updateQty, clearCart, totalQty,
    selectedQty, selectedTotalPrice
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
