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
import { Edit2, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
	id: string;
	name: string;
	priceModifier: number;
}

interface SubjectCategoriesTableProps {
	categories: Category[];
}

export default function SubjectCategoriesTable({
	categories: initialCategories,
}: SubjectCategoriesTableProps) {
	const [categories, setCategories] = useState(initialCategories);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editedName, setEditedName] = useState('');
	const [editedModifier, setEditedModifier] = useState(0);

	const handleEdit = (category: Category) => {
		setEditingId(category.id);
		setEditedName(category.name);
		setEditedModifier(category.priceModifier);
	};

	const handleCancel = () => {
		setEditingId(null);
	};

	const handleSave = async (id: string) => {
		try {
			// Call API to update the category
			const response = await fetch(`/api/services/categories/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: editedName,
					priceModifier: editedModifier,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update category');
			}

			// Update local state
			setCategories(
				categories.map((cat) =>
					cat.id === id
						? { ...cat, name: editedName, priceModifier: editedModifier }
						: cat,
				),
			);

			setEditingId(null);
			toast.success('Category updated successfully');
		} catch (error) {
			toast.error('Error updating category');
			console.error('Error updating category:', error);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this category?')) {
			return;
		}

		try {
			// Call API to delete the category
			const response = await fetch(`/api/services/categories/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete category');
			}

			// Update local state
			setCategories(categories.filter((cat) => cat.id !== id));
			toast.success('Category deleted successfully');
		} catch (error) {
			toast.error('Error deleting category');
			console.error('Error deleting category:', error);
		}
	};

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Subject Category</TableHead>
						<TableHead>Price Modifier</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{categories.map((category) => (
						<TableRow key={category.id}>
							<TableCell>
								{editingId === category.id ? (
									<Input
										value={editedName}
										onChange={(e) => setEditedName(e.target.value)}
										className='max-w-xs'
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
											value={editedModifier}
											onChange={(e) =>
												setEditedModifier(Number(e.target.value))
											}
											step='0.1'
											min='0.1'
											max='5'
											className='w-24'
										/>
										<span className='ml-2'>×</span>
									</div>
								) : (
									<span>{category.priceModifier}×</span>
								)}
							</TableCell>
							<TableCell className='text-right'>
								{editingId === category.id ? (
									<div className='flex justify-end space-x-2'>
										<Button
											onClick={() => handleSave(category.id)}
											size='sm'
											variant='outline'>
											<Save className='h-4 w-4 mr-1' />
											Save
										</Button>
										<Button
											onClick={handleCancel}
											size='sm'
											variant='outline'>
											<X className='h-4 w-4 mr-1' />
											Cancel
										</Button>
									</div>
								) : (
									<div className='flex justify-end space-x-2'>
										<Button
											onClick={() => handleEdit(category)}
											size='sm'
											variant='outline'>
											<Edit2 className='h-4 w-4 mr-1' />
											Edit
										</Button>
										<Button
											onClick={() => handleDelete(category.id)}
											size='sm'
											variant='outline'
											className='text-destructive'>
											<Trash2 className='h-4 w-4 mr-1' />
											Delete
										</Button>
									</div>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
