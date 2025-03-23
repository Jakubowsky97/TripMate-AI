import { pipeline } from "@xenova/transformers";

import { pc } from "../utils/pinecone";
const indexName = "travel-dataset";
import { env } from "@xenova/transformers"
env.localModelPath = "./models/";



async function generateEmbeddings(texts: string[]) {
    console.log("Downloading model...");
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("Model installed");

    console.log("Generating embedings");
    const embeddings = await Promise.all(
        texts.map(async (text) => {
            const output = await extractor(text, { pooling: "mean", normalize: true });
            return Array.from(output.data); 
        })
    );

    return embeddings;
}


async function run() {
    try {
      
        const data = [
            { id: "1", text: "Czym jest RAG?" },
            { id: "2", text: "Jak działa Pinecone?" }
        ];

      
        const texts = data.map(item => item.text);
        const embeddings = await generateEmbeddings(texts);

     
        const vectors = data.map((item, index) => ({
            id: item.id,
            values: embeddings[index],
            metadata: { text: item.text }
        }));

        
        const index = pc.index(indexName);
        await index.namespace("ns1").upsert(vectors);
        console.log("Data added to pinecone");

    } catch (error) {
        console.error("Error:", error);
    }
}


run();
