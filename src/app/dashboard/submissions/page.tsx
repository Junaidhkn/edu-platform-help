"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Pagination } from "@/components/ui/pagination";
import { format } from 'date-fns';

export default function SubmissionsPage() {
	const [submissions, setSubmissions] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedTab, setSelectedTab] = useState('pending');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [feedback, setFeedback] = useState('');
	const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		fetchSubmissions();
	}, [selectedTab, currentPage]);

	const fetchSubmissions = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/admin/submissions?status=${selectedTab}&page=${currentPage}`);
			if (!response.ok) throw new Error('Failed to fetch submissions');
			
			const data = await response.json();
			setSubmissions(data.submissions);
			setTotalPages(data.totalPages);
		} catch (error) {
			console.error('Error fetching submissions:', error);
			toast({
				title: "Error",
				description: "Failed to load submissions",
				variant: "destructive"
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateSubmission = async (submissionId: string, status: 'approved' | 'rejected') => {
		if (status === 'rejected' && !feedback.trim()) {
			toast({
				title: "Error",
				description: "Please provide feedback when rejecting a submission",
				variant: "destructive"
			});
			return;
		}
		
		setIsProcessing(true);
		try {
			const response = await fetch(`/api/admin/submissions/${submissionId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					status,
					adminFeedback: feedback.trim() || null 
				})
			});
			
			if (!response.ok) throw new Error(`Failed to ${status} submission`);
			
			toast({
				title: "Success",
				description: status === 'approved' 
					? "Submission approved and delivered to user" 
					: "Submission rejected and sent back to freelancer"
			});
			
			// Refresh submissions
			fetchSubmissions();
		} catch (error) {
			toast({
				title: "Error",
				description: `Failed to ${status} submission`,
				variant: "destructive"
			});
		} finally {
			setIsProcessing(false);
			setSelectedSubmission(null);
			setFeedback('');
		}
	};
	
	return (
		<div className="container mx-auto py-10">
			<h1 className="text-2xl font-bold mb-6">Freelancer Submissions</h1>
			
			<Tabs defaultValue="pending" value={selectedTab} onValueChange={setSelectedTab}>
				<TabsList className="mb-6">
					<TabsTrigger value="pending">Pending Review</TabsTrigger>
					<TabsTrigger value="approved">Approved</TabsTrigger>
					<TabsTrigger value="rejected">Rejected</TabsTrigger>
				</TabsList>
				
				<TabsContent value={selectedTab} className="space-y-6">
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Loader2 className="w-8 h-8 animate-spin" />
						</div>
					) : submissions.length > 0 ? (
						<>
							{submissions.map((submission) => (
								<Card key={submission.id} className="overflow-hidden">
									<CardHeader className="bg-muted/50">
										<div className="flex justify-between items-start">
											<div>
												<CardTitle>Order #{submission.orderId?.slice(-6) || 'Unknown'}</CardTitle>
												<CardDescription>
													Submitted on {format(new Date(submission.createdAt), 'PPP')}
												</CardDescription>
											</div>
											<Badge className={
												submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
												submission.status === 'approved' ? 'bg-green-100 text-green-800' :
												'bg-red-100 text-red-800'
											}>
												{submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
											</Badge>
										</div>
									</CardHeader>
									
									<CardContent className="py-4 space-y-4">
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarFallback>
													{submission.freelancer?.firstName?.[0] || 'F'}
													{submission.freelancer?.lastName?.[0] || 'L'}
												</AvatarFallback>
												{submission.freelancer?.imageURI && (
													<AvatarImage src={submission.freelancer.imageURI} />
												)}
											</Avatar>
											<div>
												<p className="font-medium">
													{submission.freelancer?.firstName} {submission.freelancer?.lastName}
												</p>
												<p className="text-sm text-muted-foreground">
													{submission.freelancer?.email}
												</p>
											</div>
										</div>

										{submission.comment && (
											<div>
												<h3 className="text-sm font-medium text-muted-foreground mb-1">Freelancer Comment</h3>
												<p className="text-sm whitespace-pre-wrap">{submission.comment}</p>
											</div>
										)}
										
		<div>
											<h3 className="text-sm font-medium text-muted-foreground mb-1">Submitted Files</h3>
											<div className="flex flex-wrap gap-2">
												{JSON.parse(submission.fileUrls).map((url: string, index: number) => (
													<a 
														key={index}
														href={url}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center px-3 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
													>
														<Download className="h-4 w-4 mr-1" />
														File {index + 1}
													</a>
												))}
											</div>
										</div>
										
										{submission.status !== 'pending' && submission.adminFeedback && (
											<div className="mt-4 pt-4 border-t">
												<h3 className="text-sm font-medium text-muted-foreground mb-1">Admin Feedback</h3>
												<p className="text-sm">{submission.adminFeedback}</p>
											</div>
										)}
									</CardContent>
									
									{submission.status === 'pending' && (
										<CardFooter className="border-t bg-muted/20 flex justify-between">
											<Link href={`/dashboard/orders/${submission.orderId}`}>
												<Button variant="outline" size="sm">
													<Eye className="h-4 w-4 mr-1" />
													View Order
												</Button>
											</Link>
											
											<div className="flex gap-2">
												<Dialog>
													<DialogTrigger asChild>
														<Button
															variant="destructive"
															size="sm"
															onClick={() => setSelectedSubmission(submission.id)}
														>
															<XCircle className="h-4 w-4 mr-1" />
															Reject
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Reject Submission</DialogTitle>
															<DialogDescription>
																Please provide feedback for the freelancer explaining why the submission is being rejected.
															</DialogDescription>
														</DialogHeader>
														<Textarea
															className="min-h-[120px]"
															placeholder="Enter feedback for the freelancer..."
															value={feedback}
															onChange={(e) => setFeedback(e.target.value)}
														/>
														<DialogFooter>
															<Button
																variant="outline"
																onClick={() => {
																	setSelectedSubmission(null);
																	setFeedback('');
																}}
																disabled={isProcessing}
															>
																Cancel
															</Button>
															<Button
																variant="destructive"
																onClick={() => selectedSubmission && handleUpdateSubmission(selectedSubmission, 'rejected')}
																disabled={isProcessing || !feedback.trim()}
															>
																{isProcessing ? 
																	<><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Processing...</> : 
																	'Reject Submission'}
															</Button>
														</DialogFooter>
													</DialogContent>
												</Dialog>
												
												<Dialog>
													<DialogTrigger asChild>
														<Button
															variant="default"
															size="sm"
															onClick={() => setSelectedSubmission(submission.id)}
														>
															<CheckCircle className="h-4 w-4 mr-1" />
															Approve
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Approve Submission</DialogTitle>
															<DialogDescription>
																This will deliver the completed work to the customer. You can add optional feedback below.
															</DialogDescription>
														</DialogHeader>
														<Textarea
															className="min-h-[120px]"
															placeholder="Enter optional feedback..."
															value={feedback}
															onChange={(e) => setFeedback(e.target.value)}
														/>
														<DialogFooter>
															<Button
																variant="outline"
																onClick={() => {
																	setSelectedSubmission(null);
																	setFeedback('');
																}}
																disabled={isProcessing}
															>
																Cancel
															</Button>
															<Button
																variant="default"
																onClick={() => selectedSubmission && handleUpdateSubmission(selectedSubmission, 'approved')}
																disabled={isProcessing}
															>
																{isProcessing ? 
																	<><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Processing...</> : 
																	'Approve & Deliver'}
															</Button>
														</DialogFooter>
													</DialogContent>
												</Dialog>
											</div>
										</CardFooter>
									)}
								</Card>
							))}
							
							{totalPages > 1 && (
								<Pagination 
									currentPage={currentPage} 
									totalPages={totalPages} 
									onPageChange={setCurrentPage} 
								/>
							)}
						</>
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center h-64">
								<p className="text-muted-foreground mb-2">No {selectedTab} submissions found</p>
								{selectedTab === 'pending' && (
									<p className="text-sm text-muted-foreground">Submissions from freelancers will appear here for review</p>
								)}
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
