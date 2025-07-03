'use client';

import { useRef } from 'react';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

function TawkWidget() {
	const tawkMessengerRef = useRef();
	return (
		<div className='App'>
			<TawkMessengerReact
				propertyId='686300ec319b9019082a5ca4'
				widgetId='1iv1bn7ir'
				ref={tawkMessengerRef}
			/>
		</div>
	);
}
export default TawkWidget;
