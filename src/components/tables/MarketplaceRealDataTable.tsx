import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/tables/Table";
import { Button } from '@/components/ui/Button';
import { MarketplaceItem, ItemStatus, UserRole } from '@/types/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const StatusPill: React.FC<{ status: ItemStatus }> = ({ status }) => (
    <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === ItemStatus.AVAILABLE
                ? 'bg-green-500/20 text-green-300'
                : status === ItemStatus.SOLD
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-red-500/20 text-red-300' // REMOVED
        }`}
    >
        {status}
    </span>
);

const MarketplaceRealDataTable = ({ data, currentUserId, currentUserRole }: { data: MarketplaceItem[], currentUserId: string, currentUserRole: UserRole }) => {
  const { getUserById } = useData();

  return (
    <div className="bg-kala-900 text-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Real Marketplace Data</h2>
      <Table>
        <TableCaption>A list of items available on the KalaKrut marketplace.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const canManage = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SYSTEM_ADMIN_LIVE || item.sellerId === currentUserId;
            const seller = getUserById(item.sellerId);

            return (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{seller?.name || 'Unknown Seller'}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell><StatusPill status={item.status} /></TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Button className="bg-kala-secondary text-kala-900 px-4 py-2 rounded-lg font-bold hover:bg-cyan-400 transition-colors">View</Button>
                        {canManage && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-400">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MarketplaceRealDataTable;
