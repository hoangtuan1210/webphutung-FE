import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ClientLayout from "@/layouts/ClientLayout";
import styles from "@/styles/client/profile.module.css";
import { toast } from "react-hot-toast";
import { userService } from "@/services/userService";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "/default-avatar.png",
    address: ""
  });

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, addrRes, ordersRes] = await Promise.all([
          userService.getProfile().catch(() => ({ data: null })),
          userService.getAddresses().catch(() => ({ data: [] })),
          userService.getOrders().catch(() => ({ data: [] }))
        ]);

        if (profileRes.data) {
          setUser({
            ...profileRes.data,
            avatar: profileRes.data.avatar || "/default-avatar.png",
            name: `${profileRes.data.firstName || ""} ${profileRes.data.lastName || ""}`.trim() || "Người dùng"
          });
        }
        setAddresses(addrRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      };
      await userService.updateProfile(updateData);
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      toast.error(err.message || "Không thể cập nhật thông tin");
    }
  };

  const navItems = [
    { id: "info", label: "Thông tin cá nhân", icon: "bi-person" },
    { id: "address", label: "Địa chỉ đã lưu", icon: "bi-geo-alt" },
    { id: "password", label: "Đổi mật khẩu", icon: "bi-shield-lock" },
  ];

  if (loading) return <ClientLayout><div className="text-center p-5">Đang tải thông tin...</div></ClientLayout>;

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.profileContainer}>
          <aside className={styles.sidebar}>
            <div className={styles.userCard}>
              <div className={styles.avatarWrapper}>
                <Image 
                  src={user.avatar} 
                  alt={user.name} 
                  fill 
                  className={styles.avatarImg} 
                />
                <button className={styles.editAvatarBtn}>
                  <i className="bi bi-camera" />
                </button>
              </div>
              <h3 className={styles.userName}>{user.name} </h3>
              <p className={styles.userEmail}>{user.email}</p>
            </div>

            <nav className={styles.nav}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.navItem} ${activeTab === item.id ? styles.navActive : ""}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <i className={`bi ${item.icon}`} />
                  {item.label}
                </button>
              ))}
              <hr style={{ margin: "1rem 0", opacity: 0.1 }} />
              <button 
                className={`${styles.navItem} ${styles.logoutBtn}`}
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                <i className="bi bi-box-arrow-right" />
                Đăng xuất
              </button>
            </nav>
          </aside>

          <main className={styles.mainContent}>
            {activeTab === "info" && (
              <section>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Thông tin cá nhân</h2>
                  <p className={styles.sectionDesc}>Cập nhật thông tin tài khoản của bạn tại đây</p>
                </div>

                <form className={styles.gridForm} onSubmit={handleUpdate}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Họ</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      value={user.lastName}
                      onChange={(e) => setUser({...user, lastName: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tên</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      value={user.firstName}
                      onChange={(e) => setUser({...user, firstName: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input 
                      type="email" 
                      className={styles.input} 
                      value={user.email} 
                      disabled
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Số điện thoại</label>
                    <input 
                      type="tel" 
                      className={styles.input} 
                      value={user.phone}
                      onChange={(e) => setUser({...user, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className={styles.fullWidth}>
                    <button type="submit" className={styles.saveBtn}>
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </section>
            )}

            {activeTab === "orders" && (
               <div style={{ padding: "0 1rem" }}>
                  <h2 className={styles.sectionTitle}>Đơn hàng của tôi</h2>
                  {orders.length > 0 ? (
                    <div className="mt-4">
                      {orders.map(order => (
                        <div key={order.id} className="card mb-3 p-3 shadow-sm border-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6>Đơn hàng #{order.id.slice(0,8)}</h6>
                              <p className="small text-muted mb-0">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                            </div>
                            <span className={`badge bg-${order.status === 'DELIVERED' ? 'success' : 'warning'}`}>
                              {order.status}
                            </span>
                          </div>
                          <hr />
                          <p className="mb-0">Tổng tiền: <strong>{order.totalAmount.toLocaleString("vi-VN")}₫</strong></p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "4rem 0" }}>
                        <i className="bi bi-bag-x" style={{ fontSize: "3rem", color: "#ddd" }} />
                        <p style={{ marginTop: "1rem", color: "#888" }}>Bạn chưa có đơn hàng nào.</p>
                        <Link href="/products" className={styles.saveBtn} style={{ display: "inline-block", marginTop: "1rem", color: "white" }}>
                            Mua sắm ngay
                        </Link>
                    </div>
                  )}
               </div>
            )}

            {activeTab === "address" && (
               <div style={{ padding: "0 1rem" }}>
                  <h2 className={styles.sectionTitle}>Địa chỉ đã lưu</h2>
                  {addresses.length > 0 ? (
                    <div className="mt-4">
                      {addresses.map(addr => (
                        <div key={addr.id} className="card mb-3 p-3 shadow-sm border-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6>{addr.fullName} {addr.isDefault && <span className="badge bg-primary ms-2">Mặc định</span>}</h6>
                              <p className="mb-1 text-muted">{addr.phone}</p>
                              <p className="mb-0">{addr.addressLine1}, {addr.city}</p>
                            </div>
                            <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <p>Không có địa chỉ nào được lưu.</p>
                      <button className={styles.saveBtn}>Thêm địa chỉ mới</button>
                    </div>
                  )}
               </div>
            )}
            
            {activeTab === "password" && (
              <div style={{ padding: "0 1rem" }}>
                <h2 className={styles.sectionTitle}>Đổi mật khẩu</h2>
                <form className={styles.gridForm} style={{ maxWidth: "400px" }}>
                   <div className={styles.formGroup}>
                    <label className={styles.label}>Mật khẩu hiện tại</label>
                    <input type="password" className={styles.input} />
                  </div>
                   <div className={styles.formGroup}>
                    <label className={styles.label}>Mật khẩu mới</label>
                    <input type="password" className={styles.input} />
                  </div>
                  <button type="button" className={styles.saveBtn}>Cập nhật mật khẩu</button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

ProfilePage.getLayout = function getLayout(page) {
  return (
    <ClientLayout>
      {page}
    </ClientLayout>
  );
};