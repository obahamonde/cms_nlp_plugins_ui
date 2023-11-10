interface MediumUser {
  id: string;
  username: string;
  name: string;
  url: string;
  imageUrl: string;
}

// Corresponds to Publication Pydantic model
interface MediumPublication {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
}

// Corresponds to Contributor Pydantic model
interface MediumContributor {
  userId: string;
  publicationId: string;
  role: string;
}

// Corresponds to Post Pydantic model
interface MediumPost {
  id: string;
  title: string;
  authorId: string;
  tags: string[];
  url: string;
  createdAt: Date; // or string based on how you handle dates
  updatedAt: Date; // or string
}

// Corresponds to Image Pydantic model
interface MediumImage {
  url: string;
  md5: string;
}

export type {
  MediumUser,
  MediumPublication,
  MediumContributor,
  MediumPost,
  MediumImage,
};
