"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "../../styles/client/navbar.module.css";
import { useCart } from "@/context/CartContext";

const NAV_ITEMS = [
  { label: "Sản phẩm", href: "/products" },
  { label: "Tin tức", href: "/news" },
  { label: "Về chúng tôi", href: "/about" },
];

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [topBannerVisible, setTopBannerVisible] = useState(true);
  const dropdownRef = useRef(null);
  const cart = useCart();
  const totalQty = cart?.totalQty ?? 0;
  const setIsOpen = cart?.setIsOpen;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setTopBannerVisible(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.navbarWrapper}>
      
      <div
        className={`${styles.topBanner} ${topBannerVisible ? styles.topBannerVisible : ""}`}
      >
        <div className={styles.topBannerContent}>
          <span className={styles.topBannerItem}>
            <i className="bi bi-lightning-charge-fill" /> Phụ tùng xe máy - xe
            điện chính hãng
          </span>
        </div>
      </div>

      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            MyShop
          </Link>

          <form className={styles.searchDesktop}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Tìm sản phẩm..."
              aria-label="Tìm kiếm"
            />
            <button className={styles.searchBtn} type="submit">
              <i className="bi bi-search" />
            </button>
          </form>

          <div className={styles.rightIcons}>
            <button
              className={`${styles.iconBtn} ${styles.searchToggle}`}
              onClick={() => setIsSearchOpen((p) => !p)}
              aria-label="Tìm kiếm"
            >
              <i className="bi bi-search" />
            </button>

            <div className={styles.dropdownWrapper} ref={dropdownRef}>
              <button
                className={`${styles.iconBtn}`}
                onClick={() => setIsDropdownOpen((p) => !p)}
                aria-label="Menu"
                aria-expanded={isDropdownOpen}
              >
                <i
                  className={`bi ${isDropdownOpen ? "bi-x-lg" : "bi-list"} fs-5`}
                />
              </button>
              <ul
                className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.dropdownMenuOpen : ""}`}
              >
                {NAV_ITEMS.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className={styles.dropdownItem}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`${styles.iconBtn} ${styles.cartBtn}`}
              onClick={() => setIsOpen?.(true)}
              aria-label="Giỏ hàng"
            >
              <i className="bi bi-cart3" />
              {totalQty > 0 && (
                <span className={styles.cartBadge}>
                  {totalQty > 99 ? "99+" : totalQty}
                </span>
              )}
            </button>

            <button
              className={`${styles.iconBtn} ${styles.hamburger}`}
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              aria-label="Menu"
            >
              <i
                className={`bi ${isMobileMenuOpen ? "bi-x-lg" : "bi-list"} fs-5`}
              />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`${styles.mobileSearch} ${isSearchOpen ? styles.mobileSearchOpen : ""}`}
      >
        <div className={styles.mobileSearchInner}>
          <form className={styles.mobileSearchForm}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Tìm sản phẩm..."
              autoFocus
            />
            <button className={styles.searchBtn} type="submit">
              <i className="bi bi-search" />
            </button>
            <button
              className={styles.closeSearch}
              type="button"
              onClick={() => setIsSearchOpen(false)}
            >
              <i className="bi bi-x-lg" />
            </button>
          </form>
        </div>
      </div>

      <div
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}
      >
        <ul className={styles.mobileNavList}>
          {NAV_ITEMS.map((item, i) => (
            <li key={i} className={styles.mobileNavItem}>
              <Link
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
