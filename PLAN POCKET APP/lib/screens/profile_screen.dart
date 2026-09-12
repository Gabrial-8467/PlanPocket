import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _incomeController = TextEditingController();
  bool _isEditingIncome = false;
  bool _isSavingIncome = false;

  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _showPasswordFields = false;
  bool _isSavingPassword = false;

  @override
  void dispose() {
    _incomeController.dispose();
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('Confirm Logout', style: TextStyle(color: Colors.white)),
        content: const Text(
          'Are you sure you want to log out of PlanPocket?',
          style: TextStyle(color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.dangerRed),
            onPressed: () async {
              Navigator.of(ctx).pop();
              await Provider.of<AppProvider>(context, listen: false).logout();
            },
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }


  Future<void> _handleSaveIncome() async {
    final income = double.tryParse(_incomeController.text.trim());
    if (income == null || income <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid annual income')),
      );
      return;
    }

    setState(() => _isSavingIncome = true);
    try {
      await Provider.of<AppProvider>(context, listen: false).updateIncome(income);
      setState(() => _isEditingIncome = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: AppTheme.successGreenDark,
            content: Text('Annual income updated successfully!'),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.dangerRedDark,
            content: Text('Failed to update: $e'),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSavingIncome = false);
      }
    }
  }

  Future<void> _handleChangePassword() async {
    final current = _currentPasswordController.text;
    final newPassword = _newPasswordController.text;
    final confirm = _confirmPasswordController.text;

    if (current.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your current password')),
      );
      return;
    }
    if (newPassword.isEmpty || newPassword.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('New password must be at least 6 characters')),
      );
      return;
    }
    if (newPassword != confirm) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('New passwords do not match')),
      );
      return;
    }

    setState(() => _isSavingPassword = true);
    try {
      await Provider.of<AppProvider>(context, listen: false).changePassword(
        currentPassword: current,
        newPassword: newPassword,
      );
      if (!mounted) return;
      _currentPasswordController.clear();
      _newPasswordController.clear();
      _confirmPasswordController.clear();
      setState(() => _showPasswordFields = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppTheme.successGreenDark,
          content: Text('Password updated successfully!'),
        ),
      );
    } catch (e) {
      if (mounted) {
        final msg = e.toString().replaceAll('Exception: ', '').replaceAll('ApiException: ', '');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.dangerRedDark,
            content: Text('Failed to change password: $msg'),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSavingPassword = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormatter = NumberFormat.currency(
      locale: 'en_IN',
      symbol: '₹',
      decimalDigits: 0,
    );

    return Consumer<AppProvider>(
      builder: (context, provider, _) {
        final user = provider.user;

        return SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Avatar & Name Card
              Center(
                child: Column(
                  children: [
                    Stack(
                      children: [
                        CircleAvatar(
                          radius: 42,
                          backgroundColor: AppTheme.surfaceLight,
                          child: const Icon(
                            Icons.person,
                            color: AppTheme.primaryBlueLight,
                            size: 52,
                          ),
                        ),
                        Positioned(
                          bottom: 2,
                          right: 2,
                          child: Container(
                            width: 16,
                            height: 16,
                            decoration: BoxDecoration(
                              color: AppTheme.successGreen,
                              shape: BoxShape.circle,
                              border: Border.all(color: AppTheme.background, width: 2.5),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Text(
                      user?.name.isNotEmpty == true ? user!.name : 'User',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.email_outlined, color: AppTheme.textMuted, size: 16),
                        const SizedBox(width: 6),
                        Text(
                          user?.email ?? '',
                          style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Overview 3-Card Grid
              Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.surface,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        children: [
                          const Icon(Icons.wallet, color: AppTheme.successGreen, size: 22),
                          const SizedBox(height: 6),
                          const Text('Monthly Income',
                              style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                          const SizedBox(height: 4),
                          FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              currencyFormatter.format(provider.monthlyIncome),
                              style: const TextStyle(
                                  color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.surface,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        children: [
                          const Icon(Icons.payments, color: AppTheme.dangerRed, size: 22),
                          const SizedBox(height: 6),
                          const Text('Monthly Expense',
                              style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                          const SizedBox(height: 4),
                          FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              currencyFormatter.format(provider.totalExpenses),
                              style: const TextStyle(
                                  color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.surface,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        children: [
                          const Icon(Icons.trending_up, color: AppTheme.primaryBlueLight, size: 22),
                          const SizedBox(height: 6),
                          const Text('Net Cash Flow',
                              style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                          const SizedBox(height: 4),
                          FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              currencyFormatter.format(provider.netCashFlow),
                              style: TextStyle(
                                color: provider.netCashFlow >= 0
                                    ? AppTheme.successGreen
                                    : AppTheme.dangerRed,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Transaction Summary Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.receipt_long, color: AppTheme.primaryBlueLight, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Transaction Summary',
                          style: TextStyle(
                            color: AppTheme.textPrimary,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total Recorded Transactions:',
                            style: TextStyle(color: AppTheme.textSecondary)),
                        Text('${provider.totalTransactions}',
                            style: const TextStyle(
                                color: Colors.white, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const Divider(color: AppTheme.surfaceLight, height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Income Count:',
                            style: TextStyle(color: AppTheme.textSecondary)),
                        Text('${provider.incomeCount}',
                            style: const TextStyle(
                                color: AppTheme.successGreen, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const Divider(color: AppTheme.surfaceLight, height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Expense Count:',
                            style: TextStyle(color: AppTheme.textSecondary)),
                        Text('${provider.expenseCount}',
                            style: const TextStyle(
                                color: AppTheme.dangerRed, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Annual Income Setting Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.currency_rupee, color: AppTheme.successGreen, size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Target Annual Income',
                              style: TextStyle(
                                color: AppTheme.textPrimary,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        if (!_isEditingIncome)
                          IconButton(
                            icon: const Icon(Icons.edit, color: AppTheme.primaryBlueLight, size: 18),
                            onPressed: () {
                              _incomeController.text =
                                  (user?.annualIncome ?? 0) > 0 ? '${user!.annualIncome.toInt()}' : '';
                              setState(() => _isEditingIncome = true);
                            },
                          ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    if (!_isEditingIncome) ...[
                      Text(
                        (user?.annualIncome ?? 0) > 0
                            ? currencyFormatter.format(user!.annualIncome)
                            : 'Not set yet',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        (user?.annualIncome ?? 0) > 0
                            ? 'Calculated Monthly: ${currencyFormatter.format(user!.annualIncome / 12)}'
                            : 'Set your annual target income to plan better.',
                        style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                      ),
                    ] else ...[
                      TextField(
                        controller: _incomeController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          hintText: 'e.g. 600000',
                          labelText: 'Annual Income (₹)',
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => setState(() => _isEditingIncome = false),
                              child: const Text('Cancel'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _isSavingIncome ? null : _handleSaveIncome,
                              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.successGreen),
                              child: _isSavingIncome
                                  ? const SizedBox(
                                      height: 18,
                                      width: 18,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    )
                                  : const Text('Save'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Change Password Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    InkWell(
                      onTap: () {
                        setState(() => _showPasswordFields = !_showPasswordFields);
                      },
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.lock_outline, color: AppTheme.warningYellow, size: 20),
                              SizedBox(width: 8),
                              Text(
                                'Change Password',
                                style: TextStyle(
                                  color: AppTheme.textPrimary,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          Icon(
                            _showPasswordFields
                                ? Icons.keyboard_arrow_up
                                : Icons.keyboard_arrow_down,
                            color: AppTheme.textMuted,
                          ),
                        ],
                      ),
                    ),
                    if (_showPasswordFields) ...[
                      const SizedBox(height: 16),
                      TextField(
                        controller: _currentPasswordController,
                        obscureText: true,
                        decoration: const InputDecoration(labelText: 'Current Password'),
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: _newPasswordController,
                        obscureText: true,
                        decoration: const InputDecoration(labelText: 'New Password'),
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: _confirmPasswordController,
                        obscureText: true,
                        decoration: const InputDecoration(labelText: 'Confirm New Password'),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _isSavingPassword ? null : _handleChangePassword,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.warningYellowDark,
                        ),
                        child: _isSavingPassword
                            ? const SizedBox(
                                height: 18,
                                width: 18,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Text('Change Password'),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Logout Button
              ElevatedButton.icon(
                onPressed: () => _showLogoutDialog(context),
                icon: const Icon(Icons.logout),
                label: const Text('Logout'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.dangerRed,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
              const SizedBox(height: 30),
            ],
          ),
        );
      },
    );
  }
}
