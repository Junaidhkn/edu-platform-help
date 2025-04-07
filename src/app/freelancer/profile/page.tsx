import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StarIcon } from 'lucide-react';
import db from '@/src/db';
import { freelancers } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export const metadata = {
  title: 'Freelancer Profile',
  description: 'View and manage your freelancer profile.',
};

export default async function FreelancerProfilePage() {
  const session = await auth();
  
  if (!session?.user || !(session.user as any).isFreelancer) {
    redirect('/auth/signin');
  }
  
  // Ensure user.id exists before querying
  if (!session.user.id) {
    redirect('/auth/signin');
  }
  
  // Fetch freelancer details
  const freelancer = await db.select()
    .from(freelancers)
    .where(eq(freelancers.id, session.user.id))
    .then(res => res[0]);
  
  if (!freelancer) {
    redirect('/auth/signin');
  }
  
  // Get initials for avatar
  const initials = `${freelancer.firstName.charAt(0)}${freelancer.lastName.charAt(0)}`;
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={freelancer.imageURI || undefined} alt={`${freelancer.firstName} ${freelancer.lastName}`} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{freelancer.firstName} {freelancer.lastName}</CardTitle>
              <CardDescription>Freelancer</CardDescription>
              <div className="flex justify-center mt-2">
                <Badge variant={freelancer.availabilityStatus === 'available' ? 'default' : 'secondary'}>
                  {freelancer.availabilityStatus === 'available' ? 'Available' : 'Busy'}
                </Badge>
              </div>
              {freelancer.rating && (
                <div className="flex items-center justify-center mt-2">
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{Number(freelancer.rating).toFixed(1)}</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Contact Information</h3>
                  <p className="text-sm text-muted-foreground">{freelancer.email}</p>
                  <p className="text-sm text-muted-foreground">{freelancer.phone}</p>
                </div>
                
                {freelancer.profileLink && (
                  <div>
                    <h3 className="text-sm font-medium">Profile Link</h3>
                    <a 
                      href={freelancer.profileLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {freelancer.profileLink}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.split(',').map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Profile Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {freelancer.profileDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 