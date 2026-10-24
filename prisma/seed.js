const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Hiwood database...');

  // 1. Store Settings
  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeName: 'Hiwood',
      tagline: 'Carry Your World',
      contactEmail: 'support@hiwood.pk',
      contactPhone: '+92 300 1234567',
      address: 'Plot 42, Sector 15, Korangi Industrial Area, Karachi, Pakistan',
      currency: 'Rs.',
      standardShippingFee: 250,
      freeShippingThreshold: 3000,
      codEnabled: true,
      bankTransferEnabled: true,
      bankDetails: 'Bank: Meezan Bank Ltd\nAccount Title: Hiwood Bags Private Limited\nAccount Number: 01020304050607\nIBAN: PK65MEZN0001020304050607\nBranch: Korangi Branch, Karachi',
      heroHeading: 'Carry Your World',
      heroSubheading: 'Premium quality backpacks designed for your everyday adventures. Style, comfort and durability — all in one.',
      heroButtonText: 'Shop Now',
      heroImageUrl: '/images/hero-backpack.png',
      promoHeading: 'Bags for Every Journey',
      promoSubheading: 'Travel • Study • Work • Adventure',
      promoButtonText: 'Shop Collection',
      promoImageUrl: '/images/banner-lifestyle.png',
      announcementText: '⚡ Special Offer: Free Nationwide Delivery on Orders over Rs. 3,000 | Use Code HIWOOD10 for 10% Off!',
      announcementActive: true,
    },
  });

  // 2. Admin User
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hiwood.pk' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@hiwood.pk',
      passwordHash: adminPasswordHash,
      phone: '+92 300 1234567',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  // Customer Users
  const customerPasswordHash = await bcrypt.hash('Customer123!', 10);
  const customersData = [
    { name: 'Ayesha Khan', email: 'ayesha@gmail.com', phone: '+92 321 4567890', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { name: 'Hassan Ali', email: 'hassan@gmail.com', phone: '+92 333 5678901', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { name: 'Sara Malik', email: 'sara@gmail.com', phone: '+92 345 6789012', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
    { name: 'Usman Raza', email: 'usman@gmail.com', phone: '+92 301 7890123', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { name: 'Fatima Noor', email: 'fatima@gmail.com', phone: '+92 312 8901234', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  ];

  const createdCustomers = [];
  for (const c of customersData) {
    const cust = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        passwordHash: customerPasswordHash,
        phone: c.phone,
        role: 'CUSTOMER',
        avatar: c.avatar,
      },
    });
    createdCustomers.push(cust);
  }

  // 3. Categories
  const categoriesData = [
    { name: 'Backpacks', slug: 'backpacks', description: 'Everyday, university, and commute backpacks' },
    { name: 'Travel Bags', slug: 'travel-bags', description: 'Large capacity, clamshell and flight-ready carry-ons' },
    { name: 'Laptop Bags', slug: 'laptop-bags', description: 'Padded tech sleeves and structured briefpacks' },
    { name: 'Daypacks', slug: 'daypacks', description: 'Ultralight compact bags for short day outs' },
    { name: 'Duffel Bags', slug: 'duffel-bags', description: 'Spacious gym, weekend getaway and sports gear duffels' },
    { name: 'Crossbody Bags', slug: 'crossbody-bags', description: 'Hands-free compact slings, chest packs & waist bags' },
    { name: 'Accessories', slug: 'accessories', description: 'Pouches, organizers, and water bottle carriers' },
  ];

  const createdCategories = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: Object.keys(createdCategories).length,
      },
    });
    createdCategories[cat.slug] = c;
  }

  // 4. Collections (matching Reference Image directly!)
  const collectionsData = [
    {
      name: 'Classic Series',
      slug: 'classic-series',
      subtitle: 'Simple • Stylish • Daily Use',
      description: 'Timeless silhouette designed for effortless elegance and everyday endurance.',
      startingPrice: 2499,
      bgTheme: '#FDF6EE', // warm cream/peach tint
      image: '/images/products/classic-cream.png',
      displayOrder: 1,
    },
    {
      name: 'Urban Series',
      slug: 'urban-series',
      subtitle: 'Modern • Spacious • Travel',
      description: 'Streamlined aesthetic built with tech compartments for urban explorers and commuters.',
      startingPrice: 3299,
      bgTheme: '#F3F0FA', // soft lavender tint
      image: '/images/products/urban-black.png',
      displayOrder: 2,
    },
    {
      name: 'Adventure Series',
      slug: 'adventure-series',
      subtitle: 'Rugged • Durable • Outdoor',
      description: 'Heavy-duty weather-sealed pack designed to conquer hiking trails and rugged trips.',
      startingPrice: 3799,
      bgTheme: '#EFF7F2', // soft sage green tint
      image: '/images/products/adventure-olive.png',
      displayOrder: 3,
    },
    {
      name: 'Casual Series',
      slug: 'casual-series',
      subtitle: 'Trendy • Lightweight • Daily',
      description: 'Playful, lightweight colorways tailored for students, cafes, and city strolls.',
      startingPrice: 2199,
      bgTheme: '#FDF2F4', // soft pastel pink tint
      image: '/images/products/casual-pink.png',
      displayOrder: 4,
    },
  ];

  const createdCollections = {};
  for (const col of collectionsData) {
    const c = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: col,
    });
    createdCollections[col.slug] = c;
  }

  // 5. Products
  const productsData = [
    {
      name: 'Classic Series Backpack',
      slug: 'classic-series-backpack',
      sku: 'HW-CLS-01',
      shortDescription: 'Signature Hiwood cream aesthetic backpack with rugged black accents and signature orange pullers.',
      description: 'Crafted from heavy-duty 900D water-repellent oxford canvas, the Classic Series is the ultimate companion for your everyday university, work, and city commute. Features a dedicated 15.6-inch padded laptop sleeve, ergonomic air-mesh shoulder straps, dual water bottle holders, and quick-access top stash pocket.',
      price: 2799,
      salePrice: 2499,
      stock: 35,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 38,
      categoryId: createdCategories['backpacks'].id,
      collectionId: createdCollections['classic-series'].id,
      specs: JSON.stringify({
        'Material': '900D Water-Repellent Oxford Canvas',
        'Capacity': '22 Liters',
        'Laptop Sleeve': 'Dedicated padded pocket up to 15.6"',
        'Dimensions': '45 x 30 x 15 cm',
        'Weight': '650 grams',
        'Zippers': 'Heavy-duty smooth glide nylon zippers',
        'Warranty': '1 Year Hiwood Limited Warranty',
      }),
      images: [
        { url: '/images/products/classic-cream.png', isPrimary: true, displayOrder: 0, alt: 'Classic Cream Backpack Front View' },
        { url: '/images/hero-backpack.png', isPrimary: false, displayOrder: 1, alt: 'Classic Backpack Detailed Angle' },
      ],
      variants: [
        { colorName: 'Cream & Orange', colorHex: '#F6F0E6', size: 'Standard (22L)', stock: 20 },
        { colorName: 'Matte Black', colorHex: '#1C1C1C', size: 'Standard (22L)', stock: 15 },
      ]
    },
    {
      name: 'Urban Series Backpack',
      slug: 'urban-series-backpack',
      sku: 'HW-URB-02',
      shortDescription: 'Modern, spacious, and commuter-engineered backpack with concealed anti-theft zipper pockets.',
      description: 'The Urban Series brings understated luxury to the professional commuter. Built with ballistic nylon and water-resistant zippers, it includes dedicated sleeves for a 16" MacBook Pro, tablet, and power bank with integrated cable pass-through port.',
      price: 3599,
      salePrice: 3299,
      stock: 42,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 42,
      categoryId: createdCategories['backpacks'].id,
      collectionId: createdCollections['urban-series'].id,
      specs: JSON.stringify({
        'Material': '1680D Ballistic Tech Nylon',
        'Capacity': '26 Liters',
        'Laptop Sleeve': 'Fits up to 16" Laptop',
        'Dimensions': '47 x 32 x 17 cm',
        'Weight': '780 grams',
        'Security': 'Hidden anti-theft back lumbar pocket',
        'Warranty': '1 Year Hiwood Limited Warranty',
      }),
      images: [
        { url: '/images/products/urban-black.png', isPrimary: true, displayOrder: 0, alt: 'Urban Black Backpack Front' },
      ],
      variants: [
        { colorName: 'Obsidian Black', colorHex: '#181818', size: 'Standard (26L)', stock: 30 },
        { colorName: 'Charcoal Grey', colorHex: '#3D3D3D', size: 'Standard (26L)', stock: 12 },
      ]
    },
    {
      name: 'Adventure Rugged Backpack',
      slug: 'adventure-rugged-backpack',
      sku: 'HW-ADV-03',
      shortDescription: 'Military-grade reinforced outdoor pack with compression straps and breathable suspension backpanel.',
      description: 'Engineered for the outdoors and rough terrains across Pakistan. From Margalla trail hikes to Hunza road trips, this pack features high-tensile ripstop fabric, waterproof rain-guard flap, daisy-chain attachment loops, and reinforced load-bearing chest harness.',
      price: 4199,
      salePrice: 3799,
      stock: 19,
      isFeatured: true,
      isBestSeller: false,
      rating: 5.0,
      reviewCount: 29,
      categoryId: createdCategories['backpacks'].id,
      collectionId: createdCollections['adventure-series'].id,
      specs: JSON.stringify({
        'Material': 'Diamond Ripstop 1000D Cordura',
        'Capacity': '32 Liters',
        'Laptop Sleeve': 'Fits up to 15.6"',
        'Dimensions': '50 x 33 x 20 cm',
        'Weight': '920 grams',
        'Special Feature': 'Built-in Rain Cover & Chest Buckle Whistle',
        'Warranty': '2 Year Rugged Warranty',
      }),
      images: [
        { url: '/images/products/adventure-olive.png', isPrimary: true, displayOrder: 0, alt: 'Adventure Olive Backpack' },
      ],
      variants: [
        { colorName: 'Army Olive', colorHex: '#4A5B47', size: 'Pro (32L)', stock: 12 },
        { colorName: 'Coyote Tan', colorHex: '#A38B6B', size: 'Pro (32L)', stock: 7 },
      ]
    },
    {
      name: 'Casual Series Daypack',
      slug: 'casual-series-daypack',
      sku: 'HW-CAS-04',
      shortDescription: 'Trendy, ultra-lightweight, pastel colorway backpack for daily casual outings and study sessions.',
      description: 'Effortlessly light and delightfully modern. Crafted with soft-touch water-resistant micro-twill, this casual pack has roomy main storage, pastel hardware accents, and cushioned shoulder padding designed for all-day comfort without bulk.',
      price: 2499,
      salePrice: 2199,
      stock: 28,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 51,
      categoryId: createdCategories['daypacks'].id,
      collectionId: createdCollections['casual-series'].id,
      specs: JSON.stringify({
        'Material': 'Soft-touch Water-Resistant Micro-Twill',
        'Capacity': '18 Liters',
        'Laptop Sleeve': 'Fits up to 14" Laptop or iPad Pro',
        'Dimensions': '42 x 28 x 14 cm',
        'Weight': '480 grams',
        'Warranty': '1 Year Hiwood Limited Warranty',
      }),
      images: [
        { url: '/images/products/casual-pink.png', isPrimary: true, displayOrder: 0, alt: 'Casual Pink Backpack' },
      ],
      variants: [
        { colorName: 'Blush Pink', colorHex: '#F0A3B5', size: 'Regular (18L)', stock: 16 },
        { colorName: 'Sky Blue', colorHex: '#9BBED5', size: 'Regular (18L)', stock: 12 },
      ]
    },
    {
      name: 'Voyager 35L Carry-On Travel Pack',
      slug: 'voyager-35l-travel-pack',
      sku: 'HW-VOY-05',
      shortDescription: 'Flight-approved maximum carry-on pack with 180-degree clamshell opening and compression straps.',
      description: 'Say goodbye to checked baggage. The Voyager opens flat like a suitcase, features internal zippered mesh organizers, a separate shoe compartment, and hideaway shoulder straps for clean overhead bin storage.',
      price: 5499,
      salePrice: 4899,
      stock: 14,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 22,
      categoryId: createdCategories['travel-bags'].id,
      collectionId: createdCollections['urban-series'].id,
      specs: JSON.stringify({
        'Material': 'Waterproof PU Coated Polyester',
        'Capacity': '35 Liters',
        'Laptop Sleeve': 'Padded TSA 17" sleeve',
        'Dimensions': '54 x 35 x 22 cm',
        'Weight': '1.1 kg',
        'Special Feature': 'Suitcase Clamshell + Shoe Tunnel',
      }),
      images: [
        { url: '/images/products/urban-black.png', isPrimary: true, displayOrder: 0, alt: 'Voyager Travel Pack' },
      ],
      variants: [
        { colorName: 'Carbon Black', colorHex: '#181818', size: '35L Max', stock: 14 },
      ]
    },
    {
      name: 'Metro Tech Briefpack',
      slug: 'metro-tech-briefpack',
      sku: 'HW-MET-06',
      shortDescription: 'Slim executive briefcase-backpack hybrid for corporate meetings and tech gear.',
      description: 'The sharpest way to carry your MacBook and business essentials. Converts effortlessly between a minimalist backpack and a horizontal briefcase with tuck-away straps and leather-wrapped grip handle.',
      price: 3899,
      salePrice: 3499,
      stock: 22,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.7,
      reviewCount: 16,
      categoryId: createdCategories['laptop-bags'].id,
      collectionId: createdCollections['classic-series'].id,
      specs: JSON.stringify({
        'Material': 'Structured Oxford Canvas & Vegan Leather Trims',
        'Capacity': '16 Liters',
        'Laptop Sleeve': 'Fits up to 15.6"',
        'Dimensions': '43 x 30 x 10 cm',
        'Weight': '720 grams',
      }),
      images: [
        { url: '/images/products/classic-cream.png', isPrimary: true, displayOrder: 0, alt: 'Metro Tech Briefpack' },
      ],
      variants: [
        { colorName: 'Steel Grey', colorHex: '#4A4A4A', size: 'Slim 16L', stock: 22 },
      ]
    }
  ];

  const createdProducts = [];
  for (const p of productsData) {
    const { images, variants, ...prodData } = p;
    const existing = await prisma.product.findUnique({ where: { slug: prodData.slug } });
    if (!existing) {
      const prod = await prisma.product.create({
        data: {
          ...prodData,
          images: {
            create: images,
          },
          variants: {
            create: variants,
          },
        },
      });
      createdProducts.push(prod);
    } else {
      createdProducts.push(existing);
    }
  }

  // 6. Coupons
  const coupons = [
    { code: 'HIWOOD10', discountType: 'PERCENT', discountValue: 10, minOrderAmount: 0, usageLimit: 500, isActive: true },
    { code: 'WELCOME500', discountType: 'FIXED', discountValue: 500, minOrderAmount: 3500, usageLimit: 200, isActive: true },
    { code: 'FREESHIP', discountType: 'FIXED', discountValue: 250, minOrderAmount: 2000, usageLimit: 100, isActive: true },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  // 7. Orders (matching Reference Admin Dashboard)
  const ordersSeed = [
    {
      orderNumber: 'HW-2026-1024',
      customerName: 'Ayesha Khan',
      customerEmail: 'ayesha@gmail.com',
      customerPhone: '+92 321 4567890',
      deliveryAddress: 'House 14B, Street 3, DHA Phase 5',
      city: 'Karachi',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PROCESSING',
      subtotal: 3299,
      discountAmount: 0,
      shippingFee: 0,
      totalAmount: 3299,
      courierName: 'TCS Express',
      trackingNumber: 'TCS-982310',
      productName: 'Urban Series Backpack',
      price: 3299,
    },
    {
      orderNumber: 'HW-2026-1023',
      customerName: 'Hassan Ali',
      customerEmail: 'hassan@gmail.com',
      customerPhone: '+92 333 5678901',
      deliveryAddress: 'Flat 402, Al-Razi Heights, Gulberg III',
      city: 'Lahore',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'PAID',
      orderStatus: 'SHIPPED',
      subtotal: 2499,
      discountAmount: 0,
      shippingFee: 0,
      totalAmount: 2499,
      courierName: 'Leopards Courier',
      trackingNumber: 'LEO-448291',
      productName: 'Classic Series Backpack',
      price: 2499,
    },
    {
      orderNumber: 'HW-2026-1022',
      customerName: 'Sara Malik',
      customerEmail: 'sara@gmail.com',
      customerPhone: '+92 345 6789012',
      deliveryAddress: 'House 89, Sector F-7/2',
      city: 'Islamabad',
      paymentMethod: 'COD',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      subtotal: 3799,
      discountAmount: 0,
      shippingFee: 400,
      totalAmount: 4199,
      courierName: 'Trax Logistics',
      trackingNumber: 'TRX-102948',
      productName: 'Adventure Rugged Backpack',
      price: 3799,
    },
    {
      orderNumber: 'HW-2026-1021',
      customerName: 'Usman Raza',
      customerEmail: 'usman@gmail.com',
      customerPhone: '+92 301 7890123',
      deliveryAddress: 'Street 4, Madina Colony, Samanabad',
      city: 'Faisalabad',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      subtotal: 1899,
      discountAmount: 0,
      shippingFee: 0,
      totalAmount: 1899,
      productName: 'Casual Series Daypack',
      price: 1899,
    },
    {
      orderNumber: 'HW-2026-1020',
      customerName: 'Fatima Noor',
      customerEmail: 'fatima@gmail.com',
      customerPhone: '+92 312 8901234',
      deliveryAddress: 'House 12, Cavalry Ground',
      city: 'Lahore',
      paymentMethod: 'ONLINE',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      subtotal: 3799,
      discountAmount: 0,
      shippingFee: 0,
      totalAmount: 3799,
      courierName: 'TCS Express',
      trackingNumber: 'TCS-881920',
      productName: 'Adventure Rugged Backpack',
      price: 3799,
    },
  ];

  for (const o of ordersSeed) {
    const existing = await prisma.order.findUnique({ where: { orderNumber: o.orderNumber } });
    if (!existing) {
      await prisma.order.create({
        data: {
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          deliveryAddress: o.deliveryAddress,
          city: o.city,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          subtotal: o.subtotal,
          discountAmount: o.discountAmount,
          shippingFee: o.shippingFee,
          totalAmount: o.totalAmount,
          courierName: o.courierName,
          trackingNumber: o.trackingNumber,
          items: {
            create: [
              {
                productName: o.productName,
                price: o.price,
                quantity: 1,
                total: o.price,
                image: '/images/products/classic-cream.png',
              },
            ],
          },
        },
      });
    }
  }

  // 8. Reviews
  if (createdProducts.length > 0) {
    const reviewsSeed = [
      {
        productId: createdProducts[0].id,
        userName: 'Zainab Qureshi',
        rating: 5,
        comment: 'Absolutely love this backpack! The cream and orange combination looks so stylish and high-end. The laptop padding is thick and protects my MacBook perfectly.',
      },
      {
        productId: createdProducts[0].id,
        userName: 'Bilal Ahmed',
        rating: 5,
        comment: 'Best bag purchase in Pakistan so far. Stitching quality is top-notch, zippers are very smooth, and delivery took only 2 days to Lahore.',
      },
      {
        productId: createdProducts[1].id,
        userName: 'Farhan Siddiqui',
        rating: 5,
        comment: 'Great stealth look for corporate work. Fits my 15.6 inch Dell laptop easily with plenty of room for charger and headphones.',
      },
    ];

    for (const r of reviewsSeed) {
      await prisma.review.create({
        data: {
          ...r,
          isApproved: true,
        },
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
