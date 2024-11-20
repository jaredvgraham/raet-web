import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaArrowLeft,
  FaBell,
} from "react-icons/fa";
import { useShowNav } from "@/hooks/showNav";
import { useNotification } from "@/hooks/webPush";

type HeaderProps = {
  backArrow?: boolean;
  backDestination?: string;
  image?: string;
  userName?: string;
  style?: string;
  imageOnPress?: () => void;
  noti?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  backArrow,
  backDestination,
  image,
  style,
  imageOnPress,
  noti,
}) => {
  const router = useRouter();
  const { showNav, setShowNav } = useShowNav();
  const { isSubscribed, subscribeToNotifications } = useNotification();
  const pathname = usePathname();
  const isChatPage =
    pathname.startsWith("/chat/") && pathname.split("/").length === 3;

  const handleBackPress = () => {
    if (backDestination) {
      router.push(backDestination);
    } else {
      router.back();
    }
  };

  return (
    <div
      className={`flex relative flex-row items-center justify-between px-3  h-14 ${style}`}
    >
      {/* Back Arrow */}
      {backArrow && (
        <button onClick={handleBackPress} className="w-10  flex justify-center">
          <FaArrowLeft />
        </button>
      )}
      {/* show nav button */}
      {!isChatPage && (
        <button
          onClick={() => setShowNav(!showNav)}
          className="absolute left-0 top-5 w-10 flex justify-center"
        >
          {!showNav && <FaAngleDoubleUp />}
          {showNav && <FaAngleDoubleDown />}
        </button>
      )}

      {/* Logo */}
      <div className="flex-grow flex justify-center ">
        <Image
          src="/r-logo.png" // Update this path to your logo
          alt="Logo"
          width={40}
          height={40}
        />
      </div>

      {/* Profile Image */}
      {image && (
        <button onClick={imageOnPress}>
          <div className="relative w-10 h-10 overflow-hidden bg-black rounded-full">
            <Image
              src={image}
              alt="User Profile"
              fill
              className="object-cover w-full h-full"
            />
          </div>
        </button>
      )}

      {/* Notification Button */}
      {noti && (
        <div
          className="absolute right-5 top-5"
          onClick={subscribeToNotifications}
        >
          <FaBell
            className={` ${isSubscribed ? "text-yellow-500" : "text-black"}`}
            size={20}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
