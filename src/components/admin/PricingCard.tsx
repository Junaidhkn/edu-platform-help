'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Edit2, Save, X } from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';
import { toast } from 'sonner';

interface PricingCardProps {
	id: string;
	name: string;
	basePrice: number;
}

export default function PricingCard({ id, name, basePrice }: PricingCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [price, setPrice] = useState(basePrice);
	const [tempPrice, setTempPrice] = useState(basePrice);

	const handleEdit = () => {
		setTempPrice(price);
		setIsEditing(true);
	};

	const handleCancel = () => {
		setTempPrice(price);
		setIsEditing(false);
	};

	const handleSave = async () => {
		try {
			// Call API to update the price
			const response = await fetch(`/api/services/pricing/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ basePrice: tempPrice }),
			});

			if (!response.ok) {
				throw new Error('Failed to update pricing');
			}

			setPrice(tempPrice);
			setIsEditing(false);
			toast.success('Pricing updated successfully');
		} catch (error) {
			toast.error('Error updating pricing');
			console.error('Error updating pricing:', error);
		}
	};

	return (
		<Card className='overflow-hidden'>
			<CardHeader className='bg-slate-50'>
				<CardTitle className='text-center'>{name}</CardTitle>
			</CardHeader>
			<CardContent className='p-6'>
				<div className='text-center'>
					<div className='flex items-center justify-center space-x-2'>
						{isEditing ? (
							<div className='flex items-center'>
								<span className='text-2xl font-bold mr-1'>$</span>
								<Input
									type='number'
									value={tempPrice}
									onChange={(e) => setTempPrice(Number(e.target.value))}
									className='text-2xl font-bold w-24 h-10'
									step='0.01'
									min='0'
								/>
								<span className='text-lg ml-1'>/ page</span>
							</div>
						) : (
							<span className='text-3xl font-bold'>
								{formatCurrency(price)}
								<span className='text-lg font-normal text-gray-500 ml-1'>
									/ page
								</span>
							</span>
						)}
					</div>
				</div>
			</CardContent>
			<CardFooter className='flex justify-center p-6 pt-0'>
				{isEditing ? (
					<div className='flex space-x-2'>
						<Button
							onClick={handleSave}
							size='sm'
							className='w-20'>
							<Save className='h-4 w-4 mr-1' />
							Save
						</Button>
						<Button
							onClick={handleCancel}
							size='sm'
							variant='outline'
							className='w-20'>
							<X className='h-4 w-4 mr-1' />
							Cancel
						</Button>
					</div>
				) : (
					<Button
						onClick={handleEdit}
						size='sm'
						variant='outline'>
						<Edit2 className='h-4 w-4 mr-1' />
						Edit Price
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
