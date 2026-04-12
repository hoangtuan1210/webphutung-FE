import ClientLayout from "@/layouts/ClientLayout";
import Head from "next/head";
import styles from "@/styles/client/policy.module.css";

export default function WarrantyPolicy() {
  return (
    <ClientLayout>
      <Head>
        <title>Chính sách bảo hành & Đổi trả | FEICHI</title>
      </Head>
      <main className={styles.page}>
        <div className={styles.container}>
          
          <header className={styles.header}>
            <h1 className={styles.title}>
              CHÍNH SÁCH BẢO HÀNH <br/>
              <span className={styles.titleHighlight}>& ĐỔI TRẢ SẢN PHẨM</span>
            </h1>
            <p className={styles.intro}>
              FEICHI cam kết hỗ trợ khách hàng tối đa trong việc bảo hành và đổi trả sản phẩm lỗi nhằm đảm bảo trải nghiệm mua sắm tốt nhất.
            </p>
          </header>

          <div className={styles.contentCard}>
            
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>1</span>
                Điều kiện đổi trả
              </h2>
              <p>Khách hàng có thể yêu cầu đổi/trả trong các trường hợp sau:</p>
              <ul className={styles.iconList}>
                <li className={styles.iconListItem}>
                  <i className="bi bi-patch-check text-success fs-4"/> 
                  <span>Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất.</span>
                </li>
                <li className={styles.iconListItem}>
                  <i className="bi bi-patch-check text-success fs-4"/> 
                  <span>Giao sai sản phẩm, sai mẫu mã so với đơn hàng.</span>
                </li>
                <li className={styles.iconListItem}>
                  <i className="bi bi-patch-check text-success fs-4"/> 
                  <span>Sản phẩm bị hư hỏng trong quá trình vận chuyển.</span>
                </li>
              </ul>
              <div className={styles.noteText + " mt-3"}>
                <i className="bi bi-clock-history" />
                Thời gian đổi trả: <strong>Trong vòng 07 ngày</strong> kể từ khi nhận hàng.
              </div>
            </section>

            <div className="row g-4 mb-5">
              <div className="col-lg-6">
                <section>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.numberCircle}>2</span>
                    Điều kiện áp dụng
                  </h2>
                  <ul className={styles.iconList}>
                    <li className={styles.iconListItem}>
                      <i className="bi bi-check-lg text-primary"/> 
                      <span>Sản phẩm còn nguyên vẹn, chưa qua sử dụng.</span>
                    </li>
                    <li className={styles.iconListItem}>
                      <i className="bi bi-check-lg text-primary"/> 
                      <span>Có đầy đủ hóa đơn/chứng từ mua hàng.</span>
                    </li>
                    <li className={styles.iconListItem}>
                      <i className="bi bi-check-lg text-primary"/> 
                      <span>Có video/hình ảnh chứng minh lỗi (nếu cần).</span>
                    </li>
                  </ul>
                </section>
              </div>

              <div className="col-lg-6">
                <section>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.numberCircle}>3</span>
                    Trường hợp từ chối
                  </h2>
                  <ul className={styles.iconList}>
                    <li className={styles.iconListItem}>
                      <i className="bi bi-x-lg text-danger"/> 
                      <span>Sử dụng sai cách, sai mục đích kỹ thuật.</span>
                    </li>
                    <li className={styles.iconListItem}>
                      <i className="bi bi-x-lg text-danger"/> 
                      <span>Tự ý tháo rời hoặc sửa chữa sản phẩm.</span>
                    </li>
                    <li className={styles.iconListItem}>
                      <i className="bi bi-x-lg text-danger"/> 
                      <span>Hư hỏng do các tác động ngoại lực bên ngoài.</span>
                    </li>
                  </ul>
                </section>
              </div>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>4</span>
                Thông tin bảo hành
              </h2>
              <div className={styles.returnsBox} style={{ background: '#f8f9fa', borderStyle: 'solid', borderColor: '#eee' }}>
                <p>
                  Thời gian bảo hành tùy theo từng loại sản phẩm cụ thể (Vui lòng xem thông tin chi tiết trên trang sản phẩm hoặc phiếu bảo hành đi kèm).
                </p>
              </div>
            </section>

            <div className={styles.commitmentBox}>
              <h2 className={styles.commitmentTitle}>CHẤT LƯỢNG LÀ DANH DỰ</h2>
              <div className={styles.commitmentIcons}>
                <div className={styles.commitmentItem}>
                  <i className="bi bi-shield-check" />
                  <span className="fw-bold">Tin cậy</span>
                </div>
                <div className={styles.commitmentItem}>
                  <i className="bi bi-award" />
                  <span className="fw-bold">Chính hãng</span>
                </div>
                <div className={styles.commitmentItem}>
                  <i className="bi bi-heart-pulse" />
                  <span className="fw-bold">Tận tâm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
