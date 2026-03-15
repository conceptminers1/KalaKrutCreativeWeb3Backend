
// ========= ENUMS =========

export enum UserRole {
  ARTIST = "ARTIST",
  VENUE = "VENUE",
  SERVICE_PROVIDER = "SERVICE_PROVIDER",
  ORGANIZER = "ORGANIZER",
  SPONSOR = "SPONSOR",
  REVELLER = "REVELLER",
  ADMIN = "ADMIN",
  DAO_GOVERNOR = "DAO_GOVERNOR",
  DAO_MEMBER = "DAO_MEMBER",
  SYSTEM_ADMIN_LIVE = "SYSTEM_ADMIN_LIVE",
}

export enum ContractStatus {
  PENDING = "PENDING",
  SIGNED = "SIGNED",
  ACTIVE = "ACTIVE",
  FULFILLED = "FULFILLED",
  DISPUTED = "DISPUTED",
  CANCELED = "CANCELED",
}

export enum ContractType {
  GIG = "GIG",
  SERVICE = "SERVICE",
}

export enum OnboardingStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ProposalStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  PASSED = "PASSED",
  FAILED = "FAILED",
  EXECUTED = "EXECUTED",
}

export enum EscrowStatus {
  CREATED = "CREATED",
  FUNDED = "FUNDED",
  RELEASED = "RELEASED",
  REFUNDED = "REFUNDED",
  DISPUTED = "DISPUTED",
}

export enum TicketStatus {
  AVAILABLE = "AVAILABLE",
  SOLD = "SOLD",
  INVALIDATED = "INVALIDATED",
}

export enum ItemStatus {
  AVAILABLE = "AVAILABLE",
  SOLD = "SOLD",
  REMOVED = "REMOVED",
}

export enum EventStatus {
  SCHEDULED = "SCHEDULED",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
}

export enum HRStatus {
  ACTIVE = "ACTIVE",
  ON_LEAVE = "ON_LEAVE",
  INACTIVE = "INACTIVE",
}


// ========= AUTH & CORE USER MODELS =========

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  user: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  role: UserRole;
  accounts: Account[];
  sessions: Session[];
  lead?: Lead | null;
  onboardingRequest?: OnboardingRequest | null;
  artistProfile?: ArtistProfile | null;
  venueProfile?: VenueProfile | null;
  sponsorProfile?: SponsorProfile | null;
  organizerProfile?: OrganizerProfile | null;
  serviceProviderProfile?: ServiceProviderProfile | null;
  daoMemberProfile?: DaoMemberProfile | null;
  daoGovernorProfile?: DaoGovernorProfile | null; 
  revellerProfile?: RevellerProfile | null; 
  gigsAsArtist: Gig[];
  gigsAsVenue: Gig[];
  initiatedContracts: Contract[];
  signedContracts: Contract[];
  proposals: Proposal[];
  votes: Vote[];
  ownedNFTs: NFT[];
  ownedTickets: EventTicket[];
  ownedFractions: FractionalTokenOwner[];
  escrowsAsParty: EscrowContract[];
  treasury: TreasuryTransaction[];
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

// ========= USER ONBOARDING =========

export interface OnboardingRequest {
  id: string;
  user: User;
  userId: string;
  status: OnboardingStatus;
  submittedAt: Date;
  reviewedAt?: Date | null;
  reviewNotes?: string | null;
}


// ========= USER PROFILES =========

export interface ArtistProfile {
  id: string;
  user: User;
  userId: string;
  genre?: string | null;
  bio?: string | null;
  techRiderUrl?: string | null;
  portfolioUrl?: string | null;
  verified: boolean;
}

export interface VenueProfile {
  id: string;
  user: User;
  userId: string;
  location?: string | null;
  capacity?: number | null;
  amenities: string[];
  verified: boolean;
}

export interface SponsorProfile {
  id: string;
  user: User;
  userId: string;
  companyName?: string | null;
  website?: string | null;
  focusAreas: string[];
  verified: boolean;
}

