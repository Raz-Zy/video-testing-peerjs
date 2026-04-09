"use client";

import Image from "next/image";
import Link from "next/link";
import ButtonAddComponent from "./ButtonAddComponent";
import StarRatingDisplay from "./StarRatingDisplay";
import ManageProductActions from "@/app/(site)/manage-products/_components/ManageProductActions";

export default function ProductCardComponent({ product, isShowThreeDots, onEditProduct, onProductDeleted }) {
  const productId = product.productId ?? product.id;
  const name = product.name ?? product.productName;
  const price = product.price;
  const imageUrl = product.imageUrl;

  return (
    <article className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      {isShowThreeDots && (
        <div className="absolute right-3 top-3 z-10">
          <ManageProductActions
            product={product}
            onEditProduct={onEditProduct}
            onProductDeleted={onProductDeleted}
          />
        </div>
      )}
      <Link href={`/products/${productId}`} className="block">
        <div className="relative aspect-square overflow-hidden shadow-[0_0_3px_0_rgba(0,0,0,0.1)] rounded-xl bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-gray-100 to-lime-50/30 text-gray-400">
              ◇
            </div>
          )}
        </div>
      </Link>
      <div className="relative mt-4 pr-14">
        <StarRatingDisplay star={product.star} />
        <Link href={`/products/${productId}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 hover:text-lime-700">
            {name}
          </h3>
        </Link>
        <p className="mt-2 text-base font-semibold tabular-nums text-gray-900">${price}</p>
      </div>
      <div className="absolute bottom-4 right-4">
        <ButtonAddComponent product={product} />
      </div>
    </article>
  );
}
