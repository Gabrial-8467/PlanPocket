import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/app_provider.dart';
import '../../theme/app_theme.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _contactController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _addressController = TextEditingController();

  String _occupationType = 'salaried';
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _nameController.dispose();
    _contactController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  // Password strength calculation
  int _calculatePasswordStrength(String password) {
    if (password.isEmpty) return 0;
    int score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (RegExp(r'[A-Z]').hasMatch(password) && RegExp(r'[a-z]').hasMatch(password)) score++;
    if (RegExp(r'\d').hasMatch(password)) score++;
    if (RegExp(r'[^A-Za-z0-9]').hasMatch(password)) score++;
    return score;
  }

  (String, Color) _getStrengthInfo(int score) {
    switch (score) {
      case 1:
        return ('Very Weak', AppTheme.dangerRed);
      case 2:
        return ('Weak', Colors.orange);
      case 3:
        return ('Fair', AppTheme.warningYellow);
      case 4:
        return ('Good', Colors.lightGreen);
      case 5:
        return ('Strong', AppTheme.successGreen);
      default:
        return ('', Colors.transparent);
    }
  }

  Future<void> _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;

    if (_passwordController.text != _confirmPasswordController.text) {
      setState(() => _errorMessage = 'Passwords do not match');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await Provider.of<AppProvider>(context, listen: false).register(
        name: _nameController.text.trim(),
        email: _emailController.text.trim().toLowerCase(),
        password: _passwordController.text,
        contactNumber: _contactController.text.trim(),
        address: _addressController.text.trim(),
        occupationType: _occupationType,
      );
      if (mounted) {
        Navigator.of(context).pop(); // Back to login / root
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString().replaceAll('Exception: ', '');
        });
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final password = _passwordController.text;
    final strengthScore = _calculatePasswordStrength(password);
    final (strengthLabel, strengthColor) = _getStrengthInfo(strengthScore);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: const Text('Back'),
        titleTextStyle: const TextStyle(color: AppTheme.textSecondary, fontSize: 16),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 500),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Header
                  Center(
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(18),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF10B981).withValues(alpha: 0.16),
                            blurRadius: 18,
                            spreadRadius: 1,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(18),
                        child: Image.asset(
                          'assets/icon/splash_icon.png',
                          width: 72,
                          height: 72,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Create Your Account',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Join PlanPocket and take control of your finances',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 13,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Signup Form Card
                  Card(
                    color: AppTheme.surface,
                    child: Padding(
                      padding: const EdgeInsets.all(22),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            if (_errorMessage != null) ...[
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: AppTheme.dangerRed.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: AppTheme.dangerRed.withValues(alpha: 0.4),
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.error_outline,
                                      color: AppTheme.dangerRed,
                                      size: 20,
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Text(
                                        _errorMessage!,
                                        style: const TextStyle(
                                          color: AppTheme.dangerRed,
                                          fontSize: 13,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 16),
                            ],

                            // Full Name
                            TextFormField(
                              controller: _nameController,
                              decoration: const InputDecoration(
                                labelText: 'Full Name',
                                hintText: 'John Doe',
                                prefixIcon: Icon(Icons.person_outline, color: AppTheme.textMuted),
                              ),
                              validator: (val) =>
                                  (val == null || val.trim().isEmpty) ? 'Full name is required' : null,
                            ),
                            const SizedBox(height: 14),

                            // Contact Number
                            TextFormField(
                              controller: _contactController,
                              keyboardType: TextInputType.phone,
                              decoration: const InputDecoration(
                                labelText: 'Contact Number',
                                hintText: '10-digit mobile number',
                                prefixIcon: Icon(Icons.phone_outlined, color: AppTheme.textMuted),
                              ),
                              validator: (val) {
                                if (val == null || val.trim().isEmpty) {
                                  return 'Contact number is required';
                                }
                                if (!RegExp(r'^\d{10}$').hasMatch(val.trim().replaceAll(' ', ''))) {
                                  return 'Enter a valid 10-digit number';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 14),

                            // Email Address
                            TextFormField(
                              controller: _emailController,
                              keyboardType: TextInputType.emailAddress,
                              decoration: const InputDecoration(
                                labelText: 'Email Address',
                                hintText: 'you@example.com',
                                prefixIcon: Icon(Icons.email_outlined, color: AppTheme.textMuted),
                              ),
                              validator: (val) {
                                if (val == null || val.trim().isEmpty) {
                                  return 'Email is required';
                                }
                                if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(val.trim())) {
                                  return 'Enter a valid email';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 14),

                            // Occupation Type
                            DropdownButtonFormField<String>(
                              initialValue: _occupationType,
                              dropdownColor: AppTheme.surfaceLight,
                              decoration: const InputDecoration(
                                labelText: 'Occupation Type',
                                prefixIcon: Icon(Icons.work_outline, color: AppTheme.textMuted),
                              ),
                              items: const [
                                DropdownMenuItem(
                                  value: 'salaried',
                                  child: Text('Salaried', style: TextStyle(color: Colors.white)),
                                ),
                                DropdownMenuItem(
                                  value: 'self-employed',
                                  child: Text('Self-employed', style: TextStyle(color: Colors.white)),
                                ),
                              ],
                              onChanged: (val) {
                                if (val != null) setState(() => _occupationType = val);
                              },
                            ),
                            const SizedBox(height: 14),

                            // Password
                            TextFormField(
                              controller: _passwordController,
                              obscureText: _obscurePassword,
                              onChanged: (_) => setState(() {}),
                              decoration: InputDecoration(
                                labelText: 'Password',
                                hintText: '••••••••',
                                prefixIcon: const Icon(Icons.lock_outline, color: AppTheme.textMuted),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons.visibility_off_outlined
                                        : Icons.visibility_outlined,
                                    color: AppTheme.textMuted,
                                  ),
                                  onPressed: () =>
                                      setState(() => _obscurePassword = !_obscurePassword),
                                ),
                              ),
                              validator: (val) {
                                if (val == null || val.isEmpty) return 'Password is required';
                                if (val.length < 6) return 'At least 6 characters required';
                                return null;
                              },
                            ),

                            // Password strength bar
                            if (password.isNotEmpty) ...[
                              const SizedBox(height: 8),
                              Row(
                                children: List.generate(5, (index) {
                                  return Expanded(
                                    child: Container(
                                      height: 4,
                                      margin: const EdgeInsets.symmetric(horizontal: 2),
                                      decoration: BoxDecoration(
                                        color: index < strengthScore
                                            ? strengthColor
                                            : AppTheme.surfaceLighter,
                                        borderRadius: BorderRadius.circular(2),
                                      ),
                                    ),
                                  );
                                }),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Strength: $strengthLabel',
                                style: TextStyle(color: strengthColor, fontSize: 11),
                              ),
                            ],
                            const SizedBox(height: 14),

                            // Confirm Password
                            TextFormField(
                              controller: _confirmPasswordController,
                              obscureText: _obscureConfirmPassword,
                              decoration: InputDecoration(
                                labelText: 'Confirm Password',
                                hintText: '••••••••',
                                prefixIcon: const Icon(Icons.lock_outline, color: AppTheme.textMuted),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscureConfirmPassword
                                        ? Icons.visibility_off_outlined
                                        : Icons.visibility_outlined,
                                    color: AppTheme.textMuted,
                                  ),
                                  onPressed: () => setState(
                                      () => _obscureConfirmPassword = !_obscureConfirmPassword),
                                ),
                              ),
                              validator: (val) {
                                if (val == null || val.isEmpty) {
                                  return 'Please confirm your password';
                                }
                                if (val != _passwordController.text) {
                                  return 'Passwords do not match';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 14),

                            // Address
                            TextFormField(
                              controller: _addressController,
                              maxLines: 2,
                              decoration: const InputDecoration(
                                labelText: 'Address',
                                hintText: 'City, State, Country',
                                prefixIcon: Icon(Icons.location_on_outlined, color: AppTheme.textMuted),
                              ),
                              validator: (val) =>
                                  (val == null || val.trim().isEmpty) ? 'Address is required' : null,
                            ),
                            const SizedBox(height: 24),

                            // Submit Button
                            ElevatedButton(
                              onPressed: _isLoading ? null : _handleSignup,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.successGreenDark,
                                padding: const EdgeInsets.symmetric(vertical: 14),
                              ),
                              child: _isLoading
                                  ? const SizedBox(
                                      height: 20,
                                      width: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    )
                                  : const Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(Icons.person_add, size: 20),
                                        SizedBox(width: 8),
                                        Text('Create Account'),
                                      ],
                                    ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Link to Login
                  Wrap(
                    alignment: WrapAlignment.center,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      const Text(
                        'Already have an account? ',
                        style: TextStyle(color: AppTheme.textSecondary, fontSize: 14),
                      ),
                      GestureDetector(
                        onTap: () => Navigator.of(context).pop(),
                        child: const Text(
                          'Sign in here',
                          style: TextStyle(
                            color: AppTheme.primaryBlueLight,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
