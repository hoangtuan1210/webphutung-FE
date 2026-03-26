/*
Dashboard Admin Component
========================

Giao diện dashboard chính cho trang quản trị admin.

Cấu trúc:
- Header: Tiêu đề và các nút thao tác nhanh
- Stats Cards: 4 thẻ thống kê chính (sản phẩm, đơn hàng, doanh thu, khách hàng)
- Chart Section: Vùng hiển thị biểu đồ thống kê (hiện tại là placeholder)
- Recent Activities: Danh sách hoạt động gần đây
- Quick Actions: Các nút thao tác nhanh

Màu sắc sử dụng:
- CSS Variables từ global.css (--color-primary, --color-success, etc.)
- Theme admin (--color-admin-bg, --color-admin-text, etc.)

Components sử dụng:
- Material-UI: Grid, Card, Button, Typography, Avatar, Chip, List
- React Icons: Feather icons (Fi*)
- AdminLayout: Layout wrapper cho admin pages

Mock Data:
- STATS_DATA: Dữ liệu thống kê 4 chỉ số chính
- RECENT_ACTIVITIES: Danh sách hoạt động gần đây
- QUICK_ACTIONS: Các thao tác nhanh

Tính năng:
- Responsive design
- Hover effects
- Status indicators với màu sắc
- Activity types với icon và màu riêng
- Placeholder cho chart integration

Future Enhancements:
- Tích hợp biểu đồ thực tế (Chart.js, Recharts)
- Real-time data updates
- More detailed analytics
- Export functionality
*/