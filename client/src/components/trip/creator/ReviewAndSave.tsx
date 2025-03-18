import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface ReviewAndSaveProps {
    prevStep: () => void;
    nextStep: () => void;
}

const ReviewAndSave = ({ nextStep, prevStep }: ReviewAndSaveProps) => {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const user_id = searchParams.get('user_id');
    const title = sessionStorage.getItem('tripName');
    const start_date = sessionStorage.getItem('startDate');
    const end_date = sessionStorage.getItem('endDate');
    const type_of_trip = sessionStorage.getItem('tripType');
    const image = sessionStorage.getItem('image');

    const uploadData = async () => {
        try {
            let publicUrl = null; // Ustawienie domyślnej wartości dla obrazu
    
            const base64Image = sessionStorage.getItem("imageFile");
            const fileType = sessionStorage.getItem("imageFileType");
    
            if (base64Image && fileType) {
                const blob = base64toBlob(base64Image, fileType);
                const fileExt = fileType.split("/")[1]; 
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `user-images/${user_id}/${fileName}`;
    
                const { error } = await supabase.storage.from("trip-images").upload(filePath, blob);
                if (error) throw error;
    
                const { data } = supabase.storage.from("trip-images").getPublicUrl(filePath);
                publicUrl = data.publicUrl;
            }
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trip/createTrip`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id,
                    title,
                    start_date,
                    end_date,
                    type_of_trip,
                    image: publicUrl, // Może być null, jeśli brak zdjęcia
                }),
            });
    
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || "Weryfikacja nie powiodła się");
            }
    
            sessionStorage.setItem("trip_id", responseData.travelData.id);
        } catch (err) {
            console.log(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
        }
    };
    
    function base64toBlob(base64Data: string, contentType: string) {
        contentType = contentType || '';
        const sliceSize = 1024;
        const base64String = base64Data.split(',')[1];
        const byteCharacters = atob(base64String);
        const bytesLength = byteCharacters.length;
        const slicesCount = Math.ceil(bytesLength / sliceSize);
        const byteArrays = new Array(slicesCount);
    
        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            const begin = sliceIndex * sliceSize;
            const end = Math.min(begin + sliceSize, bytesLength);
    
            const bytes = new Array(end - begin);
            for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    const clearSessionStorage = () => {
        sessionStorage.removeItem('tripName');
        sessionStorage.removeItem('startDate');
        sessionStorage.removeItem('endDate');
        sessionStorage.removeItem('tripType');
        sessionStorage.removeItem('image');
        sessionStorage.removeItem('imageFile');
        sessionStorage.removeItem('imageFileType');
        sessionStorage.removeItem('imagePreview');
    }

    const handleSave = async () => {
        if (!title || !start_date || !end_date || !type_of_trip) {
            return alert('Missing trip details, please go back and complete the form.');
        }
        await uploadData();
        clearSessionStorage();
        nextStep();
    };

    return (
        <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex flex-col gap-6 justify-between md:flex-row md:gap-0">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Review & Save</h2>
                    <div className="flex flex-col gap-4 text-gray-900 dark:text-white">
                        <p><strong>Title:</strong> {title}</p>
                        <p><strong>Starting date:</strong> {start_date}</p>
                        <p><strong>Ending date:</strong> {end_date}</p>
                        <p><strong>Type of trip:</strong> {type_of_trip}</p>
                    </div>
                </div>
            
            {image && (
                    <div className="flex justify-center">
                        <Image src={image} width={384} height={256} alt="Trip cover" className="object-cover rounded-lg" />
                    </div>
                )}
           </div>

            <div className="flex justify-center gap-4">
                <Button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Back</Button>
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save & Next</button>
            </div>
        </div>
    );
};

export default ReviewAndSave;
