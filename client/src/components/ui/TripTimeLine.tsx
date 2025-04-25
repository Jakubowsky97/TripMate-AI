import {
  FaBuilding,
  FaSun,
  FaTemperatureHigh,
  FaUtensils,
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaPlaneArrival,
} from "react-icons/fa";

interface Place {
  city: string;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
  is_start_point: boolean;
  is_end_point: boolean;
  country: string;
  weather: { temp: string; condition: string };
  coordinates: any[]; // ewentualnie [number, number] jeśli znasz dokładny typ
  date: string;
}

interface CityPlaces {
  city: string;
  country: string;
  places: Place[];
}

interface TripTimeLineInterface {
  selectedPlaces: CityPlaces[];
  mapRef: React.MutableRefObject<any>;
}

const TripTimeLine = ({ selectedPlaces, mapRef }: TripTimeLineInterface) => {
  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4">Trip Timeline</h2>
      {selectedPlaces.length > 0 ? (
        selectedPlaces.map((cityObj, cityIndex) => (
          <div key={cityIndex} className="mb-6">
            <h3 className="text-lg font-bold mb-2">
              {cityIndex + 1}. {cityObj.city}, {cityObj.country}
            </h3>
            {cityObj.places.length > 0 ? (
              cityObj.places.map((place, index) => {
                // Wybór odpowiedniej ikony na podstawie typu
                let icon;
                if (place.type === "Start")
                  icon = <FaPlaneDeparture className="text-white" />;
                else if (place.type === "End")
                  icon = <FaPlaneArrival className="text-white" />;
                else icon = <FaMapMarkerAlt className="text-white" />;

                return (
                  <div
                    key={index}
                    className="relative flex flex-col sm:flex-row items-start gap-4 mb-6 sm:mb-8"
                  >
                    {/* Ikona po lewej */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-8 h-8 ${
                        index === 0
                          ? "bg-[#f59e0b]"
                          : index === cityObj.places.length - 1
                          ? "bg-[#f43f5e]"
                          : "bg-[#f97316]"
                      } border-gray-400 rounded-full`}
                    >
                      {icon}
                    </div>

                    {index !== cityObj.places.length - 1 && (
                      <div className="absolute top-8 left-3.5 -ml-[1px] h-full w-[2px] bg-[#ffedd5]"></div>
                    )}

                    {/* Treść miejsca */}
                    <div
                      className={`p-4 rounded-lg w-full cursor-pointer ${
                        place.type === "Start"
                          ? "bg-[#fffbeb]"
                          : place.type === "End"
                          ? "bg-[#fff1f2]"
                          : "bg-[#fff7ed]"
                      }`}
                      onClick={() => {
                        if (mapRef.current && place.coordinates?.length === 2) {
                          const latLng = new google.maps.LatLng(place.coordinates[0], place.coordinates[1]);
                          mapRef.current.panTo(latLng);
                          mapRef.current.setZoom(16);
                        }
                      }}
                      
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between mb-2 sm:mb-4">
                        <p
                          className={`font-bold text-sm sm:text-base ${
                            place.type === "Start"
                              ? "text-[#b45309]"
                              : place.type === "End"
                              ? "text-[#be123c]"
                              : "text-[#c2410c]"
                          }`}
                        >
                          {place.name}
                        </p>
                        <p
                          className={`text-sm sm:text-base ${
                            place.type === "Start"
                              ? "text-[#da8730]"
                              : place.type === "End"
                              ? "text-[#e11d48]"
                              : "text-[#ea5828]"
                          }`}
                        >
                          {place.type}
                        </p>
                      </div>
                      <p className="text-sm sm:text-base mb-2">{place.date}</p>

                      {/* Sekcja pogodowa lub hotel/restauracja */}
                      {place.type === "Start" || place.type === "End" ? (
                        <div
                          className={`flex items-center gap-4 text-sm sm:text-base ${
                            place.type === "Start"
                              ? "text-[#da8730]"
                              : place.type === "End"
                              ? "text-[#e11d48]"
                              : "text-[#ea580c]"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <FaTemperatureHigh />
                            <span>{place.weather?.temp || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaSun />
                            <span>
                              {place.weather?.condition || "Unknown"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm sm:text-base mt-2">
                          <div className="flex items-center gap-1 p-1 px-2 bg-white rounded-full">
                            <FaBuilding className="text-[#c2410c]" />
                            {/* Przykład – możesz podać nazwę hotelu */}
                            <span>{"Hotel"}</span>
                          </div>
                          <div className="flex items-center gap-1 p-1 px-2 bg-white rounded-full">
                            <FaUtensils className="text-[#c2410c]" />
                            {/* Przykład – możesz podać liczbę restauracji */}
                            <span>{"Restauracja"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Brak miejsc w tym mieście</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No places selected</p>
      )}
    </div>
  );
};

export default TripTimeLine;
