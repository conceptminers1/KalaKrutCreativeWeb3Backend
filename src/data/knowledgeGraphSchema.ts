
export enum UserRole {
  ARTIST = 'Artist',
  VENUE = 'Venue',
  SPONSOR = 'Sponsor',
  REVELLER = 'Reveller',
  ADMIN = 'Admin',
  ORGANIZER = 'Organizer',
  DAO_MEMBER = 'DAO Member',
  SERVICE_PROVIDER = 'Service Provider',
  SYSTEM_ADMIN_LIVE = 'System Admin (Live)',
  DAO_GOVERNOR = 'DAO Governor',
  GUEST = 'Guest',
}

export enum ProposalStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  CANCELED = 'Canceled',
  DEFEATED = 'Defeated',
  SUCCEEDED = 'Succeeded',
  QUEUED = 'Queued',
  EXPIRED = 'Expired',
  EXECUTED = 'Executed',
}

export enum VoteType {
  FOR = 'For',
  AGAINST = 'Against',
  ABSTAIN = 'Abstain',
}


export interface Artist {
  id: string;
  musicBrainzId?: string;
  name: string;
  bio: string;
  type: 'person' | 'group' | 'producer'; // Expanded type
}

export interface Member {
  id: string;
  name: string;
}

export interface Release {
  id: string;
  musicBrainzId?: string;
  title: string;
  releaseDate: string;
}

export interface Track {
  id: string;
  musicBrainzId?: string;
  title: string;
  duration: number;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

export interface Event {
  id: string;
  name: string;
  date: string;
}

export interface Sponsor {
  id: string;
  name: string;
}

export interface Nft {
  id: string;
  tokenId: string;
  assetUrl: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  sellerId: string; // Links to an Artist/Producer node
}

export interface DAOProposal {
    id: string; // proposalId
    proposer: string; // address
    title: string;
    description: string;
    status: ProposalStatus;
    creationTimestamp: number;
    startTimestamp: number;
    endTimestamp: number;
}

export interface DAOVote {
    id: string; // voter address + proposal id
    proposalId: string;
    voterAddress: string;
    support: VoteType;
    votingPower: number;
    timestamp: number;
}

export interface DAODelegation {
    id: string; // delegator address
    delegatorAddress: string;
    delegateeAddress: string;
    timestamp: number;
}

// Edges
export interface PerformedAt {
  artistId: string;
  eventId: string;
  date: string;
}

export interface Wrote {
  artistId: string;
  trackId: string;
}

export interface Released {
  artistId: string;
  releaseId: string;
}

export interface CollaboratedWith {
  artistId1: string;
  artistId2: string;
}

export interface Sponsored {
  sponsorId: string;
  eventId: string;
}

export interface HostedAt {
  eventId: string;
  venueId: string;
}

export interface HasMember {
  groupId: string; // artistId of the group
  memberId: string;
}

export interface Produced {
  producerId: string; // artistId of the producer
  trackId: string;
}

export interface AssociatedWith {
  sourceNodeId: string;
  targetNodeId: string;
  relationship: string; // E.g., 'TICKET_FOR_EVENT'
}
