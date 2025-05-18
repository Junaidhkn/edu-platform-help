'use client';

import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Pencil, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

interface AcademicLevel {
	id: string;
	name: string;
	basePrice: number | string;
}

interface AcademicLevelsTableProps {
	academicLevels: AcademicLevel[];
}

export function AcademicLevelsTable({
	academicLevels,
}: AcademicLevelsTableProps) {
	const [levels, setLevels] = useState<AcademicLevel[]>(academicLevels);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingValues, setEditingValues] = useState<AcademicLevel | null>(
		null,
	);

	const handleEdit = (level: AcademicLevel) => {
		setEditingId(level.id);
		setEditingValues({
			...level,
			basePrice:
				typeof level.basePrice === 'string'
					? parseFloat(level.basePrice)
					: level.basePrice,
		});
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditingValues(null);
	};

	const handleSave = async () => {
		if (!editingValues) return;

		try {
			const response = await fetch(
				`/api/services/pricing/academic-levels/${editingId}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: editingValues.name,
						basePrice: editingValues.basePrice,
					}),
				},
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update academic level');
			}

			// Update local state
			setLevels(
				levels.map((level) => (level.id === editingId ? editingValues : level)),
			);

			toast.success('Academic level updated successfully');
			setEditingId(null);
			setEditingValues(null);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Error updating academic level',
			);
			console.error('Error updating academic level:', error);
		}
	};

	const handleDelete = async (id: string) => {
		if (
			!confirm(
				'Are you sure you want to delete this academic level? This action cannot be undone.',
			)
		) {
			return;
		}

		try {
			const response = await fetch(
				`/api/services/pricing/academic-levels/${id}`,
				{
					method: 'DELETE',
				},
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete academic level');
			}

			// Update local state
			setLevels(levels.filter((level) => level.id !== id));
			toast.success('Academic level deleted successfully');
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Error deleting academic level',
			);
			console.error('Error deleting academic level:', error);
		}
	};

	const handleInputChange = (field: keyof AcademicLevel, value: string) => {
		if (!editingValues) return;

		if (field === 'basePrice') {
			setEditingValues({
				...editingValues,
				[field]: parseFloat(value),
			});
		} else {
			setEditingValues({
				...editingValues,
				[field]: value,
			});
		}
	};

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Base Price (Per Page)</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{levels.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={4}
								className='text-center py-4'>
								No academic levels found
							</TableCell>
						</TableRow>
					) : (
						levels.map((level) => (
							<TableRow key={level.id}>
								<TableCell className='font-medium'>{level.id}</TableCell>
								<TableCell>
									{editingId === level.id ? (
										<Input
											value={editingValues?.name}
											onChange={(e) =>
												handleInputChange('name', e.target.value)
											}
											className='max-w-[200px]'
										/>
									) : (
										level.name
									)}
								</TableCell>
								<TableCell>
									{editingId === level.id ? (
										<div className='flex items-center'>
											<span className='mr-2'>$</span>
											<Input
												type='number'
												value={editingValues?.basePrice}
												onChange={(e) =>
													handleInputChange('basePrice', e.target.value)
												}
												className='max-w-[100px]'
												step='0.01'
												min='0'
											/>
										</div>
									) : (
										`$${
											typeof level.basePrice === 'string'
												? parseFloat(level.basePrice).toFixed(2)
												: level.basePrice.toFixed(2)
										}`
									)}
								</TableCell>
								<TableCell className='text-right'>
									{editingId === level.id ? (
										<div className='flex justify-end space-x-2'>
											<Button
												variant='outline'
												size='icon'
												onClick={handleCancelEdit}>
												<X className='h-4 w-4' />
											</Button>
											<Button
												variant='default'
												size='icon'
												onClick={handleSave}>
												<Save className='h-4 w-4' />
											</Button>
										</div>
									) : (
										<div className='flex justify-end space-x-2'>
											<Button
												variant='outline'
												size='icon'
												onClick={() => handleEdit(level)}>
												<Pencil className='h-4 w-4' />
											</Button>
											<Button
												variant='destructive'
												size='icon'
												onClick={() => handleDelete(level.id)}>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
