import ClientLayout from "@/layouts/ClientLayout";
import Head from "next/head";
import styles from "@/styles/client/policy.module.css";

export default function PaymentPolicy() {
  return (
    <ClientLayout>
      <Head>
        <title>Chính sách thanh toán | FEICHI</title>
      </Head>
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>CHÍNH SÁCH <span className={styles.titleHighlight}>THANH TOÁN</span></h1>
          </header>

          <div className={styles.contentCard}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>1</span>
                Các hình thức thanh toán
              </h2>
              <div className="row g-4">
                {[
                  { icon: "bi-cash-stack", title: "Thanh toán COD", desc: "Thanh toán trực tiếp cho đơn vị vận chuyển khi nhận hàng." },
                  { icon: "bi-bank", title: "Chuyển khoản", desc: "Thanh toán trước qua tài khoản ngân hàng của công ty." },
                  { icon: "bi-wallet2", title: "Ví điện tử", desc: "Hỗ trợ MoMo, ZaloPay và các cổng thanh toán online (nếu có)." },
                ].map((item, idx) => (
                  <div key={idx} className="col-md-4">
                    <div className="p-4 rounded-4 bg-light text-center h-100 border">
                      <i className={`bi ${item.icon} fs-1 text-danger mb-3 d-block`} />
                      <h3 className="h6 fw-bold">{item.title}</h3>
                      <p className="small text-muted mb-0">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>2</span>
                Quy định chi tiết
              </h2>
              <ul className={styles.iconList}>
                <li className={styles.iconListItem}>
                  <i className="bi bi-gear-wide-connected text-primary fs-4"/>
                  <span>Đơn hàng sẽ được xử lý ngay sau khi xác nhận thông tin đầy đủ.</span>
                </li>
                <li className={styles.iconListItem}>
                  <i className="bi bi-shield-check text-primary fs-4"/>
                  <span><strong>Đối với chuyển khoản:</strong> Khách hàng vui lòng thanh toán trước 100% giá trị đơn hàng.</span>
                </li>
                <li className={styles.iconListItem}>
                  <i className="bi bi-box-seam text-primary fs-4"/>
                  <span><strong>Đối với COD:</strong> Khách hàng thanh toán đầy đủ 100% cho shipper khi nhận hàng.</span>
                </li>
              </ul>
            </section>

            <section className={styles.returnsBox}>
               <h2 className={`${styles.sectionTitle} ${styles.returnsTitle}`}>
                <span className={styles.numberCircle}>!</span>
                Lưu ý quan trọng
              </h2>
              <ul className={styles.iconList}>
                <li className={styles.iconListItem}>
                  <i className="bi bi-exclamation-triangle-fill text-danger"/>
                  <span>Vui lòng kiểm tra kỹ thông tin người nhận, số điện thoại và địa chỉ để tránh sai sót.</span>
                </li>
                <li className={styles.iconListItem}>
                  <i className="bi bi-exclamation-triangle-fill text-danger"/>
                  <span>Chúng tôi không chịu trách nhiệm với các trường hợp cung cấp sai thông tin giao hàng dẫn đến thất lạc.</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
