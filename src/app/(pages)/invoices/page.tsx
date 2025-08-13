"use client";

import Button from "@/components/buttons/Button";
import Form, { Field } from "@/components/forms/Form";
import Search from "@/components/search/Search";
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Eye,
} from "lucide-react";
import React, { useState } from "react";

export default function InvoicesPage() {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const invoice = [
    {
      id: 1,
      name: "Liz Ken",
      email: "lizken@example.com",
      amount: "$120.00",
      dateJoined: "Jan 6, 2022",
      status: "Paid",
      icon: "💰",
      iconBg: "bg-green-100",
    },
    {
      id: 2,
      name: "John Doe",
      email: "johndoe@example.com",
      amount: "$89.99",
      dateJoined: "Jan 6, 2022",
      status: "Pending",
      icon: "⏳",
      iconBg: "bg-yellow-100",
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "janesmith@example.com",
      amount: "$150.00",
      dateJoined: "Jan 6, 2022",
      status: "Failed",
      icon: "❌",
      iconBg: "bg-red-100",
    },
    {
      id: 4,
      name: "Michael Lee",
      email: "michaellee@example.com",
      amount: "$75.50",
      dateJoined: "Jan 5, 2022",
      status: "Paid",
      icon: "💸",
      iconBg: "bg-green-100",
    },
    {
      id: 5,
      name: "Angela Ray",
      email: "angelaray@example.com",
      amount: "$200.00",
      dateJoined: "Jan 5, 2022",
      status: "Pending",
      icon: "📄",
      iconBg: "bg-yellow-100",
    },
    {
      id: 6,
      name: "Samuel Park",
      email: "samuelpark@example.com",
      amount: "$95.00",
      dateJoined: "Jan 5, 2022",
      status: "Paid",
      icon: "💳",
      iconBg: "bg-green-100",
    },
    {
      id: 7,
      name: "Chidera Okeke",
      email: "chidera@example.com",
      amount: "$130.00",
      dateJoined: "Jan 4, 2022",
      status: "Failed",
      icon: "⚠️",
      iconBg: "bg-red-100",
    },
    {
      id: 8,
      name: "Kwame Mensah",
      email: "kwamemensah@example.com",
      amount: "$99.00",
      dateJoined: "Jan 5, 2022",
      status: "Paid",
      icon: "✅",
      iconBg: "bg-green-100",
    },
  ];

  const fields: Field[] = [
    { name: "learner", label: "Title", type: "text", placeholder: "" },
    { name: "track", label: "Track", type: "select", placeholder: "", options: [
      { label: "Track 1", value: "track_1" },
      { label: "Track 2", value: "track_2" },
      { label: "Track 3", value: "track_3" },
    ] },
    { name: "picture", label: "Picture", type: "file", placeholder: "" },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "",
    },
  ];

  const addButton = <Plus size={16} />;

  function handleSearch(value: string): void {
    console.log("Searching for:", value);
  }

  function handleAddCourse(): void {
    setShowModal(true);
  }

  async function handleFormSubmit(data: Record<string, string>) {
    console.log("Form Submitted", data);
    setShowModal(false);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Manage Invoices
          </h1>
          <p className="text-gray-500 mt-2">
            Filter, sort, and access invoice records
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Search onSearch={handleSearch} placeholder="Search invoice" />
        <Button variant="primary" icon={addButton} onClick={handleAddCourse}>
          Add Invoice
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-500 uppercase tracking-wide border-b">
          <div className="col-span-3">CUSTOMER</div>
          <div className="col-span-3">EMAIL</div>
          <div className="col-span-2">DATE</div>
          <div className="col-span-2">AMOUNT</div>
          <div className="col-span-1">STATUS</div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y divide-gray-100">
          {invoice.map((item, index) => (
            <div
              key={item.id}
              className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-100 transition-colors ${
                index % 2 === 1 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="col-span-3 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center`}
                >
                  <span className="text-lg">{item.icon}</span>
                </div>
                <span className="font-medium text-gray-900">{item.name}</span>
              </div>

              <div className="col-span-3 flex items-center">
                <span className="text-gray-600">{item.email}</span>
              </div>

              <div className="col-span-2 flex items-center">
                <span className="text-gray-600">{item.dateJoined}</span>
              </div>

              <div className="col-span-2 flex items-center">
                <span className="font-semibold text-gray-900">
                  {item.amount}
                </span>
              </div>

              <div className="col-span-1 flex items-center">
                <span className="text-gray-600">{item.status}</span>
              </div>

              <div className="col-span-1 flex items-center justify-end">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Pencil size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors shadow-sm rounded-lg">
          <ChevronLeft size={16} /> Previous
        </button>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-sky-700 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors shadow-sm rounded-lg">
          Next <ChevronRight size={16} />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col items-center pt-6">
            <Form
              title="Add New Invoice"
              fields={fields}
              onSubmit={handleFormSubmit}
              buttonLabel="Create Invoice"
              successMessage="Invoice added successfully"
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

