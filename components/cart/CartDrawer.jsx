"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/client/cartDrawer.module.css";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQty,
    totalPrice,
    clearCart,
  } = useCart();

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.header}>
          <h5 className={styles.title}>
            <i className="bi bi-cart3" /> Giỏ hàng
            {items.length > 0 && (
              <span className={styles.count}>{items.length}</span>
            )}
          </h5>
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
              {items.map((item, index) => (
                <li key={item.id ?? index} className={styles.item}>
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
                      {item.price.toLocaleString("vi-VN")}đ
                    </p>

                    <div className={styles.itemQty}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, item.qty - 1)}
                      >
                        −
                      </button>
                      <span className={styles.qtyNum}>{item.qty}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.id)}
                    aria-label="Xoá"
                  >
                    <i className="bi bi-trash3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Tổng cộng</span>
              <span className={styles.totalPrice}>
                {totalPrice.toLocaleString("vi-VN")}đ
              </span>
            </div>

            <Link
              href="/checkout"
              className={styles.checkoutBtn}
              onClick={() => setIsOpen(false)}
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
