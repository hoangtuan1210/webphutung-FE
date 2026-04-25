import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import { useEffect } from "react";
import Head from "next/head";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Web Phụ Tùng Xe Máy</title>
        <meta name="description" content="Cửa hàng phụ tùng xe máy uy tín - Chất lượng cao, giá tốt nhất" />
        <link rel="icon" href="/favicon_new.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/favicon_new.png?v=2" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CartProvider>
        <Toaster position="top-right" toastOptions={{ duration: 2200 }} />
        {getLayout(<Component {...pageProps} />)}
      </CartProvider>
    </>
  );
}