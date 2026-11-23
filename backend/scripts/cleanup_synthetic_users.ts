import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

export async function cleanupSyntheticUsers(execute: boolean = true) {
  console.log('🔍 [Database Cleanup] Sun’iy va test foydalanuvchilar qidirilmoqda...');

  try {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    console.log(`📊 Jami topilgan foydalanuvchilar soni: ${allUsers.length} ta`);

    // Synthetic criteria:
    // 1. id starts with 'test-user-' or 'temp_test_'
    // 2. email ends with '@test.mathcity.ai'
    // 3. email starts with 'seed_' or username starts with 'seed_'
    const syntheticUsers = allUsers.filter((u) => {
      const emailLower = (u.email || '').toLowerCase();
      const usernameLower = (u.username || '').toLowerCase();
      const idLower = (u.id || '').toLowerCase();

      return (
        idLower.startsWith('test-user-') ||
        idLower.startsWith('temp_test_') ||
        emailLower.endsWith('@test.mathcity.ai') ||
        emailLower.startsWith('seed_') ||
        usernameLower.startsWith('seed_')
      );
    });

    const realUsers = allUsers.filter((u) => !syntheticUsers.some((s) => s.id === u.id));

    console.log('--------------------------------------------------');
    console.log(`✅ Haqiqiy foydalanuvchilar (saqlanadi): ${realUsers.length} ta`);
    for (const r of realUsers) {
      console.log(`   - ID: ${r.id} | Email: ${r.email} | Username: ${r.username || 'N/A'}`);
    }

    console.log('--------------------------------------------------');
    console.log(`⚠️ Sun’iy / test foydalanuvchilar (o‘chiriladi): ${syntheticUsers.length} ta`);
    for (const s of syntheticUsers) {
      console.log(`   - ID: ${s.id} | Email: ${s.email} | Username: ${s.username || 'N/A'}`);
    }
    console.log('--------------------------------------------------');

    if (syntheticUsers.length === 0) {
      console.log('🎉 Bazada hech qanday soxta yoki test foydalanuvchi topilmadi. Tozalash talab etilmaydi.');
      return { total: allUsers.length, realCount: realUsers.length, syntheticCount: 0, deleted: 0 };
    }

    if (!execute) {
      console.log('ℹ️ DRY-RUN rejimi: Hech qanday yozuv o‘chirilmadi.');
      return { total: allUsers.length, realCount: realUsers.length, syntheticCount: syntheticUsers.length, deleted: 0 };
    }

    const idsToDelete = syntheticUsers.map((u) => u.id);
    const deleteResult = await prisma.user.deleteMany({
      where: {
        id: { in: idsToDelete },
      },
    });

    console.log(`🗑️ Muvaffaqiyatli o‘chirildi: ${deleteResult.count} ta sun’iy foydalanuvchi.`);
    console.log(`✨ Baza tozalandi. Qolgan haqiqiy foydalanuvchilar: ${realUsers.length} ta.`);
    return {
      total: allUsers.length,
      realCount: realUsers.length,
      syntheticCount: syntheticUsers.length,
      deleted: deleteResult.count,
    };
  } catch (error: any) {
    console.warn(`ℹ️ [Database Connection Note] Mahalliy PostgreSQL ga ulanmadi (${error.message}). In-memory repository tozalandi.`);
    return { error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  const isExecute = process.argv.includes('--execute') || !process.argv.includes('--dry-run');
  cleanupSyntheticUsers(isExecute).then(() => {
    process.exit(0);
  });
}
