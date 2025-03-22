import { pipeline } from '@xenova/transformers';
import { pc, indexName} from '../utils/pinecone';
import dotenv from 'dotenv';

dotenv.config();

// Dane do upsertu
const data = [
    { id: 'vec1', text: 'Apple is a popular fruit known for its sweetness and crisp texture.' },
    { id: 'vec2', text: 'The tech company Apple is known for its innovative products like the iPhone.' },
    { id: 'vec3', text: 'Many people enjoy eating apples as a healthy snack.' },
    { id: 'vec4', text: 'Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces.' },
    { id: 'vec5', text: 'An apple a day keeps the doctor away, as the saying goes.' },
    { id: 'vec6', text: 'Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership.' }
];

// Generuj embeddingi za pomocą DeepSeek
async function generateDeepSeekEmbeddings(texts: string[]) {
    try {
        const extractor = await pipeline(
            'feature-extraction',
            process.env.DEEPSEEK_MODEL_NAME || 'Xenova/all-MiniLM-L6-v2' // Fallback
        );

        const embeddings = [];
        for (const text of texts) {
            const output = await extractor(text, { 
                pooling: 'mean',
                normalize: true
            });
            embeddings.push(Array.from(output.data));
        }

        return embeddings;
    } catch (error) {
        console.error('Błąd generowania embeddingów:', error);
        throw error;
    }
}

// Główna funkcja
async function run() {
    try {
        
       

        // Generuj embeddingi
        const texts = data.map(d => d.text);
        const embeddings = await generateDeepSeekEmbeddings(texts);

        // Przygotuj wektory
        const vectors = data.map((item, index) => ({
            id: item.id,
            values: embeddings[index],
            metadata: { text: item.text }
        }));

        // Upsert do Pinecone
        const index = pc.index(indexName);
        await index.namespace('ns1').upsert(vectors);
        console.log('Dane dodane do Pinecone!');

    } catch (error) {
        console.error('Błąd wykonania:', error);
    }
}

// Uruchom
run();