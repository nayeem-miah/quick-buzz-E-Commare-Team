import React from "react";
import { OrderStatusHistory } from "../../../../types/order";
import { OrderStatus } from "../../../../constants/enums";

interface OrderActivityLogProps {
  email: string;
  date: string;
  history: OrderStatusHistory[];
  formatDate: (dateStr: string) => string;
  formatTime: (dateStr: string) => string;
}

export const OrderActivityLog: React.FC<OrderActivityLogProps> = ({
  email,
  date,
  history,
  formatDate,
  formatTime,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">Activity Log</p>
      <ol className="relative space-y-6 border-l-2 border-orange-100 ml-3">
        {/* Order placed event */}
        <li className="ml-6 relative">
          <span className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm shadow-orange-500/30" />
          <p className="font-bold text-sm text-gray-900">Order Placed</p>
          <p className="text-xs text-gray-400">
            by <span className="font-semibold text-gray-600">{email}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDate(date)} at {formatTime(date)}
          </p>
        </li>

        {/* Status change events */}
        {history.map((entry) => {
          const isCancelled = (entry.new_status || "").toLowerCase() === OrderStatus.CANCELLED;
          return (
            <li key={entry._id} className="ml-6 relative">
              <span
                className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  isCancelled ? "bg-red-500" : "bg-gray-300"
                }`}
              />
              <p className="font-bold text-sm text-gray-900 capitalize">
                {entry.new_status}
              </p>
              <p className="text-xs text-gray-400">
                {entry.old_status && entry.old_status !== entry.new_status && (
                  <>
                    <span className="line-through">{entry.old_status}</span> →{" "}
                  </>
                )}
                by <span className="font-semibold text-gray-600 capitalize">{entry.changed_by_role}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDate(entry.timestamp)} at {formatTime(entry.timestamp)}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
