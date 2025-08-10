const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createSampleUsers() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const sampleUsers = [
      {
        email: 'client@example.com',
        password: hashedPassword,
        wallet_address: '0x1234567890123456789012345678901234567890',
        role: 'client'
      },
      {
        email: 'freelancer1@example.com',
        password: hashedPassword,
        wallet_address: '0x2345678901234567890123456789012345678901',
        role: 'freelancer'
      },
      {
        email: 'freelancer2@example.com',
        password: hashedPassword,
        wallet_address: '0x3456789012345678901234567890123456789012',
        role: 'freelancer'
      },
      {
        email: 'admin@example.com',
        password: hashedPassword,
        wallet_address: '0x4567890123456789012345678901234567890123',
        role: 'admin'
      }
    ];

    for (const userData of sampleUsers) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      });

      console.log(`Created/Updated user: ${user.email} (${user.role})`);
    }

    console.log('Sample users created successfully!');
  } catch (error) {
    console.error('Error creating sample users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleUsers();
