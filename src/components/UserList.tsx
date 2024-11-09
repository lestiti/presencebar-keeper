import { Synode } from "@/types/synode";
import { Profile } from "@/types/profile";
import UserCard from "./UserCard";

interface UserListProps {
  users: Profile[];
  synodes: Synode[];
}

const UserList = ({ users, synodes }: UserListProps) => {
  return (
    <>
      {synodes.map(synode => (
        <div key={synode.id} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: synode.color }}
            />
            <h2 className="text-2xl font-semibold">{synode.name}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users
              .filter(user => user.synode_id === synode.id)
              .map(user => (
                <UserCard 
                  key={user.id} 
                  user={{
                    id: user.id,
                    name: `${user.first_name} ${user.last_name}`,
                    function: user.function || '',
                    synode: synode.color,
                    phone: user.phone || '',
                  }} 
                />
              ))
            }
          </div>
        </div>
      ))}
    </>
  );
};

export default UserList;