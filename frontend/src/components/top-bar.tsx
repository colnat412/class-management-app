import { Bell, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

const TopBar = () => {
  return (
    <div className="w-full h-16 px-6 bg-white flex items-center justify-end gap-4">
      <Button
        type="button"
        className="relative p-2 rounded-full hover:bg-gray-100 transition bg-white"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
      </Button>

      <Avatar className="w-9 h-9 cursor-pointer">
        <AvatarImage src="/avatar.jpg" alt="User Avatar" />
        <AvatarFallback>
          <User className="w-5 h-5 text-gray-500" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default TopBar;
