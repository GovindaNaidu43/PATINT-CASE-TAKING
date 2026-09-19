import 'package:flutter/material.dart';
import '../theme/medikiosk_theme.dart';

class RoyalCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final bool glowing;
  final VoidCallback? onTap;

  const RoyalCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16.0),
    this.glowing = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: MediKioskTheme.royalSurface.withOpacity(0.92),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: glowing ? MediKioskTheme.royalGoldAccent : MediKioskTheme.royalBorder,
          width: glowing ? 1.5 : 1.0,
        ),
        boxShadow: [
          if (glowing)
            BoxShadow(
              color: MediKioskTheme.royalGold.withOpacity(0.18),
              blurRadius: 18,
              offset: const Offset(0, 6),
            )
          else
            BoxShadow(
              color: MediKioskTheme.royalGold.withOpacity(0.06),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onTap,
          child: Padding(
            padding: padding,
            child: child,
          ),
        ),
      ),
    );
  }
}

class RoyalButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool isSecondary;
  final bool isDanger;
  final bool isFullWidth;

  const RoyalButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.isSecondary = false,
    this.isDanger = false,
    this.isFullWidth = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final buttonContent = Row(
      mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (icon != null) ...[
          Icon(
            icon,
            size: 18,
            color: isSecondary
                ? (isDanger ? MediKioskTheme.royalCrimson : MediKioskTheme.royalGold)
                : Colors.white,
          ),
          const SizedBox(width: 8),
        ],
        Text(
          label.toUpperCase(),
          style: theme.textTheme.titleMedium?.copyWith(
            color: isSecondary
                ? (isDanger ? MediKioskTheme.royalCrimson : MediKioskTheme.royalGold)
                : Colors.white,
            fontWeight: FontWeight.w800,
            fontSize: 13,
            letterSpacing: 1.2,
          ),
        ),
      ],
    );

    if (isSecondary) {
      return OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          side: BorderSide(
            color: isDanger ? MediKioskTheme.royalCrimson : MediKioskTheme.royalGold,
            width: 1.5,
          ),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        ),
        child: buttonContent,
      );
    }

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        gradient: LinearGradient(
          colors: isDanger
              ? [const Color(0xFFC27367), MediKioskTheme.royalCrimson]
              : [MediKioskTheme.royalGoldAccent, MediKioskTheme.royalGold],
        ),
        boxShadow: [
          BoxShadow(
            color: (isDanger ? MediKioskTheme.royalCrimson : MediKioskTheme.royalGold).withOpacity(0.25),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        ),
        child: buttonContent,
      ),
    );
  }
}

class SignalBadgeWidget extends StatelessWidget {
  final String label;

  const SignalBadgeWidget({super.key, this.label = 'Supporting Signal — Not a Diagnosis'});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: MediKioskTheme.royalTeal.withOpacity(0.15),
        border: Border.all(color: MediKioskTheme.royalTeal, width: 1.0),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.bolt, size: 14, color: Color(0xFF5A7A55)),
          const SizedBox(width: 4),
          Flexible(
            child: Text(
              label,
              style: const TextStyle(
                color: Color(0xFF5A7A55),
                fontSize: 11,
                fontWeight: FontWeight.w700,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
