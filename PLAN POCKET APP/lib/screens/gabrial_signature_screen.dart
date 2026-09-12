import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class GabrialSignatureScreen extends StatefulWidget {
  const GabrialSignatureScreen({super.key});

  static void checkAndTrigger({
    required BuildContext context,
    required List<DateTime> tapTimestamps,
  }) {
    final now = DateTime.now();
    tapTimestamps.removeWhere(
      (t) => now.difference(t).inMilliseconds > 2000,
    );
    tapTimestamps.add(now);

    if (tapTimestamps.length >= 5) {
      tapTimestamps.clear();
      Navigator.of(context).push(
        PageRouteBuilder(
          opaque: false,
          pageBuilder: (context, animation, secondaryAnimation) =>
              const GabrialSignatureScreen(),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            final curved = CurvedAnimation(
              parent: animation,
              curve: Curves.easeOutBack,
            );
            return FadeTransition(
              opacity: animation,
              child: ScaleTransition(
                scale: Tween<double>(begin: 0.88, end: 1.0).animate(curved),
                child: child,
              ),
            );
          },
        ),
      );
    }
  }

  @override
  State<GabrialSignatureScreen> createState() => _GabrialSignatureScreenState();
}

class _GabrialSignatureScreenState extends State<GabrialSignatureScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090E17),
      body: SafeArea(
        child: Stack(
          children: [
            // Ambient background glows
            Positioned(
              top: -60,
              left: -60,
              child: Container(
                width: 260,
                height: 260,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF10B981).withValues(alpha: 0.12),
                ),
              ),
            ),
            Positioned(
              bottom: 40,
              right: -40,
              child: Container(
                width: 280,
                height: 280,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF2563EB).withValues(alpha: 0.14),
                ),
              ),
            ),

            Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 440),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Glowing developer seal
                      AnimatedBuilder(
                        animation: _pulseController,
                        builder: (context, child) {
                          final glowSpread = 4.0 + (_pulseController.value * 8.0);
                          final glowBlur = 24.0 + (_pulseController.value * 16.0);
                          return Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF10B981).withValues(alpha: 0.28),
                                  blurRadius: glowBlur,
                                  spreadRadius: glowSpread,
                                ),
                                BoxShadow(
                                  color: const Color(0xFF2563EB).withValues(alpha: 0.22),
                                  blurRadius: glowBlur * 1.3,
                                  spreadRadius: glowSpread * 0.8,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: child,
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: const LinearGradient(
                              colors: [
                                Color(0xFF10B981),
                                Color(0xFF3B82F6),
                                Color(0xFF10B981),
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                          ),
                          child: ClipOval(
                            child: Container(
                              color: const Color(0xFF091627),
                              padding: const EdgeInsets.all(16),
                              child: Image.asset(
                                'assets/icon/splash_icon.png',
                                width: 88,
                                height: 88,
                                fit: BoxFit.contain,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Signature badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: const Color(0xFF10B981).withValues(alpha: 0.4),
                          ),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.verified, size: 14, color: Color(0xFF10B981)),
                            SizedBox(width: 6),
                            Text(
                              'AUTHOR SIGNATURE VERIFIED',
                              style: TextStyle(
                                color: Color(0xFF10B981),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 18),

                      // Name Title
                      const Text(
                        'Gabrial Deora',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 34,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.5,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Creator & Lead Engineer',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.primaryBlueLight,
                          letterSpacing: 0.4,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Creed Card
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: AppTheme.surface.withValues(alpha: 0.7),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.08),
                          ),
                        ),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.format_quote_rounded,
                              color: Color(0xFF10B981),
                              size: 28,
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'PlanPocket was envisioned and built by Gabrial Deora as an uncompromising, high-performance personal finance platform. Built for speed, complete privacy, and elegance.',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 13.5,
                                height: 1.5,
                                color: AppTheme.textPrimary,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                            const SizedBox(height: 14),
                            // Stylized signature
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.3),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text(
                                '— Gabrial Deora',
                                style: TextStyle(
                                  fontFamily: 'Nata Sans',
                                  fontSize: 17,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1.0,
                                  color: Color(0xFF34D399),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Tech Spec Grid
                      _buildSpecItem(
                        icon: Icons.flash_on,
                        iconColor: const Color(0xFFF59E0B),
                        title: 'Ultra-Fast SWR Architecture',
                        subtitle: 'Instant sub-millisecond local caching with async revalidation',
                      ),
                      const SizedBox(height: 10),
                      _buildSpecItem(
                        icon: Icons.shield,
                        iconColor: const Color(0xFF10B981),
                        title: 'Production-Grade Security',
                        subtitle: 'JWT token auth, encrypted key storage & zero data leaks',
                      ),
                      const SizedBox(height: 10),
                      _buildSpecItem(
                        icon: Icons.devices,
                        iconColor: const Color(0xFF3B82F6),
                        title: 'Universal Ecosystem',
                        subtitle: 'Synchronized cross-platform state with Render cloud backend',
                      ),
                      const SizedBox(height: 28),

                      // Return Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () => Navigator.of(context).pop(),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF10B981),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 4,
                          ),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.arrow_back, size: 18),
                              SizedBox(width: 8),
                              Text(
                                'Back to PlanPocket',
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'PlanPocket • Crafted by Gabrial Deora • 2026',
                        style: TextStyle(
                          fontSize: 11,
                          color: AppTheme.textMuted.withValues(alpha: 0.8),
                          letterSpacing: 0.4,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Top close button
            Positioned(
              top: 10,
              right: 14,
              child: IconButton(
                icon: const Icon(Icons.close, color: Colors.white70),
                tooltip: 'Close',
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSpecItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
      decoration: BoxDecoration(
        color: AppTheme.surface.withValues(alpha: 0.45),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.05),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.14),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
