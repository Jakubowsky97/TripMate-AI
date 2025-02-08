interface PreferenceCardInterface {
    option: string;
}

export default function PreferenceCard({option}: PreferenceCardInterface) {
    return(
        <div className="border p-3 rounded-md flex items-center">
            <input type="checkbox" name={option} id="" value={option} />
            <label htmlFor={option} className="ml-3">{option}</label>
        </div>
    )
}