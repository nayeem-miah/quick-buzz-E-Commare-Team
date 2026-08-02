import React from "react";

interface Props {
  displayName?: string | null;
}

const HostDashboardHeader: React.FC<Props> = ({ displayName }) => {
  const initial = (displayName || "S")[0].toUpperCase();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 flex-shrink-0">
          <span className="text-xl font-black text-white">{initial}</span>
        </div>

        {/* Greeting */}
        <div>
          <h1 className="text-xl font-black text-gray-900">
            Welcome back,{" "}
            <span className="text-orange-500">{displayName || "Seller"}</span>{" "}
            👋
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">{today}</p>
        </div>
      </div>
    </div>
  );
};

export default HostDashboardHeader;
