import { useAuth } from "@/contexts/AuthContext";

export default function Header(props: HeaderProps) {
  const { showSidebar, setShowSidebar } = props;
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="fixed z-10 flex h-16 w-full items-center justify-between bg-gray-200 px-4 md:h-12">
      {isLoggedIn ? (
        <>
          <div className="flex items-center gap-2">
            <button
              className="md:hidden"
              type="button"
              onClick={() => setShowSidebar((val) => !val)}
            >
              <i
                className={`fa-solid fa-bars text-2xl transition-all duration-200 ${
                  showSidebar ? "-rotate-90" : ""
                } `}
              />
            </button>

            <img
              alt="logo"
              className="h-8 px-2 md:px-0"
              src="/images/logo.png"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => logout()}
              className="text-2xl text-gray-700 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-6 h-6"
                fill="currentColor"
              >
                <path d="M279 352c-13.3 0-24 10.7-24 24v104H71c-13.3 0-24 10.7-24 24s10.7 24 24 24h184c13.3 0 24-10.7 24-24V376c0-13.3-10.7-24-24-24zm96-248h-71.9c-10.4 0-19.7 7.9-20.6 18.3l-1.3 14.3c-1.2 12.8 9.3 23.3 22.5 23.3 12.7 0 23-10.2 23-23V104c0-13.3-10.7-24-24-24zm-103 28.6c-.6 1.6-.9 3.3-.9 5 .2 1.8.6 3.5 1 5.3h-75c.5-1.8.8-3.5 1-5.3.1-1.7-.1-3.4-.7-5zM53 79c6.4 0 12.6-4.6 14.4-11.4l20.3-70.1c1.8-6.3-2-12.7-8.3-14.5s-12.7 2-14.5 8.3l-20.3 70.1c-1.8 6.3 2 12.7 8.3 14.5 1.1.4 2.3.6 3.5.6z" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <img alt="logo" className="h-12 md:h-8" src="/images/logo.png" />
        </div>
      )}
    </div>
  );
}

interface HeaderProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
