import 'dart:convert';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'storage_service.dart';
import '../models/user.dart';
import '../models/transaction.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic data;

  ApiException(this.message, {this.statusCode, this.data});

  @override
  String toString() => message;
}

class ApiService {
  final StorageService _storageService = StorageService();

  static String get defaultBaseUrl {
    if (kIsWeb) {
      return 'http://127.0.0.1:5000/api';
    }
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:5000/api';
      }
    } catch (_) {}
    return 'http://127.0.0.1:5000/api';
  }

  String? _customBaseUrl;

  Future<String> getBaseUrl() async {
    if (_customBaseUrl != null && _customBaseUrl!.isNotEmpty) {
      return _customBaseUrl!;
    }
    final saved = await _storageService.getCustomBaseUrl();
    if (saved != null && saved.isNotEmpty) {
      _customBaseUrl = saved;
      return saved;
    }
    return defaultBaseUrl;
  }

  Future<void> setBaseUrl(String url) async {
    _customBaseUrl = url;
    await _storageService.saveBaseUrl(url);
  }

  Future<Map<String, String>> _getHeaders({bool requireAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (requireAuth) {
      final token = await _storageService.getToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  Future<dynamic> _request(
    String endpoint, {
    String method = 'GET',
    Map<String, dynamic>? body,
    bool requireAuth = true,
  }) async {
    final baseUrl = await getBaseUrl();
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = await _getHeaders(requireAuth: requireAuth);

    http.Response response;
    try {
      switch (method.toUpperCase()) {
        case 'POST':
          response = await http
              .post(url, headers: headers, body: jsonEncode(body ?? {}))
              .timeout(const Duration(seconds: 15));
          break;
        case 'PUT':
          response = await http
              .put(url, headers: headers, body: jsonEncode(body ?? {}))
              .timeout(const Duration(seconds: 15));
          break;
        case 'DELETE':
          response = await http
              .delete(url, headers: headers)
              .timeout(const Duration(seconds: 15));
          break;
        case 'GET':
        default:
          response = await http
              .get(url, headers: headers)
              .timeout(const Duration(seconds: 15));
          break;
      }
    } catch (e) {
      throw ApiException(
        'Failed to connect to server ($url). Make sure the backend server is running.\nDetails: $e',
      );
    }

    dynamic responseData;
    if (response.body.isNotEmpty) {
      try {
        responseData = jsonDecode(response.body);
      } catch (_) {
        responseData = response.body;
      }
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return responseData;
    } else {
      String message = 'Request failed';
      if (responseData is Map) {
        message = responseData['message'] ??
            responseData['msg'] ??
            (responseData['errors'] is List && responseData['errors'].isNotEmpty
                ? responseData['errors'][0]['msg']
                : null) ??
            'Server error (${response.statusCode})';
      }
      throw ApiException(
        message,
        statusCode: response.statusCode,
        data: responseData,
      );
    }
  }

  // ---------- AUTH ----------
  Future<String> register({
    required String name,
    required String email,
    required String password,
    String? contactNumber,
    String? address,
    String? occupationType,
  }) async {
    final data = <String, dynamic>{
      'name': name,
      'email': email,
      'password': password,
    };
    if (contactNumber != null && contactNumber.isNotEmpty) {
      data['contactNumber'] = contactNumber;
    }
    if (address != null && address.isNotEmpty) {
      data['address'] = address;
    }
    if (occupationType != null && occupationType.isNotEmpty) {
      data['occupationType'] = occupationType;
    }

    final res = await _request(
      '/auth/register',
      method: 'POST',
      body: data,
      requireAuth: false,
    );

    final token = res is Map ? res['token']?.toString() : null;
    if (token != null && token.isNotEmpty) {
      await _storageService.saveToken(token);
      return token;
    }
    throw ApiException('No token received from registration');
  }

  Future<String> login({
    required String email,
    required String password,
  }) async {
    final res = await _request(
      '/auth/login',
      method: 'POST',
      body: {'email': email, 'password': password},
      requireAuth: false,
    );

    final token = res is Map ? res['token']?.toString() : null;
    if (token != null && token.isNotEmpty) {
      await _storageService.saveToken(token);
      return token;
    }
    throw ApiException('Invalid credentials or no token returned');
  }

  Future<void> logout() async {
    await _storageService.removeToken();
  }

  Future<User> getCurrentUser() async {
    final res = await _request('/auth/me');
    if (res is Map<String, dynamic>) {
      if (res.containsKey('user') && res['user'] is Map<String, dynamic>) {
        return User.fromJson(res['user']);
      }
      return User.fromJson(res);
    }
    throw ApiException('Failed to parse user profile');
  }

  Future<User> updateIncome(double annualIncome) async {
    final res = await _request(
      '/users/income',
      method: 'PUT',
      body: {'annualIncome': annualIncome},
    );
    if (res is Map<String, dynamic>) {
      if (res.containsKey('user') && res['user'] is Map<String, dynamic>) {
        return User.fromJson(res['user']);
      }
      return User.fromJson(res);
    }
    throw ApiException('Failed to update income');
  }

  // ---------- TRANSACTIONS ----------
  Future<List<TransactionModel>> getTransactions() async {
    final res = await _request('/transactions');
    if (res is List) {
      return res
          .map((item) => TransactionModel.fromJson(item as Map<String, dynamic>))
          .toList();
    } else if (res is Map<String, dynamic>) {
      final list = res['transactions'] ?? res['data'];
      if (list is List) {
        return list
            .map((item) => TransactionModel.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }
    return [];
  }

  Future<TransactionModel> createTransaction({
    required String type,
    required String category,
    required double amount,
    required String description,
    DateTime? date,
  }) async {
    final body = {
      'type': type,
      'category': category,
      'amount': amount,
      'description': description,
      'notes': description,
      'date': (date ?? DateTime.now()).toIso8601String(),
    };

    final res = await _request('/transactions', method: 'POST', body: body);
    if (res is Map<String, dynamic>) {
      return TransactionModel.fromJson(res);
    }
    throw ApiException('Failed to create transaction');
  }

  Future<void> deleteTransaction(String id) async {
    await _request('/transactions/$id', method: 'DELETE');
  }
}
