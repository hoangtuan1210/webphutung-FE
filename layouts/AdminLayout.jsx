"use client";
import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import Box from "@mui/material/Box";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const drawerWidth = collapsed ? 72 : 260;

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
        {children}
      </Box>
    </Box>
  );
}
