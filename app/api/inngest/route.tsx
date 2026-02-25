import { serve } from "inngest/next"
import { inngest } from "@/lib/inngest/client"



export const { POST, GET, PUT } = serve({
    client: inngest,
    functions: [
       
    ]
})
