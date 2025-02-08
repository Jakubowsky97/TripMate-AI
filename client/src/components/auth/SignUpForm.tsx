import { FaLock, FaMap, FaRegFlag } from "react-icons/fa";
import PreferenceCard from "./PreferenceCard";

interface SignUpFormInterface{
    onClick: ()=>void;
}

export function SignUpForm({onClick}: SignUpFormInterface) {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        onClick();  
      };

  return (
            <div className="max-w-md w-full p-8">
              <div className="flex items-center flex-col mb-8">
                <div className="mb-6 border p-3 w-fit rounded-lg border-[#142F32]">
                  <FaRegFlag aria-hidden="true" className="size-6 text-[#142F32]" />
                </div>
        
                <h2 className="text-3xl font-bold mb-4 text-[#142F32]">Your details</h2>
                <p className="text-[#51605D]">Please provide your name and email.</p>
              </div>
        
              <button className="w-full bg-[#F5FAF4] text-[#142F32] flex items-center justify-center py-2 px-4 rounded-md mb-4 border border-[#C6D7C6] hover:bg-[#E3FFCC]">
                Sign up with Google
              </button>
        
              <div className="flex items-center mb-4">
                <div className="border-t flex-grow border-[#C6D7C6]"></div>
                <span className="mx-2 text-[#51605D] text-sm">OR</span>
                <div className="border-t flex-grow border-[#C6D7C6]"></div>
              </div>
        
              <form>
                <div className="mb-4">
                  <label className="block text-sm text-[#142F32] font-bold mb-1">First name*</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
                    required
                  />
                </div>
        
                <div className="mb-4">
                  <label className="block text-sm font-bold text-[#142F32] mb-1">Last name*</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
                    required
                  />
                </div>
        
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#142F32] mb-1">Email*</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
                    required
                  />
                </div>
        
                <button
                  type="submit"
                  className="w-full bg-[#142F32] text-white py-2 px-4 rounded-md hover:bg-[#0F2528]"
                  onClick={handleSubmit}
                >
                  Continue
                </button>
                <div className="mt-3">
                  <span className="text-[#777C90]">
                    You have an account?{" "}
                    <a href="/auth/login" className="text-[#142F32] hover:text-[#0F2528]">
                      Log in
                    </a>
                  </span>
                </div>
              </form>
            </div>
  );
}

export function SignUpPasswordForm({onClick} : SignUpFormInterface) {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        onClick();  
      };

    return(
        <div className="max-w-md w-full p-8">
              <div className="flex items-center flex-col mb-8">
                <div className="mb-6 border p-3 w-fit rounded-lg border-[#142F32]">
                  <FaLock aria-hidden="true" className="size-6 text-[#142F32]" />
                </div>
        
                <h2 className="text-3xl font-bold mb-4 text-[#142F32]">Choose a password</h2>
                <p className="text-[#51605D]">Must be at least 8 characters.</p>
              </div>
        
              <form>
                <div className="mb-4">
                  <label className="block text-sm text-[#142F32] font-bold mb-1">Password*</label>
                  <input
                    type="password"
                    placeholder="Choose a password"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
                    pattern="/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/"
                    required
                  />
                </div>
        
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#142F32] mb-1">Confirm password*</label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E3FFCC] border-[#C6D7C6]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#142F32] text-white py-2 px-4 rounded-md hover:bg-[#0F2528]"
                  onClick={handleSubmit}
                >
                  Continue
                </button>
              </form>
            </div>
    );
}

export function SignUpPrefForm({onClick} : SignUpFormInterface) {
    const travelPreferences = [
        {
          category: "Travel Interests",
          options: [
            "Adventure",
            "Cultural Exploration",
            "Food & Culinary",
            "Wildlife & Nature",
            "Relaxation",
            "History & Heritage",
          ],
          icons: [
            ""
          ]
        },
        {
          category: "Travel Style",
          options: [
            "Luxury",
            "Budget",
            "Backpacking",
            "Solo Travel",
            "Family Travel",
            "Group Travel",
          ],
        },
        {
          category: "Preferred Transport",
          options: [
            "Airplane",
            "Train",
            "Car Rental",
            "Bus",
            "Bicycle",
            "Walking",
          ],
        },
        {
          category: "Preferred Accommodation",
          options: [
            "Hotels",
            "Hostels",
            "Airbnb",
            "Resorts",
            "Camping",
            "Guesthouses",
          ],
        },
        {
          category: "Favorite Types of Attractions",
          options: [
            "Beaches",
            "Mountains",
            "Historical Sites",
            "Theme Parks",
            "Museums",
            "Nightlife",
          ],
        },
      ];

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); 
        onClick();  
      };

    return(
        <div className="max-w-lg w-full p-8">
              <div className="flex items-center flex-col mb-8">
                <div className="mb-6 border p-3 w-fit rounded-lg border-[#142F32]">
                  <FaMap aria-hidden="true" className="size-6 text-[#142F32]" />
                </div>
        
                <h2 className="text-3xl font-bold mb-4 text-[#142F32]">Set your preferences</h2>
                <p className="text-[#51605D]">Choose your preferences for AI recommendations.</p>
              </div>
        
              <form>
              {travelPreferences.map((category) => (
                <div key={category.category}>
                    <h3 className="text-xl font-semibold text-[#142F32]">{category.category}</h3>
                    <div className="grid grid-cols-2 gap-4">
                    {category.options.map((option) => (
                        <PreferenceCard
                        key={option}
                        option={option}
                        />
                    ))}
                    </div>
                </div>
                ))}

                <button
                  type="submit"
                  className="w-full bg-[#142F32] text-white py-2 px-4 rounded-md hover:bg-[#0F2528]"
                  onClick={handleSubmit}
                >
                  Continue
                </button>
              </form>
            </div>
    );
}