export interface OrganizerProfile {
  id: string;
  user: User;
  userId: string;
  organization?: string | null;
  pastEvents: string[];
  verified: boolean;
}

export interface ServiceProviderProfile {
  id: string;
  user: User;
  userId: string;
  serviceType: string;
  rate?: string | null;
  availability?: string | null;
  verified: boolean;
}

export interface DaoMemberProfile {
  id: string;
  user: User;
  userId: string;
  votingPower: number;
  joinedAt: Date;
  verified: boolean;
}

export interface DaoGovernorProfile {
    id: string;
    user: User;
    userId: string;
    proposals_created: number;
    votes_cast: number;
    verified: boolean;
}

export interface RevellerProfile {
    id: string;
    user: User;
    userId: string;
    tickets_purchased: number;
    verified: boolean;
}


// ========= CORE BUSINESS LOGIC =========

export interface Gig {
  id: string;
  title: string;
  description?: string | null;
  date: Date;
  status: string;
  artist: User;
  artistId: string;
  venue: User;
  venueId: string;
  contracts: Contract[];
  event?: Event | null;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    currency: string;
    status: string;
    contractId?: string;
    contract?: Contract;
    nftId?: string;
    nft?: NFT;
    fractionalizationId?: string;
    fractionalization?: Fractionalize;
    eventId?: string;
    event?: Event;
}

export interface Contract {
  id: string;
  title: string;
  terms: string;
  status: ContractStatus;
  contractType: ContractType;
  completionNote?: string | null;
  gig?: Gig | null;
  gigId?: string | null;
  initiator: User;
  initiatorId: string;
  parties: User[];
  escrow?: EscrowContract | null;
  createdAt: Date;
  updatedAt: Date;
}

// ========= DAO & GOVERNANCE =========

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: ProposalStatus;
  proposer: User;
  proposerId: string;
  votes: Vote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  id: string;
  proposal: Proposal;
  proposalId: string;
  voter: User;
  voterId: string;
  choice: boolean;
  votingPower: number;
  createdAt: Date;
}

export interface TreasuryTransaction {
  id: string;
  type: string;
  amount: number;
  timestamp: string;
}


// ========= SMART CONTRACT & WEB3 MODELS =========

export interface Event {
  id: string;
  name: string;
  gig: Gig;
  gigId: string;
  tickets: EventTicket[];
  status: EventStatus;
  startTime: Date;
  endTime: Date;
  contractAddress?: string | null;
}

export interface EventTicket {
  id: string;
  event: Event;
  eventId: string;
  owner: User;
  ownerId: string;
  tokenId: number;
  status: TicketStatus;
  contractAddress: string;
}

export interface NFT {
  id: string;
  owner: User;
  ownerId: string;
  tokenId: number;
  contractAddress: string;
  metadataUrl: string;
  fractionalization?: Fractionalize | null;
}

export interface Fractionalize {
  id: string;
  nft: NFT;
  nftId: string;
  tokenAddress: string;
  totalSupply: bigint;
  tokenOwners: FractionalTokenOwner[];
}

export interface FractionalTokenOwner {
  id: string;
  fractionalize: Fractionalize;
  fractionalizeId: string;
  owner: User;
  ownerId: string;
  balance: bigint;
}

export interface EscrowContract {
  id: string;
  contract: Contract;
  contractId: string;
  escrowAddress: string;
  status: EscrowStatus;
  amount: number; 
  parties: User[];
}

export interface Lead {
  id: string;
  user: User | null;
  userId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  currency: string;
  image: string;
  isAuction: boolean;
  endTime?: string;
  condition: string;
}

export interface HumanResources {
    id: string;
    name: string;
    role: string;
    status: HRStatus;
    joinDate: Date;
    salary: number;
    tasksAssigned: string[];
}

export interface ForumThread {
  id: string;
  title: string;
  category: string;
  authorId: string;
  replies: number;
  views: number;
  lastActive: string;
  isPinned?: boolean;
}
