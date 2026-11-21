import bcrypt from 'bcryptjs';

export interface AdminAccount {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  name: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AdminAuditLogEntry {
  id: string;
  adminId: string;
  adminUsername: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

class AdminStore {
  private admin: AdminAccount;
  private auditLogs: AdminAuditLogEntry[] = [];

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';
    const envEmail = (process.env.ADMIN_EMAIL || 'admin@mathcity.ai').trim().toLowerCase();
    const envUsername = (process.env.ADMIN_USERNAME || (envEmail.includes('@') ? envEmail.split('@')[0] : 'admin')).trim();
    // In production, requires ADMIN_PASSWORD or initial setup.
    // In local dev/testing, default to 'mirzobek' if ADMIN_PASSWORD is not provided.
    const initialPassword = process.env.ADMIN_PASSWORD || 'mirzobek';
    const isDefaultTemp = initialPassword === 'mirzobek';

    this.admin = {
      id: 'admin-01',
      username: envUsername,
      email: envEmail,
      passwordHash: bcrypt.hashSync(initialPassword, 10),
      role: 'SUPER_ADMIN',
      name: process.env.ADMIN_NAME || 'MathCity Bosh Administrator',
      mustChangePassword: isDefaultTemp,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.logAction({
      adminId: 'system',
      adminUsername: 'system',
      action: 'SYSTEM_INIT',
      targetType: 'ADMIN_STORE',
      details: {
        message: 'Administrator xotirasi xavfsiz ishga tushirildi',
        username: this.admin.username,
        email: this.admin.email,
        role: this.admin.role,
      },
    });
  }

  getAdmin(): AdminAccount {
    return this.admin;
  }

  verifyCredentials(identifier: string, password: string): { success: boolean; admin?: AdminAccount; error?: string } {
    const isProduction = process.env.NODE_ENV === 'production';
    const cleanId = (identifier || '').trim().toLowerCase();

    const isUsernameMatch = cleanId === this.admin.username.toLowerCase();
    const isEmailMatch = this.admin.email ? cleanId === this.admin.email.toLowerCase() : false;
    const isLegacyDevMatch = !isProduction && (cleanId === 'mirzobek' || cleanId === 'admin');

    if (!isUsernameMatch && !isEmailMatch && !isLegacyDevMatch) {
      return { success: false, error: 'Administrator login yoki emailingiz noto‘g‘ri.' };
    }

    // In production, prevent login with the temporary default password 'mirzobek'
    if (isProduction && password === 'mirzobek' && this.admin.mustChangePassword) {
      return {
        success: false,
        error: 'Production muhitida vaqtinchalik "mirzobek" parolidan foydalanish taqiqlangan. Kuchli ADMIN_PASSWORD o‘rnating.',
      };
    }

    // In local development, accept 'mirzobek' or valid bcrypt hash
    const isValid = (!isProduction && password === 'mirzobek') || bcrypt.compareSync(password, this.admin.passwordHash);
    if (!isValid) {
      this.logAction({
        adminId: this.admin.id,
        adminUsername: identifier,
        action: 'FAILED_LOGIN_ATTEMPT',
        targetType: 'AUTH',
        details: { reason: 'Noto‘g‘ri parol kiritildi' },
      });
      return { success: false, error: 'Kiritilgan parol noto‘g‘ri.' };
    }

    this.admin.lastLoginAt = new Date().toISOString();
    this.logAction({
      adminId: this.admin.id,
      adminUsername: this.admin.username,
      action: 'ADMIN_LOGIN_SUCCESS',
      targetType: 'AUTH',
      details: { timestamp: this.admin.lastLoginAt },
    });

    return { success: true, admin: this.admin };
  }

  changePassword(oldPassword: string, newPassword: string): { success: boolean; error?: string } {
    const isProduction = process.env.NODE_ENV === 'production';
    const isValid = bcrypt.compareSync(oldPassword, this.admin.passwordHash) || (!isProduction && oldPassword === 'mirzobek');
    if (!isValid) {
      return { success: false, error: 'Eski parol noto‘g‘ri kiritildi.' };
    }

    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'Yangi parol kamida 8 ta belgidan iborat bo‘lishi shart.' };
    }

    if (newPassword === 'mirzobek') {
      return { success: false, error: 'Yangi parol vaqtinchalik "mirzobek" paroli bo‘lishi mumkin emas.' };
    }

    this.admin.passwordHash = bcrypt.hashSync(newPassword, 10);
    this.admin.mustChangePassword = false;
    this.admin.updatedAt = new Date().toISOString();

    this.logAction({
      adminId: this.admin.id,
      adminUsername: this.admin.username,
      action: 'PASSWORD_CHANGED',
      targetType: 'SECURITY',
      details: { message: 'Administrator paroli muvaffaqiyatli almashtirildi' },
    });

    return { success: true };
  }

  logAction(entry: Omit<AdminAuditLogEntry, 'id' | 'createdAt'>): void {
    const log: AdminAuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...entry,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    // Keep last 500 audit entries
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }

  getAuditLogs(): AdminAuditLogEntry[] {
    return this.auditLogs;
  }
}

export const adminStore = new AdminStore();
