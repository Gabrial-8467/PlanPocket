import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../models/transaction.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class AppProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService();

  User? _user;
  bool _isLoggedIn = false;
  bool _isLoading = false;
  String? _error;

  List<TransactionModel> _transactions = [];

  // Metrics
  double _monthlyIncome = 0.0;
  double _totalExpenses = 0.0;
  double _remaining = 0.0;
  double _budgetUsed = 0.0;
  double _netCashFlow = 0.0;
  double _savingsRate = 0.0;

  // Getters
  User? get user => _user;
  bool get isLoggedIn => _isLoggedIn;
  bool get isLoading => _isLoading;
  String? get error => _error;
  List<TransactionModel> get transactions => _transactions;

  double get monthlyIncome => _monthlyIncome;
  double get totalExpenses => _totalExpenses;
  double get remaining => _remaining;
  double get budgetUsed => _budgetUsed;
  double get netCashFlow => _netCashFlow;
  double get savingsRate => _savingsRate;

  int get totalTransactions => _transactions.length;
  int get incomeCount => _transactions.where((tx) => tx.isIncome).length;
  int get expenseCount => _transactions.where((tx) => tx.isExpense).length;

  double get allTimeIncome =>
      _transactions.where((tx) => tx.isIncome).fold(0.0, (sum, tx) => sum + tx.amount);

  double get allTimeExpenses =>
      _transactions.where((tx) => tx.isExpense).fold(0.0, (sum, tx) => sum + tx.amount);

  AppProvider() {
    checkAuth();
  }

  void _calculateMetrics() {
    final thirtyDaysAgo = DateTime.now().subtract(const Duration(days: 30));

    final recentIncomes = _transactions.where(
      (tx) => tx.isIncome && tx.date.isAfter(thirtyDaysAgo),
    );
    _monthlyIncome = recentIncomes.fold(0.0, (sum, tx) => sum + tx.amount);

    final recentExpenses = _transactions.where(
      (tx) => tx.isExpense && tx.date.isAfter(thirtyDaysAgo),
    );
    _totalExpenses = recentExpenses.fold(0.0, (sum, tx) => sum + tx.amount);

    _remaining = (_monthlyIncome - _totalExpenses) > 0
        ? (_monthlyIncome - _totalExpenses)
        : 0.0;

    _budgetUsed = _monthlyIncome > 0
        ? (_totalExpenses / _monthlyIncome) * 100
        : 0.0;

    _netCashFlow = _monthlyIncome - _totalExpenses;

    _savingsRate = _monthlyIncome > 0
        ? (_netCashFlow / _monthlyIncome) * 100
        : 0.0;

    notifyListeners();
  }

  Future<void> checkAuth() async {
    final hasToken = await _storageService.hasToken();
    if (!hasToken) {
      _isLoggedIn = false;
      _user = null;
      notifyListeners();
      return;
    }

    try {
      _isLoading = true;
      notifyListeners();
      final currentUser = await _apiService.getCurrentUser();
      _user = currentUser;
      _isLoggedIn = true;
      await loadDashboardData();
    } catch (e) {
      // If token expired or unauthorized, log out cleanly
      await _storageService.removeToken();
      _user = null;
      _isLoggedIn = false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> login(String email, String password) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _apiService.login(email: email, password: password);
      _user = await _apiService.getCurrentUser();
      _isLoggedIn = true;
      await loadDashboardData();
    } catch (e) {
      _error = e.toString();
      _isLoggedIn = false;
      _user = null;
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
    String? contactNumber,
    String? address,
    String? occupationType,
  }) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _apiService.register(
        name: name,
        email: email,
        password: password,
        contactNumber: contactNumber,
        address: address,
        occupationType: occupationType,
      );
      _user = await _apiService.getCurrentUser();
      _isLoggedIn = true;
      await loadDashboardData();
    } catch (e) {
      _error = e.toString();
      _isLoggedIn = false;
      _user = null;
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _apiService.logout();
    _user = null;
    _isLoggedIn = false;
    _transactions = [];
    _monthlyIncome = 0.0;
    _totalExpenses = 0.0;
    _remaining = 0.0;
    _budgetUsed = 0.0;
    _netCashFlow = 0.0;
    _savingsRate = 0.0;
    _error = null;
    notifyListeners();
  }

  Future<void> loadDashboardData() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final list = await _apiService.getTransactions();
      _transactions = list;
      _calculateMetrics();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addTransaction({
    required String type,
    required String category,
    required double amount,
    required String description,
    DateTime? date,
  }) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final newTx = await _apiService.createTransaction(
        type: type,
        category: category,
        amount: amount,
        description: description,
        date: date,
      );
      _transactions.insert(0, newTx);
      _calculateMetrics();
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteTransaction(String id) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _apiService.deleteTransaction(id);
      _transactions.removeWhere((tx) => tx.id == id);
      _calculateMetrics();
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateIncome(double income) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final updatedUser = await _apiService.updateIncome(income);
      _user = updatedUser;
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<String> getBaseUrl() => _apiService.getBaseUrl();

  Future<void> setBaseUrl(String url) async {
    await _apiService.setBaseUrl(url);
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
