import {
  LeaderboardEntry,
  UserRole,
  ArtistProfile,
  MarketplaceItem,
  RosterMember,
  ServiceListing,
  ForumThread,
  Article,
  Proposal,
  TreasuryAsset,
  StaffMember,
  ModerationCase,
  SupportTicket,
  CircleMember,
  SmartContractDraft,
  Transaction,
  Gig,
  OnboardingRequest,
  ItemStatus
} from './types';

export const MOCK_ONBOARDING_REQUESTS: OnboardingRequest[] = [
    {
        id: 'lead-001',
        type: 'Lead',
        name: 'Elena Petrova',
        email: 'elena.p@example.com',
        requestedRole: UserRole.ARTIST,
        status: 'Pending',
        date: new Date('2023-10-28T10:00:00Z'),
        notes: 'Digital artist with a focus on generative art. Interested in learning about the NFT minting process.'
    },
    {
        id: 'join-001',
        type: 'Join Request',
        name: 'Marcus Thorne',
        email: 'm.thorne@corporatevent.com',
        requestedRole: UserRole.SPONSOR,
        status: 'Pending',
        date: new Date('2023-10-27T15:30:00Z'),
        notes: 'Represents a major beverage company interested in sponsoring the main stage.'
    },
    {
        id: 'join-002',
        type: 'Join Request',
        name: 'Aisha Khan',
        email: 'a.khan@soundwave.org',
        requestedRole: UserRole.ORGANIZER,
        status: 'Pending',
        date: new Date('2023-10-26T11:00:00Z'),
        notes: 'Experienced event organizer, wants to help with logistics for the art installations.'
    },
    {
        id: 'lead-002',
        type: 'Lead',
        name: 'Javier Morales',
        email: 'javi.m@email.com',
        requestedRole: UserRole.REVELLER,
        status: 'Approved',
        date: new Date('2023-10-25T09:00:00Z'),
        notes: 'Enthusiastic festival-goer, wants to be kept in the loop about ticket sales.'
    },
    {
        id: 'join-003',
        type: 'Join Request',
        name: 'Samantha Bee',
        email: 'samantha.b@venuepros.net',
        requestedRole: UserRole.VENUE,
        status: 'Denied',
        date: new Date('2023-10-24T18:00:00Z'),
        notes: 'Venue size is too small for the projected attendance numbers.'
    },
];

// --- MOCK CIRCLE DATA ---
const mockFollowers: CircleMember[] = [
  {
    id: 'f1',
    name: 'Elena Vance',
    avatar: 'https://i.pravatar.cc/150?u=f1',
    role: 'Vocalist',
  },
  {
    id: 'f2',
    name: 'Marcus Cole',
    avatar: 'https://i.pravatar.cc/150?u=f2',
    role: 'Producer',
  },
  {
    id: 'f3',
    name: 'Aria Chen',
    avatar: 'https://i.pravatar.cc/150?u=f3',
    role: 'Reveller',
  },
];

const mockBusinessAssociates: CircleMember[] = [
  {
    id: 'b1',
    name: 'Julian Cross',
    avatar: 'https://i.pravatar.cc/150?u=b1',
    role: 'Venue Manager',
  },
  {
    id: 'b2',
    name: 'Starlight Booking',
    avatar: 'https://i.pravatar.cc/150?u=b2',
    role: 'Agency',
  },
];

// --- BASE PROFILES FOR EACH ROLE ---

