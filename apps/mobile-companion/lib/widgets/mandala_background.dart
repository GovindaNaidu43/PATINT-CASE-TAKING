import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../theme/medikiosk_theme.dart';

/// Full screen background widget with:
/// 1. Watercolor radial & linear gradients
/// 2. Slowly rotating top-right Ornate Mandala
/// 3. Counter-rotating bottom-right Ornate Mandala
/// 4. Golden ink-splatter accents
class MandalaBackgroundScaffold extends StatefulWidget {
  final Widget child;
  final PreferredSizeWidget? appBar;
  final Widget? bottomNavigationBar;
  final Widget? floatingActionButton;

  const MandalaBackgroundScaffold({
    super.key,
    required this.child,
    this.appBar,
    this.bottomNavigationBar,
    this.floatingActionButton,
  });

  @override
  State<MandalaBackgroundScaffold> createState() => _MandalaBackgroundScaffoldState();
}

class _MandalaBackgroundScaffoldState extends State<MandalaBackgroundScaffold>
    with SingleTickerProviderStateMixin {
  late final AnimationController _rotationController;

  @override
  void initState() {
    super.initState();
    _rotationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 75),
    )..repeat();
  }

  @override
  void dispose() {
    _rotationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: MediKioskTheme.royalBg,
      appBar: widget.appBar,
      bottomNavigationBar: widget.bottomNavigationBar,
      floatingActionButton: widget.floatingActionButton,
      body: Stack(
        children: [
          // 1. Watercolor Gradient Wash
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFFFBF5EB),
                    Color(0xFFF5E8D0),
                    Color(0xFFEDDBBC),
                  ],
                ),
              ),
            ),
          ),
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: const Alignment(0.85, -0.75),
                  radius: 0.65,
                  colors: [
                    const Color(0xFFF0DEC0).withOpacity(0.70),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: const Alignment(0.95, 0.85),
                  radius: 0.75,
                  colors: [
                    const Color(0xFFC9974B).withOpacity(0.28),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // 2. Ink Splatters
          const Positioned.fill(
            child: IgnorePointer(
              child: CustomPaint(
                painter: InkSplatterPainter(),
              ),
            ),
          ),

          // 3. Top-Right Rotating Mandala
          Positioned(
            top: -100,
            right: -100,
            width: 320,
            height: 320,
            child: IgnorePointer(
              child: AnimatedBuilder(
                animation: _rotationController,
                builder: (context, child) {
                  return Transform.rotate(
                    angle: _rotationController.value * 2 * math.pi,
                    child: child,
                  );
                },
                child: Opacity(
                  opacity: 0.45,
                  child: CustomPaint(
                    painter: OrnateMandalaPainter(color: MediKioskTheme.royalGold),
                  ),
                ),
              ),
            ),
          ),

          // 4. Bottom-Right Counter-Rotating Mandala
          Positioned(
            bottom: -130,
            right: -110,
            width: 440,
            height: 440,
            child: IgnorePointer(
              child: AnimatedBuilder(
                animation: _rotationController,
                builder: (context, child) {
                  return Transform.rotate(
                    angle: -_rotationController.value * 2 * math.pi * 0.75,
                    child: child,
                  );
                },
                child: Opacity(
                  opacity: 0.52,
                  child: CustomPaint(
                    painter: OrnateMandalaPainter(color: MediKioskTheme.royalGoldAccent),
                  ),
                ),
              ),
            ),
          ),

          // 5. Active Foreground Content
          SafeArea(
            child: widget.child,
          ),
        ],
      ),
    );
  }
}

/// Ornate Classical Mandala Painter
class OrnateMandalaPainter extends CustomPainter {
  final Color color;

  OrnateMandalaPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    final paintStroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    final paintThin = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.6;

    final paintFill = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    // Rings
    canvas.drawCircle(center, radius * 0.95, paintStroke);
    canvas.drawCircle(center, radius * 0.88, paintThin);
    canvas.drawCircle(center, radius * 0.76, paintStroke);
    canvas.drawCircle(center, radius * 0.42, paintStroke);
    canvas.drawCircle(center, radius * 0.28, paintThin);
    canvas.drawCircle(center, radius * 0.14, paintStroke);
    canvas.drawCircle(center, radius * 0.05, paintFill);

