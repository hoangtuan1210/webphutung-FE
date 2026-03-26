import { useState } from "react";
import { INITIAL_FORM } from "../constants/product";

export function useProductForm({
  initialForm = INITIAL_FORM,
  initialImages = [],
  initialTags = [],
  initialCompatible = [],
  initialIsActive = true,
  initialIsFeatured = false,
} = {}) {
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState(initialImages);
  const [tags, setTags] = useState(initialTags);
  const [compatible, setCompatible] = useState(initialCompatible);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [isFeatured, setIsFeatured] = useState(initialIsFeatured);
  const [errors, setErrors] = useState({});
  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Tên sản phẩm không được để trống";
    if (!form.category) e.category = "Vui lòng chọn danh mục";
    if (!form.price) e.price = "Vui lòng nhập giá bán";
    if (form.stock === "") e.stock = "Vui lòng nhập tồn kho";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Submit payload:", {
      form,
      images,
      tags,
      compatible,
      isActive,
      isFeatured,
    });
  };

  const profit =
    form.price && form.costPrice
      ? {
          amount: Number(form.price) - Number(form.costPrice),
          margin: (
            ((Number(form.price) - Number(form.costPrice)) /
              Number(form.price)) *
            100
          ).toFixed(1),
        }
      : null;

  return {
    form,
    setForm,
    setField,
    images,
    setImages,
    tags,
    setTags,
    compatible,
    setCompatible,
    isActive,
    setIsActive,
    isFeatured,
    setIsFeatured,
    errors,
    profit,
    handleSubmit,
  };
}
