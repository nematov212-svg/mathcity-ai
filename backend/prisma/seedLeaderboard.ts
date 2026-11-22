import { PrismaClient, Mode, Role, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

const names = [
  'Jasur', 'Madina', 'Temur', 'Shahzoda', 'Bekzod', 'Diyora', 'Azizbek', 'Nigora',
  'Sardor', 'Rayhon', 'Bobur', 'Kamola', 'Javohir', 'Dilnoza', 'Shohruh', 'Mohira',
  'Farrux', 'Malika', "Ulug'bek", 'Laylo', 'Sherzod', 'Gulnoza', 'Rustam', 'Zilola',
  'Mirjalol', 'Sevara', 'Oybek', 'Nafisa', 'Akmal', 'Feruza', 'Jamshid', 'Zarina',
  'Ilhom', 'Dildora', 'Nodir', 'Umida', 'Botir', 'Gulbahor', 'Sanjar', 'Shaxnoza',
  'Doniyor', 'Munisa', 'Otabek', 'Robiya', 'Jahongir', 'Ozoda', 'Eldor', 'Lola',
  'Mansur', 'Fotima', 'Behruz', 'Zuhra', 'Murod', 'Nozima', 'Asadbek', 'Nilufar',
  'Shahboz', 'Yulduz', 'Zafar', "Go'zal", 'Akbar', 'Saodat', 'Anvar', 'Ruxshona',
  'Davron', 'Charos', 'Siroj', 'Dilafruz', 'Shavkat', 'Muslima', 'Alisher', 'Iroda',
  "G'ayrat", 'Komila', 'Samandar', 'Sabina', 'Abbos', 'Gulchehra', 'Humoyun', 'Muhabbat',
  'Islombek', "E'zoza", 'Quvonch', 'Parizoda', 'Tohir', 'Durdona', 'Ravshan', 'Farida',
  'Umidbek', 'Mahliyo', 'Odil', 'Zulfiya', "Ma'ruf", 'Nargiza', 'Muzaffar', 'Mastura',
  'Bahrom', 'Shoira', 'Xurshid', 'Dilrabo', 'Muhriddin', 'Sayyora', 'Qobil', 'Mohinur',
  'Sobir', 'Gulruh', 'Olim', "Ra'no", 'Elbek', 'Barno', 'Shuhrat', 'Dinora',
  'Furqat', 'Oygul', 'Hamza', 'Sarvinoz', 'Sunnat', 'Hilola', 'Shohjahon', 'Muattar'
];

export async function seedLeaderboard() {
  if (process.env.NODE_ENV === 'production') {
    console.log('Skipping leaderboard seed in production.');
    return;
  }

  console.log(`Seeding ${names.length} test users for leaderboard...`);
  const now = Date.now();

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const username = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${10 + (i % 89)}`;
    const email = `${username}@test.mathcity.ai`;
    const coinBalance = Math.max(10, Math.round(480 - i * 3.8));
    const totalXP = Math.max(50, Math.round(coinBalance * 9.5 + (names.length - i) * 15));
    const level = Math.min(15, Math.floor(totalXP / 350) + 1);
    const createdAt = new Date(now - (i + 1) * 6 * 3600 * 1000);

    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          username,
          usernameLower: username.toLowerCase(),
          role: Role.STUDENT,
          isActive: true,
          createdAt,
          studentProfile: {
            create: {
              displayName: name,
              dateOfBirth: new Date('2014-04-12'),
              age: 12,
              mode: Mode.KIDS,
              grade: 5,
              avatarUrl: `assets/images/avatars/avatar_${(i % 12) + 1}.png`,
              cityLevel: Math.min(5, Math.floor(level / 2) + 1),
            },
          },
          coinWallet: {
            create: {
              balance: coinBalance,
            },
          },
          studentXP: {
            create: {
              totalXP,
              level,
            },
          },
          subscription: {
            create: {
              status: SubscriptionStatus.FREE_TRIAL_ACTIVE,
              trialStartedAt: createdAt,
              trialExpiresAt: new Date(now + 25 * 86400 * 1000),
            },
          },
        },
      });
    } catch (e) {
      // Ignored if DB is disconnected in mock tests
    }
  }

  console.log('Leaderboard seeding completed.');
}

if (process.argv[1] && process.argv[1].endsWith('seedLeaderboard.ts')) {
  seedLeaderboard()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
    });
}
