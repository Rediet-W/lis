import React, { useState, useEffect } from "react";

export default function EditPatientForm({ open, patient, onClose, onUpdate }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (!patient) return;
    setForm({
      name: patient.name || "",
      email: patient.email || "",
      phone: patient.phone || "",
    });
  }, [patient]);

  if (!open) return null;

  const handleSave = async () => {
    try {
      // Replace with your API endpoint for updating patient
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      onUpdate(updated);
    } catch (e) {
      console.error(e);
      alert("Failed to update patient");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Patient</h3>
        <div className="space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Name"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Email"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Phone"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-[#36F1A2] px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
