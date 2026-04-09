import CartContents from "./_components/CartContentsComponent";

export const metadata = {
  title: "Cart | PurelyStore",
  description: "Review items in your cart.",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-7xl py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Your cart</h1>
      <p className="mt-2 text-gray-500">
        Cart is stored in memory for this visit — refreshing the page clears it.
      </p>
      <div className="mt-10">
        <CartContents />
      </div>
    </div>
  );
}