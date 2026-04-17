import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import ClientLayout from "@/layouts/ClientLayout";
import styles from "@/styles/client/orderDetail.module.css";
import { userService } from "@/services/userService";

const STATUS_MAP = {
  PENDING: "Đang chờ",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao hàng",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

function normalizeOrder(raw) {
  if (!raw) return null;

  const items = (raw.items ?? raw.orderItems ?? []).map((item) => ({
    id: item.id,
    name: item.productName ?? item.product?.name ?? item.name ?? "Sản phẩm",
    qty: item.quantity ?? item.qty ?? 1,
    price: parseFloat(item.productPrice ?? item.price ?? item.unitPrice ?? item.unit_price ?? item.product?.price ?? item.product?.unitPrice ?? item.product?.unit_price ?? 0),
    image:
      item.productImage ??
      item.product?.images?.[0]?.url ??
      item.product?.image ??
      item.image ??
      "/placeholder.jpg",
  }));
  
  let addressStr = "";
  if (raw.address && typeof raw.address === "object") {
    const { addressLine1, city, state, country } = raw.address;
    addressStr = [addressLine1, city, state, country].filter(Boolean).join(", ");
  } else {
    addressStr = raw.shippingAddress ?? raw.address ?? "";
  }

  return {
    id: raw.id ?? raw.orderCode,
    orderNumber: raw.orderNumber ?? raw.id,
    date: raw.createdAt
      ? new Date(raw.createdAt).toLocaleDateString("vi-VN")
      : "",
    status: raw.status ?? "PENDING",
    total: parseFloat(raw.total ?? raw.totalAmount ?? 0),
    shipping: raw.shippingMethod ?? "Giao hàng tiêu chuẩn",
    payment: raw.paymentMethod ?? "COD (Thanh toán khi nhận hàng)",
    address: addressStr,
    phone: raw.address?.phone ?? raw.phone ?? raw.customerPhone ?? "",
    email: raw.email ?? raw.customerEmail ?? "",
    name: raw.address?.fullName ?? raw.customerName ?? raw.name ?? "",
    trackingCode: raw.trackingCode ?? null,
    items,
  };
}

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.location.href = "/";
  }, []);

  useEffect(() => {
    if (!id) return;
    
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
           router.push("/login");
           return;
        }

        const res = await userService.getOrders();
        
        let fetchedOrders = [];
        if (Array.isArray(res.data)) {
            fetchedOrders = res.data;
        } else if (res.data?.data) {
            fetchedOrders = res.data.data;
        }
        
        const selectedOrder = fetchedOrders.find(o => o.id === id || o.orderNumber === id);
        
        if (selectedOrder) {
            setOrder(normalizeOrder(selectedOrder));
        } else {
            setOrder(null);
        }
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);

  if (loading) {
     return (
       <ClientLayout>
         <div className="container py-5 text-center">
            <div className="spinner-border text-dark mt-5" role="status">
                <span className="visually-hidden">Đang tải...</span>
            </div>
         </div>
       </ClientLayout>
     );
  }

  if (!order) {
    return (
      <ClientLayout>
        <div className="container py-5 text-center">
          <div className="py-5">
            <h2 className="fw-bold mb-3">Đơn hàng không tồn tại!</h2>
            <Link href="/order" className="btn btn-dark px-4 py-2 mt-3 rounded-pill">
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className={styles.container}>
        <div className="container">
          <nav className="mb-4 d-flex align-items-center gap-2 small">
            <Link href="/" className="text-secondary text-decoration-none hover-dark">Trang chủ</Link>
            <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.7rem" }} />
            <Link href="/order" className="text-secondary text-decoration-none hover-dark">Đơn hàng</Link>
            <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.7rem" }} />
            <span className="text-dark fw-bold">{order.orderNumber}</span>
          </nav>

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h2 className={`${styles.title} mb-0`}>Chi tiết đơn hàng</h2>
            <span className={`${styles.status} ${styles[order.status]}`}>
              {STATUS_MAP[order.status] ?? order.status}
            </span>
          </div>

          <div className="row g-4">
            {/* ====== LEFT ====== */}
            <div className="col-lg-8">
              <div className={styles.orderCard}>
                <h5 className="fw-bold mb-4 border-start border-4 border-dark ps-2">
                  Sản phẩm đã đặt
                </h5>
                <div className={styles.itemList}>
                  {order.items.map((item, idx) => (
                    <div key={item.id ?? idx} className={styles.item}>
                      <div className={styles.itemImage}>
                        <Image
                          src={item.image}
                          fill
                          alt={item.name}
                          className="object-fit-cover"
                        />
                      </div>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{item.name}</div>
                        <div className="fw-bold">
                          {item.price.toLocaleString("vi-VN")}đ{" "}
                          <span className="text-muted fw-normal fs-6">x{item.qty}</span>
                        </div>
                      </div>
                      <div className={styles.itemTotal}>
                        {(item.price * item.qty).toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-top border-light">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Tổng tiền hàng</span>
                    <span className="fw-semibold">{order.total.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted small">Phí vận chuyển</span>
                    <span className="text-success fw-bold">Miễn phí</span>
                  </div>
                  <div className="d-flex justify-content-between mt-3 pt-3 border-top border-2 border-dark">
                    <h4 className="fw-bold mb-0">Thành tiền</h4>
                    <h4 className="fw-bold text-danger mb-0">
                      {order.total.toLocaleString("vi-VN")}đ
                    </h4>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-4 shadow-sm p-4 bg-white rounded-4 border">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-clock-history me-2 text-primary" /> Trạng thái vận chuyển
                </h5>
                <div className="ps-2">
                  <div className={styles.timelineItem}>
                    <div className={`${styles.timelineIcon} bg-success shadow-sm`}>
                      <i className="bi bi-check-lg" />
                    </div>
                    <div className="flex-fill">
                      <div className="fw-bold text-dark">Đơn hàng đã đặt</div>
                      <small className="text-muted d-block">{order.date}</small>
                      <p className="small text-muted mt-1 mb-0">
                        Hệ thống đã ghi nhận đơn hàng và đang chờ xác nhận.
                      </p>
                    </div>
                  </div>

                  {["SHIPPING", "COMPLETED", "DELIVERED"].includes(order.status) && (
                    <div className={styles.timelineItem}>
                      <div className={`${styles.timelineIcon} bg-primary shadow-sm`}>
                        <i className="bi bi-truck" />
                      </div>
                      <div className="flex-fill">
                        <div className="fw-bold text-dark">Đang vận chuyển</div>
                        <p className="small text-muted mt-1 mb-0">
                          Đơn hàng đang trên đường đến địa điểm giao hàng.
                        </p>
                      </div>
                    </div>
                  )}

                  {["COMPLETED", "DELIVERED"].includes(order.status) && (
                    <div className={styles.timelineItem}>
                      <div className={`${styles.timelineIcon} bg-success shadow-sm`}>
                        <i className="bi bi-house-check" />
                      </div>
                      <div className="flex-fill">
                        <div className="fw-bold text-dark">Đã giao hàng</div>
                        <p className="small text-muted mt-1 mb-0">
                          Đơn hàng đã được giao thành công.
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === "CANCELLED" && (
                    <div className={styles.timelineItem}>
                      <div className={`${styles.timelineIcon} bg-danger shadow-sm`}>
                        <i className="bi bi-x-lg" />
                      </div>
                      <div className="flex-fill">
                        <div className="fw-bold text-dark">Đã hủy đơn</div>
                        <p className="small text-muted mt-1 mb-0">
                          Đơn hàng đã bị hủy.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ====== RIGHT ====== */}
            <div className="col-lg-4">
              <div className={`${styles.customerCard} card mb-4`}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 border-start border-4 border-dark ps-2">
                    Khách hàng
                  </h5>
                  <div className={styles.infoSection}>
                    <div className={styles.infoLabel}>Người nhận</div>
                    <div className={styles.infoValue}>{order.name}</div>
                  </div>
                  <div className={styles.infoSection}>
                    <div className={styles.infoLabel}>Số điện thoại & Email</div>
                    <div className={styles.infoValue}>{order.phone}</div>
                    <div className="text-muted small">{order.email}</div>
                  </div>
                  <div className="mb-0">
                    <div className={styles.infoLabel}>Địa chỉ nhận hàng</div>
                    <div className={styles.infoValue}>{order.address}</div>
                  </div>
                </div>
              </div>

              <div className={`${styles.customerCard} card px-2`}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 border-start border-4 border-dark ps-2">
                    Thanh toán
                  </h5>
                  <div className={styles.infoSection}>
                    <div className={styles.infoLabel}>Phương thức</div>
                    <div className={styles.infoValue}>{order.payment}</div>
                  </div>
                  <div className="mb-0">
                    <div className={styles.infoLabel}>Mã vận đơn</div>
                    <div className="fw-bold text-primary text-decoration-underline">
                      {order.trackingCode ?? "Chưa có mã vận đơn"}
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn btn-dark w-100 btn-lg rounded-pill fw-bold py-3 mt-4 shadow-lg border-0 transform-active">
                <i className="bi bi-chat-dots-fill me-2" /> Liên hệ hỗ trợ
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-dark:hover { color: #111 !important; }
        .transform-active:active { transform: scale(0.98); }
      `}</style>
    </ClientLayout>
  );
}

