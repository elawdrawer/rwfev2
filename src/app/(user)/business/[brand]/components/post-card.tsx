import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Heart } from 'lucide-react'
import { Post } from '../types/brands'


export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          <p className="text-gray-600">{post.description}</p>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 border-t flex justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-500" />
          <span className="text-sm text-gray-600">{post.likes}</span>
        </div>
        <div className="text-sm text-gray-400">{post.date}</div>
      </CardFooter>
    </Card>
  )
}

