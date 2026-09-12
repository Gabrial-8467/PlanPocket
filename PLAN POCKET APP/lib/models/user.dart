class User {
  final String id;
  final String name;
  final String email;
  final double annualIncome;
  final double monthlyIncome;
  final String? contactNumber;
  final String? address;
  final String? occupationType;
  final DateTime? createdAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.annualIncome = 0.0,
    this.monthlyIncome = 0.0,
    this.contactNumber,
    this.address,
    this.occupationType,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      annualIncome: (json['annualIncome'] as num?)?.toDouble() ?? 0.0,
      monthlyIncome: (json['monthlyIncome'] as num?)?.toDouble() ?? 0.0,
      contactNumber: json['contactNumber'],
      address: json['address'],
      occupationType: json['occupationType'],
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'annualIncome': annualIncome,
      'monthlyIncome': monthlyIncome,
      if (contactNumber != null) 'contactNumber': contactNumber,
      if (address != null) 'address': address,
      if (occupationType != null) 'occupationType': occupationType,
      if (createdAt != null) 'createdAt': createdAt!.toIso8601String(),
    };
  }

  User copyWith({
    String? id,
    String? name,
    String? email,
    double? annualIncome,
    double? monthlyIncome,
    String? contactNumber,
    String? address,
    String? occupationType,
    DateTime? createdAt,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      annualIncome: annualIncome ?? this.annualIncome,
      monthlyIncome: monthlyIncome ?? this.monthlyIncome,
      contactNumber: contactNumber ?? this.contactNumber,
      address: address ?? this.address,
      occupationType: occupationType ?? this.occupationType,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
