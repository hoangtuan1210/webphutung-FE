import {
  FiGrid,
  FiShoppingBag,
  FiUser,
  FiFileText,
  FiTable,
  FiPieChart,
  FiBox,
  FiLock,
  FiBarChart2,
} from "react-icons/fi";

export const MENU_SECTIONS = [
  {
    section: "Danh mục",
    items: [
      {
        label: "Tổng quan",
        icon: <FiGrid />,
        children: [
          { href: "/admin/dashboard", label: "Doanh Thu", icon: <FiShoppingBag /> },
        ],
      },
      { href: "/admin/profile", label: "Thông tin người dùng", icon: <FiUser /> },
      {
        label: "Sản phẩm",
        icon: <FiBox />,
        children: [
          {
            href: "/admin/products",
            label: "Danh sách sản phẩm",
            icon: <FiFileText />,
          },
          {
            href: "/admin/products/create",
            label: "Tạo sản phẩm",
            icon: <FiFileText />,
          },
        ],
      },
      {
        label: "Tin tức",
        icon: <FiTable />,
        children: [
          {
            href: "/admin/news/list",
            label: "Danh sách tin tức",
            icon: <FiTable />,
          },
          {
            href: "/admin/news/create",
            label: "Tạo tin tức",
            icon: <FiTable />,
          },
        ],
      },
      {
        label: "Đơn hàng",
        icon: <FiBarChart2 />,
        children: [
          {
            href: "/admin/orders/list",
            label: "Danh sách đơn hàng",
            icon: <FiBarChart2 />,
          },
          {
            href: "/admin/orders/create",
            label: "Tạo đơn hàng",
            icon: <FiBarChart2 />,
          },
        ],
      },
    ],
  },
  {
    section: "Khác",
    items: [
      {
        label: "Charts",
        icon: <FiPieChart />,
        children: [
          {
            href: "/admin/charts/line",
            label: "Line Chart",
            icon: <FiPieChart />,
          },
          {
            href: "/admin/charts/bar",
            label: "Bar Chart",
            icon: <FiBarChart2 />,
          },
        ],
      },
      {
        label: "Authentication",
        icon: <FiLock />,
        children: [
          { href: "/admin/auth/signin", label: "Sign In", icon: <FiLock /> },
          { href: "/admin/auth/signup", label: "Sign Up", icon: <FiLock /> },
        ],
      },
    ],
  },
];