// Mock data for destinations
export interface Destination {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  description: string;
  price: number;
  images: string[];
  guide?: string;
  guideImage?: string;
  amenities: {
    hotel: boolean;
    flight: boolean;
    transport: boolean;
    food: boolean;
  };
}

export const categories = [
  {
    id: "1",
    name: "Laya",
    image:
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=200",
  },
  {
    id: "2",
    name: "Calatagan",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=200",
  },
  {
    id: "3",
    name: "Matabungkay",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=200",
  },
  {
    id: "4",
    name: "Taal",
    image:
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=200",
  },
  {
    id: "5",
    name: "Lobo",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=200",
  },
];

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Merapi Mount",
    location: "Sleman city",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=500",
    description:
      "Mount Merapi is an active stratovolcano located on the border between the province of Central Java and the Special Region of Yogyakarta. It is the most active volcano in Indonesia and has erupted regularly since 1548.",
    price: 249,
    images: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=500",
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=500",
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=500",
    ],
    guide: "Pak Joko",
    guideImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
    amenities: {
      hotel: true,
      flight: true,
      transport: true,
      food: true,
    },
  },
  {
    id: "2",
    name: "Baron Beach",
    location: "Gunung Kidul, Indonesia",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=500",
    description:
      "Baron Beach is located in Gunung Kidul Regency DIY. However, tourists must head to Yogyakarta City first, especially by airplane. The flight even takes only 1 hour and 10 minutes, so it would be a comfortable trip.",
    price: 313,
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=500",
      "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?q=80&w=500",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=500",
    ],
    guide: "Pak Joko",
    guideImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
    amenities: {
      hotel: true,
      flight: true,
      transport: true,
      food: true,
    },
  },
  {
    id: "3",
    name: "Borobudur Temple",
    location: "Magelang, Indonesia",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=500",
    description:
      "Borobudur is a 9th-century Mahayana Buddhist temple in Central Java, Indonesia. It is the world's largest Buddhist temple and a UNESCO World Heritage site.",
    price: 275,
    images: [
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=500",
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=500",
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=500",
    ],
    guide: "Ibu Sari",
    guideImage:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100",
    amenities: {
      hotel: true,
      flight: false,
      transport: true,
      food: true,
    },
  },
  {
    id: "4",
    name: "Uluwatu Temple",
    location: "Bali, Indonesia",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=500",
    description:
      "Uluwatu Temple is a Balinese Hindu sea temple located in Uluwatu. The temple is regarded as one of the six spiritual pillars of Bali and is renowned for its magnificent location, perched on top of a steep cliff.",
    price: 289,
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=500",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=500",
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?q=80&w=500",
    ],
    guide: "Pak Wayan",
    guideImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
    amenities: {
      hotel: true,
      flight: true,
      transport: true,
      food: true,
    },
  },
];
