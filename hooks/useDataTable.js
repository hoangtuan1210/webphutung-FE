import { useMemo, useState } from "react";

export default function useDataTable(data, options = {}) {
  const { defaultPageSize = 7 } = options;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sort, setSort] = useState(null);
  const [selected, setSelected] = useState([]);

  const handleSort = (key) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  const filtered = useMemo(() => {
    let list = data;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((item) =>
        Object.values(item).some((v) =>
          String(v).toLowerCase().includes(q)
        )
      );
    }

    if (sort) {
      list = [...list].sort((a, b) => {
        const va = a[sort.key];
        const vb = b[sort.key];
        const cmp =
          typeof va === "number"
            ? va - vb
            : String(va).localeCompare(String(vb));

        return sort.dir === "asc" ? cmp : -cmp;
      });
    }

    return list;
  }, [data, search, sort]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return {
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    sort,
    handleSort,
    selected,
    setSelected,
    data: paginated,
    totalPages,
  };
}