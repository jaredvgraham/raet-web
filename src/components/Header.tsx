import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type HeaderProps = {
  backArrow?: boolean;
  backDestination?: string;
  image?: string;
  userName?: string;
  style?: string;
  imageOnPress?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  backArrow,
  backDestination,
  image,
  style,
  imageOnPress,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (backDestination) {
      router.push(backDestination);
    } else {
      router.back();
    }
  };

  return (
    <div
      className={`flex  flex-row items-center justify-between px-3 h-14 ${style}`}
    >
      {/* Back Arrow */}
      {backArrow && (
        <button onClick={handleBackPress} className="w-10 flex justify-center">
          <i
            className="fas fa-angle-left text-4xl text-black transform scale-x-75"
            aria-label="Back"
          />
        </button>
      )}

      {/* Logo */}
      <div className="flex-grow flex justify-center">
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
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <Image
              src={image}
              alt="User Profile"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </button>
      )}
    </div>
  );
};

export default Header;
