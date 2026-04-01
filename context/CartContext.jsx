"use client";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (items.length > 0 || localStorage.getItem("cart")) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);

  const addToCart = useCallback((product, qty = 1) => {
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

    toast.success(`${product.name} đã được thêm vào giỏ hàng`, {
      duration: 2200,
      position: "top-right",
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedIds((prev) => prev.filter((sId) => sId !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return removeItem(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setSelectedIds([]);
  }, []);

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

  const selectedItems = useMemo(() => 
    items.filter((item) => selectedIds.includes(item.id)),
  [items, selectedIds]);

  const totalQty = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const selectedQty = useMemo(() => selectedItems.reduce((sum, i) => sum + i.qty, 0), [selectedItems]);
  const selectedTotalPrice = useMemo(() => selectedItems.reduce((sum, i) => sum + i.price * i.qty, 0), [selectedItems]);

  const contextValue = useMemo(() => ({
    items,
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
    items, isOpen, selectedIds, selectedItems, 
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
