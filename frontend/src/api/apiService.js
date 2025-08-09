// API Service for PlanPocket
// This file handles all API calls to the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Helper method to get auth headers
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        };
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication APIs
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
        }

        return response;
    }

    async logout() {
        localStorage.removeItem('authToken');
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    async updateProfile(profileData) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async changePassword(passwordData) {
        return this.request('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    }

    // User APIs
    async updateIncome(incomeData) {
        return this.request('/user/income', {
            method: 'PUT',
            body: JSON.stringify(incomeData)
        });
    }

    async getDashboardData() {
        return this.request('/user/dashboard');
    }

    // Transaction APIs
    async getTransactions(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/transactions?${queryString}`);
    }

    async createTransaction(transactionData) {
        return this.request('/transactions', {
            method: 'POST',
            body: JSON.stringify(transactionData)
        });
    }

    async getTransaction(id) {
        return this.request(`/transactions/${id}`);
    }

    async updateTransaction(id, transactionData) {
        return this.request(`/transactions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(transactionData)
        });
    }

    async deleteTransaction(id) {
        return this.request(`/transactions/${id}`, {
            method: 'DELETE'
        });
    }

    async getTransactionStats() {
        return this.request('/transactions/stats/summary');
    }

    // Loan APIs
    async getLoans(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/loans?${queryString}`);
    }

    async createLoan(loanData) {
        return this.request('/loans', {
            method: 'POST',
            body: JSON.stringify(loanData)
        });
    }

    async getLoan(id) {
        return this.request(`/loans/${id}`);
    }

    async updateLoan(id, loanData) {
        return this.request(`/loans/${id}`, {
            method: 'PUT',
            body: JSON.stringify(loanData)
        });
    }

    async deleteLoan(id) {
        return this.request(`/loans/${id}`, {
            method: 'DELETE'
        });
    }

    async calculateEMI(emiData) {
        return this.request('/loans/calculate-emi', {
            method: 'POST',
            body: JSON.stringify(emiData)
        });
    }

    async getLoanStats() {
        return this.request('/loans/stats/summary');
    }

    // Summary APIs
    async getFinancialSummary() {
        return this.request('/summary');
    }

    async getYearlySummary() {
        return this.request('/summary/yearly');
    }

    async getSpendingTrends() {
        return this.request('/summary/trends');
    }

    // Utility methods
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    getToken() {
        return localStorage.getItem('authToken');
    }

    setToken(token) {
        localStorage.setItem('authToken', token);
    }

    removeToken() {
        localStorage.removeItem('authToken');
    }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
