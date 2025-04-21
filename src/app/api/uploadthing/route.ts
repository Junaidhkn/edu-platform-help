import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import type { OurFileRouter } from "./core";

import { generateReactHelpers } from "@uploadthing/react";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
	router: ourFileRouter,
});
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();