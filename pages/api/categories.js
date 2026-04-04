export default function handler(req, res) {
  const categories = [
    { id: 1, name: "Phụ tùng máy", slug: "phu-tung-may" },
    { id: 2, name: "Phụ tùng điện", slug: "phu-tung-dien" },
    { id: 3, name: "Đồ chơi xe", slug: "do-choi-xe" },
    { id: 4, name: "Dầu nhớt", slug: "dau-nhot" },
    { id: 5, name: "Lốp xe", slug: "lop-xe" },
    { id: 6, name: "Ắc quy", slug: "ac-quy" },
  ];
  res.status(200).json(categories);
}
