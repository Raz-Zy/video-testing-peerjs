export default function OrderCardComponent({ order }) {
  const {
    orderId,
    appUserId,
    totalAmount,
    orderDate,
    orderDetailsResponse,
    orderDetails,
  } = order;

  const details = orderDetailsResponse ?? orderDetails ?? [];
  const count = details.length;
  const customerLabel = appUserId ?? order.customerId;

  const formattedDate = (() => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(new Date(orderDate));
    } catch {
      return orderDate;
    }
  })();

  const total = Number(totalAmount) || 0;

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Order</p>
          <p className="mt-1 break-all text-lg font-semibold tabular-nums text-gray-900">
            #{orderId}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-semibold tabular-nums text-gray-900">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {customerLabel != null && (
          <div>
            <dt className="text-gray-500">User ID</dt>
            <dd className="mt-0.5 break-all font-medium text-gray-900">{customerLabel}</dd>
          </div>
        )}
        <div>
          <dt className="text-gray-500">Order date</dt>
          <dd className="mt-0.5 font-medium text-gray-900">{formattedDate}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-gray-500">Line items</dt>
          <dd className="mt-0.5 font-medium tabular-nums text-gray-900">{count}</dd>
        </div>
      </dl>

      {count > 0 && (
        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Order details
          </p>
          <ul className="mt-3 space-y-3">
            {details.map((line, i) => {
              const qty = line.orderQty ?? line.quantity ?? 0;
              const lineTotal = Number(line.orderTotal ?? line.lineTotal) || 0;
              return (
                <li
                  key={`${orderId}-${line.productId}-${i}`}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/80 pb-3 text-sm last:border-0 last:pb-0"
                >
                  <span className="text-gray-600">
                    Product{" "}
                    <span className="break-all font-medium text-gray-900">{line.productName}</span>
                  </span>
                  <span>Qty <span className="font-medium tabular-nums text-gray-900">{qty}</span></span>
                  <span className="font-medium tabular-nums text-gray-900">
                    ${lineTotal.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {count === 0 && (
        <p className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-500">
          No line items for this order.
        </p>
      )}
    </article>
  );
}
