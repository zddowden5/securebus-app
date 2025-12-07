import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user (john@doe.com)
  const adminPassword = await bcrypt.hash('johndoe123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: adminPassword,
      name: 'John Doe',
      companyName: 'Doe Security Solutions',
      role: 'admin',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create test business user
  const testPassword = await bcrypt.hash('SecurePass123!', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@business.com' },
    update: {},
    create: {
      email: 'test@business.com',
      password: testPassword,
      name: 'Test Business Owner',
      companyName: 'Test Security Co',
      role: 'user',
    },
  });
  console.log('✅ Created test user:', testUser.email);

  // Create sample devices for admin
  const devices = [
    {
      name: 'Office Desktop PC',
      type: 'Desktop',
      os: 'Windows 11 Pro',
      ipAddress: '192.168.1.101',
      macAddress: '00:1B:44:11:3A:B7',
      location: 'Main Office',
      status: 'active',
      userId: admin.id,
      lastScan: new Date('2024-12-03'),
    },
    {
      name: 'CEO Laptop',
      type: 'Laptop',
      os: 'macOS Sonoma',
      ipAddress: '192.168.1.102',
      macAddress: '00:1B:44:11:3A:B8',
      location: 'Executive Suite',
      status: 'active',
      userId: admin.id,
      lastScan: new Date('2024-12-04'),
    },
    {
      name: 'Conference Room Mac',
      type: 'Desktop',
      os: 'macOS Ventura',
      ipAddress: '192.168.1.103',
      macAddress: '00:1B:44:11:3A:B9',
      location: 'Conference Room A',
      status: 'warning',
      userId: admin.id,
      lastScan: new Date('2024-11-28'),
      notes: 'Security update pending',
    },
    {
      name: 'Server - Main',
      type: 'Server',
      os: 'Ubuntu Server 22.04',
      ipAddress: '192.168.1.10',
      macAddress: '00:1B:44:11:3A:C0',
      location: 'Server Room',
      status: 'active',
      userId: admin.id,
      lastScan: new Date('2024-12-04'),
    },
    {
      name: 'Marketing Team Laptop',
      type: 'Laptop',
      os: 'Windows 10 Pro',
      ipAddress: '192.168.1.104',
      macAddress: '00:1B:44:11:3A:C1',
      location: 'Marketing Department',
      status: 'inactive',
      userId: admin.id,
      lastScan: new Date('2024-11-15'),
      notes: 'Out for repair',
    },
  ];

  for (const device of devices) {
    await prisma.device.upsert({
      where: { id: device.name },
      update: {},
      create: device,
    });
  }
  console.log('✅ Created sample devices');

  // Create phishing reports (last 12 months)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const phishingReports = [];
  
  for (let i = 0; i < 12; i++) {
    const monthIndex = (new Date().getMonth() - 11 + i + 12) % 12;
    const year = new Date().getFullYear() - (i > new Date().getMonth() ? 1 : 0);
    const emailsSent = Math.floor(Math.random() * 50) + 50;
    const emailsOpened = Math.floor(emailsSent * (Math.random() * 0.4 + 0.3));
    const linksClicked = Math.floor(emailsOpened * (Math.random() * 0.3 + 0.1));
    const credentialsEntered = Math.floor(linksClicked * (Math.random() * 0.2 + 0.05));
    const reported = Math.floor(emailsOpened * (Math.random() * 0.15 + 0.05));
    const successRate = ((emailsOpened / emailsSent) * 100);

    phishingReports.push({
      month: months[monthIndex],
      year,
      emailsSent,
      emailsOpened,
      linksClicked,
      credentialsEntered,
      reported,
      successRate: parseFloat(successRate.toFixed(2)),
    });
  }

  for (const report of phishingReports) {
    await prisma.phishingReport.create({ data: report });
  }
  console.log('✅ Created phishing reports');

  // Create security partners
  const securityPartners = [
    {
      name: 'CrowdStrike Falcon',
      category: 'Endpoint Protection',
      description: 'Cloud-native endpoint protection platform with AI-powered threat detection and response.',
      website: 'https://www.crowdstrike.com',
      features: ['Real-time threat detection', 'Automated response', 'Cloud-native architecture', '24/7 threat hunting'],
      pricing: 'Starting at $8.99/endpoint/month',
      rating: 4.8,
    },
    {
      name: 'KnowBe4',
      category: 'Security Awareness Training',
      description: 'World\'s largest security awareness training and simulated phishing platform.',
      website: 'https://www.knowbe4.com',
      features: ['Phishing simulations', 'Security awareness training', 'Compliance training', 'Reporting & analytics'],
      pricing: 'Contact for pricing',
      rating: 4.7,
    },
    {
      name: 'Cisco Umbrella',
      category: 'DNS Security',
      description: 'Cloud-delivered security service that blocks threats before they reach your network.',
      website: 'https://umbrella.cisco.com',
      features: ['DNS-layer security', 'Cloud access security', 'Threat intelligence', 'Secure web gateway'],
      pricing: 'Starting at $3/user/month',
      rating: 4.6,
    },
    {
      name: 'Duo Security',
      category: 'Multi-Factor Authentication',
      description: 'Easy-to-use two-factor authentication that protects against data breaches.',
      website: 'https://duo.com',
      features: ['Two-factor authentication', 'Single sign-on', 'Device trust', 'Access policies'],
      pricing: 'Starting at $3/user/month',
      rating: 4.5,
    },
    {
      name: 'Proofpoint',
      category: 'Email Security',
      description: 'Advanced email security and compliance platform to protect against phishing and malware.',
      website: 'https://www.proofpoint.com',
      features: ['Email threat protection', 'Email encryption', 'Data loss prevention', 'Archive & compliance'],
      pricing: 'Contact for pricing',
      rating: 4.4,
    },
    {
      name: 'Splunk',
      category: 'SIEM',
      description: 'Security information and event management platform for real-time security monitoring.',
      website: 'https://www.splunk.com',
      features: ['Real-time monitoring', 'Threat detection', 'Incident response', 'Compliance reporting'],
      pricing: 'Starting at $150/month',
      rating: 4.5,
    },
    {
      name: 'LastPass Business',
      category: 'Password Management',
      description: 'Enterprise password management solution with secure password sharing.',
      website: 'https://www.lastpass.com/business',
      features: ['Password vault', 'Secure sharing', 'Multi-factor authentication', 'Admin dashboard'],
      pricing: 'Starting at $7/user/month',
      rating: 4.3,
    },
    {
      name: 'Tenable Nessus',
      category: 'Vulnerability Management',
      description: 'Industry\'s most comprehensive vulnerability scanner with high accuracy.',
      website: 'https://www.tenable.com/products/nessus',
      features: ['Vulnerability scanning', 'Configuration auditing', 'Malware detection', 'Compliance checks'],
      pricing: 'Starting at $3,990/year',
      rating: 4.6,
    },
  ];

  for (const partner of securityPartners) {
    await prisma.securityPartner.create({ data: partner });
  }
  console.log('✅ Created security partners');

  // Create sample response plans
  const responsePlans = [
    {
      userId: admin.id,
      title: 'Data Breach Response',
      incidentType: 'Data Breach',
      priority: 'critical',
      steps: [
        'Immediately isolate affected systems',
        'Notify security team and management',
        'Document all evidence and timeline',
        'Assess scope and impact of breach',
        'Notify affected parties as required by law',
        'Implement containment measures',
        'Begin recovery procedures',
        'Conduct post-incident review',
      ],
      contacts: ['Security Officer: +1-555-0101', 'Legal Team: legal@company.com', 'IT Manager: +1-555-0102'],
    },
    {
      userId: admin.id,
      title: 'Ransomware Attack Response',
      incidentType: 'Ransomware',
      priority: 'critical',
      steps: [
        'Disconnect infected systems from network',
        'Do NOT pay ransom - contact authorities',
        'Activate backup and recovery procedures',
        'Document ransom note and attack details',
        'Report to FBI IC3 and local law enforcement',
        'Notify insurance provider',
        'Begin system restoration from clean backups',
        'Review and update security measures',
      ],
      contacts: ['FBI IC3: ic3.gov', 'Cyber Insurance: +1-555-0103', 'Backup Admin: +1-555-0104'],
    },
    {
      userId: admin.id,
      title: 'Phishing Incident Response',
      incidentType: 'Phishing',
      priority: 'high',
      steps: [
        'Identify and quarantine phishing email',
        'Reset credentials if compromised',
        'Scan affected systems for malware',
        'Block sender and related domains',
        'Notify all employees about the threat',
        'Review email security settings',
        'Provide additional security training',
        'Monitor for suspicious activity',
      ],
      contacts: ['IT Support: support@company.com', 'Security Team: security@company.com'],
    },
  ];

  for (const plan of responsePlans) {
    await prisma.responsePlan.create({ data: plan });
  }
  console.log('✅ Created response plans');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
