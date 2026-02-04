"use client";

import { useState, useEffect } from "react";

export default function ChangeValuePage() {
  const [storageKeys, setStorageKeys] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  // Load all localStorage keys on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const keys = Object.keys(localStorage);
      setStorageKeys(keys);
    }
  }, []);

  // Load data when a key is selected
  const handleKeySelect = (key: string) => {
    setSelectedKey(key);
    setEditingIndex(null);
    
    try {
      const value = localStorage.getItem(key);
      if (value) {
        const parsed = JSON.parse(value);
        // Handle both arrays and single objects
        setData(Array.isArray(parsed) ? parsed : [parsed]);
      }
    } catch (error) {
      console.error("Error parsing localStorage value:", error);
      alert("Failed to parse localStorage value. Make sure it's valid JSON.");
    }
  };

  // Start editing an item
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...data[index] });
  };

  // Update form field
  const handleFormChange = (field: string, value: string) => {
    setEditForm((prev: any) => ({
      ...prev,
      [field]: value === "" ? null : isNaN(Number(value)) ? value : Number(value),
    }));
  };

  // Save changes
  const handleSave = () => {
    if (editingIndex === null) return;

    const updatedData = [...data];
    updatedData[editingIndex] = editForm;
    setData(updatedData);

    // Save to localStorage
    const valueToSave = data.length === 1 && !Array.isArray(JSON.parse(localStorage.getItem(selectedKey) || "[]"))
      ? updatedData[0]
      : updatedData;
    
    localStorage.setItem(selectedKey, JSON.stringify(valueToSave));
    setEditingIndex(null);
    alert("Saved successfully!");
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  // Delete an item
  const handleDelete = (index: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);

    if (updatedData.length > 0) {
      localStorage.setItem(selectedKey, JSON.stringify(updatedData));
    } else {
      localStorage.removeItem(selectedKey);
      setSelectedKey("");
    }
    
    alert("Deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">LocalStorage Editor</h1>

        {/* Step 1: Select localStorage key */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">1. Select Storage Key</h2>
          <select
            value={selectedKey}
            onChange={(e) => handleKeySelect(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a key --</option>
            {storageKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Display and edit data */}
        {selectedKey && data.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              2. Edit Data from "{selectedKey}"
            </h2>

            <div className="space-y-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                >
                  {editingIndex === index ? (
                    // Edit mode
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-4">
                        Editing Item {index + 1}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {Object.keys(editForm).map((field) => (
                          <div key={field}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              {field}
                            </label>
                            <input
                              type="text"
                              value={editForm[field] === null ? "" : editForm[field]}
                              onChange={(e) => handleFormChange(field, e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`Enter ${field}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-3">
                        Item {index + 1}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {Object.entries(item).map(([key, value]) => (
                          <div key={key} className="bg-gray-600 rounded p-2">
                            <span className="text-xs text-gray-400 block">{key}:</span>
                            <span className="text-white">
                              {value === null ? "null" : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedKey && data.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400">No data found for this key.</p>
          </div>
        )}
      </div>
    </div>
  );
}
