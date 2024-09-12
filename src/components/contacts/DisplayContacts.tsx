import { ScrollArea } from "@/components/ui/scroll-area";
import DisplayContact from "./DisplayContact";
import { friendListType } from "@/app/page";

const DisplayContacts = ({
  friendsList,
}: {
  friendsList: friendListType[];
}) => {
  // const [selectedUser, setSelectUser] = useState();
  // const [selectedUser, setSelectedUser] = useState(null);
  return (
    <ScrollArea className="h-full">
      {friendsList.map((friends: friendListType) => (
        <DisplayContact key={friends.id} friends={friends} />
      ))}
    </ScrollArea>
  );
};

export default DisplayContacts;
