/*
Pagination Component
===================

Component phân trang có thể tái sử dụng cho admin pages.

Props:
- currentPage: number - Trang hiện tại (bắt đầu từ 1)
- totalPages: number - Tổng số trang
- pageSize: number - Số items mỗi trang
- pageSizeOptions: array - Các tùy chọn số items mỗi trang [5, 10, 20]
- onPageChange: function - Callback khi thay đổi trang (page) => void
- onPageSizeChange: function - Callback khi thay đổi pageSize (size) => void
- showPageSizeSelector: boolean - Hiển thị select page size (default: true)
- showPageInfo: boolean - Hiển thị thông tin trang (default: true)
- className: string - Class CSS bổ sung
- sx: object - Styles Material-UI bổ sung

Ví dụ sử dụng:

```jsx
import Pagination from "@/components/admin/Pagination";

const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

<Pagination
  currentPage={page}
  totalPages={Math.ceil(totalItems / pageSize)}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={(newSize) => {
    setPageSize(newSize);
    setPage(1);
  }}
/>
```

Tính năng:
- Hiển thị tối đa 5 nút trang xung quanh trang hiện tại
- Có nút Previous/Next
- Có dấu "..." khi có nhiều trang
- Tự động ẩn khi chỉ có 1 trang
- Responsive design
- Sử dụng CSS variables cho theme
*/