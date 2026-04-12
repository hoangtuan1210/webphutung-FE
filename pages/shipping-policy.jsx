import ClientLayout from "@/layouts/ClientLayout";
import Head from "next/head";
import styles from "@/styles/client/policy.module.css";

export default function ShippingPolicy() {
  return (
    <ClientLayout>
      <Head>
        <title>Chính sách vận chuyển | FEICHI</title>
      </Head>
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>CHÍNH SÁCH <span className={styles.titleHighlight}>VẬN CHUYỂN</span></h1>
          </header>

          <div className={styles.contentCard}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>1</span>
                Phạm vi và thời gian giao hàng
              </h2>
              <p>Chúng tôi cung cấp dịch vụ giao hàng trên toàn quốc với thời gian dự kiến như sau:</p>
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="p-4 rounded-4 bg-light border h-100 text-center">
                    <i className="bi bi-geo-alt fs-1 text-danger d-block mb-2" />
                    <h3 className="h6 fw-bold">Khu vực nội thành</h3>
                    <p className="small text-muted mb-0">Thời gian nhận hàng: <strong>1 – 3 ngày</strong> làm việc.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 rounded-4 bg-light border h-100 text-center">
                    <i className="bi bi-globe-central-south-asia fs-1 text-danger d-block mb-2" />
                    <h3 className="h6 fw-bold">Các tỉnh thành khác</h3>
                    <p className="small text-muted mb-0">Thời gian nhận hàng: <strong>3 – 7 ngày</strong> làm việc.</p>
                  </div>
                </div>
              </div>
              <p className="small fst-italic text-muted text-center">* Lưu ý: Thời gian giao hàng có thể thay đổi tùy thuộc vào điều kiện thời tiết hoặc tình trạng vận hành của đơn vị vận chuyển.</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>2</span>
                Phí vận chuyển và kiểm tra hàng
              </h2>
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className={styles.returnsBox} style={{ background: '#fff', borderStyle: 'solid', borderColor: '#eee', height: '100%', margin: 0 }}>
                    <h3 className="h6 fw-bold mb-3">Quy định phí ship</h3>
                    <ul className={styles.iconList}>
                      <li className={styles.iconListItem}><i className="bi bi-truck text-danger"/> Tính dựa trên khoảng cách địa lý.</li>
                      <li className={styles.iconListItem}><i className="bi bi-box-seam text-danger"/> Dựa trên khối lượng/kích thước sản phẩm.</li>
                      <li className={styles.iconListItem}><i className="bi bi-chat-dots text-danger"/> Phí được thông báo trước khi chốt đơn.</li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className={styles.returnsBox} style={{ background: '#fff', borderStyle: 'solid', borderColor: '#eee', height: '100%', margin: 0 }}>
                    <h3 className="h6 fw-bold mb-3">Quyền lợi kiểm tra</h3>
                    <ul className={styles.iconList}>
                      <li className={styles.iconListItem}><i className="bi bi-eye text-success"/> Kiểm tra hàng trước khi thanh toán (COD).</li>
                      <li className={styles.iconListItem}><i className="bi bi-x-square text-danger"/> Từ chối nhận nếu phát hiện lỗi hoặc hư hỏng.</li>
                      <li className={styles.iconListItem}><i className="bi bi-camera-video text-primary"/> Khuyến khích quay clip unbox để được hỗ trợ tốt nhất.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
