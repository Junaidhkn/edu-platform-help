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
import { formatCurrency } from '@/src/lib/utils';

interface AssignmentType {
	id: string;
	name: string;
	priceAdjustment: number;
}

interface AssignmentTypesTableProps {
	assignmentTypes: AssignmentType[];
}

export default function AssignmentTypesTable({
	assignmentTypes: initialTypes,
}: AssignmentTypesTableProps) {
	const [types, setTypes] = useState(initialTypes);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editedName, setEditedName] = useState('');
	const [editedAdjustment, setEditedAdjustment] = useState(0);

	const handleEdit = (type: AssignmentType) => {
		setEditingId(type.id);
		setEditedName(type.name);
		setEditedAdjustment(type.priceAdjustment);
	};

	const handleCancel = () => {
		setEditingId(null);
	};

	const handleSave = async (id: string) => {
		try {
			// Call API to update the assignment type
			const response = await fetch(`/api/services/assignment-types/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: editedName,
					priceAdjustment: editedAdjustment,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update assignment type');
			}

			// Update local state
			setTypes(
				types.map((type) =>
					type.id === id
						? { ...type, name: editedName, priceAdjustment: editedAdjustment }
						: type,
				),
			);

			setEditingId(null);
			toast.success('Assignment type updated successfully');
		} catch (error) {
			toast.error('Error updating assignment type');
			console.error('Error updating assignment type:', error);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this assignment type?')) {
			return;
		}

		try {
			// Call API to delete the assignment type
			const response = await fetch(`/api/services/assignment-types/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete assignment type');
			}

			// Update local state
			setTypes(types.filter((type) => type.id !== id));
			toast.success('Assignment type deleted successfully');
		} catch (error) {
			toast.error('Error deleting assignment type');
			console.error('Error deleting assignment type:', error);
		}
	};

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Assignment Type</TableHead>
						<TableHead>Price Adjustment</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{types.map((type) => (
						<TableRow key={type.id}>
							<TableCell>
								{editingId === type.id ? (
									<Input
										value={editedName}
										onChange={(e) => setEditedName(e.target.value)}
										className='max-w-xs'
									/>
								) : (
									type.name
								)}
							</TableCell>
							<TableCell>
								{editingId === type.id ? (
									<Input
										type='number'
										value={editedAdjustment}
										onChange={(e) =>
											setEditedAdjustment(Number(e.target.value))
										}
										step='1'
										min='0'
										className='w-24'
									/>
								) : (
									formatCurrency(type.priceAdjustment)
								)}
							</TableCell>
							<TableCell className='text-right'>
								{editingId === type.id ? (
									<div className='flex justify-end space-x-2'>
										<Button
											onClick={() => handleSave(type.id)}
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
											onClick={() => handleEdit(type)}
											size='sm'
											variant='outline'>
											<Edit2 className='h-4 w-4 mr-1' />
											Edit
										</Button>
										<Button
											onClick={() => handleDelete(type.id)}
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
