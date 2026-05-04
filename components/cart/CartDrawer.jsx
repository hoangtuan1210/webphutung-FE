"use client";
import { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/client/cartDrawer.module.css";

const CartItem = memo(({ item, isSelected, onToggle, onUpdateQty, onRemove }) => {
  return (
    <li className={`${styles.item} ${isSelected ? styles.itemSelected : ""}`}>
      <div className="d-flex align-items-center me-2">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => onToggle(item.id)}
          className="form-check-input mt-0"
          style={{ width: 18, height: 18, cursor: 'pointer' }}
        />
      </div>

      <div className={styles.itemImg}>
        <Image
          src={item.image}
          fill
          alt={item.name}
          className={styles.itemImgEl}
          sizes="80px"
        />
      </div>

      <div className={styles.itemInfo}>
        <p className={styles.itemName}>{item.name}</p>
        <p className={styles.itemPrice}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ
        </p>

        <div className={styles.itemQty}>
          <button
            className={styles.qtyBtn}
            onClick={() => onUpdateQty(item.id, item.qty - 1)}
          >
            −
          </button>
          <span className={styles.qtyNum}>{item.qty}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => onUpdateQty(item.id, item.qty + 1)}
          >
            +
          </button>
        </div>
      </div>

      <button
        className={styles.removeBtn}
        onClick={() => onRemove(item.id)}
        aria-label="Xoá"
      >
        <i className="bi bi-trash3" />
      </button>
    </li>
  );
});

CartItem.displayName = "CartItem";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    selectedIds,
    toggleItemSelection,
    toggleSelectAll,
    removeItem,
    updateQty,
    totalPrice,
    clearCart,
  } = useCart();

  const isAllSelected = useMemo(() => 
    items.length > 0 && selectedIds.length === items.length,
  [items.length, selectedIds.length]);

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.header}>
          <div className="d-flex align-items-center gap-2">
             <input 
              type="checkbox" 
              checked={isAllSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
              className="form-check-input mt-0"
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <h5 className={styles.title} style={{ marginBottom: 0 }}>
              <i className="bi bi-cart3" /> Giỏ hàng
              {items.length > 0 && (
                <span className={styles.count}>{items.length}</span>
              )}
            </h5>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <i className="bi bi-cart-x" />
              <p>Giỏ hàng trống</p>
              <button
                className={styles.continueBtn}
                onClick={() => setIsOpen(false)}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <ul className={styles.list}>
              {items.map((item) => (
                <CartItem 
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.includes(item.id)}
                  onToggle={toggleItemSelection}
                  onUpdateQty={updateQty}
                  onRemove={removeItem}
                />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Tạm tính ({selectedIds.length})</span>
              <span className={styles.totalPrice}>
                {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ
              </span>
            </div>

            <Link
              href={selectedIds.length > 0 ? "/checkout" : "#"}
              className={`${styles.checkoutBtn} ${selectedIds.length === 0 ? "opacity-50" : ""}`}
              onClick={(e) => {
                if (selectedIds.length === 0) {
                   e.preventDefault();
                   return;
                }
                setIsOpen(false);
              }}
              style={selectedIds.length === 0 ? { cursor: 'not-allowed', pointerEvents: 'none' } : {}}
            >
              Thanh toán <i className="bi bi-arrow-right" />
            </Link>

            <button className={styles.clearBtn} onClick={clearCart}>
              <i className="bi bi-trash3" /> Xoá tất cả
            </button>
          </div>
        )}
      </div>
    </>
  );
}
