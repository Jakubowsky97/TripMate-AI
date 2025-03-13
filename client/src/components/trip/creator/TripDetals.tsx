import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

interface TripDetailsProps {
    nextStep: () => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({ nextStep }) => {
    const [tripName, setTripName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tripType, setTripType] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
  
    const tripTypes =  ['Solo', 'Family', 'Friends', 'Group'];

    useEffect(() => {
      if (sessionStorage.getItem('tripName')) {
        setTripName(sessionStorage.getItem('tripName') as string);
      }
      if (sessionStorage.getItem('startDate')) {
        setStartDate(sessionStorage.getItem('startDate') as string);
      }
      if (sessionStorage.getItem('endDate')) {
        setEndDate(sessionStorage.getItem('endDate') as string);
      }
      if (sessionStorage.getItem('tripType')) {
        setTripType(sessionStorage.getItem('tripType') as string);
      }
      if (sessionStorage.getItem('image')) {
        setImagePreview(sessionStorage.getItem('image') as string);
      }
    }, []);
  
    const handleNext = () => {
        if (!tripName || !startDate || !endDate || !tripType) return alert('Please fill all fields');

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            return alert('End date must be at least one day after the start date');
        }

        sessionStorage.setItem('tripName', tripName);
        sessionStorage.setItem('startDate', startDate);
        sessionStorage.setItem('endDate', endDate);
        sessionStorage.setItem('tripType', tripType);
        if (imagePreview) {
            sessionStorage.setItem('image', imagePreview);
        }
        nextStep();
    };

  
    return (
      <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex flex-row gap-24 justify-between items-start">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-xl font-bold text-gray-900 dark:text-white">Title</Label>
              <Input
                placeholder="Name of your trip"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label className="text-xl font-bold text-gray-900 dark:text-white">Starting date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
            />
            </div>
      
            <div className="flex flex-col gap-2">
              <Label className="text-xl font-bold text-gray-900 dark:text-white">Ending date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label className="text-xl font-bold text-gray-900 dark:text-white">Type of trip</Label>
              <Select
                value={tripType}
                onValueChange={(value) => setTripType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type of your trip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {tripTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Label className="text-xl font-bold text-gray-900 dark:text-white">Cover image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="w-fit"
            />
            {imagePreview && (
              <img src={imagePreview} alt="trip cover" className="w-96 object-cover rounded-lg" />
            )}
          </div>
        </div>
  
        <Button 
          onClick={handleNext} 
          variant="next"
          className={`${!tripName || !startDate || !endDate || !tripType ? 'opacity-50 cursor-not-allowed' : ''} w-40 self-center`}
        >
          Next
        </Button>
      </div>
    );
}

export default TripDetails;
