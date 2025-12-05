import { Dare } from '@/lib/types'

export const MOCK_DARES: Dare[] = [
    {
        id: '1',
        content: 'Fais 10 pompes ou bois 2 gorgées.',
        difficultyLevel: 1,
        categoryTags: ['Soft'],
        xpReward: 10,
    },
    {
        id: '2',
        content: 'Raconte ta pire honte.',
        difficultyLevel: 2,
        categoryTags: ['Humiliant'],
        xpReward: 20,
    },
    {
        id: '3',
        content: 'Envoie un SMS à ton ex.',
        difficultyLevel: 4,
        categoryTags: ['Chaos'],
        xpReward: 50,
    },
    {
        id: '4',
        content: 'Danse sans musique pendant 1 minute.',
        difficultyLevel: 2,
        categoryTags: ['Fun'],
        xpReward: 15,
    },
    {
        id: '5',
        content: 'Imite le cri d\'un animal choisi par le groupe.',
        difficultyLevel: 1,
        categoryTags: ['Fun'],
        xpReward: 10,
    },
    {
        id: '6',
        content: 'Fais un discours de 1 minute sur l\'importance des chaussettes.',
        difficultyLevel: 3,
        categoryTags: ['Fun', 'Chaos'],
        xpReward: 30,
    }
]
