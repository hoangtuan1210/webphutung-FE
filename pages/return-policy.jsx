import ClientLayout from "@/layouts/ClientLayout";
import Head from "next/head";
import styles from "@/styles/client/policy.module.css";

export default function ReturnPolicy() {
  return (
    <ClientLayout>
      <Head>
        <title>Chính sách đổi trả | Web Phụ Tùng</title>
      </Head>
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>CHÍNH SÁCH <span className={styles.titleHighlight}>ĐỔI TRẢ SẢN PHẨM</span></h1>
            <p className={styles.intro}>
              Nhằm đảm bảo quyền lợi tối đa cho khách hàng, chúng tôi áp dụng chính sách đổi mới sản phẩm linh hoạt đối với các lỗi phát sinh từ nhà sản xuất.
            </p>
          </header>

          <div className={styles.contentCard}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>1</span>
                Quy định đổi mới (07 Ngày Vàng)
              </h2>
              <div className={styles.returnsBox}>
                <div className={styles.returnsHighlight}>
                  <i className="bi bi-arrow-repeat" /> Đổi mới 100% trong vòng 7 ngày đầu tiên.
                </div>
                <p>
                  Nếu sản phẩm phát sinh lỗi kỹ thuật từ nhà sản xuất trong vòng <strong>07 ngày</strong> kể từ khi quý khách nhận hàng, cửa hàng sẽ hỗ trợ đổi sang sản phẩm mới hoàn toàn cùng loại.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>2</span>
                Điều kiện áp dụng đổi hàng
              </h2>
              <ul className={styles.iconList}>
                <li className={styles.iconListItem}>
                  <i className="bi bi-check2-square text-success fs-4"/>
                  <span><strong>Sản phẩm còn nguyên trạng:</strong> Chưa có dấu hiệu tháo rời, trầy xước nặng hoặc hư hỏng do tác động ngoại lực.</span>
                </li>
                <li className={styles.iconListItem}>
                  <i className="bi bi-check2-square text-success fs-4"/>
                  <span><strong>Đầy đủ phụ kiện:</strong> Phải còn nguyên bao bì, hộp đựng, tem nhãn của nhà sản xuất và tem cửa hàng.</span>
                </li>
                <li className={styles.iconListItem}>
                  <i className="bi bi-check2-square text-success fs-4"/>
                  <span><strong>Bằng chứng thực tế:</strong> Khách hàng vui lòng cung cấp video khui hàng (unbox) hoặc hình ảnh mô tả lỗi cụ thể.</span>
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.numberCircle}>3</span>
                Các trường hợp không hỗ trợ
              </h2>
              <div className="row g-4">
                <div className="col-md-6">
                   <ul className={styles.iconList}>
                    <li className={styles.iconListItem}><i className="bi bi-x-circle text-danger"/> Sản phẩm bị hư hỏng do lắp ráp sai kỹ thuật.</li>
                    <li className={styles.iconListItem}><i className="bi bi-x-circle text-danger"/> Sản phẩm đã qua sử dụng dẫn đến hao mòn tự nhiên.</li>
                  </ul>
                </div>
                <div className="col-md-6">
                   <ul className={styles.iconList}>
                    <li className={styles.iconListItem}><i className="bi bi-x-circle text-danger"/> Sản phẩm bị vào nước, chập cháy do nguồn điện.</li>
                    <li className={styles.iconListItem}><i className="bi bi-x-circle text-danger"/> Quá thời hạn 07 ngày quy định.</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className={styles.commitmentBox}>
              <h2 className={styles.commitmentTitle}>QUY TRÌNH XỬ LÝ NHANH</h2>
              <p className="mb-4">Chúng tôi cam kết giải quyết các yêu cầu đổi trả trong vòng 24h - 48h làm việc.</p>
              <div className={styles.commitmentIcons}>
                 <div className={styles.commitmentItem}>
                  <i className="bi bi-headset" />
                  <span className="fw-bold">Tiếp nhận thông tin</span>
                </div>
                <div className={styles.commitmentItem}>
                  <i className="bi bi-search" />
                  <span className="fw-bold">Kiểm tra kỹ thuật</span>
                </div>
                <div className={styles.commitmentItem}>
                   <i className="bi bi-box-seam" />
                  <span className="fw-bold">Gửi hàng thay thế</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-muted small fst-italic">
              * Sau 07 ngày, mọi sản phẩm sẽ được chuyển sang chế độ bảo hành theo quy định của cửa hàng.
            </p>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
