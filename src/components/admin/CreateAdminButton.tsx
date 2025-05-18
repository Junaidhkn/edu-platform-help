'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { toast } from 'sonner';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

export function CreateAdminButton() {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [open, setOpen] = useState(false);

	const handleCreateAdmin = async () => {
		if (!email || !email.includes('@')) {
			toast.error('Please enter a valid email address');
			return;
		}

		try {
			setIsLoading(true);

			// Make API call to add the admin
			const response = await fetch('/api/admin/add', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			const result = await response.json();

			if (response.ok) {
				toast.success(result.message || 'Admin user added successfully');
				setEmail('');
				setOpen(false);
			} else {
				toast.error(result.message || 'Failed to add admin user');
			}
		} catch (error) {
			toast.error('Failed to add admin user');
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='default'>Add Admin User</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Add New Admin User</DialogTitle>
					<DialogDescription>
						Enter the email address of the user you want to make an admin. If
						the user has already signed up, they will be given admin privileges.
						If not, they will be granted admin privileges when they sign up.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label
							htmlFor='email'
							className='text-right'>
							Email
						</Label>
						<Input
							id='email'
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='col-span-3'
							placeholder='admin@example.com'
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={handleCreateAdmin}
						disabled={isLoading}>
						{isLoading ? 'Adding...' : 'Add Admin User'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