export const MOCK_ARTIST_PROFILE: ArtistProfile = {
  id: 'u_artist',
  name: 'Luna Eclipse',
  avatar: 'https://picsum.photos/seed/u1/200',
  role: UserRole.ARTIST,
  xp: 450,
  level: 2,
  password: 'password123', // Default mock password
  coverImage: 'https://picsum.photos/seed/gig1/1200/400',
  bio: `Electronic synthesis meets classical composition. Based in Brooklyn, Luna Eclipse has been redefining the ambient techno scene since 2021.\n\nMy sets are an immersive journey through sound and light, perfect for intimate venues and large-scale festivals alike.`,
  location: 'Brooklyn, NY',
  genres: ['Techno', 'Ambient', 'Electronica'],
  verified: true,
  followers: mockFollowers,
  businessAssociates: mockBusinessAssociates,
  pressKit: {
    photos: [
      'https://picsum.photos/seed/gig2/400/400',
      'https://picsum.photos/seed/gig3/400/400',
    ],
    topTracks: [
      { title: 'Midnight Protocol', duration: '5:42', plays: '124' },
      { title: 'Neon Rain', duration: '4:15', plays: '98' },
    ],
    techRiderUrl: '#',
    socials: [
      { platform: 'Instagram', followers: '45' },
      { platform: 'Twitter', followers: '12' },
    ],
  },
  stats: {
    gigsCompleted: 4,
    activeGigs: 1,
    rating: 4.9,
    responseTime: '< 2 hrs',
  },
  equityOpportunities: [
    {
      id: 'eq-1',
      title: 'Project: "Neon Horizons" Album',
      type: 'Project Equity',
      description:
        'Invest in the production and marketing of the upcoming sophomore album.',
      totalValuation: 5000,
      currency: 'USD',
      equityAvailablePercentage: 20,
      minInvestment: 50,
      tokenSymbol: '$NEON2',
      technology: 'ERC-20',
      termsSummary: 'Investors receive 20% of net royalties for 5 years.',
      riskLevel: 'Medium',
      backersCount: 2,
    },
  ],
  subscription: {
    planName: 'Community Pro',
    status: 'Active',
    expiryDate: '2024-10-24',
    supportTier: 'Priority',
    autoRenew: true,
    hasLeadGeniusSync: false,
  },
  savedPaymentMethods: {
    crypto: [
      {
        id: 'w1',
        network: 'Ethereum',
        address: '0x71C...9A23',
        label: 'Main Vault',
        isDefault: true,
      },
    ],
    fiat: [
      {
        id: 'c1',
        type: 'Card',
        last4: '4242',
        label: 'Chase Business',
        isDefault: true,
      },
    ],
  },
  revenue: {
    totalLifetime: 850,
    pendingPayout: 150,
    lastMonth: 340,
    breakdown: {
      gigs: 600,
      merch: 100,
      royalties: 50,
      licensing: 100,
    },
    recentPayouts: [
      {
        date: '2023-09-15',
        amount: 200,
        method: 'Crypto (ETH)',
        status: 'Completed',
      },
      {
        date: '2023-08-15',
        amount: 150,
        method: 'Bank Transfer',
        status: 'Completed',
      },
    ],
  },
  leadQueries: [],
};

export const MOCK_DAO_GOVERNOR_PROFILE: ArtistProfile = {
  ...MOCK_ARTIST_PROFILE,
  id: 'u_dao_gov',
  name: 'Governor Alice',
  role: UserRole.DAO_GOVERNOR,
  avatar: 'https://picsum.photos/seed/dao/200',
  level: 15,
  bio: 'Founding member of the KalaKrut DAO. Focused on sustainable growth and artist empowerment.',
  stats: { ...MOCK_ARTIST_PROFILE.stats, rating: 5.0 },
};

export const MOCK_DAO_MEMBER_PROFILE: ArtistProfile = {
  ...MOCK_ARTIST_PROFILE,
  id: 'u_dao_member',
  name: 'Leo Valdez',
  role: UserRole.DAO_MEMBER,
  avatar: 'https://picsum.photos/seed/daomember/200',
  level: 8,
  xp: 2500,
  bio: 'Sound engineer and long-time community member. Recently accepted nomination to join the DAO.',
  stats: { ...MOCK_ARTIST_PROFILE.stats, rating: 4.8 },
};

