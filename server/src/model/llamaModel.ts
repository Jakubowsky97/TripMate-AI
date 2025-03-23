import fetch from "node-fetch";
import {HF_TOKEN} from "../env";
const MODEL_NAME = "meta-llama/Llama-2-7b";

interface HuggingFaceResponse {
    generated_text?: string;
    error?: string;
}

export async function generateText(prompt: string) {
    try{
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_NAME}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
    });

    const text = await response.text();  
    console.log("Odp", text);
    
   
    } catch (error) {
        console.log(error," ")
    }
}