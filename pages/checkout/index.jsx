import ClientLayout from "@/layouts/ClientLayout";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/client/checkout.module.css";
import { checkoutService } from "@/services/checkoutService";
import { userService } from "@/services/userService";

export default function Checkout() {
  const { selectedItems, selectedTotalPrice, clearCart, setIsOpen } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    payment: "cod",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) newErrors.name = "Vui lòng nhập tên";
    if (!phoneRegex.test(form.phone)) newErrors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)";
    if (form.email && !emailRegex.test(form.email)) newErrors.email = "Email không hợp lệ";
    if (!form.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }

    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    let orderId = null;

    try {
      if (token) {
        let validAddressId = "";
        
        try {
           const addrRes = await userService.getAddresses();
           if (addrRes.data && addrRes.data.length > 0) {
              const defaultAddr = addrRes.data.find(a => a.isDefault) || addrRes.data[0];
              validAddressId = defaultAddr.id;
           } else {
              // Tạo mới một địa chỉ từ thông tin form
              const createRes = await userService.createAddress({
                  fullName: form.name,
                  phone: form.phone,
                  addressLine1: form.address,
                  addressLine2: form.note || "",
                  city: "Thành phố Hồ Chí Minh",
                  state: "Hồ Chí Minh",
                  postalCode: "700000",
                  country: "VN",
                  isDefault: true
              });
              if (createRes.data?.id) validAddressId = createRes.data.id;
              if (createRes.data?.data?.id) validAddressId = createRes.data.data.id;
           }
        } catch (error) {
           console.error("Lỗi địa chỉ:", error);
        }

        if (!validAddressId) {
           toast.error("Không thể tạo hoặc tìm thấy địa chỉ người dùng!");
           return;
        }

        const authPayload = {
          addressId: validAddressId,
          items: selectedItems.map(item => ({
            productId: (item.productId ?? item.id).toString(),
            quantity: item.qty
          })),
          couponCode: "",
          deliveryDate: new Date().toISOString(),
          deliverySlot: "",
          customerNotes: form.note
        };
        const res = await checkoutService.createOrder(authPayload);
        orderId = res.data?.id || res.data?.data?.id;
      } else {
        const guestPayload = {
          email: form.email || "guest@example.com",
          fullName: form.name,
          phoneNumber: form.phone,
          address: {
            fullName: form.name,
            phoneNumber: form.phone,
            streetAddress: form.address,
            ward: "",
            district: "",
            city: "",
            postalCode: ""
          },
          items: selectedItems.map(item => ({
            productId: (item.productId ?? item.id).toString(),
            quantity: item.qty
          })),
          couponCode: "",
          paymentMethod: form.payment,
          deliveryDate: new Date().toISOString(),
          deliverySlot: "",
          customerNotes: form.note
        };
        const res = await checkoutService.createGuestOrder(guestPayload);
        orderId = res.data?.id || res.data?.data?.id;
      }

      toast.success("Đặt hàng thành công! Vui lòng kiểm tra email của bạn.");
      clearCart();
      setTimeout(() => {
        if (token) {
          if (orderId) {
            router.push(`/order/${orderId}`);
          } else {
            router.push("/profile");
          }
        } else {
          router.push("/products");
        }
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Đã có lỗi xảy ra khi đặt hàng.");
    }
  };

  if (selectedItems.length === 0) {
    return (
      <ClientLayout>
        <div className="container py-5 text-center">
          <div className="py-5">
            <i className="bi bi-cart-x display-1 text-muted mb-4 opacity-50"></i>
            <h2 className="fw-bold mb-3">Chưa có sản phẩm nào được chọn!</h2>
            <p className="text-muted mb-4">Vui lòng quay lại giỏ hàng và chọn sản phẩm bạn muốn mua.</p>
            <Link href="/" className="btn btn-dark px-4 py-2 rounded-pill shadow-sm fw-bold">
              Quay lại mua sắm
            </Link>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className={styles.page}>
        <div className="container">
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>Trang chủ</Link>
            <i className={`bi bi-chevron-right ${styles.breadcrumbSeparator}`}></i>
            <span className={styles.breadcrumbActive}>Thanh toán</span>
          </nav>

          <div className="row g-4">
            {/* Left: Customer Info */}
            <div className="col-lg-7">
              <div className={`${styles.card} card`}>
                <div className="card-body p-4">
                  <h4 className={styles.sectionTitle}>Thông tin giao hàng</h4>
                  <form onSubmit={handleOrder} noValidate>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className={styles.formLabel}>Họ và tên <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          name="name"
                          className={`form-control form-control-lg ${styles.formInput} ${errors.name ? "is-invalid" : ""}`}
                          placeholder="Nguyễn Văn A"
                          value={form.name}
                          onChange={handleChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className={styles.formLabel}>Số điện thoại <span className="text-danger">*</span></label>
                        <input
                          type="tel"
                          name="phone"
                          className={`form-control form-control-lg ${styles.formInput} ${errors.phone ? "is-invalid" : ""}`}
                          placeholder="09xx xxx xxx"
                          value={form.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className={styles.formLabel}>Email</label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control form-control-lg ${styles.formInput} ${errors.email ? "is-invalid" : ""}`}
                          placeholder="example@gmail.com"
                          value={form.email}
                          onChange={handleChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                      <div className="col-12">
                        <label className={styles.formLabel}>Địa chỉ nhận hàng <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          name="address"
                          className={`form-control form-control-lg ${styles.formInput} ${errors.address ? "is-invalid" : ""}`}
                          placeholder="Số nhà, tên đường, phường/xã..."
                          value={form.address}
                          onChange={handleChange}
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </div>
                      <div className="col-12">
                        <label className={styles.formLabel}>Ghi chú (Tùy chọn)</label>
                        <textarea
                          name="note"
                          className={`form-control ${styles.formInput}`}
                          rows="3"
                          placeholder="Lời nhắn cho cửa hàng..."
                          value={form.note}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>

                    <h4 className={`${styles.sectionTitle} mt-5`}>Phương thức thanh toán</h4>
                    <div className="d-flex flex-column gap-3">
                      <label className={`${styles.paymentOption} ${form.payment === 'cod' ? styles.paymentOptionActive : ""}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={form.payment === "cod"}
                          onChange={handleChange}
                          className={`form-check-input ${styles.paymentRadio}`}
                        />
                        <div>
                          <p className="mb-0 fw-bold">Thanh toán khi nhận hàng (COD)</p>
                          <small className="text-muted">Nhận hàng rồi mới trả tiền</small>
                        </div>
                        <i className="bi bi-cash-coin ms-auto fs-3 text-success"></i>
                      </label>

                      <label className={`${styles.paymentOption} ${styles.paymentOptionDisabled}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="bank"
                          disabled
                          className={`form-check-input ${styles.paymentRadio}`}
                        />
                        <div>
                          <p className="mb-0 fw-bold text-muted">Chuyển khoản (Sắp ra mắt)</p>
                          <small className="text-muted">Hỗ trợ QR Code nhanh chóng</small>
                        </div>
                        <i className="bi bi-bank ms-auto fs-3 text-muted"></i>
                      </label>
                    </div>

                    <button type="submit" className={`${styles.confirmBtn} btn w-100 mt-5`}>
                      Xác nhận đặt hàng
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className={`${styles.card} ${styles.summaryCard} card`}>
                <div className="card-header bg-white border-0 p-4 pb-0">
                  <h4 className="fw-bold mb-0">Tóm tắt đơn hàng</h4>
                </div>
                <div className="card-body p-4">
                  <div className="checkout-items d-flex flex-column gap-3 mb-4">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="d-flex align-items-center gap-3">
                        <div className={styles.itemThumb}>
                          <Image src={item.image} fill alt={item.name} className={styles.thumbImg} />
                        </div>
                        <div className="flex-fill">
                          <p className="small fw-bold mb-0 text-truncate" style={{ maxWidth: 180 }}>{item.name}</p>
                          <small className="text-muted">
                            {item.price.toLocaleString("vi-VN")}đ <span className={styles.itemQty}>x{item.qty}</span>
                          </small>
                        </div>
                        <span className="fw-bold text-end">{(item.price * item.qty).toLocaleString("vi-VN")}đ</span>
                      </div>
                    ))}
                  </div>

                  <hr className={styles.divider} />

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Tạm tính ({selectedItems.length} sản phẩm)</span>
                    <span className="small">{selectedTotalPrice.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Phí vận chuyển</span>
                    <span className="text-success small fw-bold">Miễn phí</span>
                  </div>

                  <div className={styles.totalBox}>
                    <h5 className="mb-0" style={{ color: "#fff"}}>Tổng tiền</h5>
                    <h4 className={styles.totalPrice}>{selectedTotalPrice.toLocaleString("vi-VN")}đ</h4>
                  </div>

                  <div className={styles.securityNote}>
                    <p className="mb-0">
                      <i className="bi bi-shield-check text-success"></i> Đơn hàng được bảo mật & an toàn
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

