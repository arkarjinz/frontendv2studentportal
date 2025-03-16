
export type Post = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    postOwner: string;
    profileImage?: string;
    roseCount?: number;
    likeCount?: number;
};
