import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
	router: ourFileRouter,
	config: {
		// Add debugging for upload issues
		logLevel: "Debug",
		// Force HTTPS for all requests
		// callbackUrl: "https://edu-help-assign.lcl.host:44365/api/uploadthing",
	},
});