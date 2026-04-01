import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClientLayout from "@/layouts/ClientLayout";
import styles from "@/styles/client/order.module.css";

import { MOCK_ORDERS, STATUS_MAP as GLOBAL_STATUS } from "@/data/order";

const STATUS_TABS = {
  all: "Tất cả",
  pending: "Chờ xử lý",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders = 
    activeTab === "all" 
      ? MOCK_ORDERS 
      : MOCK_ORDERS.filter(o => o.status === activeTab);

  return (
    <ClientLayout>
      <div className={styles.container}>
        <div className="container">
          <nav className="mb-4 d-flex align-items-center gap-2 small">
            <Link href="/" className="text-secondary text-decoration-none hover-dark">Trang chủ</Link>
            <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.7rem' }}></i>
            <span className="text-dark fw-bold">Đơn hàng</span>
          </nav>

          <h1 className={styles.title}>Đơn hàng của tôi</h1>

          <div className={styles.tabs}>
            {Object.keys(STATUS_TABS).map((status) => (
              <button
                key={status}
                className={`${styles.tabBtn} ${activeTab === status ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(status)}
              >
                {STATUS_TABS[status]}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className={styles.orderList}>
            {filteredOrders.length === 0 ? (
              <div className="py-5 text-center bg-white rounded-4 shadow-sm">
                <i className="bi bi-receipt display-4 text-muted mb-3 opacity-50 d-block"></i>
                <p className="text-muted fw-bold">Không có đơn hàng nào trong danh mục này.</p>
                <Link href="/" className="btn btn-dark px-4 py-2 mt-3 rounded-pill">Tiếp tục mua hàng</Link>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className="d-flex align-items-center gap-3">
                      <i className="bi bi-box-seam fs-4"></i>
                      <div>
                        <div className={styles.orderId}>Mã đơn: {order.id}</div>
                        <small className="text-muted">Ngày đặt: {order.date}</small>
                      </div>
                    </div>
                    <span className={`${styles.status} ${styles[order.status]}`}>
                      {GLOBAL_STATUS[order.status]?.label || order.status}
                    </span>
                  </div>

                  <div className={styles.itemList}>
                    {order.items.map((item, idx) => (
                      <div key={idx} className={styles.item}>
                        <div className={styles.itemImage}>
                          <Image src={item.image} fill alt={item.name} className="object-fit-cover" />
                        </div>
                        <div className={styles.itemInfo}>
                          <div className={styles.itemName}>{item.name}</div>
                          <div className={styles.itemPrice}>Số lượng: {item.qty}</div>
                        </div>
                        <div className={styles.itemTotal}>
                          {(item.price * item.qty).toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderFooter}>
                    <div>
                      <div className={styles.totalLabel}>Tổng số tiền:</div>
                      <div className={styles.totalPrice}>{order.total.toLocaleString("vi-VN")}đ</div>
                    </div>
                    <div className={styles.actions}>
                      <Link href={`/order/${order.id}`} className={styles.btnDetail}>Xem chi tiết</Link>
                      <button className={styles.btnReorder}>Mua lại</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
