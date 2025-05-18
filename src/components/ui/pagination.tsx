import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	// Don't render pagination if there's only one page
	if (totalPages <= 1) {
		return null;
	}

	const pageNumbers = [];
	const maxPageButtons = 5; // Maximum number of page buttons to show

	let startPage: number;
	let endPage: number;

	if (totalPages <= maxPageButtons) {
		// Show all pages if there are less than the maximum
		startPage = 1;
		endPage = totalPages;
	} else {
		// Calculate start and end page based on current page
		if (currentPage <= Math.ceil(maxPageButtons / 2)) {
			startPage = 1;
			endPage = maxPageButtons;
		} else if (currentPage + Math.floor(maxPageButtons / 2) >= totalPages) {
			startPage = totalPages - maxPageButtons + 1;
			endPage = totalPages;
		} else {
			startPage = currentPage - Math.floor(maxPageButtons / 2);
			endPage = currentPage + Math.floor(maxPageButtons / 2);
		}
	}

	// Create page buttons
	for (let i = startPage; i <= endPage; i++) {
		pageNumbers.push(i);
	}

	return (
		<div className='flex items-center justify-center mt-6'>
			<div className='flex items-center gap-1'>
				<Button
					variant='outline'
					size='icon'
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					aria-label='Previous page'>
					<ChevronLeft className='h-4 w-4' />
				</Button>

				{startPage > 1 && (
					<>
						<Button
							variant={currentPage === 1 ? 'default' : 'outline'}
							size='sm'
							onClick={() => onPageChange(1)}
							className='h-8 w-8 p-0'>
							1
						</Button>
						{startPage > 2 && (
							<span className='mx-1 text-muted-foreground'>...</span>
						)}
					</>
				)}

				{pageNumbers.map((page) => (
					<Button
						key={page}
						variant={currentPage === page ? 'default' : 'outline'}
						size='sm'
						onClick={() => onPageChange(page)}
						className='h-8 w-8 p-0'>
						{page}
					</Button>
				))}

				{endPage < totalPages && (
					<>
						{endPage < totalPages - 1 && (
							<span className='mx-1 text-muted-foreground'>...</span>
						)}
						<Button
							variant={currentPage === totalPages ? 'default' : 'outline'}
							size='sm'
							onClick={() => onPageChange(totalPages)}
							className='h-8 w-8 p-0'>
							{totalPages}
						</Button>
					</>
				)}

				<Button
					variant='outline'
					size='icon'
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					aria-label='Next page'>
					<ChevronRight className='h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
