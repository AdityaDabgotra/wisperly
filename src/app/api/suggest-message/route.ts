const messages = [
    "Do you ever think about me?",
    "What’s something you’ve never told anyone?",
    "Are you happy right now, honestly?",
    "Who was the last person you missed?",
    "Do you believe in second chances?",
    "What scares you the most these days?",
    "Have I ever annoyed you without knowing?",
    "What’s one thing you regret not doing?",
    "Do you feel understood by the people around you?",
    "Who do you trust the most?",
    "Have you ever lied just to avoid hurting someone?",
    "What keeps you awake at night?",
    "Do you think people can really change?",
    "What’s something you wish people noticed about you?",
    "Are you afraid of ending up alone?",
    "What’s the nicest thing someone has done for you?",
    "Do you hide your feelings well?",
    "Who do you think about when you’re sad?",
    "What’s one thing you wish you could ask me directly?",
    "Do you believe timing matters in relationships?",
    "Have you ever felt invisible?",
    "What’s something you’re proud of but never say?",
    "Do you miss someone you shouldn’t?",
    "What’s your biggest insecurity?",
    "Do you feel appreciated?",
    "Have you ever loved someone silently?",
    "What’s something that instantly makes your day better?",
    "Do you think people really know the real you?",
    "What’s the hardest thing you’ve been through?",
    "Do you forgive easily or hold grudges?",
    "What’s one thing you want to improve about yourself?",
    "Do you overthink conversations after they happen?",
    "What does comfort look like to you?",
    "Have you ever felt like giving up?",
    "Who was the last person who made you smile?",
    "Do you believe in fate or choice?",
    "What’s something you’re afraid to admit?",
    "Do you feel lonely even when surrounded by people?",
    "What’s one question you wish someone would ask you?",
    "Have you ever pretended to be okay when you weren’t?",
    "What motivates you to keep going?",
    "Do you trust easily?",
    "What’s a memory you wish you could relive?",
    "Do you think you’re a good person?",
    "What’s one thing you want right now?",
    "Have you ever been misunderstood?",
    "What does happiness mean to you?",
    "Who do you miss the most?",
    "Do you think things will get better?",
    "If you could tell me anything anonymously, what would it be?"
];
function getRandomQuestions(messages: string[]): string[] {
    const shuffled = [...messages];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 5);
}

export async function POST(req: Request) {
    try {
        const selectedMessages = getRandomQuestions(messages);
        return Response.json({
            success: true,
            messages: selectedMessages 
        });
    } catch (error) {
        console.log("Error generating messages:", error);
        return Response.json({
            success: false,
            messages: []
        })
        
    }
}