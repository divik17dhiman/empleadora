const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSampleProjects() {
  try {
    // Get a client user
    const client = await prisma.user.findFirst({
      where: { role: 'client' }
    });

    if (!client) {
      console.log('No client user found. Please create a client user first.');
      return;
    }

    // Create sample projects
    const sampleProjects = [
      {
        title: 'E-commerce Website Development',
        description: 'Build a modern e-commerce website with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.',
        budget: '5000000000000000000', // 5 AVAX
        skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        onchain_pid: BigInt('123456789'),
        clientId: client.id,
        milestones: [
          { mid: 0, amount_wei: '2000000000000000000' }, // 2 AVAX
          { mid: 1, amount_wei: '2000000000000000000' }, // 2 AVAX
          { mid: 2, amount_wei: '1000000000000000000' }  // 1 AVAX
        ]
      },
      {
        title: 'Mobile App for Food Delivery',
        description: 'Develop a cross-platform mobile app for food delivery service. Include features like real-time tracking, push notifications, and payment processing.',
        budget: '8000000000000000000', // 8 AVAX
        skills: ['React Native', 'Firebase', 'Google Maps API', 'Stripe'],
        onchain_pid: BigInt('123456790'),
        clientId: client.id,
        milestones: [
          { mid: 0, amount_wei: '3000000000000000000' }, // 3 AVAX
          { mid: 1, amount_wei: '3000000000000000000' }, // 3 AVAX
          { mid: 2, amount_wei: '2000000000000000000' }  // 2 AVAX
        ]
      },
      {
        title: 'UI/UX Design for SaaS Platform',
        description: 'Create comprehensive UI/UX design for a SaaS platform. Include wireframes, mockups, and interactive prototypes.',
        budget: '3000000000000000000', // 3 AVAX
        skills: ['Figma', 'Adobe XD', 'UI/UX Design', 'Prototyping'],
        onchain_pid: BigInt('123456791'),
        clientId: client.id,
        milestones: [
          { mid: 0, amount_wei: '1500000000000000000' }, // 1.5 AVAX
          { mid: 1, amount_wei: '1500000000000000000' }  // 1.5 AVAX
        ]
      },
      {
        title: 'Blockchain Smart Contract Development',
        description: 'Develop smart contracts for a DeFi application on Ethereum. Include token contracts, staking mechanisms, and yield farming features.',
        budget: '6000000000000000000', // 6 AVAX
        skills: ['Solidity', 'Web3.js', 'Ethereum', 'DeFi'],
        onchain_pid: BigInt('123456792'),
        clientId: client.id,
        milestones: [
          { mid: 0, amount_wei: '2500000000000000000' }, // 2.5 AVAX
          { mid: 1, amount_wei: '2500000000000000000' }, // 2.5 AVAX
          { mid: 2, amount_wei: '1000000000000000000' }  // 1 AVAX
        ]
      },
      {
        title: 'Content Marketing Strategy',
        description: 'Develop and execute a comprehensive content marketing strategy for a B2B SaaS company. Include blog posts, whitepapers, and social media content.',
        budget: '2000000000000000000', // 2 AVAX
        skills: ['Content Strategy', 'SEO', 'Social Media', 'Copywriting'],
        onchain_pid: BigInt('123456793'),
        clientId: client.id,
        milestones: [
          { mid: 0, amount_wei: '1000000000000000000' }, // 1 AVAX
          { mid: 1, amount_wei: '1000000000000000000' }  // 1 AVAX
        ]
      }
    ];

    for (const projectData of sampleProjects) {
      const { milestones, ...projectInfo } = projectData;
      
      const project = await prisma.project.create({
        data: {
          ...projectInfo,
          status: 'OPEN',
          milestones: {
            create: milestones
          }
        }
      });

      console.log(`Created project: ${project.title} (ID: ${project.id})`);
    }

    console.log('Sample projects created successfully!');
  } catch (error) {
    console.error('Error creating sample projects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleProjects();
