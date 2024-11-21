import { UserProfile } from "@clerk/nextjs";
import { ScrollArea } from "@/components/ui/scroll-area";

const UserProfilePage = () => (
  <div className="h-screen max-h-screen">
    <ScrollArea className="h-full">
      <UserProfile path="/user-profile" />
    </ScrollArea>
  </div>
);

export default UserProfilePage;
