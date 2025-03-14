'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { service } from '@/constants/data';
import {
	CATEGORY_OPTIONS,
	useserviceTableFilters,
} from './use-service-table-filters';
import { columns } from './columns';

export default function serviceTable({
	data,
	totalData,
}: {
	data: service[];
	totalData: number;
}) {
	const {
		categoriesFilter,
		setCategoriesFilter,
		isAnyFilterActive,
		resetFilters,
		searchQuery,
		setPage,
		setSearchQuery,
	} = useserviceTableFilters();

	return (
		<div className='space-y-4 '>
			<div className='flex flex-wrap items-center gap-4'>
				<DataTableSearch
					searchKey='name'
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					setPage={setPage}
				/>
				<DataTableFilterBox
					filterKey='categories'
					title='Categories'
					options={CATEGORY_OPTIONS}
					setFilterValue={setCategoriesFilter}
					filterValue={categoriesFilter}
				/>
				<DataTableResetFilter
					isFilterActive={isAnyFilterActive}
					onReset={resetFilters}
				/>
			</div>
			<DataTable
				columns={columns}
				data={data}
				totalItems={totalData}
			/>
		</div>
	);
}
