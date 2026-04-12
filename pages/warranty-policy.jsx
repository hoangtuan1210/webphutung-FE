import ClientLayout from "@/layouts/ClientLayout";

export default function WarrantyPolicy() {
  return (
    <ClientLayout>
      <main className="page" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
            Chính sách bảo hành
          </h1>
          
          <div style={{ lineHeight: 1.8, color: '#444' }}>
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>1. Phạm vi bảo hành</h2>
              <p>Tất cả sản phẩm phụ tùng, đồ chơi xe chính hãng được bán tại Website đều được áp dụng chính sách bảo hành theo tiêu chuẩn của nhà sản xuất.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>2. Thời gian bảo hành</h2>
              <p>Thời gian bảo hành dao động từ <b>3 đến 12 tháng</b> tùy loại sản phẩm (Có ghi rõ trong phần mô tả sản phẩm và thẻ bảo hành).</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>3. Các trường hợp không được bảo hành</h2>
              <ul style={{ listStyle: 'disc inside', paddingLeft: '1rem' }}>
                <li>Hết thời hạn bảo hành ghi trên thẻ/hệ thống.</li>
                <li>Hư hỏng do sử dụng sai kỹ thuật, độ xe không đúng cách.</li>
                <li>Sản phẩm đã bị tháo dỡ, sửa chữa bởi bên thứ ba không thuộc uỷ quyền.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
