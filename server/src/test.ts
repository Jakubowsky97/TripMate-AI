import { generateText } from "./model/llamaModel";

async function test() {
    const response = await generateText("Podaj mi 3 najlepsze restauracje w okolicy Krakowskiego Wawelu w formacie Nazwa Restauracji:,Ulica: . Nie opisuj ich chce tylko te dane ");
    console.log("Odpowiedź modelu:", response);
}

test();