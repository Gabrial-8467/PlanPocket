import 'dart:math' as math;
import 'dart:ui';
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
          barrierDismissible: true,
          barrierColor: Colors.black.withValues(alpha: 0.65),
          transitionDuration: const Duration(milliseconds: 650),
          reverseTransitionDuration: const Duration(milliseconds: 350),
          pageBuilder: (context, animation, secondaryAnimation) =>
              const GabrialSignatureScreen(),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            final curved = CurvedAnimation(
              parent: animation,
              curve: Curves.easeOutCubic,
              reverseCurve: Curves.easeInCubic,
            );

            return BackdropFilter(
              filter: ImageFilter.blur(
                sigmaX: 16.0 * curved.value,
                sigmaY: 16.0 * curved.value,
              ),
              child: FadeTransition(
                opacity: curved,
                child: SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0.0, 0.08),
                    end: Offset.zero,
                  ).animate(curved),
                  child: ScaleTransition(
                    scale: Tween<double>(begin: 0.90, end: 1.0).animate(curved),
                    child: child,
                  ),
                ),
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
    with TickerProviderStateMixin {
  late AnimationController _entranceController;
  late AnimationController _pulseController;
  late AnimationController _rotateController;
  late AnimationController _particlesDriftController;

  late Animation<double> _sealScale;
  late Animation<double> _sealRotation;
  late Animation<double> _headerOpacity;
  late Animation<Offset> _headerSlide;
  late Animation<double> _creedOpacity;
  late Animation<Offset> _creedSlide;
  late Animation<double> _specsOpacity;
  late Animation<Offset> _specsSlide;
  late Animation<double> _buttonScale;

  late List<_DustMolecule> _dustMolecules;

  @override
  void initState() {
    super.initState();

    // 1. Orchestrated entrance controller
    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    // 2. Ambient pulse & rotation controllers
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2400),
    )..repeat(reverse: true);

    _rotateController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat();

    // 3. Continuous dust molecules floating drift controller
    _particlesDriftController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 15),
    )..repeat();

    // Generate 65 dust molecules with varied properties
    final random = math.Random(42);
    const particleColors = [
      Color(0xFF10B981), // Emerald
      Color(0xFF38BDF8), // Cyan
      Color(0xFF34D399), // Mint
      Color(0xFFFDE047), // Gold
      Colors.white,      // Stardust
      Color(0xFF818CF8), // Indigo
    ];

    _dustMolecules = List.generate(65, (index) {
      final angle = random.nextDouble() * 2 * math.pi;
      final distance = 60.0 + random.nextDouble() * 320.0;
      return _DustMolecule(
        initialAngle: angle,
        burstDistance: distance,
        targetXRatio: 0.05 + random.nextDouble() * 0.90,
        targetYRatio: 0.05 + random.nextDouble() * 0.90,
        radius: 1.0 + random.nextDouble() * 2.8,
        baseAlpha: 0.25 + random.nextDouble() * 0.65,
        color: particleColors[random.nextInt(particleColors.length)],
        speed: 0.8 + random.nextDouble() * 1.6,
        phaseOffset: random.nextDouble() * 2 * math.pi,
        driftX: (random.nextDouble() - 0.5) * 40.0,
        driftY: -20.0 - random.nextDouble() * 50.0,
      );
    });

    // Staggered choreographies
    _sealScale = CurvedAnimation(
      parent: _entranceController,
      curve: const Interval(0.0, 0.45, curve: Curves.easeOutBack),
    );

    _sealRotation = Tween<double>(begin: -0.15, end: 0.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.0, 0.50, curve: Curves.easeOutQuart),
      ),
    );

    _headerOpacity = CurvedAnimation(
      parent: _entranceController,
      curve: const Interval(0.20, 0.60, curve: Curves.easeOut),
    );

    _headerSlide = Tween<Offset>(
      begin: const Offset(0, 0.35),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.20, 0.60, curve: Curves.easeOutCubic),
      ),
    );

    _creedOpacity = CurvedAnimation(
      parent: _entranceController,
      curve: const Interval(0.40, 0.78, curve: Curves.easeOut),
    );

    _creedSlide = Tween<Offset>(
      begin: const Offset(0, 0.25),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.40, 0.78, curve: Curves.easeOutCubic),
      ),
    );

    _specsOpacity = CurvedAnimation(
      parent: _entranceController,
      curve: const Interval(0.55, 0.88, curve: Curves.easeOut),
    );

    _specsSlide = Tween<Offset>(
      begin: const Offset(0, 0.20),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.55, 0.88, curve: Curves.easeOutCubic),
      ),
    );

    _buttonScale = CurvedAnimation(
      parent: _entranceController,
      curve: const Interval(0.70, 1.0, curve: Curves.easeOutBack),
    );

    _entranceController.forward();
  }

  @override
  void dispose() {
    _entranceController.dispose();
    _pulseController.dispose();
    _rotateController.dispose();
    _particlesDriftController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xF0080D18),
      body: SafeArea(
        child: Stack(
          children: [
            // Dynamic floating ambient orbs
            AnimatedBuilder(
              animation: _pulseController,
              builder: (context, child) {
                final pulse = _pulseController.value;
                return Stack(
                  children: [
                    Positioned(
                      top: -40 + (pulse * 20),
                      left: -50 + (pulse * 15),
                      child: Container(
                        width: 280,
                        height: 280,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              const Color(0xFF10B981).withValues(alpha: 0.18 + (pulse * 0.08)),
                              const Color(0xFF10B981).withValues(alpha: 0.0),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 20 - (pulse * 20),
                      right: -50 - (pulse * 10),
                      child: Container(
                        width: 320,
                        height: 320,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              const Color(0xFF2563EB).withValues(alpha: 0.16 + (pulse * 0.06)),
                              const Color(0xFF2563EB).withValues(alpha: 0.0),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),

            // DUST MOLECULES PARTICLE LAYER
            Positioned.fill(
              child: IgnorePointer(
                child: AnimatedBuilder(
                  animation: Listenable.merge([
                    _entranceController,
                    _particlesDriftController,
                  ]),
                  builder: (context, _) {
                    return CustomPaint(
                      painter: _DustMoleculesPainter(
                        molecules: _dustMolecules,
                        entranceProgress: _entranceController.value,
                        driftProgress: _particlesDriftController.value,
                      ),
                    );
                  },
                ),
              ),
            ),

            // Main Content Area
            Center(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 440),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // PHASE 1: Dramatic Seal Entrance with Swirling Gradient Border
                      ScaleTransition(
                        scale: _sealScale,
                        child: RotationTransition(
                          turns: _sealRotation,
                          child: AnimatedBuilder(
                            animation: Listenable.merge([_pulseController, _rotateController]),
                            builder: (context, child) {
                              final glowSpread = 4.0 + (_pulseController.value * 7.0);
                              final glowBlur = 24.0 + (_pulseController.value * 18.0);
                              final angle = _rotateController.value * 2 * math.pi;

                              return Container(
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF10B981).withValues(alpha: 0.35),
                                      blurRadius: glowBlur,
                                      spreadRadius: glowSpread,
                                    ),
                                    BoxShadow(
                                      color: const Color(0xFF3B82F6).withValues(alpha: 0.25),
                                      blurRadius: glowBlur * 1.2,
                                      spreadRadius: glowSpread * 0.7,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Container(
                                  padding: const EdgeInsets.all(3.5),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: SweepGradient(
                                      transform: GradientRotation(angle),
                                      colors: const [
                                        Color(0xFF10B981),
                                        Color(0xFF3B82F6),
                                        Color(0xFF06B6D4),
                                        Color(0xFF10B981),
                                      ],
                                    ),
                                  ),
                                  child: ClipOval(
                                    child: Container(
                                      color: const Color(0xFF091627),
                                      padding: const EdgeInsets.all(16),
                                      child: Image.asset(
                                        'assets/icon/splash_icon.png',
                                        width: 86,
                                        height: 86,
                                        fit: BoxFit.contain,
                                      ),
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 22),

                      // PHASE 2: Badge & Header Slide Entrance
                      SlideTransition(
                        position: _headerSlide,
                        child: FadeTransition(
                          opacity: _headerOpacity,
                          child: Column(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF10B981).withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: const Color(0xFF10B981).withValues(alpha: 0.45),
                                    width: 1.2,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF10B981).withValues(alpha: 0.15),
                                      blurRadius: 10,
                                      spreadRadius: 1,
                                    ),
                                  ],
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
                              const SizedBox(height: 16),
                              const Text(
                                'Gabrial Deora',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 34,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 0.6,
                                  color: Colors.white,
                                  shadows: [
                                    Shadow(
                                      color: Color(0x6610B981),
                                      blurRadius: 16,
                                      offset: Offset(0, 2),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'Creator & Lead Engineer',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 15.5,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.primaryBlueLight,
                                  letterSpacing: 0.4,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 18),

                      // PHASE 3: Creed Card Slide Entrance
                      SlideTransition(
                        position: _creedSlide,
                        child: FadeTransition(
                          opacity: _creedOpacity,
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(18),
                            decoration: BoxDecoration(
                              color: AppTheme.surface.withValues(alpha: 0.65),
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.09),
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.25),
                                  blurRadius: 18,
                                  offset: const Offset(0, 8),
                                ),
                              ],
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
                                  'PlanPocket was envisioned and crafted by Gabrial Deora as an uncompromising, high-performance personal finance suite. Built for speed, complete privacy, and elegance.',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 13.5,
                                    height: 1.55,
                                    color: AppTheme.textPrimary,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                                const SizedBox(height: 14),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withValues(alpha: 0.35),
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(
                                      color: const Color(0xFF10B981).withValues(alpha: 0.2),
                                    ),
                                  ),
                                  child: const Text(
                                    '— Gabrial Deora',
                                    style: TextStyle(
                                      fontFamily: 'serif',
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
                        ),
                      ),
                      const SizedBox(height: 16),

                      // PHASE 4: Tech Spec Grid Staggered Entrance
                      SlideTransition(
                        position: _specsSlide,
                        child: FadeTransition(
                          opacity: _specsOpacity,
                          child: Column(
                            children: [
                              _buildSpecItem(
                                icon: Icons.flash_on,
                                iconColor: const Color(0xFFF59E0B),
                                title: 'Ultra-Fast SWR Architecture',
                                subtitle: 'Sub-millisecond local caching with async cloud sync',
                              ),
                              const SizedBox(height: 10),
                              _buildSpecItem(
                                icon: Icons.shield,
                                iconColor: const Color(0xFF10B981),
                                title: 'Production-Grade Security',
                                subtitle: 'JWT vault storage, auto-sanitizing credentials & zero leaks',
                              ),
                              const SizedBox(height: 10),
                              _buildSpecItem(
                                icon: Icons.devices,
                                iconColor: const Color(0xFF3B82F6),
                                title: 'Universal Ecosystem',
                                subtitle: 'Synchronized cross-platform state with Render backend',
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // PHASE 5: Action Button Pop Entrance
                      ScaleTransition(
                        scale: _buttonScale,
                        child: SizedBox(
                          width: double.infinity,
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF10B981).withValues(alpha: 0.35),
                                  blurRadius: 18,
                                  spreadRadius: 1,
                                  offset: const Offset(0, 5),
                                ),
                              ],
                            ),
                            child: ElevatedButton(
                              onPressed: () => Navigator.of(context).pop(),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF10B981),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                elevation: 0,
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
                                      letterSpacing: 0.3,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'PlanPocket • Crafted by Gabrial Deora • 2026',
                        style: TextStyle(
                          fontSize: 11,
                          color: AppTheme.textMuted.withValues(alpha: 0.75),
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

/// Dust molecule model
class _DustMolecule {
  final double initialAngle;
  final double burstDistance;
  final double targetXRatio;
  final double targetYRatio;
  final double radius;
  final double baseAlpha;
  final Color color;
  final double speed;
  final double phaseOffset;
  final double driftX;
  final double driftY;

  _DustMolecule({
    required this.initialAngle,
    required this.burstDistance,
    required this.targetXRatio,
    required this.targetYRatio,
    required this.radius,
    required this.baseAlpha,
    required this.color,
    required this.speed,
    required this.phaseOffset,
    required this.driftX,
    required this.driftY,
  });
}

/// Hardware-accelerated dust molecules canvas painter
class _DustMoleculesPainter extends CustomPainter {
  final List<_DustMolecule> molecules;
  final double entranceProgress;
  final double driftProgress;

  _DustMoleculesPainter({
    required this.molecules,
    required this.entranceProgress,
    required this.driftProgress,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final centerX = size.width * 0.5;
    final centerY = size.height * 0.22; // Seal position

    // Eased explosion burst on opening
    final burstCurve = Curves.easeOutCubic.transform(entranceProgress);
    final settleCurve = Curves.easeInOutCubic.transform(
      (entranceProgress - 0.4).clamp(0.0, 0.6) / 0.6,
    );

    final time = driftProgress * 2 * math.pi;

    for (final molecule in molecules) {
      // 1. Initial burst position outward from seal center
      final burstX = centerX + math.cos(molecule.initialAngle) * (molecule.burstDistance * burstCurve);
      final burstY = centerY + math.sin(molecule.initialAngle) * (molecule.burstDistance * burstCurve);

      // 2. Ambient target drift position with continuous smooth float
      final floatTime = time * molecule.speed + molecule.phaseOffset;
      final ambientX = (size.width * molecule.targetXRatio) +
          (math.sin(floatTime) * molecule.driftX) +
          (math.cos(floatTime * 0.7) * 12.0);
      final ambientY = (size.height * molecule.targetYRatio) +
          (math.sin(floatTime * 0.8) * molecule.driftY) +
          (math.cos(floatTime) * 14.0);

      // Interpolate from opening burst to ambient drift
      final currentX = burstX + (ambientX - burstX) * settleCurve;
      final currentY = burstY + (ambientY - burstY) * settleCurve;

      // 3. Dynamic twinkling opacity
      final twinkle = 0.55 + 0.45 * math.sin(floatTime * 2.2);
      final alpha = (molecule.baseAlpha * twinkle * entranceProgress).clamp(0.0, 1.0);

      if (alpha <= 0.01) continue;

      final paint = Paint()
        ..color = molecule.color.withValues(alpha: alpha)
        ..style = PaintingStyle.fill;

      // Draw soft ambient glow halo for larger dust particles
      if (molecule.radius > 1.8) {
        final glowPaint = Paint()
          ..color = molecule.color.withValues(alpha: alpha * 0.35)
          ..maskFilter = MaskFilter.blur(BlurStyle.normal, molecule.radius * 2.2);
        canvas.drawCircle(Offset(currentX, currentY), molecule.radius * 2.2, glowPaint);
      }

      // Draw particle core
      canvas.drawCircle(Offset(currentX, currentY), molecule.radius, paint);
    }
  }

  @override
  bool shouldRepaint(covariant _DustMoleculesPainter oldDelegate) {
    return oldDelegate.entranceProgress != entranceProgress ||
        oldDelegate.driftProgress != driftProgress;
  }
}
