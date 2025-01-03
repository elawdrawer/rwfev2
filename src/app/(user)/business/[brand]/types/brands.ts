export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
}

export interface Post {
  id: string;
  image: string;
  title: string;
  description: string;
  likes: number;
  date: string;
}

export interface BrandInfo {
  name: string;
  logo: string;
  isVerified: boolean;
  rating: number;
  rank: number;
}
