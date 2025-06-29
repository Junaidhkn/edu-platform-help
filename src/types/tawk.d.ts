declare module '@tawk.to/tawk-messenger-react' {
	export interface TawkMessengerReactProps {
		propertyId?: string;
		widgetId?: string;
		customStyle?: object;
		onLoad?: () => void;
		onError?: (error: any) => void;
	}

	const TawkMessengerReact: React.FC<TawkMessengerReactProps>;
	export default TawkMessengerReact;
}