// Mock Users for Role Switcher
export const MOCK_USERS_BY_ROLE: Record<UserRole, ArtistProfile> = {
  [UserRole.ARTIST]: MOCK_ARTIST_PROFILE,
  [UserRole.VENUE]: {
    ...MOCK_ARTIST_PROFILE,
    id: 'u_venue',
    name: 'The Warehouse',
    role: UserRole.VENUE,
    avatar: 'https://picsum.photos/seed/venue1/200',
    location: 'London, UK',
  },
  [UserRole.SPONSOR]: {
    ...MOCK_ARTIST_PROFILE,
    id: 'u_sponsor',
    name: 'RedBull Music',
    role: UserRole.SPONSOR,
    avatar: 'https://picsum.photos/seed/sponsor1/200',
    location: 'Global',
  },
  [UserRole.REVELLER]: {
    ...MOCK_ARTIST_PROFILE,
    id: 'u_reveller',
    name: 'Alex Fan',
    role: UserRole.REVELLER,
    avatar: 'https://picsum.photos/seed/fan1/200',
    level: 2,
    xp: 150,
  },
  [UserRole.ADMIN]: {
    ...MOCK_ARTIST_PROFILE,
    id: 'u_admin',
    name: 'System Admin',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/seed/admin/200',
    level: 99,
  },
  [UserRole.SYSTEM_ADMIN_LIVE]: {
    ...MOCK_ARTIST_PROFILE,
    id: 'u_sys_admin_live',
    name: 'Kala Owner',
    role: UserRole.SYSTEM_ADMIN_LIVE,
    avatar: 'https://picsum.photos/seed/sysadmin/200',
    level: 100,
    password: 'live',
  },
  [UserRole.ORGANIZER]: {
    ...MOCK_ARTIST_PROFILE,
    id: 'u_org',
    name: 'Festival Co.',
    role: UserRole.ORGANIZER,
    avatar: 'https://picsum.photos/seed/org/200',
  },
  [UserRole.DAO_GOVERNOR]: MOCK_DAO_GOVERNOR_PROFILE,
  [UserRole.DAO_MEMBER]: MOCK_DAO_MEMBER_PROFILE,
  [UserRole.SERVICE_PROVIDER]: {
    ...MOCK_ARTIST_PROFILE,
    id: 'u_service',
    name: 'Legal Eagle',
    role: UserRole.SERVICE_PROVIDER,
    avatar: 'https://picsum.photos/seed/legal/200',
  },
};

