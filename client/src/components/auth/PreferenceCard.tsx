import { useDarkMode } from "@/hooks/useDarkMode";


interface PreferenceCardInterface {
    option: string;
    category: string;
    onChange: (category: string, option: string) => void;
    isChecked: boolean;
  }
  
  export default function PreferenceCard({ option, category, onChange, isChecked }: PreferenceCardInterface) {
    const { darkMode }= useDarkMode();
    return (
      <div className={`${darkMode ? "bg-[#1a1e1f] shadow-lg shadow-white/10 border-[#2C2C2C] hover:shadow-[#292929]" : "border bg-white"} p-3 rounded-md flex items-center`}>
        <input
          type="checkbox"
          name={option}
          id={option}
          value={option}
          checked={isChecked}
          onChange={() => onChange(category, option)}
        />
        <label htmlFor={option} className="ml-3">{option}</label>
      </div>
    );
  }
  