import FriendsTabNavigation from "./_components/FriendsNav";

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full md:max-w-md h-[calc(100vh-4rem)] lg:h-screen flex flex-col">
      <div className="p-4">
        <FriendsTabNavigation />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
