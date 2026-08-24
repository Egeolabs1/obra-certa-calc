export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        role: string;
        avatar?: string;
    };
    category: string;
    tags: string[];
    publishedAt: string;
    updatedAt?: string;
    readTimeMinutes: number;
    featuredImage?: string;
    relatedPosts?: string[]; // Array of post IDs
    reviewedAt?: string;
    reviewedBy?: string;
    sources?: { label: string; url: string; publisher: string }[];
}

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon?: string;
}
