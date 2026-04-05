import ProductsComponent from "@/components/product/ProductPage";
import ClientLayout from "@/layouts/ClientLayout";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import Head from "next/head";

export default function ProductsPage({ initialProducts, categories, totalCount }) {
  return (
    <ClientLayout>
      <Head>
        <title>Sản phẩm - Shop</title>
        <meta name="description" content="Danh sách sản phẩm chính hãng" />
      </Head>
      <ProductsComponent
        initialProducts={initialProducts}
        categories={categories}
        totalCount={totalCount}
      />
    </ClientLayout>
  );
}

export async function getServerSideProps({ query }) {
  const {
    page = 1,
    limit = 12,
    categoryId = "",
    search = "",
    sortBy = "createdAt",
    sortOrder = "DESC",
  } = query;

  const params = {
    page,
    limit,
    sortBy,
    sortOrder,
    ...(categoryId && { categoryId }),
    ...(search && { search }),
  };

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      productService.getProducts(params).catch((e) => {
        console.error("products fetch error:", e);
        return { success: false };
      }),
      categoryService.getCategories().catch((e) => {
        console.error("categories fetch error:", e);
        return { success: false };
      }),
    ]);

    console.log("productsRes:", JSON.stringify(productsRes, null, 2));

    let initialProducts = [];
    let totalCount = 0;

    if (productsRes?.success) {
      if (Array.isArray(productsRes.data)) {
        initialProducts = productsRes.data;
        totalCount = productsRes.total ?? productsRes.data.length;
      } else {
        initialProducts = productsRes.data?.items ?? productsRes.data?.data ?? [];
        totalCount = productsRes.data?.total ?? productsRes.total ?? initialProducts.length;
      }
    }

    const categories = categoriesRes?.success ? (categoriesRes.data ?? []) : [];

    return {
      props: {
        initialProducts,
        categories,
        totalCount,
      },
    };
  } catch (error) {
    console.error("Products Page Fetch Error:", error);
    return {
      props: {
        initialProducts: [],
        categories: [],
        totalCount: 0,
      },
    };
  }
}