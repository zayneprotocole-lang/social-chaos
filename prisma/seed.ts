import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const dares = [
    {
        content: "Fais 10 pompes ou bois 2 gorgées.",
        difficultyLevel: 1,
        categoryTags: ["Soft", "Fun"],
        xpReward: 10
    },
    {
        content: "Raconte ta pire honte ou finis ton verre.",
        difficultyLevel: 2,
        categoryTags: ["Humiliant", "Alcool"],
        xpReward: 20
    },
    {
        content: "Envoie un message 'Je t'aime' à la 3ème personne de tes contacts récents.",
        difficultyLevel: 3,
        categoryTags: ["Chaos", "Gênant"],
        xpReward: 50
    },
    {
        content: "Laisse le groupe choisir un SMS à envoyer à ton ex.",
        difficultyLevel: 4,
        categoryTags: ["Apocalypse", "Chaos"],
        xpReward: 100
    },
    {
        content: "Imite le cri d'un animal choisi par le groupe pendant 1 minute.",
        difficultyLevel: 1,
        categoryTags: ["Fun", "Soft"],
        xpReward: 10
    },
    {
        content: "Échange tes chaussures avec ton voisin de droite.",
        difficultyLevel: 2,
        categoryTags: ["Fun"],
        xpReward: 20
    },
    {
        content: "Bois une gorgée sans les mains.",
        difficultyLevel: 2,
        categoryTags: ["Alcool", "Fun"],
        xpReward: 15
    },
    {
        content: "Fais un discours de 1 minute sur l'importance des chaussettes.",
        difficultyLevel: 1,
        categoryTags: ["Soft", "Fun"],
        xpReward: 10
    },
    {
        content: "Montre ta dernière photo prise.",
        difficultyLevel: 3,
        categoryTags: ["Gênant", "Chaos"],
        xpReward: 30
    },
    {
        content: "Danse la Macarena sans musique.",
        difficultyLevel: 2,
        categoryTags: ["Fun", "Humiliant"],
        xpReward: 20
    }
]

async function main() {
    console.log('Start seeding ...')
    for (const dare of dares) {
        const d = await prisma.dare.create({
            data: dare,
        })
        console.log(`Created dare with id: ${d.id}`)
    }
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
