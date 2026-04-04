import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ClientLayout from "@/layouts/ClientLayout";
import styles from "@/styles/client/profile.module.css";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState({
    name: "Nguyễn Hoàng Tuấn",
    email: "nguyentuan2003@gmail.com",
    phone: "0345678912",
    address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
    avatar: "/default-avatar.png"
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success("Cập nhật thông tin thành công!");
  };

  const navItems = [
    { id: "info", label: "Thông tin cá nhân", icon: "bi-person" },
    { id: "password", label: "Đổi mật khẩu", icon: "bi-shield-lock" },
    { id: "address", label: "Địa chỉ đã lưu", icon: "bi-geo-alt" },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.profileContainer}>
          {/* Sidebar */}
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
              <h3 className={styles.userName}>{user.name}</h3>
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
              <Link href="/" className={`${styles.navItem} ${styles.logoutBtn}`}>
                <i className="bi bi-box-arrow-right" />
                Đăng xuất
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className={styles.mainContent}>
            {activeTab === "info" && (
              <section>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Thông tin cá nhân</h2>
                  <p className={styles.sectionDesc}>Cập nhật thông tin tài khoản của bạn tại đây</p>
                </div>

                <form className={styles.gridForm} onSubmit={handleUpdate}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Họ và tên</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      value={user.name}
                      onChange={(e) => setUser({...user, name: e.target.value})}
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
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Địa chỉ giao hàng</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      value={user.address}
                      onChange={(e) => setUser({...user, address: e.target.value})}
                      placeholder="Nhập địa chỉ của bạn..."
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
               <div style={{ textAlign: "center", padding: "4rem 0" }}>
                  <i className="bi bi-bag-x" style={{ fontSize: "3rem", color: "#ddd" }} />
                  <p style={{ marginTop: "1rem", color: "#888" }}>Bạn chưa có đơn hàng nào.</p>
                  <Link href="/products" className={styles.saveBtn} style={{ display: "inline-block", marginTop: "1rem", color: "white" }}>
                      Mua sắm ngay
                  </Link>
               </div>
            )}
            
            {activeTab !== "info" && activeTab !== "orders" && (
              <div style={{ padding: "4rem 0", textAlign: "center", color: "#888" }}>
                Tính năng đang được phát triển...
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