export const MOCK_ROSTER: RosterMember[] = [
  {
    id: 'u_artist',
    name: 'Luna Eclipse',
    role: UserRole.ARTIST,
    avatar: 'https://picsum.photos/seed/u1/200',
    location: 'Brooklyn, NY',
    verified: true,
    assets: {
      ips: [],
      events: [],
      services: [],
      products: [],
      contents: [],
      equipment: [],
      instruments: [],
      tickets: [],
    },
    rating: 4.9,
    subscriberOnly: {
      email: 'booking@lunaeclipse.com',
      phone: '+1 555 019 2834',
      agentContact: 'Creative Artists Agency',
    },
    walletAddress: '0xAbc...123',
  },
  {
    id: 'u_venue',
    name: 'The Warehouse',
    role: UserRole.VENUE,
    avatar: 'https://picsum.photos/seed/venue1/200',
    location: 'London, UK',
    verified: true,
    assets: {
      ips: [],
      events: [],
      services: [],
      products: [],
      contents: [],
      equipment: [],
      instruments: [],
      tickets: [],
    },
    rating: 4.8,
    subscriberOnly: {
      email: 'events@thewarehouse.ldn',
      phone: '+44 20 7946 0123',
      agentContact: 'Internal Booking Team',
    },
    walletAddress: '0xDef...456',
  },
  {
    id: 'r3',
    name: 'TechStart Inc.',
    role: UserRole.SPONSOR,
    avatar: 'https://picsum.photos/seed/sponsor1/200',
    location: 'San Francisco, CA',
    verified: true,
    assets: {
      ips: [],
      events: [],
      services: [],
      products: [],
      contents: [],
      equipment: [],
      instruments: [],
      tickets: [],
    },
    rating: 5.0,
    subscriberOnly: {
      email: 'partnerships@techstart.io',
      phone: '+1 415 555 0100',
      agentContact: 'Global Brand Director',
    },
    walletAddress: '0xGhi...789',
  },
  {
    id: 'u_dao_gov',
    name: 'Governor Alice',
    role: UserRole.DAO_GOVERNOR,
    avatar: 'https://picsum.photos/seed/dao/200',
    location: 'Decentralized',
    verified: true,
    assets: {
      ips: [],
      events: [],
      services: [],
      products: [],
      contents: [],
      equipment: [],
      instruments: [],
      tickets: [],
    },
    rating: 5.0,
    subscriberOnly: {
      email: 'governor.alice@kalakrut.io',
      phone: '',
      agentContact: '',
    },
    walletAddress: '0xJkl...012',
  },
  {
    id: 'r4',
    name: 'DJ Quantum',
    role: UserRole.ARTIST,
    avatar: 'https://picsum.photos/seed/u4/200',
    location: 'Berlin, DE',
    verified: false,
    assets: {
      ips: [],
      events: [],
      services: [],
      products: [],
      contents: [],
      equipment: [],
      instruments: [],
      tickets: [],
    },
    rating: 4.7,
    subscriberOnly: {
      email: 'contact@djquantum.com',
      phone: '+49 176 12345678',
      agentContact: 'Self-managed',
    },
    walletAddress: '0xMno...345',
  },
  {
    id: 'u_dao_member',
    name: 'Leo Valdez',
    role: UserRole.DAO_MEMBER,
    avatar: 'https://picsum.photos/seed/daomember/200',
    location: 'Mexico City, MX',
    verified: true,
    assets: {
      ips: [],
      events: [],
      services: [],
      products: [],
      contents: [],
      equipment: [],
      instruments: [],
      tickets: [],
    },
    rating: 4.8,
    subscriberOnly: { email: 'leo.v@email.com', phone: '', agentContact: '' },
    walletAddress: '0xPqr...678',
  },
  {
    id: 'u_sponsor_2',
    name: 'RedBull Music',
    role: UserRole.SPONSOR,
    avatar: 'https://picsum.photos/seed/sponsor2/200',
    location: 'Global',
    verified: true,
    assets: {
      ips: [],
      events: [],
      services: [],
      products: [],
      contents: [],
      equipment: [],
      instruments: [],
      tickets: [],
    },
    rating: 4.9,
    subscriberOnly: {
      email: 'music@redbull.com',
      phone: '',
      agentContact: 'Artist Relations',
    },
    walletAddress: '0xStu...901',
  },
  {
    id: 'u_reveller',
    name: 'Alex Fan',
    role: UserRole.REVELLER,
    avatar: 'https://picsum.photos/seed/fan1/200',
    location: 'Paris, FR',
    verified: false,
    assets: {
      ips: [],
      events: [],
      services: [],
      products: [],
      contents: [],
      equipment: [],
      instruments: [],
      tickets: [],
    },
    rating: 4.5,
    subscriberOnly: { email: '', phone: '', agentContact: '' },
    walletAddress: '0xVwx...234',
  },
  {
    id: 'u_org',
    name: 'Festival Co.',
    role: UserRole.ORGANIZER,
    avatar: 'https://picsum.photos/seed/org/200',
    location: 'Amsterdam, NL',
    verified: true,
    assets: {
      ips: [],
      events: [],
      services: [],
      products: [],
      contents: [],
      equipment: [],
      instruments: [],
      tickets: [],
    },
    rating: 4.6,
    subscriberOnly: {
      email: 'contact@festivalco.com',
      phone: '',
      agentContact: 'Booking Department',
    },
    walletAddress: '0xYza...567',
  },
  {
    id: 'u_service',
    name: 'Legal Eagle',
    role: UserRole.SERVICE_PROVIDER,
    avatar: 'https://picsum.photos/seed/legal/200',
    location: 'New York, NY',
    verified: true,
    assets: {
      ips: [],
      events: [],
      services: [],
      products: [],
      contents: [],
      equipment: [],
      instruments: [],
      tickets: [],
    },
    rating: 5.0,
    subscriberOnly: {
      email: 'consult@legaleagle.com',
      phone: '',
      agentContact: '',
    },
    walletAddress: '0xBcd...890',
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    user: {
      ...MOCK_USERS_BY_ROLE[UserRole.ARTIST],
      name: 'Luna Eclipse',
      xp: 450,
      level: 2,
    },
    badges: ['Early Adopter'],
    change: 0,
  },
  {
    rank: 2,
    user: {
      ...MOCK_USERS_BY_ROLE[UserRole.VENUE],
      name: 'The Warehouse',
      xp: 320,
      level: 1,
    },
    badges: ['Super Host'],
    change: 0,
  },
  {
    rank: 3,
    user: {
      ...MOCK_USERS_BY_ROLE[UserRole.REVELLER],
      name: 'CryptoFan_99',
      xp: 150,
      level: 1,
    },
    badges: ['Collector'],
    change: 0,
  },
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'PROP-101',
    title: 'Initialize Treasury',
    description:
      'Proposal to seed the community treasury with initial grant funding.',
    votesFor: 3,
    votesAgainst: 0,
    deadline: '2023-10-20',
    status: 'Active',
    creator: 'Governor Alice',
    quorumRequired: 20,
    currentParticipation: 100, // 3/3 users voted
    isCritical: true,
  },
];

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'm1',
    sellerId: 'u_artist',
    name: 'Cyberpunk Guitar (Limited Ed.)',
    type: 'Instrument',
    price: 1200,
    currency: 'USD',
    image: 'https://picsum.photos/seed/guitar/400/400',
    isAuction: false,
    description:
      'Custom painted Cyberpunk 2077 themed electric guitar. Modified pickups for extra crunch. Used on stage during the "Neon Nights" tour.',
    condition: 'Like New',
    status: ItemStatus.AVAILABLE,
    createdAt: new Date('2023-10-20T10:00:00Z'),
    updatedAt: new Date('2023-10-20T10:00:00Z'),
  },
  {
    id: 'm2',
    sellerId: 'u_venue',
    name: 'Lifetime Backstage Pass NFT',
    type: 'NFT',
    price: 0.5,
    currency: 'ETH',
    image: 'https://picsum.photos/seed/nft1/400/400',
    isAuction: true,
    endTime: '2d 14h',
    description:
      'Granting lifetime backstage access to all events at The Warehouse London. Includes VIP bar access and meet & greet privileges. Tradable on secondary market.',
    condition: 'Digital',
    status: ItemStatus.AVAILABLE,
    createdAt: new Date('2023-10-18T14:00:00Z'),
    updatedAt: new Date('2023-10-19T11:30:00Z'),
  },
];

