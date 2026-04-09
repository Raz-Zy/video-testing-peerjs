"use client";

import { useEffect } from "react";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { sileo } from "sileo";
import { ProductSchema } from "./productSchemas";
import { createProductAction, updateProductAction } from "@/actions/product.actions";

const COLOR_OPTIONS = ["green", "gray", "red", "blue", "white"];
const SIZE_OPTIONS = ["s", "m", "l", "xl", "xxl", "xxxl"];

function emptyProductForm() {
  return {
    name: "",
    description: "",
    colors: [],
    sizes: [],
    price: "",
    categoryId: "",
    imageUrl: "",
  };
}

function mergeInitialFormValues(initialValues) {
  const base = emptyProductForm();
  const next = { ...base, ...(initialValues ?? {}) };
  return {
    productId: next.productId ?? "",
    name: next.name ?? "",
    description: next.description ?? "",
    colors: Array.isArray(next.colors) ? next.colors : [],
    sizes: Array.isArray(next.sizes) ? next.sizes : [],
    price: next.price ?? "",
    categoryId: next.categoryId ?? "",
    imageUrl: next.imageUrl ?? "",
  };
}

export default function ProductModal({
  open,
  mode,
  categories,
  initialValues,
  onClose,
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: emptyProductForm(),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const nameReg = register("name");
  const priceReg = register("price");
  const imageUrlReg = register("imageUrl");
  const descriptionReg = register("description");

  const categoryOptions = categories.map((c) => ({
    value: String(c.categoryId),
    label: c.name,
  }));

  useEffect(() => {
    if (!open) return;
    reset(mergeInitialFormValues(initialValues));
    clearErrors();
  }, [open, initialValues, reset, clearErrors]);

  const submit = handleSubmit(async (payload) => {
    clearErrors("root.serverError");
    try {
      if (mode === "edit") {
        if (!isDirty) {
          onClose();
          return;
        }
        const result = await updateProductAction(
          { ...payload, price: Number(payload.price) },
          initialValues.productId,
        );
        if (result?.status === "200 OK") {
          sileo.success({
            title: "Product updated",
            description: result?.message ?? "Changes saved successfully.",
          });
          onClose();
        } else {
          const msg =
            typeof result?.message === "string"
              ? result.message
              : "Failed to update product.";
          sileo.error({ title: "Update failed", description: msg });
          setError("root.serverError", { message: msg });
        }
      } else {
        const result = await createProductAction({
          ...payload,
          price: Number(payload.price),
        });
        if (result?.status === "201 CREATED") {
          sileo.success({
            title: "Product created",
            description: result?.message ?? "New product added to the catalog.",
          });
          reset();
          onClose();
        } else {
          const msg =
            typeof result?.message === "string"
              ? result.message
              : "Failed to create product.";
          sileo.error({ title: "Create failed", description: msg });
          setError("root.serverError", { message: msg });
        }
      }
    } catch (e) {
      const msg = e?.message ?? "Something went wrong.";
      sileo.error({ title: "Request failed", description: String(msg) });
      setError("root.serverError", {
        type: "server",
        message: msg,
      });
    }
  });

  const title = mode === "edit" ? "Edit product" : "Create product";
  const submitLabel = mode === "edit" ? "Save changes" : "Create product";

  return (
    <Modal
      isOpen={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      size="2xl"
      placement="center"
      scrollBehavior="inside"
      hideCloseButton
      classNames={{ base: "border border-gray-200" }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-0 pb-0 pt-6">
          <div className="flex w-full items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Demo CRUD only (local state). Refresh resets changes.
              </p>
            </div>
            <Button
              variant="bordered"
              onPress={onClose}
              isIconOnly
              aria-label="Close"
              className="shrink-0 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700"
            >
              ✕
            </Button>
          </div>
        </ModalHeader>

        <ModalBody className="gap-4 pb-6">
          {errors.root?.serverError?.message && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {String(errors.root.serverError.message)}
            </div>
          )}

          <form className="grid grid-cols-1 gap-4" onSubmit={submit} noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  {...nameReg}
                  onChange={(e) => {
                    nameReg.onChange(e);
                    clearErrors("name");
                    clearErrors("root.serverError");
                  }}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
                  placeholder="e.g. Tea-Trica BHA Foam"
                />
                {errors.name?.message && (
                  <p className="mt-1 text-sm text-red-600">{String(errors.name.message)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  {...priceReg}
                  onChange={(e) => {
                    priceReg.onChange(e);
                    clearErrors("price");
                    clearErrors("root.serverError");
                  }}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
                  placeholder="e.g. 62"
                />
                {errors.price?.message && (
                  <p className="mt-1 text-sm text-red-600">{String(errors.price.message)}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      aria-label="Category"
                      placeholder="Select..."
                      selectedKeys={field.value ? new Set([field.value]) : new Set([])}
                      selectionMode="single"
                      onSelectionChange={(keys) => {
                        if (keys === "all") return;
                        const [selected] = Array.from(keys);
                        field.onChange(selected ? String(selected) : "");
                        clearErrors("categoryId");
                        clearErrors("root.serverError");
                      }}
                      className="mt-1.5"
                    >
                      {categoryOptions.map((c) => (
                        <SelectItem key={c.value}>{c.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.categoryId?.message && (
                  <p className="mt-1 text-sm text-red-600">{String(errors.categoryId.message)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL (optional)
                </label>
                <input
                  {...imageUrlReg}
                  onChange={(e) => {
                    imageUrlReg.onChange(e);
                    clearErrors("imageUrl");
                    clearErrors("root.serverError");
                  }}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
                  placeholder="https://..."
                />
                {errors.imageUrl?.message && (
                  <p className="mt-1 text-sm text-red-600">{String(errors.imageUrl.message)}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Colors</label>
              <div className="mt-2 flex flex-wrap gap-x-5 pl-2 gap-y-2">
                <Controller
                  name="colors"
                  control={control}
                  render={({ field }) =>
                    COLOR_OPTIONS.map((color) => {
                      const selectedValues = Array.isArray(field.value) ? field.value : [];
                      const checked = selectedValues.includes(color);
                      return (
                        <Checkbox
                          key={color}
                          isSelected={checked}
                          onValueChange={(isSelected) => {
                            const currentValues = Array.isArray(getValues("colors"))
                              ? getValues("colors")
                              : [];
                            const nextValues = isSelected
                              ? Array.from(new Set([...currentValues, color]))
                              : currentValues.filter((value) => value !== color);
                            setValue("colors", nextValues, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            clearErrors("colors");
                            clearErrors("root.serverError");
                          }}
                          classNames={{
                            base: "inline-flex rounded-full border border-gray-200 bg-white px-3 py-1.5",
                            label: "text-sm text-gray-700",
                          }}
                        >
                          {color}
                        </Checkbox>
                      );
                    })
                  }
                />
              </div>
              {errors.colors?.message && (
                <p className="mt-2 text-sm text-red-600">{String(errors.colors.message)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sizes</label>
              <div className="mt-2 flex flex-wrap gap-x-5 pl-2 gap-y-2">
                <Controller
                  name="sizes"
                  className="flex gap-x-4"
                  control={control}
                  render={({ field }) =>
                    SIZE_OPTIONS.map((size) => {
                      const selectedValues = Array.isArray(field.value) ? field.value : [];
                      const checked = selectedValues.includes(size);
                      return (
                        <Checkbox
                          key={size}
                          isSelected={checked}
                          onValueChange={(isSelected) => {
                            const currentValues = Array.isArray(getValues("sizes"))
                              ? getValues("sizes")
                              : [];
                            const nextValues = isSelected
                              ? Array.from(new Set([...currentValues, size]))
                              : currentValues.filter((value) => value !== size);
                            setValue("sizes", nextValues, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            clearErrors("sizes");
                            clearErrors("root.serverError");
                          }}
                          classNames={{
                            base: "inline-flex rounded-full border border-gray-200 bg-white px-3 py-1.5",
                            label: "text-sm text-gray-700",
                          }}
                        >
                          {size}
                        </Checkbox>
                      );
                    })
                  }
                />
              </div>
              {errors.sizes?.message && (
                <p className="mt-2 text-sm text-red-600">{String(errors.sizes.message)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...descriptionReg}
                onChange={(e) => {
                  descriptionReg.onChange(e);
                  clearErrors("description");
                  clearErrors("root.serverError");
                }}
                className="mt-1.5 w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
                placeholder="Short description shown on the product card..."
                rows={4}
              />
              {errors.description?.message && (
                <p className="mt-1 text-sm text-red-600">{String(errors.description.message)}</p>
              )}
            </div>
          </form>
        </ModalBody>

        <ModalFooter className="border-t border-gray-100">
          <Button variant="bordered" onPress={onClose} className="rounded-full px-6">
            Cancel
          </Button>
          <Button
            variant="solid"
            isDisabled={isSubmitting}
            onPress={() => submit()}
            className="rounded-full bg-lime-400 px-6 font-semibold text-gray-900 hover:bg-lime-300"
          >
            {submitLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
