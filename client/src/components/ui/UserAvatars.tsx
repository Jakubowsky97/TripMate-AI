import Image from "next/image";

interface User {
  avatar_url: string;
  full_name: string;
}

interface UserAvatarsProps {
  users: User[];
  size: number; 
}

export default function UserAvatars({ users, size }: UserAvatarsProps) {
  const displayedUsers = users.slice(0, 3);
  const extraUsers = users.length - displayedUsers.length;

  return (
    <div className="flex items-center">
      {displayedUsers.map((user, index) => (
        <div
          key={index}
          className={`w-${size} h-${size} overflow-hidden rounded-full border-2 border-white relative ${
            index !== 0 ? "-ml-3" : ""
          }`}
          style={{
            maskImage: "radial-gradient(circle at right, rgba(0,0,0,1) 100%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "radial-gradient(circle at right, rgba(0,0,0,1) 100%, rgba(0,0,0,0) 100%)",
          }}
        >
          <Image
            src={user.avatar_url || "/img/default.png"}
            alt={user.full_name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      {extraUsers > 0 && (
        <div className={`-ml-3 w-${size} h-${size} flex items-center justify-center rounded-full border-2 border-white bg-[#fff7ed] text-[#ef700c] text-xs font-semibold z-10`}>
          +{extraUsers}
        </div>
      )}
    </div>
  );
}
