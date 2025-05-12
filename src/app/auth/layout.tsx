// import { auth } from "@/auth";
// import { redirect } from "next/navigation";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// const session = await auth();
	// if (session) redirect("/profile");

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-sm'>
				{children}
			</div>
		</div>
	);
}
