'use client';

import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import { useEffect, useState } from 'react';

const TawkChat = () => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// Ensure we're in the browser environment
		if (typeof window !== 'undefined') {
			setIsLoaded(true);
		}
	}, []);

	if (!isLoaded) return null;

	const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
	const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

	if (!propertyId || !widgetId) {
		console.error(
			'Tawk.to configuration is missing. Please check your environment variables.',
		);
		return null;
	}

	return (
		<TawkMessengerReact
			propertyId={propertyId}
			widgetId={widgetId}
			onLoad={() => {
				console.log('Tawk.to widget loaded successfully');
			}}
			onError={(error: any) => {
				console.error('Error loading Tawk.to widget:', error);
			}}
		/>
	);
};

export default TawkChat;
