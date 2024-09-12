import { ScrollArea } from "@/components/ui/scroll-area";
import DisplayContact from "./DisplayContact";
import DisplaySearchUser from "./DisplaySearchUser";
import { friendListType } from "@/app/page";

const DisplaySearchUsers = ({
  friendsList,
}: {
  friendsList: friendListType[];
}) => {
  // const [selectedUser, setSelectUser] = useState();
  // const [selectedUser, setSelectedUser] = useState(null);

  // console.log(friendsList.length);
  return (
    <>
      {friendsList && friendsList.length > 0 ? (
        <ScrollArea className="h-full">
          {friendsList.map((friends: friendListType) => (
            <DisplaySearchUser key={friends.id} friends={friends} />
          ))}
        </ScrollArea>
      ) : (
        <div className=" flex justify-center">
          <span>No users found</span>
        </div>
      )}
    </>
  );
};

export default DisplaySearchUsers;
