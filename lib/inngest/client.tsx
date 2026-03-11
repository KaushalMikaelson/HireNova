import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: "HireNova",
    name: "HireNova",
    credentials: {
        groq: {
            apiKey: process.env.GROQ_API_KEY,
        },
    },
    
});
