export const ALL_ORDERS = [
  {
    id: "AH-001235",
    customer: "Nguyễn Văn An",
    phone: "0901234567",
    email: "an@gmail.com",
    address: "123 Nguyễn Trãi, Q.1, TP.HCM",
    date: "12/03/2026",
    status: "pending", // Chờ duyệt
    payment: "Chuyển khoản",
    total: 1250000,
    items: [
      { name: "Pô Akrapovic Titan cao cấp", qty: 1, price: 950000, image: "/bo-cong-tac.jpg" },
      { name: "Ốp pô Carbon", qty: 1, price: 300000, image: "/gu-carbon.jpg" },
    ],
    product: "Pô Akrapovic Titan cao cấp",
    amount: 1250000,
    qty: 2,
  },
  {
    id: "AH-001236",
    customer: "Trần Thị Bích",
    phone: "0912345678",
    email: "bich@gmail.com",
    address: "45 Lê Lợi, Q.3, TP.HCM",
    date: "10/03/2026",
    status: "shipping", // Đang giao
    payment: "COD",
    total: 550000,
    items: [
      { name: "Gù tay lái Carbon", qty: 2, price: 275000, image: "/gu-carbon.jpg" },
    ],
    product: "Gù tay lái Carbon",
    amount: 550000,
    qty: 2,
  },
  {
    id: "AH-001237",
    customer: "Lê Minh Châu",
    phone: "0923456789",
    email: "chau@gmail.com",
    address: "78 Hai Bà Trưng, Q.Bình Thạnh, TP.HCM",
    date: "05/03/2026",
    status: "completed", // Hoàn thành
    payment: "Ví điện tử",
    total: 450000,
    items: [
      { name: "Bao tay kiểng", qty: 1, price: 450000, image: "/bao-tay.jpg" },
    ],
    product: "Bao tay kiểng",
    amount: 450000,
    qty: 1,
  },
  {
    id: "AH-001238",
    customer: "Phạm Quốc Đạt",
    phone: "0934567890",
    email: "dat@gmail.com",
    address: "22 Trường Chinh, Q.Tân Bình, TP.HCM",
    date: "01/03/2026",
    status: "cancelled", // Huỷ
    payment: "COD",
    total: 320000,
    items: [
      { name: "Tay thắng RCB chính hãng", qty: 1, price: 320000, image: "/tay-thang.jpg" },
    ],
    product: "Tay thắng RCB chính hãng",
    amount: 320000,
    qty: 1,
  },
  {
    id: "AH-001239",
    customer: "Hoàng Thị Em",
    phone: "0945678901",
    date: "28/02/2026",
    status: "processing", // Đang xử lý
    payment: "Chuyển khoản",
    total: 3850000,
    items: [
      { name: "Pin lithium 48V-15Ah", qty: 1, price: 3850000, image: "/bao-tay.jpg" },
    ],
    product: "Pin lithium 48V-15Ah",
    amount: 3850000,
    qty: 1,
  },
  {
    id: "AH-001240",
    customer: "Vũ Tuấn Anh",
    phone: "0956789012",
    date: "25/02/2026",
    status: "completed",
    payment: "COD",
    total: 2100000,
    items: [
      { name: "Bộ côn SH 150i 2023", qty: 1, price: 2100000, image: "/bo-cong-tac.jpg" },
    ],
    product: "Bộ côn SH 150i 2023",
    amount: 2100000,
    qty: 1,
  },
   {
    id: "AH-001240",
    customer: "Vũ Tuấn Anh",
    phone: "0956789012",
    date: "25/02/2026",
    status: "completed",
    payment: "COD",
    total: 2100000,
    items: [
      { name: "Bộ côn SH 150i 2023", qty: 1, price: 2100000, image: "/bo-cong-tac.jpg" },
    ],
    product: "Bộ côn SH 150i 2023",
    amount: 2100000,
    qty: 1,
  },
   {
    id: "AH-001240",
    customer: "Vũ Tuấn Anh",
    phone: "0956789012",
    date: "25/02/2026",
    status: "completed",
    payment: "COD",
    total: 2100000,
    items: [
      { name: "Bộ côn SH 150i 2023", qty: 1, price: 2100000, image: "/bo-cong-tac.jpg" },
    ],
    product: "Bộ côn SH 150i 2023",
    amount: 2100000,
    qty: 1,
  },
   {
    id: "AH-001240",
    customer: "Vũ Tuấn Anh",
    phone: "0956789012",
    date: "25/02/2026",
    status: "completed",
    payment: "COD",
    total: 2100000,
    items: [
      { name: "Bộ côn SH 150i 2023", qty: 1, price: 2100000, image: "/bo-cong-tac.jpg" },
    ],
    product: "Bộ côn SH 150i 2023",
    amount: 2100000,
    qty: 1,
  }
  , {
    id: "AH-001240",
    customer: "Vũ Tuấn Anh",
    phone: "0956789012",
    date: "25/02/2026",
    status: "completed",
    payment: "COD",
    total: 2100000,
    items: [
      { name: "Bộ côn SH 150i 2023", qty: 1, price: 2100000, image: "/bo-cong-tac.jpg" },
    ],
    product: "Bộ côn SH 150i 2023",
    amount: 2100000,
    qty: 1,
  }
  , {
    id: "AH-001240",
    customer: "Vũ Tuấn Anh",
    phone: "0956789012",
    date: "25/02/2026",
    status: "completed",
    payment: "COD",
    total: 2100000,
    items: [
      { name: "Bộ côn SH 150i 2023", qty: 1, price: 2100000, image: "/bo-cong-tac.jpg" },
    ],
    product: "Bộ côn SH 150i 2023",
    amount: 2100000,
    qty: 1,
  }
  , {
    id: "AH-001240",
    customer: "Vũ Tuấn Anh",
    phone: "0956789012",
    date: "25/02/2026",
    status: "completed",
    payment: "COD",
    total: 2100000,
    items: [
      { name: "Bộ côn SH 150i 2023", qty: 1, price: 2100000, image: "/bo-cong-tac.jpg" },
    ],
    product: "Bộ côn SH 150i 2023",
    amount: 2100000,
    qty: 1,
  }
];

export const MOCK_ORDERS = ALL_ORDERS;

export const STATUS_MAP = {
  pending:    { label: "Chờ duyệt",  color: "#7c3aed" },
  processing: { label: "Đang xử lý", color: "#d97706" },
  shipping:   { label: "Đang giao",  color: "#2563eb" },
  completed:  { label: "Hoàn thành", color: "#16a34a" },
  cancelled:  { label: "Huỷ",         color: "#dc2626" },
};