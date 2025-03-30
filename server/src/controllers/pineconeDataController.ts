import { pipeline } from "@xenova/transformers";
import { pc } from "../utils/pinecone";
import { createHash } from "crypto";
const indexName = "travel-dataset";
import { env } from "@xenova/transformers";
env.localModelPath = "./models/";

// Generowanie hasha SHA-256
const generateContentHash = (text: string): string => 
  createHash('sha256').update(text).digest('hex');

async function generateEmbeddings(texts: string[]) {
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  return Promise.all(
    texts.map(async (text) => {
      const output = await extractor(text, { pooling: "mean", normalize: true });
      return Array.from(output.data);
    })
  );
}

async function checkExistingHashes(namespace: any, hashes: string[]): Promise<Set<string>> {
  const existingHashes = new Set<string>();
  const batchSize = 100;

  for (let i = 0; i < hashes.length; i += batchSize) {
    const batch = hashes.slice(i, i + batchSize);
    const response = await namespace.query({
      filter: {
        "$or": batch.map(hash => ({ contentHash: { "$eq": hash } }))
      },
      topK: 1,
      includeMetadata: true
    });

    response.matches.forEach((match: { metadata: { contentHash: string; }; }) => {
      if (match.metadata?.contentHash) {
        existingHashes.add(match.metadata.contentHash);
      }
    });
  }

  return existingHashes;
}

async function run() {
  try {
    const data = [
      { id: "1", text: "Czym jest RAG?" },
      { id: "2", text: "Jak działa Pinecone?" }
    ];

    const index = pc.index(indexName);
    const namespace = index.namespace("ns1");

    // Generuj hashe dla nowych danych
    const newHashes = data.map(item => generateContentHash(item.text));
    
    // Sprawdź które hashe już istnieją
    const existingHashes = await checkExistingHashes(namespace, newHashes);
    console.log(`Znaleziono ${existingHashes.size} istniejących duplikatów`);

    // Filtruj tylko unikalne rekordy
    const uniqueData = data.filter((item, index) => 
      !existingHashes.has(newHashes[index]));

    if (uniqueData.length === 0) {
      console.log("Brak nowych danych do dodania");
      return;
    }

    // Generuj embeddingi i przygotuj wektory
    const texts = uniqueData.map(item => item.text);
    const embeddings = await generateEmbeddings(texts);
    
    const vectors = uniqueData.map((item, index) => ({
      id: item.id,
      values: embeddings[index],
      metadata: {
        text: item.text,
        contentHash: generateContentHash(item.text),
        timestamp: new Date().toISOString()
      }
    }));

    // Dodaj do Pinecone z retry
    let attempts = 0;
    while (attempts < 3) {
      try {
        await namespace.upsert(vectors);
        console.log(`Dodano ${vectors.length} wektorów`);
        break;
      } catch (error) {
        attempts++;
        console.error(`Błąd upsert (próba ${attempts}/3):`, error);
        await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
      }
    }

  } catch (error) {
    console.error("Krytyczny błąd:", error);
  }
}

run();