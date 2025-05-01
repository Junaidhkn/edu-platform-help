import type { OurFileRouter } from "@/src/app/api/uploadthing/core";
import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from "@uploadthing/react";

// // Create explicit client configuration with HTTPS
// export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>({
//   url: "https://edu-help-assign.lcl.host:44365/api/uploadthing",
// });

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
  