import {
  FaBuilding,
  FaSun,
  FaTemperatureHigh,
  FaUtensils,
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaPlaneArrival,
} from "react-icons/fa";

interface TripTimeLineInterface {
  selectedPlaces: {
    name: string;
    type: string;
    date: string;
    weather?: { temp: string; condition: string };
    places?: string[]; // Make it optional
    coordinates: number[];
  }[];
}

const TripTimeLine = ({ selectedPlaces }: TripTimeLineInterface) => {
  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4">Trip Timeline</h2>
      {/* Linia łącząca ikony */}
      {selectedPlaces.length > 0 ? (
        selectedPlaces.map((place, index) => {
          // Wybór odpowiedniej ikony
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
              {/* Ikona po lewej stronie */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 ${
                  index == 0
                    ? "bg-[#f59e0b]"
                    : index == selectedPlaces.length - 1
                    ? "bg-[#f43f5e]"
                    : "bg-[#f97316]"
                } border-gray-400 rounded-full`}
              >
                {icon}
              </div>

              {index !== selectedPlaces.length - 1 && (
                <div className="absolute top-8 left-3.5 -ml-[1px] h-full w-[2px] bg-[#ffedd5]"></div>
              )}

              {/* Treść miejsca */}
              <div
                className={`p-4 rounded-lg w-full ${
                  place.type === "Start"
                    ? "bg-[#fffbeb]"
                    : place.type === "End"
                    ? "bg-[#fff1f2]"
                    : "bg-[#fff7ed]"
                }`}
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
                    {place.type === "Start"
                      ? "Start"
                      : place.type === "End"
                      ? "End"
                      : `${place.type}`}
                  </p>
                </div>
                <p className="text-sm sm:text-base mb-2">{place.date}</p>

                {/* Weather or Hotel/Restaurant section */}
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
                      <span>{place.weather?.condition || "Unknown"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm sm:text-base mt-2">
                    <div className="flex items-center gap-1 p-1 px-2 bg-white rounded-full">
                      <FaBuilding className="text-[#c2410c]" />
                      <span>{place.places?.[0] ?? "N/A"}</span>{" "}
                      {/* Nazwa hotelu */}
                    </div>
                    <div className="flex items-center gap-1 p-1 px-2 bg-white rounded-full">
                      <FaUtensils className="text-[#c2410c]" />
                      <span>{place.places?.[1] ?? "N/A"}</span>{" "}
                      {/* Liczba restauracji */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">No places selected</p>
      )}
    </div>
  );
};

export default TripTimeLine;
