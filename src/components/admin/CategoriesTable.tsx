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

interface Category {
	id: string;
	name: string;
	priceModifier: number | string;
}

interface CategoriesTableProps {
	categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
	const [categoriesList, setCategories] = useState<Category[]>(categories);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingValues, setEditingValues] = useState<Category | null>(null);

	const handleEdit = (category: Category) => {
		setEditingId(category.id);
		setEditingValues({
			...category,
			priceModifier:
				typeof category.priceModifier === 'string'
					? parseFloat(category.priceModifier)
					: category.priceModifier,
		});
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditingValues(null);
	};

	const handleSave = async () => {
		if (!editingValues) return;

		try {
			const response = await fetch(`/api/services/categories/${editingId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: editingValues.name,
					priceModifier: editingValues.priceModifier,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update category');
			}

			// Update local state
			setCategories(
				categoriesList.map((category) =>
					category.id === editingId ? editingValues : category,
				),
			);

			toast.success('Category updated successfully');
			setEditingId(null);
			setEditingValues(null);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Error updating category',
			);
			console.error('Error updating category:', error);
		}
	};

	const handleDelete = async (id: string) => {
		if (
			!confirm(
				'Are you sure you want to delete this category? This action cannot be undone.',
			)
		) {
			return;
		}

		try {
			const response = await fetch(`/api/services/categories/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete category');
			}

			// Update local state
			setCategories(categoriesList.filter((category) => category.id !== id));
			toast.success('Category deleted successfully');
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Error deleting category',
			);
			console.error('Error deleting category:', error);
		}
	};

	const handleInputChange = (field: keyof Category, value: string) => {
		if (!editingValues) return;

		if (field === 'priceModifier') {
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
						<TableHead>Price Modifier</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{categoriesList.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={4}
								className='text-center py-4'>
								No categories found
							</TableCell>
						</TableRow>
					) : (
						categoriesList.map((category) => (
							<TableRow key={category.id}>
								<TableCell className='font-medium'>{category.id}</TableCell>
								<TableCell>
									{editingId === category.id ? (
										<Input
											value={editingValues?.name}
											onChange={(e) =>
												handleInputChange('name', e.target.value)
											}
											className='max-w-[200px]'
										/>
									) : (
										category.name
									)}
								</TableCell>
								<TableCell>
									{editingId === category.id ? (
										<div className='flex items-center'>
											<Input
												type='number'
												value={editingValues?.priceModifier}
												onChange={(e) =>
													handleInputChange('priceModifier', e.target.value)
												}
												className='max-w-[100px]'
												step='0.05'
												min='0.1'
												max='5'
											/>
											<span className='ml-2'>× base price</span>
										</div>
									) : (
										`${
											typeof category.priceModifier === 'string'
												? parseFloat(category.priceModifier).toFixed(2)
												: category.priceModifier.toFixed(2)
										}× base price`
									)}
								</TableCell>
								<TableCell className='text-right'>
									{editingId === category.id ? (
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
												onClick={() => handleEdit(category)}>
												<Pencil className='h-4 w-4' />
											</Button>
											<Button
												variant='destructive'
												size='icon'
												onClick={() => handleDelete(category.id)}>
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
