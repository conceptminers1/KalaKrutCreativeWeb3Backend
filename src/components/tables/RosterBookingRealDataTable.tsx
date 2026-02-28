import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/tables/Table';
import { Button } from '@/components/ui/Button';

const RosterBookingRealDataTable: React.FC = () => {
  const [bookings, setBookings] = useState([
    {
      id: 'RB-101',
      artist: 'Artist B',
      event: 'Event D',
      status: 'Pending',
    },
    {
      id: 'RB-102',
      artist: 'Artist C',
      event: 'Event E',
      status: 'Confirmed',
    },
  ]);

  const handleDecision = (id: string, decision: 'Confirmed' | 'Cancelled') => {
    setBookings((prevBookings) =>
      prevBookings.map((book) =>
        book.id === id ? { ...book, status: decision } : book
      )
    );
    console.log(`Booking ${id} has been ${decision}`);
  };

  return (
    <div className="bg-kala-900 text-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Real Roster Booking Data</h2>
      <Table className="bg-kala-900 text-white rounded-lg p-6">
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.artist}</TableCell>
              <TableCell>{booking.event}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>
                {booking.status === 'Pending' && (
                  <div className="flex space-x-2">
                    <Button onClick={() => handleDecision(booking.id, 'Confirmed')} className="bg-green-500 hover:bg-green-600">Confirm</Button>
                    <Button onClick={() => handleDecision(booking.id, 'Cancelled')} className="bg-red-500 hover:bg-red-600">Cancel</Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RosterBookingRealDataTable;