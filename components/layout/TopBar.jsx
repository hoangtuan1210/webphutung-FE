"use client";
import { useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import {
  FiMenu,
  FiMoon,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { MdSearch } from "react-icons/md";
import styles from "../../styles/admin/topbar.module.css";
import Notification from "../notification/Notification";

export default function TopBar({
  onOpenSidebar,
  onToggleCollapse,
  drawerWidth,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <AppBar
      className={styles.appBar}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer - 1,
        left: { xs: 0, md: `${drawerWidth}px` },
        width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar className={styles.toolbar} sx={{ px: { xs: 1.5, md: 2.5 } }}>
        <IconButton
          onClick={onToggleCollapse}
          size="small"
          className={`${styles.hamburgerBtn} ${styles.hamburgerDesktop}`}
        >
          <FiMenu size={18} />
        </IconButton>

        <IconButton
          onClick={onOpenSidebar}
          size="small"
          className={`${styles.hamburgerBtn} ${styles.hamburgerMobile}`}
        >
          <FiMenu size={18} />
        </IconButton>

        <Box className={styles.searchBox}>
          <MdSearch size={18} className={styles.searchIcon} />
          <InputBase
            placeholder="Search or type command..."
            inputProps={{ "aria-label": "search" }}
            className={styles.searchInput}
          />
          <Box className={styles.kbdBadge}>
            <Typography className={styles.kbdText}>⌘K</Typography>
          </Box>
        </Box>

        <Box className={styles.spacer} />


        <Notification />

        <Box
          className={styles.userTrigger}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <Avatar src="/avatar.jpg" alt="Admin" className={styles.userAvatar}>
            A
          </Avatar>
          <Typography className={styles.userName}>ADMIN</Typography>
          <FiChevronDown size={14} color="#6b7280" />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ elevation: 0, className: styles.menuPaper }}
        >
          <Box className={styles.menuHeader}>
            <Typography className={styles.menuHeaderName}>ADMIN</Typography>
            <Typography className={styles.menuHeaderEmail}>
              admin@admin.com
            </Typography>
          </Box>

          <Divider className={styles.menuDivider} />

          <MenuItem
            component={Link}
            href="/admin/profile"
            onClick={() => setAnchorEl(null)}
            className={styles.menuItem}
          >
            <FiUser size={15} /> Hồ sơ
          </MenuItem>

          <MenuItem
            component={Link}
            href="/admin/settings"
            onClick={() => setAnchorEl(null)}
            className={styles.menuItem}
          >
            <FiSettings size={15} /> Cài đặt
          </MenuItem>

          <Divider className={styles.menuDivider} />

          <MenuItem
            component={Link}
            href="/"
            onClick={() => setAnchorEl(null)}
            className={`${styles.menuItem} ${styles.menuItemDanger}`}
          >
            <FiLogOut size={15} /> Đăng xuất
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
