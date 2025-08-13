import { create } from "zustand";

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
  items?: InvoiceItem[];
  tax?: number;
  discount?: number;
  total?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type InvoicesState = {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  loading: boolean;
  error: string | null;

  // Statistics
  totalRevenue: number;
  pendingAmount: number;
  paidAmount: number;

  // Actions
  fetchInvoices: () => Promise<void>;
  fetchInvoice: (id: string) => Promise<void>;
  createInvoice: (invoiceData: Partial<Invoice>) => Promise<void>;
  updateInvoice: (id: string, invoiceData: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  markAsPaid: (id: string) => Promise<void>;
  markAsCancelled: (id: string) => Promise<void>;
  calculateStatistics: () => void;
  setInvoices: (invoices: Invoice[]) => void;
  setCurrentInvoice: (invoice: Invoice | null) => void;
  clearError: () => void;
};

export const useInvoicesStore = create<InvoicesState>((set, get) => ({
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,
  totalRevenue: 0,
  pendingAmount: 0,
  paidAmount: 0,

  fetchInvoices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/invoices", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch invoices");
      }

      const data = await response.json();
      const invoices = data.invoices || data;
      
      set({ 
        invoices, 
        loading: false, 
        error: null 
      });

      // Calculate statistics after fetching
      get().calculateStatistics();
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch invoices",
        loading: false,
      });
      throw error;
    }
  },

  fetchInvoice: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch invoice");
      }

      const data = await response.json();
      set({ 
        currentInvoice: data.invoice || data, 
        loading: false, 
        error: null 
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch invoice",
        loading: false,
      });
      throw error;
    }
  },

  createInvoice: async (invoiceData: Partial<Invoice>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create invoice");
      }

      const data = await response.json();
      const newInvoice = data.invoice || data;
      
      set((state) => ({
        invoices: [...state.invoices, newInvoice],
        loading: false,
        error: null,
      }));

      // Recalculate statistics
      get().calculateStatistics();

      return newInvoice;
    } catch (error: any) {
      set({
        error: error.message || "Failed to create invoice",
        loading: false,
      });
      throw error;
    }
  },

  updateInvoice: async (id: string, invoiceData: Partial<Invoice>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update invoice");
      }

      const data = await response.json();
      const updatedInvoice = data.invoice || data;
      
      set((state) => ({
        invoices: state.invoices.map((invoice) =>
          invoice._id === id ? updatedInvoice : invoice
        ),
        currentInvoice: state.currentInvoice?._id === id ? updatedInvoice : state.currentInvoice,
        loading: false,
        error: null,
      }));

      // Recalculate statistics
      get().calculateStatistics();

      return updatedInvoice;
    } catch (error: any) {
      set({
        error: error.message || "Failed to update invoice",
        loading: false,
      });
      throw error;
    }
  },

  deleteInvoice: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete invoice");
      }

      set((state) => ({
        invoices: state.invoices.filter((invoice) => invoice._id !== id),
        currentInvoice: state.currentInvoice?._id === id ? null : state.currentInvoice,
        loading: false,
        error: null,
      }));

      // Recalculate statistics
      get().calculateStatistics();
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete invoice",
        loading: false,
      });
      throw error;
    }
  },

  markAsPaid: async (id: string) => {
    return get().updateInvoice(id, { 
      status: "paid", 
      paidDate: new Date().toISOString() 
    });
  },

  markAsCancelled: async (id: string) => {
    return get().updateInvoice(id, { status: "cancelled" });
  },

  calculateStatistics: () => {
    const { invoices } = get();
    
    const totalRevenue = invoices
      .filter(inv => inv.status === "paid")
      .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);
    
    const pendingAmount = invoices
      .filter(inv => inv.status === "pending")
      .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);
    
    const paidAmount = invoices
      .filter(inv => inv.status === "paid")
      .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);

    set({ totalRevenue, pendingAmount, paidAmount });
  },

  setInvoices: (invoices) => {
    set({ invoices });
    get().calculateStatistics();
  },
  
  setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),
  clearError: () => set({ error: null }),
}));