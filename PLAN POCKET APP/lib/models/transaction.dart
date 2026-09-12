class TransactionModel {
  final String id;
  final String type; // 'income' or 'expense'
  final String category;
  final double amount;
  final String description;
  final DateTime date;
  final DateTime? createdAt;

  TransactionModel({
    required this.id,
    required this.type,
    required this.category,
    required this.amount,
    required this.description,
    required this.date,
    this.createdAt,
  });

  bool get isIncome => type.toLowerCase() == 'income';
  bool get isExpense => type.toLowerCase() == 'expense';

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['_id'] ?? json['id'] ?? '',
      type: json['type'] ?? 'expense',
      category: json['category'] ?? 'General',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      description: json['description'] ?? json['notes'] ?? '',
      date: json['date'] != null
          ? (DateTime.tryParse(json['date'].toString()) ?? DateTime.now())
          : DateTime.now(),
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'category': category,
      'amount': amount,
      'description': description,
      'notes': description,
      'date': date.toIso8601String(),
    };
  }
}
