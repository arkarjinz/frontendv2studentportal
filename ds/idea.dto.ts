export type Idea = {
    id?: number;
    title: string;
    description: string;
    createdAt: string;
    ideaOwner?: string;
    profileImage?: string;
    roseCount?: number;
    sdgs?: number[];
};
