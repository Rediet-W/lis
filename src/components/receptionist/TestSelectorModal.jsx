import React, { useEffect, useState } from "react";

export default function TestSelectorModal({ open, onClose, onAdd }) {
  const [tests, setTests] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!open) return;
    // Replace with your API: GET /api/test-types
    fetch("/api/test-types")
      .then((r) => (r.ok ? r.json() : []))
      .then(setTests)
      .catch(() => setTests([]));
    setSelected([]);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select Tests</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="space-y-3 max-h-72 overflow-auto">
          {tests.map((t) => (
            <div
              key={t._id || t.id}
              className="p-3 border rounded flex justify-between items-start"
            >
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-gray-600">
                  Reference: {t.reference || "N/A"}
                </div>
                <div className="text-sm text-gray-600">
                  Price: {t.price ? `$${t.price}` : "N/A"}
                </div>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={!!selected.find((s) => s.id === (t._id || t.id))}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelected((prev) => [
                        ...prev,
                        {
                          id: t._id || t.id,
                          name: t.name,
                          price: t.price,
                          reference: t.reference,
                        },
                      ]);
                    else
                      setSelected((prev) =>
                        prev.filter((x) => x.id !== (t._id || t.id))
                      );
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button className="px-4 py-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-[#235F72] text-white px-4 py-2 rounded"
            onClick={() => onAdd(selected)}
          >
            Add Selected
          </button>
        </div>
      </div>
    </div>
  );
}
