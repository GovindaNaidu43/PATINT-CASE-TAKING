import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_companion/main.dart';

void main() {
  testWidgets('MediKiosk companion smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const MediKioskCompanionApp());
    expect(find.text('Digital ABHA ID'), findsOneWidget);
  });
}
