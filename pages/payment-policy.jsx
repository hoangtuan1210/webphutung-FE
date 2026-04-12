import ClientLayout from "@/layouts/ClientLayout";

export default function PaymentPolicy() {
  return (
    <ClientLayout>
      <main className="page" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
            Phương thức thanh toán
          </h1>
          
          <div style={{ lineHeight: 1.8, color: '#444' }}>
            <p className="mb-4">Tại Web Phụ Tùng, chúng tôi hỗ trợ đa dạng các phương thức thanh toán để quý khách dễ dàng lựa chọn:</p>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>1. Thanh toán khi nhận hàng (COD)</h2>
              <p>Quý khách thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng ngay sau khi nhận và kiểm tra hàng.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>2. Chuyển khoản ngân hàng</h2>
              <p>Thanh toán qua số tài khoản cửa hàng. Đơn hàng sẽ được xử lý ngay sau khi hệ thống xác nhận nhận được tiền.</p>
            </section>

            <section>
              <h2 style={{ color: '#111', fontSize: '1.5rem', marginBottom: '1rem' }}>3. Ví điện tử</h2>
              <p>Hỗ trợ thanh toán qua MoMo, ZaloPay (Đang trong quá trình tích hợp tự động).</p>
            </section>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
