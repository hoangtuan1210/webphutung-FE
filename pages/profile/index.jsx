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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
     fullName: "",
     phone: "",
     addressLine1: "",
     city: "",
     isDefault: false
  });
  const [passwordForm, setPasswordForm] = useState({
     currentPassword: "",
     newPassword: "",
     confirmPassword: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, addrRes, ordersRes] = await Promise.all([
          userService.getProfile().catch(() => ({ data: null })),
          userService.getAddresses().catch(() => ({ data: [] })),
          userService.getOrders().catch(() => ({ data: [] }))
        ]);

        if (profileRes.success && profileRes.data) {
          setUser({
            ...profileRes.data,
            avatar: profileRes.data.avatar || "/default-avatar.png",
            name: `${profileRes.data.lastName || ""} ${profileRes.data.firstName || ""}`.trim() || "Người dùng"
          });
        }
        setAddresses(addrRes.data || []);
        
        let fetchedOrders = [];
        if (Array.isArray(ordersRes.data)) {
            fetchedOrders = ordersRes.data;
        } else if (ordersRes.data?.data) {
            fetchedOrders = ordersRes.data.data;
        }
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAddresses = async () => {
    try {
      const addrRes = await userService.getAddresses();
      setAddresses(addrRes.data || []);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá địa chỉ này?")) return;
    try {
      await userService.deleteAddress(id);
      toast.success("Xoá địa chỉ thành công!");
      fetchAddresses();
    } catch (err) {
      toast.error(err.message || "Không thể xoá địa chỉ");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userService.setDefaultAddress(id);
      toast.success("Đã thiết lập địa chỉ mặc định!");
      fetchAddresses();
    } catch (err) {
      toast.error(err.message || "Không thể thiết lập mặc định");
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      city: addr.city,
      isDefault: addr.isDefault
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress.id, addressForm);
        toast.success("Cập nhật địa chỉ thành công!");
      } else {
        await userService.createAddress(addressForm);
        toast.success("Thêm địa chỉ mới thành công!");
      }
      setIsAddressModalOpen(false);
      setEditingAddress(null);
      setAddressForm({ fullName: "", phone: "", addressLine1: "", city: "", isDefault: false });
      fetchAddresses();
    } catch (err) {
      toast.error(err.message || "Không thể lưu địa chỉ");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
    }

    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại với mật khẩu mới.", { duration: 3000 });
      
      // Chờ một chút để user đọc thông báo rồi logout
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      toast.error(err.message || "Đổi mật khẩu thất bại");
    }
  };

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
                      {orders.map(order => {
                         const STATUS_MAP = {
                           PENDING: "Đang chờ",
                           SHIPPING: "Đang giao",
                           DELIVERED: "Đã bị giao",
                           COMPLETED: "Hoàn thành",
                           CANCELLED: "Đã hủy"
                         };
                         return (
                        <div key={order.id} className="card mb-3 p-3 shadow-sm border-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6>Đơn hàng #{order.orderNumber || order.id.slice(0,8)}</h6>
                              <p className="small text-muted mb-0">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                            </div>
                            <span className={`badge bg-${order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                              {STATUS_MAP[order.status] || order.status}
                            </span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <p className="mb-0">Tổng tiền: <strong>{order.total?.toLocaleString("vi-VN") || order.totalAmount?.toLocaleString("vi-VN")}₫</strong></p>
                            <Link href={`/order/${order.id}`} className="btn btn-sm btn-outline-dark rounded-pill px-3">
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                        );
                      })}
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
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Địa chỉ đã lưu</h2>
                    <button 
                      className="btn btn-dark btn-sm rounded-pill px-3"
                      onClick={() => {
                        setEditingAddress(null);
                        setAddressForm({ fullName: "", phone: "", addressLine1: "", city: "", isDefault: false });
                        setIsAddressModalOpen(true);
                      }}
                    >
                      <i className="bi bi-plus-lg me-1" /> Thêm địa chỉ mới
                    </button>
                  </div>

                  {isAddressModalOpen && (
                    <div className="card p-4 mb-4 shadow-sm border-0 bg-light">
                      <h5>{editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</h5>
                      <form onSubmit={handleSaveAddress} className="mt-3">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label small fw-bold">Họ và tên</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              required
                              value={addressForm.fullName}
                              onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-bold">Số điện thoại</label>
                            <input 
                              type="tel" 
                              className="form-control" 
                              required
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label small fw-bold">Địa chỉ chi tiết</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              required
                              value={addressForm.addressLine1}
                              onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-bold">Thành phố/Tỉnh</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              required
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                            />
                          </div>
                          <div className="col-12">
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="isDefault"
                                checked={addressForm.isDefault}
                                onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                              />
                              <label className="form-check-label small" htmlFor="isDefault">
                                Đặt làm địa chỉ mặc định
                              </label>
                            </div>
                          </div>
                          <div className="col-12 d-flex gap-2">
                            <button type="submit" className="btn btn-primary btn-sm px-4">Lưu</button>
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary btn-sm px-4"
                              onClick={() => setIsAddressModalOpen(false)}
                            >Hủy</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {addresses.length > 0 ? (
                    <div className="mt-4">
                       {addresses.map(addr => (
                        <div key={addr.id} className="card mb-3 p-3 shadow-sm border-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6>{addr.fullName} 
                                {addr.isDefault ? (
                                  <span className="badge bg-success ms-2">Mặc định</span>
                                ) : (
                                  <button 
                                    className="btn btn-sm btn-link p-0 ms-2 text-primary"
                                    onClick={() => handleSetDefault(addr.id)}
                                    style={{ fontSize: '0.8rem', textDecoration: 'none' }}
                                  >
                                    Thiết lập mặc định
                                  </button>
                                )}
                              </h6>
                              <p className="mb-1 text-muted">{addr.phone}</p>
                              <p className="mb-0">{addr.addressLine1}, {addr.city}</p>
                            </div>
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm btn-outline-dark"
                                onClick={() => handleEditAddress(addr)}
                                title="Sửa địa chỉ"
                              >
                                <i className="bi bi-pencil" />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteAddress(addr.id)}
                                title="Xoá địa chỉ"
                              >
                                <i className="bi bi-trash" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !isAddressModalOpen && (
                    <div className="text-center py-5">
                      <p>Không có địa chỉ nào được lưu.</p>
                      <button 
                        className={styles.saveBtn}
                        onClick={() => setIsAddressModalOpen(true)}
                      >Thêm địa chỉ mới</button>
                    </div>
                  )}
               </div>
            )}
            
            {activeTab === "password" && (
              <div style={{ padding: "0 1rem" }}>
                <h2 className={styles.sectionTitle}>Đổi mật khẩu</h2>
                <form className={styles.gridForm} style={{ maxWidth: "480px" }} onSubmit={handleChangePassword}>
                   <div className={styles.formGroup}>
                    <label className={styles.label}>Mật khẩu hiện tại</label>
                    <input 
                      type="password" 
                      className={styles.input} 
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>
                   <div className={styles.formGroup}>
                    <label className={styles.label}>Mật khẩu mới</label>
                    <input 
                      type="password" 
                      className={styles.input} 
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="Ít nhất 6 ký tự"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Xác nhận mật khẩu mới</label>
                    <input 
                      type="password" 
                      className={styles.input} 
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                  <div className={styles.fullWidth}>
                    <button type="submit" className={styles.saveBtn} style={{ width: 'fit-content', padding: '0.75rem 2rem' }}>
                      Cập nhật mật khẩu
                    </button>
                  </div>
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