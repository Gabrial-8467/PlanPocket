import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class AddTransactionDialog extends StatefulWidget {
  const AddTransactionDialog({super.key});

  @override
  State<AddTransactionDialog> createState() => _AddTransactionDialogState();
}

class _AddTransactionDialogState extends State<AddTransactionDialog> {
  final _formKey = GlobalKey<FormState>();
  String _type = 'expense';
  final _descController = TextEditingController();
  final _amountController = TextEditingController();
  String _selectedCategory = '';
  DateTime _selectedDate = DateTime.now();
  bool _isSubmitting = false;

  final List<String> _expenseCategories = [
    'Food & Dining',
    'Shopping',
    'Transportation',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Rent',
    'Other Expense',
  ];

  final List<String> _incomeCategories = [
    'Salary',
    'Freelance',
    'Business',
    'Investments',
    'Gift',
    'Bonus',
    'Other Income',
  ];

  @override
  void initState() {
    super.initState();
    _selectedCategory = _expenseCategories.first;
  }

  @override
  void dispose() {
    _descController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final amount = double.tryParse(_amountController.text.trim());
    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid amount greater than 0')),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      await Provider.of<AppProvider>(context, listen: false).addTransaction(
        type: _type,
        category: _selectedCategory,
        amount: amount,
        description: _descController.text.trim().isNotEmpty
            ? _descController.text.trim()
            : _selectedCategory,
        date: _selectedDate,
      );

      if (mounted) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: AppTheme.successGreenDark,
            content: Text('Transaction added successfully!'),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.dangerRedDark,
            content: Text('Failed to add transaction: $e'),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final categories = _type == 'expense' ? _expenseCategories : _incomeCategories;

    return Dialog(
      backgroundColor: AppTheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppTheme.warningYellow, width: 2),
      ),
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryBlue.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.add_circle, color: AppTheme.primaryBlueLight),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'Add New Transaction',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Type Toggle (Expense / Income)
                Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _type = 'expense';
                            _selectedCategory = _expenseCategories.first;
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _type == 'expense'
                                ? AppTheme.dangerRed
                                : AppTheme.surfaceLight,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'Expense',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: _type == 'expense'
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _type = 'income';
                            _selectedCategory = _incomeCategories.first;
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _type == 'income'
                                ? AppTheme.successGreen
                                : AppTheme.surfaceLight,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'Income',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: _type == 'income'
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Description Field (Optional)
                TextFormField(
                  controller: _descController,
                  decoration: const InputDecoration(
                    labelText: 'Description (Optional)',
                    hintText: 'e.g. Grocery shopping or Dinner',
                    prefixIcon: Icon(Icons.description, color: AppTheme.textMuted),
                  ),
                ),
                const SizedBox(height: 14),

                // Amount Field
                TextFormField(
                  controller: _amountController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(
                    labelText: 'Amount (₹)',
                    hintText: '0.00',
                    prefixIcon: Icon(Icons.currency_rupee, color: AppTheme.textMuted),
                  ),
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Amount is required';
                    final n = double.tryParse(v.trim());
                    if (n == null || n <= 0) return 'Enter a valid positive number';
                    return null;
                  },
                ),
                const SizedBox(height: 14),

                // Category Field (Dropdown)
                DropdownButtonFormField<String>(
                  key: ValueKey('category-$_type'),
                  initialValue: categories.contains(_selectedCategory)
                      ? _selectedCategory
                      : categories.first,
                  dropdownColor: AppTheme.surfaceLight,
                  decoration: const InputDecoration(
                    labelText: 'Category',
                    prefixIcon: Icon(Icons.category, color: AppTheme.textMuted),
                  ),
                  items: categories
                      .map((c) => DropdownMenuItem(
                            value: c,
                            child: Text(c, style: const TextStyle(color: Colors.white)),
                          ))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) {
                      setState(() => _selectedCategory = val);
                    }
                  },
                ),
                const SizedBox(height: 14),

                // Date Picker Tile
                InkWell(
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _selectedDate,
                      firstDate: DateTime(2000),
                      lastDate: DateTime(2100),
                      builder: (ctx, child) {
                        return Theme(
                          data: Theme.of(ctx).copyWith(
                            colorScheme: const ColorScheme.dark(
                              primary: AppTheme.primaryBlue,
                              surface: AppTheme.surface,
                            ),
                          ),
                          child: child!,
                        );
                      },
                    );
                    if (picked != null) {
                      setState(() => _selectedDate = picked);
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceLight,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.calendar_today, color: AppTheme.textMuted, size: 20),
                            const SizedBox(width: 12),
                            Text(
                              DateFormat('dd MMM yyyy').format(_selectedDate),
                              style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
                            ),
                          ],
                        ),
                        const Icon(Icons.arrow_drop_down, color: AppTheme.textMuted),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _isSubmitting ? null : () => Navigator.of(context).pop(),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.surfaceLighter),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text('Cancel', style: TextStyle(color: AppTheme.textSecondary)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _isSubmitting ? null : _submit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _type == 'expense'
                              ? AppTheme.dangerRed
                              : AppTheme.successGreen,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                        child: _isSubmitting
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Text('Add Transaction'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
