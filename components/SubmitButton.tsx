'use client';

import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
	label: string;
	btnProps?: {
		[x: string]: string;
	};
}

const Submit = ({ label, ...btnProps }: SubmitButtonProps) => {
	const { pending } = useFormStatus();

	return (
		<Button
			{...btnProps}
			type='submit'
			isLoading={pending}>
			{label}
		</Button>
	);
};

export default Submit;
