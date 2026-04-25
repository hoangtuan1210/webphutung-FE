import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Phụ tùng ô tô chính hãng, giá tốt, giao hàng toàn quốc"
        />
        <meta name="keywords" content="phụ tùng ô tô, phụ tùng xe hơi, phụ tùng chính hãng, phụ tùng giá tốt, phụ tùng giao hàng toàn quốc" />
        <meta name="author" content="Phụ tùng ô tô chính hãng" />

        <link rel="icon" href="/favicon_new.png?v=2" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