    // 16 Petals - Outer Lotus
    for (int i = 0; i < 16; i++) {
      final double angle = (i * 22.5 * math.pi) / 180;
      final double tipX = center.dx + (radius * 0.95) * math.cos(angle);
      final double tipY = center.dy + (radius * 0.95) * math.sin(angle);

      final double c1X = center.dx + (radius * 0.68) * math.cos(angle - 0.22);
      final double c1Y = center.dy + (radius * 0.68) * math.sin(angle - 0.22);
      final double c2X = center.dx + (radius * 0.68) * math.cos(angle + 0.22);
      final double c2Y = center.dy + (radius * 0.68) * math.sin(angle + 0.22);

      final path = Path()
        ..moveTo(center.dx, center.dy)
        ..cubicTo(c1X, c1Y, c2X, c2Y, tipX, tipY)
        ..close();

      canvas.drawPath(path, paintThin);
      canvas.drawCircle(
        Offset(
          center.dx + (radius * 0.86) * math.cos(angle),
          center.dy + (radius * 0.86) * math.sin(angle),
        ),
        1.5,
        paintFill,
      );
    }

    // 8 Petals - Mid Lotus
    for (int i = 0; i < 8; i++) {
      final double angle = (i * 45 * math.pi) / 180;
      final double tipX = center.dx + (radius * 0.74) * math.cos(angle);
      final double tipY = center.dy + (radius * 0.74) * math.sin(angle);

      final double c1X = center.dx + (radius * 0.50) * math.cos(angle - 0.35);
      final double c1Y = center.dy + (radius * 0.50) * math.sin(angle - 0.35);
      final double c2X = center.dx + (radius * 0.50) * math.cos(angle + 0.35);
      final double c2Y = center.dy + (radius * 0.50) * math.sin(angle + 0.35);

      final path = Path()
        ..moveTo(center.dx, center.dy)
        ..cubicTo(c1X, c1Y, c2X, c2Y, tipX, tipY)
        ..close();

      canvas.drawPath(path, paintStroke);
    }

    // 8 Diamonds
    for (int i = 0; i < 8; i++) {
      final double angle = (i * 45 * math.pi) / 180;
      final pTip = Offset(center.dx + (radius * 0.42) * math.cos(angle), center.dy + (radius * 0.42) * math.sin(angle));
      final pBase = Offset(center.dx + (radius * 0.32) * math.cos(angle), center.dy + (radius * 0.32) * math.sin(angle));
      final pLeft = Offset(center.dx + (radius * 0.37) * math.cos(angle - 0.25), center.dy + (radius * 0.37) * math.sin(angle - 0.25));
      final pRight = Offset(center.dx + (radius * 0.37) * math.cos(angle + 0.25), center.dy + (radius * 0.37) * math.sin(angle + 0.25));

      final diamond = Path()
        ..moveTo(pTip.dx, pTip.dy)
        ..lineTo(pLeft.dx, pLeft.dy)
        ..lineTo(pBase.dx, pBase.dy)
        ..lineTo(pRight.dx, pRight.dy)
        ..close();

      canvas.drawPath(diamond, paintThin);
    }
  }

  @override
  bool shouldRepaint(covariant OrnateMandalaPainter oldDelegate) => oldDelegate.color != color;
}

/// Ink Splatter dots matching the watercolor aesthetics
class InkSplatterPainter extends CustomPainter {
  const InkSplatterPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final dots = [
      {'x': 0.65, 'y': 0.28, 'r': 2.0, 'op': 0.45},
      {'x': 0.72, 'y': 0.32, 'r': 1.2, 'op': 0.35},
      {'x': 0.76, 'y': 0.27, 'r': 1.5, 'op': 0.40},
      {'x': 0.82, 'y': 0.34, 'r': 2.4, 'op': 0.50},
      {'x': 0.85, 'y': 0.30, 'r': 1.0, 'op': 0.30},
      {'x': 0.60, 'y': 0.62, 'r': 6.5, 'op': 0.60}, // Bold accent drop
      {'x': 0.68, 'y': 0.65, 'r': 1.8, 'op': 0.45},
      {'x': 0.74, 'y': 0.60, 'r': 1.4, 'op': 0.38},
      {'x': 0.54, 'y': 0.68, 'r': 1.6, 'op': 0.35},
    ];

    for (final d in dots) {
      final paint = Paint()
        ..color = MediKioskTheme.royalGoldAccent.withOpacity(d['op'] as double)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(
        Offset(size.width * (d['x'] as double), size.height * (d['y'] as double)),
        d['r'] as double,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
