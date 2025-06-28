import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MusicIcon } from 'lucide-react';

interface MatchUser {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface MatchCategory {
  title: string;
  users: MatchUser[];
}

interface MusicMatchesProps {
  categories: MatchCategory[];
}

const MusicMatches: React.FC<MusicMatchesProps> = ({ categories }) => {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Music Matches</CardTitle>
      </CardHeader>
      
      <CardContent className="p-3">
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={category.title}>
              <h3 className="font-semibold text-sm text-gray-500 mb-2">{category.title}</h3>
              
              <div className="space-y-2">
                {category.users.map((user) => (
                  <Link 
                    key={user.id} 
                    href={`/user/${user.id}`} 
                    className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 relative rounded-full overflow-hidden flex-shrink-0 border">
                      <Image 
                        src={user.image} 
                        alt={user.name} 
                        width={40} 
                        height={40} 
                        className="object-cover" 
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-sm">{user.name}</h4>
                      <p className="text-xs text-gray-500">{user.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              
              {index < categories.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full text-sm" 
              size="sm"
              asChild
            >
              <Link href="/matches">
                <MusicIcon className="h-4 w-4 mr-2" />
                Find More Matches
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample data
export const sampleMatchCategories = [
  {
    title: "Today's Picks",
    users: [
      {
        id: '1',
        name: 'Lila Thompson',
        description: 'Discovering new beats',
        image: '/images/albumcover1.jpg'
      },
      {
        id: '2',
        name: 'Ethan Reynolds',
        description: 'Jamming to favourite tunes',
        image: '/images/albumcover2.jpg'
      }
    ]
  },
  {
    title: "New Releases",
    users: [
      {
        id: '3',
        name: 'Sophie Walker',
        description: 'Creating a new mix',
        image: '/images/albumcover3.jpg'
      }
    ]
  },
  {
    title: "Top Charts",
    users: [
      {
        id: '4',
        name: 'Oliver Scott',
        description: 'Exploring indie tracks',
        image: '/images/albumcover4.jpg'
      }
    ]
  }
];

// Default export with sample data
const MusicMatchesWithData: React.FC = () => {
  return <MusicMatches categories={sampleMatchCategories} />;
};

export default MusicMatchesWithData;