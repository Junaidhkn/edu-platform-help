import { Button } from '@/src/components/ui/button';

export type OrderFilterType =
	| 'recent'
	| 'deadline'
	| 'accepted'
	| 'pending'
	| 'all';

interface OrderFiltersProps {
	activeFilter: OrderFilterType;
	onFilterChange: (filter: OrderFilterType) => void;
}

export function OrderFilters({
	activeFilter,
	onFilterChange,
}: OrderFiltersProps) {
	const filters: { value: OrderFilterType; label: string }[] = [
		{ value: 'recent', label: 'Recent Orders' },
		{ value: 'deadline', label: 'By Deadline' },
		{ value: 'accepted', label: 'Accepted' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'all', label: 'All Orders' },
	];

	return (
		<div className='flex flex-wrap gap-2 mb-4'>
			{filters.map((filter) => (
				<Button
					key={filter.value}
					variant={activeFilter === filter.value ? 'default' : 'outline'}
					size='sm'
					onClick={() => onFilterChange(filter.value)}>
					{filter.label}
				</Button>
			))}
		</div>
	);
}
