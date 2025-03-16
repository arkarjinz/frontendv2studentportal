// lost.and.found.dto.ts
export type LostAndFoundDto = {
    id?: number;
    title: string;
    description: string;
    // For GET responses, image will now be a Base64 string
    imageBase64?: string;
    isFound: boolean;
    studentName?: string;
};
