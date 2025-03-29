'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, StarIcon } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Freelancer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string;
  availabilityStatus: 'available' | 'busy';
  rating?: number;
  imageURI?: string | null;
}

interface FreelancerTableProps {
  freelancers: Freelancer[];
  onAssignOrder?: (freelancerId: string) => void;
}

export default function FreelancerTable({ freelancers, onAssignOrder }: FreelancerTableProps) {
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  // Function to get initials from name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Function to get status badge color
  const getStatusColor = (status: 'available' | 'busy') => {
    return status === 'available' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Freelancer</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {freelancers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No freelancers registered yet.
              </TableCell>
            </TableRow>
          ) : (
            freelancers.map((freelancer) => (
              <TableRow key={freelancer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={freelancer.imageURI || ''} alt={`${freelancer.firstName} ${freelancer.lastName}`} />
                      <AvatarFallback>{getInitials(freelancer.firstName, freelancer.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{`${freelancer.firstName} ${freelancer.lastName}`}</p>
                      <p className="text-xs text-gray-500">{freelancer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">{freelancer.skills}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(freelancer.availabilityStatus)}`}
                  >
                    {freelancer.availabilityStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  {freelancer.rating ? (
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span>{freelancer.rating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No ratings</span>
                  )}
                </TableCell>
                <TableCell>{freelancer.phone}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Link href={`/dashboard/freelancer/${freelancer.id}`}>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                      </Link>
                      {onAssignOrder && (
                        <DropdownMenuItem
                          onClick={() => {
                            setIsAssigning(freelancer.id);
                            onAssignOrder(freelancer.id);
                            setIsAssigning(null);
                            toast.success(`Order assigned to ${freelancer.firstName} ${freelancer.lastName}`);
                          }}
                          disabled={isAssigning === freelancer.id || freelancer.availabilityStatus === 'busy'}
                        >
                          {isAssigning === freelancer.id ? 'Assigning...' : 'Assign Order'}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          toast.success('Email sent to freelancer');
                        }}
                      >
                        Contact
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 