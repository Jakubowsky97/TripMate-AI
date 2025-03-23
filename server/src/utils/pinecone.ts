import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import { PINECONE_API_KEY } from '../env';

dotenv.config();

if (!PINECONE_API_KEY) {
    throw new Error('Brak klucza Pinecone w .env');
}

export const pc = new Pinecone({
    apiKey: PINECONE_API_KEY,
});



 const indexName = 'travel-dataset';

async function createPineconeIndex() {
    try {
        // Pobierz listę indeksów
        const response = await pc.listIndexes();
        
        // Debug: Sprawdź strukturę odpowiedzi
        console.log('Odpowiedź listIndexes:', JSON.stringify(response, null, 2));

        // Dostosuj do struktury odpowiedzi
        let indexExists: boolean;
        if (Array.isArray(response)) {
            // Wersja zwracająca tablicę stringów (np. ["index1", "index2"])
            indexExists = response.includes(indexName);
        } else if (response.indexes && Array.isArray(response.indexes)) {
            // Wersja zwracająca obiekt z tablicą obiektów (np. { indexes: [{ name: "index1" }] })
            indexExists = response.indexes.some((index: any) => index.name === indexName);
        } else {
            indexExists = false;
        }

        if (indexExists) {
            console.log(`Indeks "${indexName}" już istnieje.`);
            return;
        }

        // Utwórz indeks
        await pc.createIndex({
            name: indexName,
            dimension: 384,
            metric: 'cosine',
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1',
                },
            },
        });
        console.log(`Indeks "${indexName}" utworzony.`);
    } catch (error) {
        console.error('Błąd:', error);
    }
}

createPineconeIndex();