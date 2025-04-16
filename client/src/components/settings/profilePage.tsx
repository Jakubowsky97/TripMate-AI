import { sendResetPassword } from "@/app/auth/actions";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Avatar from "../ui/Avatar";
import { useDarkMode } from "@/hooks/useDarkMode";

interface UserData {
    avatar_url: string;
    full_name: string;
    username: string;
    email: string;
  }

export default function ProfilePage() {
      const { darkMode } = useDarkMode();
      const searchParams = useSearchParams();

      const [uploading, setUploading] = useState(false);
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState("");
    
      const [userData, setUserData] = useState<UserData | null>(null);
      const [localData, setLocalData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        avatarUrl: "",
      });

      useEffect(() => {
        const fetchUserData = async () => {
          const userId = searchParams.get("user_id");
          if (!userId) {
            setError("Missing or invalid user_id");
            setLoading(false);
            return;
          }
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/getUser`, {
              credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to fetch user data");
    
            const user = data.data[0] || null;
            setUserData(user);
            if (user) {
              const [firstName, lastName] = user.full_name.split(" ");
              setLocalData({
                firstName: firstName || "",
                lastName: lastName || "",
                username: user.username || "",
                email: user.email || "",
                avatarUrl: user.avatar_url || "",
              });
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
          } finally {
            setLoading(false);
          }
          
        };
    
        fetchUserData();
      }, [searchParams]);
    
      const handleChange = (field: string, value: string) => {
        setLocalData((prev) => ({ ...prev, [field]: value }));
      };
    
      const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>, url: string) => {
        try {
          setUploading(true);
          if (!event.target.files?.length) throw new Error("You must select an image to upload.");
    
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/updateUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              avatar_url: url,
            }),
            credentials: "include",
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Failed to upload avatar");
    
          setLocalData((prev) => ({ ...prev, avatarUrl: url }));
          setMessage("Avatar uploaded successfully.");
        } catch (err) {
          alert(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
          setUploading(false);
        }
      };
    
      const handleSubmit = async () => {
        if (
          localData.email === userData?.email &&
          localData.firstName === userData?.full_name.split(" ")[0] &&
          localData.lastName === userData?.full_name.split(" ")[1] &&
          localData.username === userData?.username
        ) {
          setMessage("No changes detected.");
          return;
        }
    
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/updateUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              full_name: `${localData.firstName} ${localData.lastName}`,
              username: localData.username,
              email: localData.email,
            }),
            credentials: "include",
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Failed to update user data");
    
          setUserData(data.data?.[0] || null);
          setMessage("User data updated successfully.");
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
      };
    
      const handleChangePassword = () => sendResetPassword(localData.email);
      
      if (loading) return <p>Loading user data...</p>;
      if (error) return <p>Error: {error}</p>;
      if (uploading) return <p>Uploading avatar...</p>;

      return (
                <div className="space-y-6">
                    {Object.entries({ firstName: "First Name", lastName: "Last Name", username: "Username", email: "Email"}).map(([key, label]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium">{label}</label>
                        <input
                          type={key === "email" ? "email" : "text"}
                          value={localData[key as keyof typeof localData]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          disabled={key === "password"}
                          className={`w-full p-2 mt-2 rounded border ${darkMode && "bg-[#1a1e1f] shadow-lg shadow-white/10 border-[#2D2D2D]"}`}
                          placeholder={label}
                        />
                      </div>
                    ))}
                    <div>
                      <span className="text-[#777C90]">
                        You want to change password?{"  "}
                        <span onClick={handleChangePassword} className={`${darkMode ? "text-[#f8f8f8] hover:text-[#f0f0f2]" : "text-[#2D2D2D]"} hover:text-[#0F2528] cursor-pointer`}>
                          Reset password
                        </span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Avatar</label>
                      <Avatar url={localData.avatarUrl} size={150} onUpload={handleAvatarUpload} />
                    </div>
                    <button className={`${darkMode ? "bg-[#4e73df] text-white hover:bg-[#2e59e5]" : "bg-[#007bff] text-white hover:bg-[#0056b3]"} p-2 rounded`} onClick={handleSubmit}>Save Changes</button>
                    {message && <p className="mt-4 text-left">{message}</p>}
                  </div>
      )
}