"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { FiBarChart2, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { MENU_SECTIONS } from "../../section/menu_section";
import styles from "../../styles/admin/sidebar.module.css";

const DRAWER_EXPANDED = 260;
const DRAWER_COLLAPSED = 72;

const cx = (...classes) => classes.filter(Boolean).join(" ");

/* ───────────────── LOGO ───────────────── */
function Logo({ isExpanded }) {
  return (
    <Box
      className={cx(styles.logoWrap, !isExpanded && styles.logoWrapCollapsed)}
    >
      <Box className={styles.logoIcon}>
        <FiBarChart2 color="#fff" size={18} />
      </Box>
      {isExpanded && (
        <Typography className={styles.logoText} variant="h6">
          Admin
        </Typography>
      )}
    </Box>
  );
}

/* ───────────────── SECTION LABEL ───────────────── */
function SectionLabel({ label, isExpanded }) {
  if (!isExpanded) return <Box className={styles.sectionDivider} />;
  return (
    <Typography variant="overline" className={styles.sectionLabel}>
      {label}
    </Typography>
  );
}

/* ───────────────── NAV ITEM ───────────────── */
function NavItem({ item, isExpanded, pathname }) {
  const isActive = pathname === item.href;

  return (
    <ListItem disablePadding className={styles.navItemOuter}>
      <ListItemButton
        component={Link}
        href={item.href}
        className={cx(
          styles.navItemBtn,
          !isExpanded && styles.navItemBtnCollapsed,
          isActive ? styles.navItemBtnActive : styles.navItemBtnDefault,
        )}
        sx={{ color: isActive ? "var(--active-color)" : "var(--text-default)" }}
      >
        <ListItemIcon
          className={cx(
            styles.navIcon,
            isActive && styles.navIconActive,
            !isExpanded && styles.navIconCollapsed,
          )}
        >
          {item.icon}
        </ListItemIcon>

        {isExpanded && (
          <ListItemText
            primary={item.label}
            className={cx(styles.navText, !isExpanded && styles.navTextHidden)}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
}

/* ───────────────── NAV GROUP ───────────────── */
function NavGroup({ item, isExpanded, pathname, expanded, onToggle }) {
  const isOpen = expanded.includes(item.label);
  const isGroupActive = item.children?.some((c) => pathname === c.href);

  return (
    <Box className={styles.navGroupOuter}>
      <ListItem disablePadding className={styles.navItemOuter}>
        <ListItemButton
          onClick={() => onToggle(item.label)}
          className={cx(
            styles.navGroupBtn,
            !isExpanded && styles.navGroupBtnCollapsed,
            isGroupActive && styles.navGroupBtnGroupActive,
            isGroupActive && !isOpen && styles.navGroupBtnActiveCollapsed,
          )}
          sx={{
            color: isGroupActive
              ? "var(--active-color)"
              : "var(--text-default)",
          }}
        >
          <ListItemIcon
            className={cx(
              styles.navIcon,
              isGroupActive && styles.navIconActive,
              !isExpanded && styles.navIconCollapsed,
            )}
          >
            {item.icon}
          </ListItemIcon>

          {isExpanded && (
            <>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isGroupActive ? 600 : 500,
                }}
              />
              <Box className={styles.chevronIcon}>
                {isOpen ? <FiChevronDown /> : <FiChevronRight />}
              </Box>
            </>
          )}
        </ListItemButton>
      </ListItem>

      <Collapse in={isOpen && isExpanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children.map((sub) => {
            const isSubActive = pathname === sub.href;
            return (
              <ListItem
                key={sub.href}
                disablePadding
                className={cx(
                  styles.subItemOuter,
                  isExpanded && styles.subItemOuterIndented,
                )}
              >
                <ListItemButton
                  component={Link}
                  href={sub.href}
                  className={cx(
                    styles.subItemBtn,
                    isSubActive
                      ? styles.subItemBtnActive
                      : styles.subItemBtnDefault,
                  )}
                  sx={{
                    color: isSubActive
                      ? "var(--active-color)"
                      : "var(--text-default)",
                  }}
                >
                  <ListItemText
                    primary={sub.label}
                    primaryTypographyProps={{
                      fontSize: "0.85rem",
                      fontWeight: isSubActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </Box>
  );
}

/* ───────────────── MAIN SIDEBAR ───────────────── */
export default function Sidebar({
  mobileOpen,
  onClose,
  collapsed,
  isHovered,
  setIsHovered,
}) {
  const pathname = usePathname();

  const isExpanded = !collapsed || isHovered;

  // ⚠️ width hiển thị (KHÔNG ảnh hưởng layout)
  const visualWidth = collapsed
    ? isHovered
      ? DRAWER_EXPANDED
      : DRAWER_COLLAPSED
    : DRAWER_EXPANDED;

  // auto expand group active
  const defaultExpanded = MENU_SECTIONS.flatMap((s) => s.items)
    .filter((item) => item.children?.some((c) => pathname === c.href))
    .map((item) => item.label);

  const [expanded, setExpanded] = useState(
    defaultExpanded.length ? defaultExpanded : ["Dashboard"],
  );

  const toggleExpand = (label) =>
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
    );

  const content = (
    <Box className={styles.drawerPaper} sx={{ width: visualWidth }}>
      <Box className={styles.logoRow}>
        <Logo isExpanded={isExpanded} />
      </Box>

      <Divider sx={{ borderColor: "var(--border-color)" }} />

      <Box className={styles.navBox}>
        {MENU_SECTIONS.map((section) => (
          <Box key={section.section}>
            <SectionLabel label={section.section} isExpanded={isExpanded} />
            <List disablePadding>
              {section.items.map((item) =>
                item.children ? (
                  <NavGroup
                    key={item.label}
                    item={item}
                    isExpanded={isExpanded}
                    pathname={pathname}
                    expanded={expanded}
                    onToggle={toggleExpand}
                  />
                ) : (
                  <NavItem
                    key={item.href}
                    item={item}
                    isExpanded={isExpanded}
                    pathname={pathname}
                  />
                ),
              )}
            </List>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: "var(--border-color)" }} />

      <Typography className={styles.footer}>
        {!isExpanded ? "v1.0" : "Version 1.0.0"}
      </Typography>
    </Box>
  );

  return (
    <>
      {/* MOBILE */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_EXPANDED,
            border: "none",
          },
        }}
      >
        {content}
      </Drawer>

      {/* DESKTOP */}
      <Box
        onMouseEnter={() => collapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          display: { xs: "none", md: "block" },
          position: "fixed", // 🔥 FIX QUAN TRỌNG
          top: 0,
          left: 0,
          zIndex: 1200,
        }}
      >
        <Drawer
          variant="permanent"
          open
          sx={{
            "& .MuiDrawer-paper": {
              width: visualWidth,
              border: "none",
              transition: "width 0.25s ease",
              overflow: "hidden",
              boxShadow: isHovered ? "4px 0 20px rgba(0,0,0,0.1)" : "none",
            },
          }}
        >
          {content}
        </Drawer>
      </Box>
    </>
  );
}
