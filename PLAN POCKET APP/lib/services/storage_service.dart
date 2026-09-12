import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/transaction.dart';

class StorageService {
  static const String _tokenKey = 'authToken';
  static const String _baseUrlKey = 'customBaseUrl';
  static const String _cachedUserKey = 'cached_user_profile';
  static const String _cachedTransactionsKey = 'cached_transactions_list';
  static const String _lastSyncKey = 'cached_last_sync_timestamp';

  // --- Auth Token ---
  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await clearCache();
  }

  Future<bool> hasToken() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  // --- Base URL Config ---
  Future<void> saveBaseUrl(String url) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_baseUrlKey, url);
  }

  Future<String?> getCustomBaseUrl() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_baseUrlKey);
  }

  // --- Caching for Instant Startup & Offline Resilience ---
  Future<void> cacheUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_cachedUserKey, jsonEncode(user.toJson()));
  }

  Future<User?> getCachedUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = prefs.getString(_cachedUserKey);
      if (str != null && str.isNotEmpty) {
        return User.fromJson(jsonDecode(str) as Map<String, dynamic>);
      }
    } catch (_) {}
    return null;
  }

  Future<void> cacheTransactions(List<TransactionModel> transactions) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = transactions.map((t) => t.toJson()).toList();
    await prefs.setString(_cachedTransactionsKey, jsonEncode(jsonList));
    await prefs.setInt(_lastSyncKey, DateTime.now().millisecondsSinceEpoch);
  }

  Future<List<TransactionModel>> getCachedTransactions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = prefs.getString(_cachedTransactionsKey);
      if (str != null && str.isNotEmpty) {
        final list = jsonDecode(str) as List;
        return list
            .map((item) => TransactionModel.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {}
    return [];
  }

  Future<DateTime?> getLastSyncTime() async {
    final prefs = await SharedPreferences.getInstance();
    final ms = prefs.getInt(_lastSyncKey);
    return ms != null ? DateTime.fromMillisecondsSinceEpoch(ms) : null;
  }

  Future<void> clearCache() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_cachedUserKey);
    await prefs.remove(_cachedTransactionsKey);
    await prefs.remove(_lastSyncKey);
  }
}
