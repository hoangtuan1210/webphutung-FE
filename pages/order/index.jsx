import { useState, useEffect } from "react";
import Link from "next/link";
import ClientLayout from "@/layouts/ClientLayout";
import { userService } from "@/services/userService";
import styles from "@/styles/client/profile.module.css";
import Image from "next/image";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const STATUS_MAP = {
    PENDING: "Đang chờ",
    SHIPPING: "Đang giao",
    DELIVERED: "Đã giao hàng",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  };

  useEffect(() => {
    window.location.href = "/";
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }
        
        const res = await userService.getOrders();
        
        let fetchedOrders = [];
        if (Array.isArray(res.data)) {
            fetchedOrders = res.data;
        } else if (res.data?.data) {
            fetchedOrders = res.data.data;
        }
        
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <ClientLayout>
      <div className="container py-5" style={{ minHeight: "70vh" }}>
        
        <nav className="mb-4 d-flex align-items-center gap-2 small">
          <Link href="/" className="text-secondary text-decoration-none hover-dark">Trang chủ</Link>
          <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.7rem" }} />
          <Link href="/profile" className="text-secondary text-decoration-none hover-dark">Tài khoản</Link>
          <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.7rem" }} />
          <span className="text-dark fw-bold">Đơn hàng của tôi</span>
        </nav>

        <h2 className="fw-bold mb-4">Lịch sử đơn hàng</h2>

        <div className="d-flex gap-2 mb-4 overflow-auto pb-2" style={{ whiteSpace: "nowrap" }}>
          {["ALL", "PENDING", "SHIPPING", "DELIVERED", "COMPLETED", "CANCELLED"].map(status => (
            <button
              key={status}
              className={`btn rounded-pill px-4 fw-semibold ${statusFilter === status ? "btn-dark" : "btn-outline-secondary"}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === "ALL" ? "Tất cả" : STATUS_MAP[status] || status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center p-5">
             <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Đang tải...</span>
             </div>
          </div>
        ) : orders.filter(o => statusFilter === "ALL" || o.status === statusFilter).length > 0 ? (
          <div className="row g-4">
            {orders.filter(o => statusFilter === "ALL" || o.status === statusFilter).map(order => (
              <div key={order.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 p-4 shadow-sm border-0 rounded-4" style={{ transition: "all 0.3s ease" }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">#{order.orderNumber || order.id.slice(0,8)}</h6>
                      <p className="small text-muted mb-0">
                         <i className="bi bi-calendar-event me-1"></i>
                         {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <span className={`badge bg-${order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                      {STATUS_MAP[order.status] || order.status}
                    </span>
                  </div>
                  
                  <div className="bg-light p-3 rounded-3 mb-3">
                     <div className="d-flex flex-column gap-2 mb-3">
                        {order.items?.map((item) => (
                          <div key={item.id} className="d-flex align-items-center gap-2">
                            <div style={{ position: "relative", width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff" }}>
                              <Image src={item.productImage || "/placeholder.jpg"} fill className="object-fit-cover" alt={item.productName} />
                            </div>
                            <div className="flex-fill" style={{ minWidth: 0 }}>
                              <p className="mb-0 small fw-semibold text-truncate">{item.productName}</p>
                              <p className="mb-0 small text-muted">x{item.quantity}</p>
                            </div>
                            <div className="small fw-bold">{item.price?.toLocaleString("vi-VN")}đ</div>
                          </div>
                        ))}
                     </div>
                     <hr className="my-2" style={{ opacity: 0.1 }} />
                     <div className="d-flex justify-content-between">
                        <span className="text-muted small">Tổng thanh toán ({order.items?.length || 0} món):</span>
                        <span className="text-danger fw-bold">{order.total?.toLocaleString("vi-VN") || order.totalAmount?.toLocaleString("vi-VN")}₫</span>
                     </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <Link href={`/order/${order.id}`} className="btn btn-outline-dark w-100 rounded-pill fw-semibold">
                      Xem chi tiết đơn hàng
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
              <i className="bi bi-bag-x mb-3 d-block" style={{ fontSize: "4rem", color: "#ddd" }} />
              <h5 className="fw-bold text-dark">Bạn chưa có đơn hàng nào</h5>
              <p className="text-muted mb-4">Hãy dạo quanh cửa hàng và chọn cho mình những sản phẩm ưng ý nhé.</p>
              <Link href="/products" className="btn btn-dark px-4 py-2 rounded-pill fw-bold">
                  Bắt đầu mua sắm
              </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .hover-dark:hover { color: #111 !important; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
      `}</style>
    </ClientLayout>
  );
}