"use client";
import Button from "@/components/buttons/Button";
import Form, { Field } from "@/components/forms/Form";
import Search from "@/components/search/Search";
import { Plus, Trash2, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useInvoicesStore } from "@/store/invoicesStore";
import { useLearnersStore } from "@/store/learnersStore";
import { useTracksStore } from "@/store/tracksStore";
import toast from "react-hot-toast";

type Invoice = {
  _id: string;
  invoiceNumber: string;
  learnerId?: string;
  learnerName?: string;
  learnerEmail?: string;
  trackId?: string;
  trackName?: string;
  amount: number;
  currency?: string;
  status: "pending" | "paid" | "cancelled" | "overdue";
  dueDate?: string;
  paidDate?: string;
  paymentMethod?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function InvoicesPage() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of invoices per page

  // Get invoices data and functions from store
  const {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    clearError
  } = useInvoicesStore();

  // Get learners and tracks data for form options
  const { learners, fetchLearners } = useLearnersStore();
  const { tracks, fetchTracks } = useTracksStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchInvoices().catch((err) => {
      console.error("Failed to fetch invoices:", err.message || "Unknown error");
    });
    fetchLearners().catch((err) => {
      console.error("Failed to fetch learners:", err.message || "Unknown error");
    });
    fetchTracks().catch((err) => {
      console.error("Failed to fetch tracks:", err.message || "Unknown error");
    });
  }, [fetchInvoices, fetchLearners, fetchTracks]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'An error occurred');
      clearError();
    }
  }, [error, clearError]);

  // Convert learners and tracks to options for form
  const learnerOptions = learners.map(learner => ({
    label: `${learner.firstName} ${learner.lastName} (${learner.email})`,
    value: learner._id
  }));

  const trackOptions = tracks.map(track => ({
    label: track.name || track.title || 'Untitled Track',
    value: track._id
  }));

  // Define form fields based on API requirements
  const fields: Field[] = [
    {
      name: "learner",
      label: "Select Learner",
      type: "select",
      placeholder: "Choose a learner",
      options: learnerOptions,
      required: true,
    },
    {
      name: "track", 
      label: "Track",
      type: "select",
      placeholder: "Choose a track",
      options: trackOptions,
      required: false,
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      placeholder: "Enter custom amount or leave empty",
      required: false,
    },
    {
      name: "paymentDetails",
      label: "Payment Details",
      type: "textarea",
      placeholder: "Add notes or description for this invoice",
      required: false,
    },
  ];

  const addButton = <Plus size={16} />;

  function handleSearch(value: string): void {
    // TODO: Implement search functionality
    console.log("Searching for:", value);
  }

  function handleAddInvoice(): void {
    console.log("Invoice form fields:", fields);
    console.log("Learner options:", learnerOptions);
    console.log("Track options:", trackOptions);
    setShowModal(true);
  }

  async function handleFormSubmit(data: Record<string, any>) {
    try {
      console.log("Form data received:", data);
      console.log("Available learners:", learners);
      console.log("Selected learner ID:", data.learner);
      
      // Find the selected learner to verify it exists
      const selectedLearner = learners.find(l => l._id === data.learner);
      console.log("Selected learner object:", selectedLearner);
      
      const invoiceData: any = {
        learner: data.learner,
        paystackCallbackUrl: `${window.location.origin}/payment`,
        paymentDetails: data.paymentDetails || "Invoice payment",
      };
      
      // Add track if selected
      if (data.track) {
        invoiceData.track = data.track;
      }
      
      // Add amount if specified
      if (data.amount) {
        invoiceData.amount = parseFloat(data.amount);
      }

      console.log("Sending invoice data to API:", invoiceData);

      const loadingToast = toast.loading("Creating invoice...");
      
      await createInvoice(invoiceData);
      
      toast.dismiss(loadingToast);
      toast.success("Invoice created successfully!");
      setShowModal(false);
    } catch (error: unknown) {
      console.error("Invoice creation error:", error);
      let errorMessage = error instanceof Error ? error.message : "Failed to create invoice";
      
      // Provide more helpful error message for enrollment issues
      if (errorMessage.toLowerCase().includes("learner does not exist or is not enrolled")) {
        errorMessage = `The selected learner is not enrolled in any track. Please enroll the learner in a track first before creating an invoice.`;
      }
      
      toast.error(errorMessage);
    }
  }

  function handleEditInvoice(invoice: Invoice): void {
    setEditingInvoice(invoice);
    setShowEditModal(true);
  }

  async function handleEditFormSubmit(data: Record<string, any>) {
    if (!editingInvoice) return;
    
    try {
      const invoiceData: any = {
        learner: data.learner,
        paymentDetails: data.paymentDetails,
      };
      
      if (data.track) {
        invoiceData.track = data.track;
      }
      
      if (data.amount) {
        invoiceData.amount = parseFloat(data.amount);
      }

      const loadingToast = toast.loading("Updating invoice...");
      
      await updateInvoice(editingInvoice._id, invoiceData);
      
      toast.dismiss(loadingToast);
      toast.success("Invoice updated successfully!");
      setShowEditModal(false);
      setEditingInvoice(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update invoice";
      toast.error(errorMessage);
    }
  }

  function handleDeleteInvoice(invoice: Invoice): void {
    setDeletingInvoice(invoice);
    setShowDeleteModal(true);
  }

  async function confirmDelete(): Promise<void> {
    if (!deletingInvoice) return;
    
    try {
      const loadingToast = toast.loading("Deleting invoice...");
      
      await deleteInvoice(deletingInvoice._id);
      
      toast.dismiss(loadingToast);
      toast.success("Invoice deleted successfully!");
      setShowDeleteModal(false);
      setDeletingInvoice(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete invoice";
      toast.error(errorMessage);
    }
  }

  function cancelDelete(): void {
    setShowDeleteModal(false);
    setDeletingInvoice(null);
  }

  // Function to get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return { icon: '✅', bg: 'bg-green-100', color: 'text-green-800' };
      case 'pending':
        return { icon: '⏳', bg: 'bg-yellow-100', color: 'text-yellow-800' };
      case 'failed':
        return { icon: '❌', bg: 'bg-red-100', color: 'text-red-800' };
      case 'cancelled':
        return { icon: '🚫', bg: 'bg-gray-100', color: 'text-gray-800' };
      case 'overdue':
        return { icon: '⚠️', bg: 'bg-orange-100', color: 'text-orange-800' };
      default:
        return { icon: '📄', bg: 'bg-blue-100', color: 'text-blue-800' };
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = invoices.slice(startIndex, endIndex);
  const showPagination = invoices.length > itemsPerPage;

  const goToPreviousPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  };

  return (
    <>
      {/* Header */}
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

      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <Search onSearch={handleSearch} placeholder="Search invoice" />
        <Button variant="primary" icon={addButton} onClick={handleAddInvoice}>
          Add Invoice
        </Button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-500 uppercase tracking-wide border-b">
          <div className="col-span-3">CUSTOMER</div>
          <div className="col-span-3">EMAIL</div>
          <div className="col-span-2">DATE</div>
          <div className="col-span-2">AMOUNT</div>
          <div className="col-span-1">STATUS</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Loading invoices...
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No invoices found. Create your first invoice!
            </div>
          ) : (
            currentInvoices.filter(invoice => invoice && invoice._id).map((invoice, index) => {
              const statusDisplay = getStatusDisplay(invoice.status);
              return (
                <div
                  key={invoice._id}
                  className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-100 transition-colors ${
                    index % 2 === 1 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {/* Customer Name with Avatar */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${statusDisplay.bg} flex items-center justify-center overflow-hidden`}>
                      <span className="text-lg">{statusDisplay.icon}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {invoice?.learnerName || 'Unknown Customer'}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="col-span-3 flex items-center">
                    <span className="text-gray-600">{invoice?.learnerEmail || 'N/A'}</span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-600">
                      {invoice?.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="col-span-2 flex items-center">
                    <span className="font-semibold text-gray-900">
                      ${invoice?.amount?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                      {invoice.status}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button 
                      onClick={() => handleEditInvoice(invoice)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteInvoice(invoice)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination - Only show if there are more items than itemsPerPage */}
      {showPagination && (
        <div className="flex items-center justify-between mt-6">
          <button 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-3 py-2 transition-colors shadow-sm rounded-lg ${
              currentPage === 1 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 transition-colors shadow-sm rounded-lg ${
              currentPage === totalPages 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col items-center pt-6">
            <Form
              title="Add New Invoice"
              fields={fields}
              onSubmit={handleFormSubmit}
              buttonLabel="Create Invoice"
              successMessage="Invoice created successfully!"
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {showEditModal && editingInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col items-center pt-6">
            <Form
              title="Update Invoice"
              fields={fields}
              defaultValues={{
                learner: editingInvoice.learnerId || "",
                track: editingInvoice.trackId || "",
                amount: editingInvoice.amount?.toString() || "",
                paymentDetails: editingInvoice.description || ""
              }}
              onSubmit={handleEditFormSubmit}
              buttonLabel="Update Invoice"
              successMessage="Invoice updated successfully"
              onClose={() => {
                setShowEditModal(false);
                setEditingInvoice(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Invoice</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the invoice for &ldquo;{deletingInvoice?.learnerName || 'this customer'}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}