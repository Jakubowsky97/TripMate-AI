interface stepInterface {
    step: number,
    name: String,
    description: String
}

const Step = ({ step, name, description } : stepInterface) => {
  const stepGradients = [
    "bg-gradient-to-r from-[#1F3B36] to-[#3B7F76]", // Darkest gradient for step 1
    "bg-gradient-to-r from-[#2D4C3A] to-[#A5C6B7]", // Step 2
    "bg-gradient-to-r from-[#4B6F58] to-[#E3FFCC]", // Step 3
    "bg-gradient-to-r from-[#4B6F58] to-[#D1F6D0]", // Brightest gradient for step 4 (lighter than Step 3)
  ];

  //TODO: Dodać kreskę o kolorze #E3FFCC
    return (
      <div className="p-4 mb-4">
        <p className={`numberStyle font-bold text-transparent bg-clip-text ${stepGradients[step - 1]}`}>{step}</p>
        <h2 className="text-2xl font-bold text-[#282930]">{name}</h2>
        <p className="text-[#777C90]">{description}</p>
      </div>
    );
  };
  
  export default Step;