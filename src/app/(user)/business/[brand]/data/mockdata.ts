import { BrandInfo, Post, Review } from "../types/brands";
import { SingleCategoryShortsProps } from "../components/postSection";

export const brandInfo: BrandInfo = {
  name: "Arata",
  logo: "https://cdn.shopify.com/s/files/1/0082/7300/2573/files/Asset_1.svg?v=1734691219",
  isVerified: true,
  rating: 4.5,
  rank: 3,
};

export const reviews: Review[] = [
  {
    id: "1",
    author: "Sarah J.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content: "Amazing natural products! The hair gel is my favorite.",
    date: "2023-12-25",
  },
  {
    id: "2",
    author: "Mike R.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    content: "Great skincare line, seeing real results!",
    date: "2023-12-24",
  },
  // Add more reviews as needed
];

export const posts: Post[] = [
  {
    id: "1",
    image: "/placeholder.svg?height=300&width=300",
    title: "New Hair Care Collection",
    description: "Introducing our latest natural hair care products...",
    likes: 1200,
    date: "2023-12-26",
  },
  {
    id: "2",
    image: "/placeholder.svg?height=300&width=300",
    title: "Skincare Routine Guide",
    description: "Learn how to use our products for the best results...",
    likes: 890,
    date: "2023-12-25",
  },
  // Add more posts as needed
];

