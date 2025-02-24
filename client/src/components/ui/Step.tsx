interface stepInterface {
    step: number,
    name: String,
    description: String,
    darkMode: boolean
}

const Step = ({ step, name, description, darkMode } : stepInterface) => {
  const stepGradients = [
    "bg-gradient-to-r from-[#1F3B36] to-[#3B7F76]",
    "bg-gradient-to-r from-[#2D4C3A] to-[#A5C6B7]",
    "bg-gradient-to-r from-[#4B6F58] to-[#E3FFCC]",
    "bg-gradient-to-r from-[#4B6F58] to-[#D1F6D0]",
  ];

  const darkModestepGradients = [
    "bg-gradient-to-r from-[#112A26] to-[#1E5F4B]", 
    "bg-gradient-to-r from-[#1A3A34] to-[#3B7F76]", 
    "bg-gradient-to-r from-[#233F3A] to-[#4CA58F]", 
    "bg-gradient-to-r from-[#2D4C3A] to-[#A5C6B7]", 
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