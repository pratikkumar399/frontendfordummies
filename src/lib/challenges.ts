import { INITIAL_TEMPLATES } from '@/lib/constants';
import { Template } from '@/types/types';

export const getChallengeBySlug = (slug: string): Template | undefined => {
    return INITIAL_TEMPLATES.find((t) => t.slug === slug);
};

export const getAllChallenges = (): Template[] => {
    return INITIAL_TEMPLATES;
};

export const getRelatedChallenges = (currentSlug: string, limit: number = 3): Template[] => {
    return INITIAL_TEMPLATES
        .filter(t => t.slug !== currentSlug)
        .slice(0, limit);
}