export const dummyCategoryData: SingleCategoryShortsProps["categoryData"] = {
  message: "Success.",
  data: {
    count: 3,
    data: [
      {
        _id: "6732e97c1650e3737bff5dcf",
        userDetails: {
          userId: "675021a83e35ef556024e106",
          firstName: "Madhan",
          lastName: "S",
          userName: "Madhan",
        },
        videoId: "6732e97c1650e3737bff5dcf",
        hashtags: [],
        title:
          "Save and share this reel if Varkala is on your bucket list! 🌊✨ ",
        uploaderRating: {
          "1": {
            value: "Testing",
            rating: 4,
          },
        },
        desc: "Dive into the detailed comparison of the New Himalayan 452 and the Himalayan 411. Discover the key differences in design, performance, and features that set these two models apart. 411 vs 452. New Himalayan is not sharing any part with previous one, so it is more than engine, it’s the overall engineering that has improved at @royalenfield.\n#Himalayan411 #Himalayan452 #RoyalEnfield #BikeComparison #NewVsOld #HimalayanBattle #AdventureBike #BikeLife #TwoWheels #RideOrDie #BikePhotography #MotorcycleLifestyle #RiderCommunity\n@avinash @sonu @gaganchaudhry @fasbeam",
        cdnVideoPath:
          "https://d2c97t3k1om0pj.cloudfront.net/672b36e9b51c5ffd0789c6cd/mp4-672b36e9b51c5ffd0789c6cd/ef4dbf7e59b14486a83fa414df4612c3.mp4",
        cdnThumbPath: [
          "https://d2c97t3k1om0pj.cloudfront.net/672b36e9b51c5ffd0789c6cd/thumbs-672b36e9b51c5ffd0789c6cd/ef4dbf7e59b14486a83fa414df4612c3-00001.png",
          "https://d1scqik6tlhrr8.cloudfront.net/video-thumb/672b36e9b51c5ffd0789c6cd/6732e97c1650e3737bff5dcf/IMG/original/Screenshot2024-11-07145155.png",
        ],
        totalViewCount: 0,
        totalShareCount: 0,
        totalLikes: 0,
        totalComments: 0,
        isCommentingAllowed: true,
        avgRating: 0,
        status: "Unpublished",
        uploadedAt: "2024-12-17T11:01:57.697Z",
        videoLocation: {
          type: "Point",
          coordinates: [72.1005154, 20.7567554],
        },
        locationName: "",
        isSponsored: false,
        isAdvertisement: false,
      },
      {
        _id: "6732e6471650e3737bff5af0",
        userDetails: {
          userId: "675021a83e35ef556024e106",
          firstName: "Madhan",
          lastName: "S",
          userName: "Madhan",
        },
        videoId: "6732e6471650e3737bff5af0",
        hashtags: [],
        title: "Places to visit in Karnataka for this monsoo",
        uploaderRating: {
          "1": {
            value: "Testing",
            rating: 4,
          },
        },
        desc: "Testing2",
        cdnVideoPath:
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/mp4-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900.mp4",
        cdnThumbPath: [
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/thumbs-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900-00001.png",
          "https://d1scqik6tlhrr8.cloudfront.net/video-thumb/672b5b8389dc54d1f4983c38/6732e1981650e3737bff586d/IMG/original/13.png",
        ],
        totalViewCount: 1,
        totalShareCount: 0,
        totalLikes: 0,
        totalComments: 0,
        isCommentingAllowed: true,
        avgRating: 5,
        adminRejectionReason: "Testing",
        reasonToDelete: "Testing",
        status: "Rejected By Admin",
        uploadedAt: "2024-12-11T05:54:50.022Z",
        videoLocation: {
          type: "Point",
          coordinates: [72.1005154, 20.7567554],
        },
        locationName: "",
        isSponsored: false,
        isAdvertisement: false,
      },
      {
        _id: "6732e1981650e3737bff586d",
        userDetails: {
          userId: "675021a83e35ef556024e106",
          firstName: "Madhan",
          lastName: "S",
          userName: "Madhan",
        },
        videoId: "6732e1981650e3737bff586d",
        hashtags: ["Trending"],
        title: "Must have 5 Amazon Gadgets",
        uploaderRating: {
          value: "Testing1",
          rating: 4.5,
        },
        desc: "Testing1",
        cdnVideoPath:
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/mp4-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900.mp4",
        cdnThumbPath: [
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/thumbs-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900-00001.png",
          "https://d1scqik6tlhrr8.cloudfront.net/video-thumb/672b5b8389dc54d1f4983c38/6732e1981650e3737bff586d/IMG/original/13.png",
        ],
        totalViewCount: 4,
        totalShareCount: 0,
        totalLikes: 1,
        totalComments: 3,
        isCommentingAllowed: true,
        avgRating: 4.5,
        status: "Published",
        uploadedAt: "2024-12-08T06:29:10.310Z",
        videoLocation: {
          type: "Point",
          coordinates: [72.1005154, 20.7567554],
        },
        locationName: "",
        isSponsored: true,
        isAdvertisement: true,
        categoryId: "672a06401040012a1c0bd646",
      },
      {
        _id: "6732e97c1650e3737bff5dcf",
        userDetails: {
          userId: "675021a83e35ef556024e106",
          firstName: "Madhan",
          lastName: "S",
          userName: "Madhan",
        },
        videoId: "6732e97c1650e3737bff5dcf",
        hashtags: [],
        title:
          "Save and share this reel if Varkala is on your bucket list! 🌊✨ ",
        uploaderRating: {
          "1": {
            value: "Testing",
            rating: 4,
          },
        },
        desc: "Dive into the detailed comparison of the New Himalayan 452 and the Himalayan 411. Discover the key differences in design, performance, and features that set these two models apart. 411 vs 452. New Himalayan is not sharing any part with previous one, so it is more than engine, it’s the overall engineering that has improved at @royalenfield.\n#Himalayan411 #Himalayan452 #RoyalEnfield #BikeComparison #NewVsOld #HimalayanBattle #AdventureBike #BikeLife #TwoWheels #RideOrDie #BikePhotography #MotorcycleLifestyle #RiderCommunity\n@avinash @sonu @gaganchaudhry @fasbeam",
        cdnVideoPath:
          "https://d2c97t3k1om0pj.cloudfront.net/672b36e9b51c5ffd0789c6cd/mp4-672b36e9b51c5ffd0789c6cd/ef4dbf7e59b14486a83fa414df4612c3.mp4",
        cdnThumbPath: [
          "https://d2c97t3k1om0pj.cloudfront.net/672b36e9b51c5ffd0789c6cd/thumbs-672b36e9b51c5ffd0789c6cd/ef4dbf7e59b14486a83fa414df4612c3-00001.png",
          "https://d1scqik6tlhrr8.cloudfront.net/video-thumb/672b36e9b51c5ffd0789c6cd/6732e97c1650e3737bff5dcf/IMG/original/Screenshot2024-11-07145155.png",
        ],
        totalViewCount: 0,
        totalShareCount: 0,
        totalLikes: 0,
        totalComments: 0,
        isCommentingAllowed: true,
        avgRating: 0,
        status: "Unpublished",
        uploadedAt: "2024-12-17T11:01:57.697Z",
        videoLocation: {
          type: "Point",
          coordinates: [72.1005154, 20.7567554],
        },
        locationName: "",
        isSponsored: false,
        isAdvertisement: false,
      },
      {
        _id: "6732e6471650e3737bff5af0",
        userDetails: {
          userId: "675021a83e35ef556024e106",
          firstName: "Madhan",
          lastName: "S",
          userName: "Madhan",
        },
        videoId: "6732e6471650e3737bff5af0",
        hashtags: [],
        title: "Places to visit in Karnataka for this monsoo",
        uploaderRating: {
          "1": {
            value: "Testing",
            rating: 4,
          },
        },
        desc: "Testing2",
        cdnVideoPath:
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/mp4-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900.mp4",
        cdnThumbPath: [
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/thumbs-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900-00001.png",
          "https://d1scqik6tlhrr8.cloudfront.net/video-thumb/672b5b8389dc54d1f4983c38/6732e1981650e3737bff586d/IMG/original/13.png",
        ],
        totalViewCount: 1,
        totalShareCount: 0,
        totalLikes: 0,
        totalComments: 0,
        isCommentingAllowed: true,
        avgRating: 5,
        adminRejectionReason: "Testing",
        reasonToDelete: "Testing",
        status: "Rejected By Admin",
        uploadedAt: "2024-12-11T05:54:50.022Z",
        videoLocation: {
          type: "Point",
          coordinates: [72.1005154, 20.7567554],
        },
        locationName: "",
        isSponsored: false,
        isAdvertisement: false,
      },
      {
        _id: "6732e1981650e3737bff586d",
        userDetails: {
          userId: "675021a83e35ef556024e106",
          firstName: "Madhan",
          lastName: "S",
          userName: "Madhan",
        },
        videoId: "6732e1981650e3737bff586d",
        hashtags: ["Trending"],
        title: "Must have 5 Amazon Gadgets",
        uploaderRating: {
          value: "Testing1",
          rating: 4.5,
        },
        desc: "Testing1",
        cdnVideoPath:
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/mp4-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900.mp4",
        cdnThumbPath: [
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/thumbs-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900-00001.png",
          "https://d1scqik6tlhrr8.cloudfront.net/video-thumb/672b5b8389dc54d1f4983c38/6732e1981650e3737bff586d/IMG/original/13.png",
        ],
        totalViewCount: 4,
        totalShareCount: 0,
        totalLikes: 1,
        totalComments: 3,
        isCommentingAllowed: true,
        avgRating: 4.5,
        status: "Published",
        uploadedAt: "2024-12-08T06:29:10.310Z",
        videoLocation: {
          type: "Point",
          coordinates: [72.1005154, 20.7567554],
        },
        locationName: "",
        isSponsored: true,
        isAdvertisement: true,
        categoryId: "672a06401040012a1c0bd646",
      },
      {
        _id: "6732e97c1650e3737bff5dcf",
        userDetails: {
          userId: "675021a83e35ef556024e106",
          firstName: "Madhan",
          lastName: "S",
          userName: "Madhan",
        },
        videoId: "6732e97c1650e3737bff5dcf",
        hashtags: [],
        title:
          "Save and share this reel if Varkala is on your bucket list! 🌊✨ ",
        uploaderRating: {
          "1": {
            value: "Testing",
            rating: 4,
          },
        },
        desc: "Dive into the detailed comparison of the New Himalayan 452 and the Himalayan 411. Discover the key differences in design, performance, and features that set these two models apart. 411 vs 452. New Himalayan is not sharing any part with previous one, so it is more than engine, it’s the overall engineering that has improved at @royalenfield.\n#Himalayan411 #Himalayan452 #RoyalEnfield #BikeComparison #NewVsOld #HimalayanBattle #AdventureBike #BikeLife #TwoWheels #RideOrDie #BikePhotography #MotorcycleLifestyle #RiderCommunity\n@avinash @sonu @gaganchaudhry @fasbeam",
        cdnVideoPath:
          "https://d2c97t3k1om0pj.cloudfront.net/672b36e9b51c5ffd0789c6cd/mp4-672b36e9b51c5ffd0789c6cd/ef4dbf7e59b14486a83fa414df4612c3.mp4",
        cdnThumbPath: [
          "https://d2c97t3k1om0pj.cloudfront.net/672b36e9b51c5ffd0789c6cd/thumbs-672b36e9b51c5ffd0789c6cd/ef4dbf7e59b14486a83fa414df4612c3-00001.png",
          "https://d1scqik6tlhrr8.cloudfront.net/video-thumb/672b36e9b51c5ffd0789c6cd/6732e97c1650e3737bff5dcf/IMG/original/Screenshot2024-11-07145155.png",
        ],
        totalViewCount: 0,
        totalShareCount: 0,
        totalLikes: 0,
        totalComments: 0,
        isCommentingAllowed: true,
        avgRating: 0,
        status: "Unpublished",
        uploadedAt: "2024-12-17T11:01:57.697Z",
        videoLocation: {
          type: "Point",
          coordinates: [72.1005154, 20.7567554],
        },
        locationName: "",
        isSponsored: false,
        isAdvertisement: false,
      },
      {
        _id: "6732e6471650e3737bff5af0",
        userDetails: {
          userId: "675021a83e35ef556024e106",
          firstName: "Madhan",
          lastName: "S",
          userName: "Madhan",
        },
        videoId: "6732e6471650e3737bff5af0",
        hashtags: [],
        title: "Places to visit in Karnataka for this monsoo",
        uploaderRating: {
          "1": {
            value: "Testing",
            rating: 4,
          },
        },
        desc: "Testing2",
        cdnVideoPath:
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/mp4-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900.mp4",
        cdnThumbPath: [
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/thumbs-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900-00001.png",
          "https://d1scqik6tlhrr8.cloudfront.net/video-thumb/672b5b8389dc54d1f4983c38/6732e1981650e3737bff586d/IMG/original/13.png",
        ],
        totalViewCount: 1,
        totalShareCount: 0,
        totalLikes: 0,
        totalComments: 0,
        isCommentingAllowed: true,
        avgRating: 5,
        adminRejectionReason: "Testing",
        reasonToDelete: "Testing",
        status: "Rejected By Admin",
        uploadedAt: "2024-12-11T05:54:50.022Z",
        videoLocation: {
          type: "Point",
          coordinates: [72.1005154, 20.7567554],
        },
        locationName: "",
        isSponsored: false,
        isAdvertisement: false,
      },
      {
        _id: "6732e1981650e3737bff586d",
        userDetails: {
          userId: "675021a83e35ef556024e106",
          firstName: "Madhan",
          lastName: "S",
          userName: "Madhan",
        },
        videoId: "6732e1981650e3737bff586d",
        hashtags: ["Trending"],
        title: "Must have 5 Amazon Gadgets",
        uploaderRating: {
          value: "Testing1",
          rating: 4.5,
        },
        desc: "Testing1",
        cdnVideoPath:
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/mp4-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900.mp4",
        cdnThumbPath: [
          "https://d2c97t3k1om0pj.cloudfront.net/672b5b8389dc54d1f4983c38/thumbs-672b5b8389dc54d1f4983c38/9ea09cb7098047d4b69eb7354794e900-00001.png",
          "https://d1scqik6tlhrr8.cloudfront.net/video-thumb/672b5b8389dc54d1f4983c38/6732e1981650e3737bff586d/IMG/original/13.png",
        ],
        totalViewCount: 4,
        totalShareCount: 0,
        totalLikes: 1,
        totalComments: 3,
        isCommentingAllowed: true,
        avgRating: 4.5,
        status: "Published",
        uploadedAt: "2024-12-08T06:29:10.310Z",
        videoLocation: {
          type: "Point",
          coordinates: [72.1005154, 20.7567554],
        },
        locationName: "",
        isSponsored: true,
        isAdvertisement: true,
        categoryId: "672a06401040012a1c0bd646",
      },
    ],
  },
};
