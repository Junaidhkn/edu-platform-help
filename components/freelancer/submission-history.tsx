'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Define the submission type that matches our database schema
interface Submission {
  id: string;
  createdAt: string | Date;
  fileUrls: string | string[];
  comment?: string | null;
  status: string;
  adminFeedback?: string | null;
  orderId?: string;
  freelancerId?: string;
  reviewedBy?: string | null;
  isDelivered?: boolean | null;
  deliveredAt?: string | null;
  updatedAt?: string | Date;
}

interface SubmissionHistoryProps {
  submissions: Submission[];
}

export default function SubmissionHistory({ submissions }: SubmissionHistoryProps) {
  if (!submissions.length) {
    return (
      <div className="p-6 text-center bg-muted rounded-md">
        <p>No submissions yet.</p>
      </div>
    );
  }

  function getStatusBadgeStyle(status: string) {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    }
  }

  // Parse fileUrls from JSON string if needed
  const parseFileUrls = (fileUrls: string | string[]): string[] => {
    if (Array.isArray(fileUrls)) return fileUrls;
    try {
      return JSON.parse(fileUrls);
    } catch (e) {
      // If it's a single URL string or comma-separated string
      return fileUrls.split(',').map(url => url.trim());
    }
  };

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <div key={submission.id} className="border rounded-md overflow-hidden">
          <div className="bg-muted p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Submission #{submission.id.slice(-6)}</h3>
                <Badge variant="outline" className={getStatusBadgeStyle(submission.status)}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex gap-2">
              {/* Handle multiple file URLs properly */}
              {parseFileUrls(submission.fileUrls).length > 0 && (
                <div className="flex flex-col gap-2">
                  {parseFileUrls(submission.fileUrls).map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a 
                          href={url} 
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          File {index + 1}
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4">
            {submission.comment && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-1">Your Comments</h4>
                <p className="text-sm whitespace-pre-line">{submission.comment}</p>
              </div>
            )}
            
            {submission.status === 'rejected' && submission.adminFeedback && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                <h4 className="text-sm font-semibold mb-1 text-red-800">Admin Feedback</h4>
                <p className="text-sm text-red-700 whitespace-pre-line">{submission.adminFeedback}</p>
              </div>
            )}
            
            {submission.status === 'approved' && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                <p className="text-sm text-green-700">
                  This submission has been approved. The order is now complete.
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 