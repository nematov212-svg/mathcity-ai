import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/auth_design_tokens.dart';

/// MathCity AI — Rasmiy Maxfiylik Siyosati (Privacy Policy)
/// Google OAuth, COPPA, GDPR va O‘zbekiston Respublikasi qonunchiligi talablariga mos
class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = AuthTokens.isDark(context);
    final size = MediaQuery.of(context).size;
    final isDesktop = size.width > 800;

    return Scaffold(
      backgroundColor: AuthTokens.bg(context),
      appBar: AppBar(
        backgroundColor: AuthTokens.card(context),
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_rounded,
            color: AuthTokens.ink(context),
          ),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/welcome');
            }
          },
        ),
        title: Text(
          'Maxfiylik siyosati',
          style: TextStyle(
            fontFamily: 'Nunito',
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: AuthTokens.ink(context),
          ),
        ),
        centerTitle: true,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            color: isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
            height: 1,
          ),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              maxWidth: isDesktop ? 760 : double.infinity,
            ),
            child: ListView(
              padding: EdgeInsets.symmetric(
                horizontal: isDesktop ? 32 : 20,
                vertical: 24,
              ),
              children: [
                // Header Card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AuthTokens.card(context),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
                      width: 1.5,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AuthTokens.brand(context).withOpacity(0.12),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Icon(
                              Icons.security_rounded,
                              color: AuthTokens.brand(context),
                              size: 26,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'MathCity AI Maxfiylik Siyosati',
                                  style: TextStyle(
                                    fontFamily: 'Nunito',
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    color: AuthTokens.ink(context),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Oxirgi yangilanish: 2026-yil 23-noyabr',
                                  style: TextStyle(
                                    fontFamily: 'Nunito',
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: AuthTokens.mute(context),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Text(
                        'Ushbu Maxfiylik siyosati MathCity AI ta’lim platformasi (veb-sayt, mobil ilova va backend API xizmatlari) tomonidan foydalanuvchilar, o‘quvchilar va ota-onalarning shaxsiy ma’lumotlari qanday to‘planishi, ishlatilishi, saqlanishi va himoyalanishini bayon qiladi.',
                        style: TextStyle(
                          fontFamily: 'Nunito',
                          fontSize: 14,
                          height: 1.5,
                          color: AuthTokens.ink(context),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // 1-bo'lim
                _buildSection(
                  context,
                  icon: Icons.info_outline_rounded,
                  title: '1. Kirish va Platforma haqida',
                  content:
                      'MathCity AI — maktab o‘quvchilari va matematika ixlosmandlari uchun interaktiv, sun’iy intellekt (AI) ustoz yordamida bilim olish va shahar qurish o‘yin mexanikasi orqali rag‘batlantiruvchi ta’lim platformasidir.\n\n'
                      'Biz foydalanuvchilarimiz, ayniqsa voyaga yetmagan bolalarning shaxsiy daxlsizligi va xavfsizligini birlamchi o‘ringa qo‘yamiz. Ushbu siyosat Google API Services User Data Policy, COPPA (Bolalar onlayn maxfiyligini himoya qilish to‘g‘risidagi qonun), GDPR hamda O‘zbekiston Respublikasining "Shaxsga doir ma’lumotlar to‘g‘risida"gi Qonuni talablariga to‘liq mos keladi.',
                ),

                // 2-bo'lim
                _buildSection(
                  context,
                  icon: Icons.folder_shared_outlined,
                  title: '2. Qanday ma’lumotlar yig‘iladi?',
                  content:
                      'MathCity AI faqat ta’lim jarayonini tashkil etish va ilova ishlashi uchun qat’iy zarur bo‘lgan minimal ma’lumotlarni to‘playdi:\n\n'
                      'a) Ro‘yxatdan o‘tish ma’lumotlari:\n'
                      '• Foydalanuvchi nomi (username) va ixtiyoriy email manzili.\n'
                      '• Parol: faqat kuchli bir tomonlama kriptografik xesh ko‘rinishida (Bcrypt 12 rounds) saqlanadi. Parolning o‘zi hech qachon ochiq saqlanmaydi.\n'
                      '• Tug‘ilgan sana (kun, oy, yil): o‘quvchining yoshini hisoblash, unga mos matematika sinfi (1–11 sinf) va o‘quv dasturini belgilash uchun xizmat qiladi.\n'
                      '• Profil rasmi (avatar): ilova ichidagi tayyor avatarlar yoki foydalanuvchi yuklagan rasm.\n\n'
                      'b) Google Sign-In orqali kirilganda:\n'
                      '• Google hisob identifikatori (Google ID / sub).\n'
                      '• Email manzili va ism-sharif (displayName).\n'
                      '• Profil rasmi havolasi (picture URL).\n\n'
                      'c) Apple Sign-In orqali kirilganda:\n'
                      '• Apple foydalanuvchi identifikatori (appleUserId).\n'
                      '• Email manzili (haqiqiy yoki Apple Private Relay orqali shifrlangan manzil).\n'
                      '• Ism va familiya (faqat foydalanuvchi ruxsat bergan taqdirda).\n\n'
                      'd) O‘quv faoliyati va yutuqlar:\n'
                      '• Yechilgan matematika mashqlari, to‘g‘ri/noto‘g‘ri javoblar, o‘rganilgan darslar.\n'
                      '• To‘plangan tangalar (coin balance), tajriba ballari (XP), daraja (level) va peshqadamlar reytingi ko‘rsatkichlari.\n'
                      '• Virtual shahar binolari va kunlik topshiriqlar holati.',
                ),

                // 3-bo'lim
                _buildSection(
                  context,
                  icon: Icons.psychology_outlined,
                  title: '3. AI Ustoz (Ziyo AI) bilan ishlashda ma’lumotlar',
                  content:
                      'O‘quvchi ilovadagi AI Ustozga matematika masalasini matn ko‘rinishida kiritishi, masalaning fotosuratini yoki ovozli savolini yuborishi mumkin.\n\n'
                      '• Ushbu savollar faqat matematik masalani tahlil qilish va qadamma-qadam tushuntirish berish maqsadida ishlatiladi.\n'
                      '• Murakkab masalalar Google Gemini API xizmati orqali shifrlangan HTTPS protokoli bilan qayta ishlanadi.\n'
                      '• Muhim: Google Gemini tizimiga foydalanuvchining paroli, shaxsiy ID raqami yoki shaxsini tasdiqlovchi ma’lumotlar YUBORILMAYDI. Faqat o‘quv topshirig‘i matni/tasviri yuboriladi.\n'
                      '• Suhbat tarixi o‘quvchiga o‘zining avvalgi tushuntirishlarini qayta ko‘rib chiqish imkonini berish uchun o‘z hisobiga bog‘langan holda saqlanadi.',
                ),

                // 4-bo'lim (Google Limited Use talablari)
                _buildSection(
                  context,
                  icon: Icons.verified_user_outlined,
                  title: '4. Google Foydalanuvchi Ma’lumotlari (Limited Use siyosati)',
                  content:
                      'Google hisobi orqali kirishda olingan ma’lumotlar bilan ishlashimiz qat’iy ravishda "Google API Services User Data Policy" hamda uning "Limited Use" (Cheklangan foydalanish) talablariga mos keladi:\n\n'
                      '1. Faqat autentifikatsiya: Google ma’lumotlari faqatgina tizimga xavfsiz kirish va o‘quvchi profilini yaratish uchun ishlatiladi.\n'
                      '2. Reklamaga taqiq: Google’dan olingan hech qanday ma’lumot uchinchi tomon reklama tizimlariga berilmaydi va maqsadli reklama (targeting) uchun ishlatilmaydi.\n'
                      '3. Ma’lumotlarni sotmaslik: Biz foydalanuvchilarimizning ma’lumotlarini hech qachon sotmaymiz yoki uchinchi shaxslarga tijoriy maqsadda topshirmaymiz.\n'
                      '4. AI modellarini o‘qitmaslik: Google orqali olingan foydalanuvchi shaxsiy ma’lumotlari umumiy sun’iy intellekt (AI/ML) modellarini o‘qitish uchun ishlatilmaydi.',
                ),

                // 5-bo'lim
                _buildSection(
                  context,
                  icon: Icons.payment_outlined,
                  title: '5. To‘lovlar va Obuna (MathCity Pro)',
                  content:
                      'MathCity Pro tariflari (oylik va yillik obunalar) Click va Payme milliy to‘lov operatorlari hamda Google Play / Apple In-App Purchase orqali rasmiy ravishda amalga oshiriladi.\n\n'
                      '• Xavfsizlik kafolati: MathCity AI foydalanuvchilarning bank kartalari raqamlari, amal qilish muddati, CVV kodlari yoki PIN kodlarini SAQLAMAYDI va KO‘RMAYDI.\n'
                      '• To‘lovlar to‘liq to‘lov operatorlarining himoyalangan rasmiy shlyuzlarida (PCI-DSS xalqaro standartlari asosida) kechadi.\n'
                      '• Biz faqat to‘lov muvaffaqiyati haqidagi tasdiq (tranzaksiya ID, buyurtma ID va sana) ma’lumotlarini obunani faollashtirish uchun qabul qilamiz.',
                ),

                // 6-bo'lim
                _buildSection(
                  context,
                  icon: Icons.child_care_rounded,
                  title: '6. Bolalar Maxfiyligi (Children’s Privacy)',
                  content:
                      'MathCity AI maktab o‘quvchilari uchun mo‘ljallangan ta’lim ilovasi bo‘lganligi sababli, voyaga yetmaganlarning shaxsiy daxlsizligi eng yuqori darajada himoyalanadi:\n\n'
                      '• 13 yoshga to‘lmagan o‘quvchilar ro‘yxatdan o‘tganda tizim ota-ona bilan birgalikda foydalanish haqida ogohlantirish beradi.\n'
                      '• Ilovada boshqa o‘quvchilar bilan xususiy yozishmalar (shaxsiy chatlar) yoki begona shaxslar bilan nazoratsiz aloqa kanallari MAVJUD EMAS.\n'
                      '• Peshqadamlar reytingida faqat foydalanuvchi nomi, o‘rganish natijasi (tanga/XP) va tanlangan avatar ko‘rsatiladi — shaxsiy aloqa vositalari yoki shaxsni tasdiqlovchi ma’lumotlar oshkor etilmaydi.\n'
                      '• Ota-onalar istalgan vaqt farzandining barcha o‘quv ma’lumotlarini ko‘rish, eksport qilish yoki butunlay o‘chirib yuborish huquqiga ega.',
                ),

                // 7-bo'lim
                _buildSection(
                  context,
                  icon: Icons.cookie_outlined,
                  title: '7. Xotira, Cookie va Kuzatuv (Tracking) Texnologiyalari',
                  content:
                      '• Ilovamizda uchinchi tomon kuzatuv trekerlari (masalan, AdMob, Facebook Pixel va h.k.) MAVJUD EMAS.\n'
                      '• Qurilmada faqat xavfsiz mahalliy xotira (FlutterSecureStorage, SharedPreferences, LocalStorage) ishlatiladi.\n'
                      '• Bu xotirada faqat o‘quvchining sessiya kaliti (JWT token), tanlangan mavzu (tungi/kunduzgi rejim) va oflayn rejimdagi o‘quv natijalari saqlanadi.',
                ),

                // 8-bo'lim
                _buildSection(
                  context,
                  icon: Icons.cloud_done_outlined,
                  title: '8. Ma’lumotlarni Saqlash va Xavfsizlik',
                  content:
                      '• Barcha ma’lumotlar xalqaro xavfsizlik standartlariga javob beruvchi Render bulut platformasi (Yevropa hududi) hamda PostgreSQL shifrlangan ma’lumotlar bazasida saqlanadi.\n'
                      '• Foydalanuvchi qurilmasi va server o‘rtasidagi barcha ma’lumotlar almashinuvi 256-bitli SSL/TLS (HTTPS) shifrlash protokollari bilan himoyalangan.\n'
                      '• Tizimda OWASP ASVS standartlariga muvofiq, ruxsatsiz kirishlardan himoya qiluvchi doimiy xavfsizlik filtrlari (rate limiting, CSP, CORS) faoliyat yuritadi.',
                ),

                // 9-bo'lim
                _buildSection(
                  context,
                  icon: Icons.delete_forever_rounded,
                  title: '9. Foydalanuvchi Huquqlari va Hisobni O‘chirish Tartibi',
                  content:
                      'Har bir foydalanuvchi yoki uning ota-onasi quyidagi to‘liq huquqlarga ega:\n\n'
                      '1. Ma’lumotlarni ko‘rish va eksport qilish: Ilovaning "Sozlamalar" bo‘limidan o‘z ma’lumotlarini ko‘rish yoki yuklab olish mumkin.\n'
                      '2. Ma’lumotlarni tuzatish: Ism, parol va boshqa sozlamalarni o‘zgartirish huquqi.\n'
                      '3. Hisobni butunlay o‘chirish (In-App Deletion):\n'
                      '   • Ilova ichida "Profil" yoki "Sozlamalar" bo‘limiga o‘ting.\n'
                      '   • "Hisobni o‘chirish" tugmasini bosing va tasdiqlang.\n'
                      '   • Sizning hisobingiz, darslar progressi, tangalar va barcha AI suhbatlaringiz server bazasidan QAYTA TIKLANMAS qilib butunlay o‘chiriladi.\n'
                      '4. Email orqali o‘chirish so‘rovi: Agar ilovaga kira olmasangiz, ro‘yxatdan o‘tgan emailingizdan support@mathcity.ai manziliga "Hisobni o‘chirish" mavzusida xat yuboring. So‘rov 48 soat ichida to‘liq bajariladi.',
                ),

                // 10-bo'lim
                _buildSection(
                  context,
                  icon: Icons.update_rounded,
                  title: '10. Siyosatdagi O‘zgarishlar',
                  content:
                      'MathCity AI o‘z xizmatlarini takomillashtirish yoki qonunchilik talablariga muvofiqlashtirish maqsadida ushbu Maxfiylik siyosatiga o‘zgartirishlar kiritishi mumkin. Muhim o‘zgarishlar ilova orqali foydalanuvchilarga bildiriladi. Sahifaning yuqori qismidagi "Oxirgi yangilanish" sanasi doimo eng so‘nggi tahrirni aks ettiradi.',
                ),

                // 11-bo'lim (Aloqa)
                _buildSection(
                  context,
                  icon: Icons.contact_support_outlined,
                  title: '11. Aloqa va Murojaatlar',
                  content:
                      'Maxfiylik siyosati, shaxsiy ma’lumotlaringiz xavfsizligi yoki farzandingizning hisobi bo‘yicha savol va takliflaringiz bo‘lsa, biz bilan quyidagi rasmiy kanallar orqali bog‘lanishingiz mumkin:\n\n'
                      '• Ilova nomi: MathCity AI\n'
                      '• Rasmiy veb-manzil: https://mathcity-ai-web.onrender.com (yoki https://mathcity.uz)\n'
                      '• Qo‘llab-quvvatlash xizmati elektron pochtasi: support@mathcity.ai\n'
                      '• Administrator aloqa pochtasi: admin@mathcity.ai\n'
                      '• Hudud: Toshkent shahri, O‘zbekiston',
                ),

                const SizedBox(height: 16),

                // Back Button
                Center(
                  child: TextButton.icon(
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 14,
                      ),
                      backgroundColor: AuthTokens.card(context),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: BorderSide(
                          color: isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
                        ),
                      ),
                    ),
                    onPressed: () {
                      if (context.canPop()) {
                        context.pop();
                      } else {
                        context.go('/welcome');
                      }
                    },
                    icon: Icon(
                      Icons.arrow_back_rounded,
                      color: AuthTokens.brand(context),
                      size: 20,
                    ),
                    label: Text(
                      'Ilovaga qaytish',
                      style: TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AuthTokens.brand(context),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSection(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String content,
  }) {
    final isDark = AuthTokens.isDark(context);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AuthTokens.card(context),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
          width: 1.5,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                icon,
                color: AuthTokens.brand(context),
                size: 22,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AuthTokens.ink(context),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: TextStyle(
              fontFamily: 'Nunito',
              fontSize: 14,
              height: 1.55,
              fontWeight: FontWeight.w500,
              color: AuthTokens.ink(context).withOpacity(0.9),
            ),
          ),
        ],
      ),
    );
  }
}
