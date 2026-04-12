import ClientLayout from "@/layouts/ClientLayout";
import Head from "next/head";
import styles from "@/styles/client/policy.module.css";

export default function PrivacyPolicy() {
  return (
    <ClientLayout>
      <Head>
        <title>Chính sách bảo mật | FEICHI</title>
      </Head>
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>CHÍNH SÁCH <span className={styles.titleHighlight}>BẢO MẬT THÔNG TIN</span></h1>
          </header>

          <div className={styles.contentCard}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>1</span>
                Mục đích thu thập
              </h2>
              <p>FEICHI thu thập thông tin khách hàng nhằm phục vụ các mục tiêu sau:</p>
              <ul className={styles.iconList}>
                <li className={styles.iconListItem}><i className="bi bi-cart-check text-success"/> Xử lý đơn hàng và thanh toán.</li>
                <li className={styles.iconListItem}><i className="bi bi-truck text-success"/> Thực hiện giao hàng và chăm sóc khách hàng.</li>
                <li className={styles.iconListItem}><i className="bi bi-graph-up-arrow text-success"/> Nghiên cứu và cải thiện chất lượng dịch vụ.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>2</span>
                Cam kết bảo mật & Phạm vi sử dụng
              </h2>
              <div className={styles.returnsBox} style={{ background: '#f8f9fa', borderStyle: 'solid', borderColor: '#eee' }}>
                <p>Thông tin của quý khách chỉ được sử dụng nội bộ công ty:</p>
                <ul className="mb-0">
                  <li>Tuyệt đối không chia sẻ cho bên thứ ba khi chưa có sự đồng ý của khách hàng.</li>
                  <li>Chỉ cung cấp cho cơ quan nhà nước có thẩm quyền khi có yêu cầu bằng văn bản.</li>
                  <li>Dữ liệu được lưu trữ an toàn trên hệ thống kỹ thuật hiện đại.</li>
                </ul>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>3</span>
                Quyền lợi của khách hàng
              </h2>
              <ul className={styles.iconList}>
                <li className={styles.iconListItem}>
                  <i className="bi bi-person-gear text-primary fs-4"/>
                  <span>Có quyền yêu cầu kiểm tra, cập nhật hoặc yêu cầu xóa thông tin cá nhân.</span>
                </li>
                <li className={styles.iconListItem}>
                  <i className="bi bi-shield-exclamation text-primary fs-4"/>
                  <span>Có quyền khiếu nại nếu phát hiện thông tin bị sử dụng sai mục đích cam kết.</span>
                </li>
              </ul>
            </section>

            <div className={styles.commitmentBox}>
              <h2 className={styles.commitmentTitle}>AN TOÀN TUYỆT ĐỐI</h2>
              <div className={styles.commitmentIcons}>
                 <div className={styles.commitmentItem}>
                  <i className="bi bi-shield-lock" />
                  <span className="fw-bold">Bảo vệ 24/7</span>
                </div>
                <div className={styles.commitmentItem}>
                  <i className="bi bi-key" />
                  <span className="fw-bold">Mã hóa dữ liệu</span>
                </div>
                <div className={styles.commitmentItem}>
                  <i className="bi bi-hand-thumbs-up" />
                  <span className="fw-bold">Tôn trọng quyền riêng tư</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
