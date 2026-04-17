import CartDrawer from "@/components/cart/CartDrawer";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import styles from "@/styles/shared.module.css";

export default function ClientLayout({ children }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className={styles.layoutMain}>{children}</main>
      <FloatingContact />
      <Footer />
    </>
  );
}
