import ClientLayout from "@/layouts/ClientLayout";

export default function ReturnPolicy() {
  return (
    <ClientLayout>
      <main className="page" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
            Chính sách đổi trả
          </h1>
          
          <div style={{ lineHeight: 1.8, color: '#444' }}>
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>1. Thời hạn đổi trả</h2>
              <p>Khách hàng có quyền yêu cầu đổi trả sản phẩm trong vòng <b>7 ngày</b> kể từ ngày nhận được hàng.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>2. Điều kiện đổi trả</h2>
              <ul style={{ listStyle: 'disc inside', paddingLeft: '1rem' }}>
                <li>Sản phẩm còn nguyên tem, mác, chưa qua sử dụng hoặc lắp đặt.</li>
                <li>Sản phẩm không bị trầy xước, móp méo do lỗi từ phía khách hàng.</li>
                <li>Có hoá đơn mua hàng hoặc thông tin đơn hàng trên hệ thống.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>3. Chi phí vận chuyển</h2>
              <p>Trường hợp lỗi do nhà sản xuất (giao sai hàng, hàng hỏng hóc), Web Phụ Tùng sẽ chịu 100% phí ship đổi trả. Trường hợp đổi trả theo ý muốn, khách hàng sẽ chịu phí vận chuyển 2 chiều.</p>
            </section>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
