import { useEffect, useState, useCallback } from "react";
import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import Box from "@mui/material/Box";
import Loading from "@/components/admin/Loading";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const handleOpenSidebar = useCallback(() => setMobileOpen((p) => !p), []);
  const handleCloseSidebar = useCallback(() => setMobileOpen(false), []);
  const handleToggleCollapse = useCallback(() => setCollapsed((p) => !p), []);

  const drawerWidth = collapsed ? 72 : 260;
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "var(--color-admin-bg)",
      }}
    >
      <TopBar
        onOpenSidebar={handleOpenSidebar}
        onToggleCollapse={handleToggleCollapse}
        collapsed={collapsed}
        drawerWidth={drawerWidth}
      />

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleCloseSidebar}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        isHovered={isHovered}
        setIsHovered={setIsHovered}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "56px",
          minHeight: "calc(100vh - 56px)",
          bgcolor: "var(--color-admin-bg)",
          p: { xs: 2, md: 3.5 },
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: `${drawerWidth}px` },
          transition: "margin-left 0.25s ease, width 0.25s ease",
          overflow: "hidden",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        {loading ? <Loading /> : children}
      </Box>
    </Box>
  );
}
