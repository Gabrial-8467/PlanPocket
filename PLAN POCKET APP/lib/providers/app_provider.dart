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
  bool _isBackgroundSyncing = false;
  String? _error;
  DateTime? _lastSyncTime;

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
  bool get isBackgroundSyncing => _isBackgroundSyncing;
  String? get error => _error;
  DateTime? get lastSyncTime => _lastSyncTime;
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

  /// Instant startup with cached data, followed by background revalidation
  Future<void> checkAuth() async {
    _isLoading = true;
    final hasToken = await _storageService.hasToken();
    if (!hasToken) {
      _isLoggedIn = false;
      _user = null;
      _isLoading = false;
      notifyListeners();
      return;
    }

    // 1. FAST CACHE HYDRATION (<1ms)
    final cachedUser = await _storageService.getCachedUser();
    final cachedTx = await _storageService.getCachedTransactions();
    _lastSyncTime = await _storageService.getLastSyncTime();

    if (cachedUser != null) {
      _user = cachedUser;
      _transactions = cachedTx;
      _isLoggedIn = true;
      _calculateMetrics();
      // Notify immediately so user sees UI instantly
      notifyListeners();
    } else {
      _isLoading = true;
      notifyListeners();
    }

    // 2. BACKGROUND SERVER REVALIDATION
    _isBackgroundSyncing = true;
    notifyListeners();

    try {
      final currentUser = await _apiService.getCurrentUser();
      _user = currentUser;
      _isLoggedIn = true;
      await loadDashboardData(silent: true);
      _lastSyncTime = DateTime.now();
    } catch (e) {
      final isAuthError = e is ApiException &&
          (e.statusCode == 401 ||
              e.message.toLowerCase().contains('not authorized') ||
              e.message.toLowerCase().contains('token is not valid'));
      if (_user == null && isAuthError) {
        // Expired/invalid token -> force clean logout
        await _storageService.removeToken();
        _user = null;
        _isLoggedIn = false;
        _error = null;
      }
    } finally {
      _isLoading = false;
      _isBackgroundSyncing = false;
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

  Future<void> loadDashboardData({bool silent = false}) async {
    try {
      if (!silent) {
        _isLoading = true;
        _error = null;
        notifyListeners();
      }

      final list = await _apiService.getTransactions();
      _transactions = list;
      _calculateMetrics();
      _lastSyncTime = DateTime.now();
    } catch (e) {
      if (!silent || _transactions.isEmpty) {
        _error = e.toString();
      }
    } finally {
      if (!silent) {
        _isLoading = false;
        notifyListeners();
      }
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
      await _storageService.cacheTransactions(_transactions);
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
      await _storageService.cacheTransactions(_transactions);
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

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      _error = null;
      await _apiService.changePassword(
        currentPassword: currentPassword,
        newPassword: newPassword,
      );
    } catch (e) {
      _error = e.toString();
      rethrow;
    }
  }

  Future<String> getBaseUrl() => _apiService.getBaseUrl();

  Future<void> setBaseUrl(String url) async {
    await _apiService.setBaseUrl(url);
    await loadDashboardData();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
