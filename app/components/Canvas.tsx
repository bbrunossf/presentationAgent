import { Outlet } from "@remix-run/react";

export default function Canvas() {
  return (
    <div className="bg-white p-4 shadow rounded min-h-[300px] mt-4">
      <h2 className="text-lg font-semibold mb-2">Canvas</h2>
      <div className="canvas-content">
        <Outlet />
      </div>
    </div>
  );
}