export const MOCK_THREADS: ForumThread[] = [
  {
    id: '1',
    title: 'Welcome to the Beta!',
    category: 'General',
    authorId: 'u_admin',
    replies: 2,
    views: 12,
    lastActive: '1h ago',
    isPinned: true,
  },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'KalaKrut Launches Beta',
    excerpt:
      'Welcome to the future of creative collaboration. We are live with our first cohort of artists.',
    content: 'Full article content here...',
    date: 'Oct 12, 2023',
    author: 'KalaKrut Team',
    image: 'https://picsum.photos/seed/news1/800/400',
    category: 'Announcement',
  },
];

export const MOCK_SERVICES: ServiceListing[] = [
  {
    id: '1',
    title: 'Web3 Grant Writing & Strategy',
    provider: 'CryptoGrants Co.',
    category: 'Grant Writing',
    rate: '150',
    rating: 5.0,
    reviews: 1,
    isPlatformService: false,
  },
];

export const MOCK_TREASURY_ASSETS: TreasuryAsset[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 2.5,
    valueUsd: 4500,
    allocation: 25,
    trend: 'neutral',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 10000,
    valueUsd: 10000,
    allocation: 55,
    trend: 'neutral',
  },
  {
    symbol: 'KALA',
    name: 'Kala Token',
    balance: 50000,
    valueUsd: 2500,
    allocation: 20,
    trend: 'up',
  },
];

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Sarah Connor',
    role: 'Community Manager',
    department: 'Community',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/staff1/200',
    email: 'sarah@kalakrut.io',
    lastActive: '5 mins ago',
    designation: 'Community Lead',
    employmentDate: '2023-09-01',
    salary: 4000,
    currency: 'USD',
    taxDeductions: 600,
    normalHours: 160,
    hoursWorked: 160,
    overtimeHours: 0,
    overtimePaid: 0,
    leavesAccrued: 2,
    leavesUsed: 0,
    duties: ['Manage Discord', 'Onboard initial users'],
    monthlyTasks: ['Welcome new users', 'Gather feedback'],
  },
];

