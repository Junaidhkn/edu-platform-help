'use client';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
export function UserNav() {
	const { data: session } = useSession();
	if (session) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='relative h-8 w-8 rounded-full'>
						<Avatar className='h-8 w-8'>
							<AvatarImage
								src={session.user?.image ?? ''}
								alt={session.user?.name ?? ''}
							/>
							<AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className='w-56'
					align='end'
					forceMount>
					<DropdownMenuLabel className='font-normal'>
						<div className='flex flex-col space-y-1'>
							<p className='text-sm font-medium leading-none'>
								{session.user?.name}
							</p>
							<p className='text-xs leading-none text-muted-foreground'>
								{session.user?.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => signOut()}>
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}
}
