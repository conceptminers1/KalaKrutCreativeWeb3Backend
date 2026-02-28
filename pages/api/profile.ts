import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient, UserRole } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// A more complete and correct schema
const profileUpdateSchema = z.object({
  // General User fields
  name: z.string().optional(),
  avatar: z.string().url().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),

  // ArtistProfile fields
  artistName: z.string().optional(),
  genre: z.string().optional(),
  bio: z.string().optional(),
  techRiderUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),

  // VenueProfile fields
  venueName: z.string().optional(),
  bookingEmail: z.string().email().optional(),
  capacity: z.number().int().positive().optional(),
  amenities: z.array(z.string()).optional(),
  address: z.string().optional(),

  // SponsorProfile fields
  sponsorName: z.string().optional(),
  sponsorshipTier: z.string().optional(),
  companyName: z.string().optional(),
  focusAreas: z.array(z.string()).optional(),

  // OrganizerProfile fields
  organizerName: z.string().optional(),
  organization: z.string().optional(),
  pastEvents: z.array(z.string()).optional(),

  // ServiceProviderProfile fields
  serviceProviderName: z.string().optional(),
  serviceType: z.string().optional(),
  rate: z.string().optional(),
  availability: z.string().optional(),

  // RevellerProfile fields
  interests: z.array(z.string()).optional(),
});

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    try {
      const result = profileUpdateSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid data', errors: result.error.errors });
      }

      const data = result.data;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: data.name,
          avatar: data.avatar,
          location: data.location,
          website: data.website,
          tags: data.tags,
          
          ...(user.role === UserRole.ARTIST && {
            artistProfile: {
              upsert: {
                create: { artistName: data.artistName, genre: data.genre, bio: data.bio, techRiderUrl: data.techRiderUrl, portfolioUrl: data.portfolioUrl },
                update: { artistName: data.artistName, genre: data.genre, bio: data.bio, techRiderUrl: data.techRiderUrl, portfolioUrl: data.portfolioUrl },
              },
            },
          }),
          ...(user.role === UserRole.VENUE && {
            venueProfile: {
              upsert: {
                create: { venueName: data.venueName, bookingEmail: data.bookingEmail, capacity: data.capacity, amenities: data.amenities, address: data.address },
                update: { venueName: data.venueName, bookingEmail: data.bookingEmail, capacity: data.capacity, amenities: data.amenities, address: data.address },
              },
            },
          }),
          ...(user.role === UserRole.SPONSOR && {
            sponsorProfile: {
              upsert: {
                create: { sponsorName: data.sponsorName, companyName: data.companyName, website: data.website, focusAreas: data.focusAreas, sponsorshipTier: data.sponsorshipTier },
                update: { sponsorName: data.sponsorName, companyName: data.companyName, website: data.website, focusAreas: data.focusAreas, sponsorshipTier: data.sponsorshipTier },
              },
            },
          }),
          ...(user.role === UserRole.ORGANIZER && {
            organizerProfile: {
              upsert: {
                create: { organizerName: data.organizerName, organization: data.organization, pastEvents: data.pastEvents },
                update: { organizerName: data.organizerName, organization: data.organization, pastEvents: data.pastEvents },
              },
            },
          }),
          ...(user.role === UserRole.SERVICE_PROVIDER && {
            serviceProviderProfile: {
              upsert: {
                create: { serviceProviderName: data.serviceProviderName, serviceType: data.serviceType, rate: data.rate, availability: data.availability },
                update: { serviceProviderName: data.serviceProviderName, serviceType: data.serviceType, rate: data.rate, availability: data.availability },
              },
            },
          }),
          ...(user.role === UserRole.REVELLER && {
            revellerProfile: {
              upsert: {
                create: { interests: data.interests },
                update: { interests: data.interests },
              },
            },
          }),
        },
        include: {
          artistProfile: true,
          venueProfile: true,
          sponsorProfile: true,
          organizerProfile: true,
          serviceProviderProfile: true,
          revellerProfile: true,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } 
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
