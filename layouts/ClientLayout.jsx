import CartDrawer from "@/components/cart/CartDrawer";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";

export default function ClientLayout({ children }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>{children}</main>
      <FloatingContact />
      <Footer />
    </>
  );
}
