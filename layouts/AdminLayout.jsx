"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import Box from "@mui/material/Box";
import Loading from "@/components/admin/Loading";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
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
        onOpenSidebar={() => setMobileOpen((p) => !p)}
        onToggleCollapse={() => setCollapsed((p) => !p)}
        collapsed={collapsed}
        drawerWidth={drawerWidth}
      />

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((p) => !p)}
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
          transition: "width 0.25s ease",
          minWidth: 0,
          ml: { md: `${drawerWidth}px` },
        }}
      >
        {loading ? <Loading /> : children}
      </Box>
    </Box>
  );
}
