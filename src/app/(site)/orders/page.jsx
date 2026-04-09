import { getOrdersAction } from "@/actions/product.actions";
import OrderCardComponent from "./_components/OrderCardComponent";

export const metadata = {
  title: "Orders | PurelyStore",
  description: "Your order history.",
};

export default async function OrdersPage() {
  const res = await getOrdersAction();
  const orders =
    res?.status === "200 OK" && Array.isArray(res?.payload) ? res.payload : [];

  return (
    <div className="mx-auto w-full max-w-7xl py-12 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Ordered products
        </h1>
        <p className="mt-2 text-gray-500">
          {res?.status === "200 OK"
            ? `${orders.length} order${orders.length === 1 ? "" : "s"} from your account.`
            : res?.message ?? "Could not load orders. Sign in and try again."}
        </p>
      </header>
      <div className="mt-12 flex flex-col gap-6">
        {orders.length === 0 && res?.status === "200 OK" && (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-gray-500 shadow-sm">
            You have no orders yet.
          </p>
        )}
        {orders.map((o) => (
          <OrderCardComponent key={o.orderId} order={o} />
        ))}
      </div>
    </div>
  );
}
