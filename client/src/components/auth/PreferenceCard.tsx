interface PreferenceCardInterface {
    option: string;
    category: string;
    onChange: (category: string, option: string) => void;
    isChecked: boolean;
  }
  
  export default function PreferenceCard({ option, category, onChange, isChecked }: PreferenceCardInterface) {
    return (
      <div className="border p-3 rounded-md flex items-center">
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
  