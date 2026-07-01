export const ENTERPRISE_PRICING = {
  vCPU: { min: 1, max: 64, step: 1, price: 200 },
  RAM: { min: 1, max: 512, step: 1, price: 85 },
  SSD: { min: 50, max: 10240, step: 50, baseIncrement: 50, price: 100 },
  Bandwidth: [
    { label: '1 TB', value: '1TB', price: 500 },
    { label: '5 TB', value: '5TB', price: 1500 },
    { label: '10 TB', value: '10TB', price: 2500 },
    { label: 'Unlimited', value: 'Unlimited', price: 5000 }
  ],
  OS: [
    { label: 'Ubuntu 20', value: 'Ubuntu 20', price: 0 },
    { label: 'Ubuntu 22', value: 'Ubuntu 22', price: 0 },
    { label: 'Ubuntu 24', value: 'Ubuntu 24', price: 0 },
    { label: 'Ubuntu 26', value: 'Ubuntu 26', price: 0 },
    { label: 'Windows 2016 64 bit', value: 'Windows 2016 64 bit', price: 1500 },
    { label: 'Windows 2019 64 bit', value: 'Windows 2019 64 bit', price: 1500 },
    { label: 'Windows 2022 64 bit', value: 'Windows 2022 64 bit', price: 1500 },
    { label: 'Windows 2025 64 bit', value: 'Windows 2025 64 bit', price: 1500 },
    { label: 'Alma 8 64 bit', value: 'Alma 8 64 bit', price: 0 },
    { label: 'Alma 9 64 bit', value: 'Alma 9 64 bit', price: 0 },
    { label: 'Rocky 8 64 bit', value: 'Rocky 8 64 bit', price: 0 },
    { label: 'Rocky 9 64 bit', value: 'Rocky 9 64 bit', price: 0 },
    { label: 'Rocky 10 64 bit', value: 'Rocky 10 64 bit', price: 0 },
    { label: 'Debian 10 64 bit', value: 'Debian 10 64 bit', price: 0 },
    { label: 'Debian 11 64 bit', value: 'Debian 11 64 bit', price: 0 }
  ],
  Backup: {
    price: 500 // Daily backup price
  }
};

export const ENTERPRISE_OFFERS = [
  {
    name: 'Enterprise Offer',
    discount: 20, // 20%
    min_vcpu: 16,
    min_ram: 32
  },
  {
    name: 'Business Offer',
    discount: 15,
    min_vcpu: 8,
    min_ram: 16
  },
  {
    name: 'Startup Offer',
    discount: 10,
    min_vcpu: 4,
    min_ram: 8
  }
];