export const MOCK_MODERATION_CASES: ModerationCase[] = [];

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'TK-1001',
    userId: 'u_artist',
    userName: 'Luna Eclipse',
    subject: 'Profile Verification',
    category: 'Account',
    priority: 'Low',
    status: 'Open',
    tier: 'Tier 1',
    createdAt: '2023-10-14 09:00',
    lastUpdate: '2h ago',
  },
];

export const MOCK_CONTRACTS: SmartContractDraft[] = [
    {
        id: 'scd-001',
        contractType: 'KalaKrutToken',
        content: `contract KalaKrutToken is ERC20 {\n    constructor() ERC20("KalaKrut Token", "KALA") {\n        _mint(msg.sender, 1000000 * 10 ** 18);\n    }\n}`,
        lastEditedBy: 'Admin',
        version: 1,
        status: 'Published',
        parameters: [],
    },
    {
        id: 'scd-002',
        contractType: 'TimelockController',
        content: `contract TimelockController is TimelockController {\n    constructor(uint256 minDelay, address[] memory proposers, address[] memory executors) \n        TimelockController(minDelay, proposers, executors, msg.sender) {}\n}`,
        lastEditedBy: 'Admin',
        version: 1,
        status: 'Published',
        parameters: ['minDelay', 'proposers', 'executors'],
    },
    {
        id: 'scd-003',
        contractType: 'KalaKrutGovernor',
        content: `contract KalaKrutGovernor is Governor, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {\n    constructor(IVotes _token, TimelockController _timelock)\n        Governor(ERC20Votes.getPastTotalSupply, "KalaKrutGovernor")\n        GovernorVotes(_token)\n        GovernorVotesQuorumFraction(4)\n        GovernorTimelockControl(_timelock) {}\n}`,
        lastEditedBy: 'Admin',
        version: 1,
        status: 'Published',
        parameters: ['tokenAddress', 'timelockAddress'],
    },
    {
        id: 'scd-004',
        contractType: 'Treasury',
        content: `contract Treasury {\n    address public owner;\n    constructor() {\n        owner = msg.sender;\n    }\n    // Additional treasury logic here\n}`,
        lastEditedBy: 'Admin',
        version: 1,
        status: 'Published',
        parameters: [],
    },
    {
        id: 'scd-005',
        contractType: 'KalaKrutNFT',
        content: `contract KalaKrutNFT is ERC721, Ownable {\n    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}\n}`,
        lastEditedBy: 'Admin',
        version: 1,
        status: 'Published',
        parameters: ['nftName', 'nftSymbol'],
    },
    {
        id: 'scd-006',
        contractType: 'EventTicket',
        content: `contract EventTicket is ERC721, Ownable {\n    constructor(string memory uri) ERC721("EventTicket", "EVT") {\n        _safeMint(msg.sender, 1, uri);\n    }\n}`,
        lastEditedBy: 'Admin',
        version: 1,
        status: 'Published',
        parameters: ['eventUri'],
    },
    {
        id: 'scd-007',
        contractType: 'Fractionalizer',
        content: `contract Fractionalizer is ERC20, Ownable {\n    constructor(string memory name, string memory symbol, address nftContract, uint256 nftId, uint256 totalSupply)\n        ERC20(name, symbol) {\n        // Logic to fractionalize the NFT\n    }\n}`,
        lastEditedBy: 'Admin',
        version: 1,
        status: 'Published',
        parameters: ['fractionalizerName', 'fractionalizerSymbol', 'nftContractAddress', 'nftId', 'totalSupply'],
    },
    {
        id: 'scd-008',
        contractType: 'Escrow',
        content: `contract Escrow {\n    address public beneficiary;\n    address public arbiter;\n    constructor(address _beneficiary, address _arbiter) {\n        beneficiary = _beneficiary;\n        arbiter = _arbiter;\n    }\n}`,
        lastEditedBy: 'Admin',
        version: 1,
        status: 'Published',
        parameters: ['beneficiary', 'arbiter'],
    },
    {
        id: 'scd-009',
        contractType: 'ServiceAgreement',
        content: `contract ServiceAgreement is ReentrancyGuard {\n    address public provider; // The address of the service provider\n    address public client;   // The address of the client\n    address public arbiter;  // The address of the arbiter for dispute resolution\n
    uint256 public paymentAmount; // The agreed payment amount in wei\n    string public terms;          // The terms of the service agreement\n
    enum State { Created, Funded, Completed, Cancelled, InDispute }\n    State public currentState;\n
    // ... (rest of the contract code) ...\n}`,
        lastEditedBy: 'Admin',
        version: 1,
        status: 'Published',
        parameters: ['provider', 'client', 'arbiter', 'terms', 'paymentAmount'],
    },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    date: '2023-10-24T10:00:00Z',
    description: 'Ticket Purchase: Luna Eclipse Live',
    amount: -25.00,
    currency: 'USD',
    status: 'Completed',
  },
  {
    id: 'txn-2',
    date: '2023-10-22T14:30:00Z',
    description: 'Merch Sale: Neon Nights T-Shirt',
    amount: 35.00,
    currency: 'USD',
    status: 'Completed',
  },
  {
    id: 'txn-3',
    date: '2023-10-20T18:00:00Z',
    description: 'Gig Payout: The Warehouse Performance',
    amount: 250.00,
    currency: 'USD',
    status: 'Completed',
  },
    {
    id: 'txn-4',
    date: '2023-10-19T12:00:00Z',
    description: 'Service Fee: Graphic Design',
    amount: -75.00,
    currency: 'USD',
    status: 'Completed',
  },
  {
    id: 'txn-5',
    date: '2023-10-18T09:00:00Z',
    description: 'Subscription: Kalakrut Pro',
    amount: -15.00,
    currency: 'USD',
    status: 'Completed',
  }
];

export const MOCK_GIGS: Gig[] = [
    {
        id: 'gig-1',
        artistId: 'u_artist',
        venueId: 'u_venue',
        title: 'Luna Eclipse Live at The Warehouse',
    },
    {
        id: 'gig-2',
        artistId: 'r4',
        venueId: 'u_venue',
        title: 'DJ Quantum Presents: Berlin Beats',
    },
    {
        id: 'gig-3',
        artistId: 'u_dao_gov',
        venueId: 'u_venue',
        title: 'DAO Governance Summit',
    },
]
