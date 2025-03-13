interface stepInterface {
    step: number,
    name: String,
    description: String,
    darkMode: boolean
}

const Step = ({ step, name, description, darkMode } : stepInterface) => {
  const stepGradients = [
    "bg-gradient-to-r from-[#FFB07C] to-[#FF8C42]",  // Jasny pomarańczowy do ciepłego pomarańczowego
    "bg-gradient-to-r from-[#FFDA79] to-[#FF9A4D]",  // Subtelny złoty do ciepłego pomarańczowego
    "bg-gradient-to-r from-[#FFD45F] to-[#FFB45F]",  // Złoto do ciepłego żółtego
    "bg-gradient-to-r from-[#FF9F80] to-[#FF8C42]",  // Ciepły róż do pomarańczowego
  ];

  const darkModestepGradients = [
    "bg-gradient-to-r from-[#2C2C2A] to-[#4E4E4E]", // Bardzo ciemny szary do ciemnego szarego
    "bg-gradient-to-r from-[#2C2C2C] to-[#4E4E4E]",  // Ciemny szary do średniego szarego
    "bg-gradient-to-r from-[#3A3A3A] to-[#5A5A5A]",  // Ciemny szary do jaśniejszego szarego
    "bg-gradient-to-r from-[#2B2B2B] to-[#474747]",  // Bardzo ciemny szary do ciemniejszego szarego
  ];
  

  //TODO: Dodać kreskę o kolorze #E3FFCC
    return (
      <div className="p-4 mb-4">
        <p className={`numberStyle font-bold text-transparent bg-clip-text ${darkMode ? darkModestepGradients[step - 1] : stepGradients[step - 1]}`}>{step}</p>
        <h2 className={`${darkMode ? "text-[#f8f8f8]" : "text-[#282930]"} text-2xl font-bold`}>{name}</h2>
        <p className="text-[#777C90]">{description}</p>
      </div>
    );
  };
  
  export default Step;