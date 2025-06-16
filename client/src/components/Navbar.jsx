import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/authSlice";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [
    logoutUser,
    { data, isSuccess, isError, error, isLoading: logoutLoading },
  ] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to log out.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out.");
      dispatch(logout());
      navigate("/login");
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to log out.");
    }
  }, [isSuccess, isError, error, data, dispatch, navigate]);

  return (
    <div className="h-16 bg-white border-b border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} className="text-[#C70039]" />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl text-[#C70039]">
              Digital CourseAI
            </h1>
          </Link>
        </div>
        {/* User icons and dark mode icon */}
        <div className="flex items-center gap-8">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                      alt={user?.name || "@user"}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "CN"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[180px] bg-[#C70039] text-white max-h-[300px] overflow-y-auto">
                  <DropdownMenuLabel className="text-white">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer hover:bg-black focus:bg-black focus:text-white">
                      <Link to="/my-learning">My Learning</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-black focus:bg-black focus:text-white">
                      <Link to="/profile">Edit Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-black focus:bg-black focus:text-white"
                      onClick={logoutHandler}
                      disabled={logoutLoading}
                    >
                      {logoutLoading ? "Logging out..." : "Log out"}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  {user?.role === "instructor" && (
                    <>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem className="cursor-pointer hover:bg-black focus:bg-black focus:text-white">
                        <Link to="/admin/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DarkMode />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                className="bg-[#C70039] text-white hover:bg-black"
                variant="outline"
                onClick={() => navigate("/login?tab=login")}
              >
                Login
              </Button>
              <Button
                className="bg-[#C70039] text-white hover:bg-black"
                onClick={() => navigate("/login?tab=signup")}
              >
                Signup
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Device */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl text-[#C70039]">
          Digital CourseAI
        </h1>
        <MobileNavbar
          logoutHandler={logoutHandler}
          navigate={navigate}
          user={user}
          isAuthenticated={isAuthenticated}
          logoutLoading={logoutLoading}
        />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({
  logoutHandler,
  navigate,
  user,
  isAuthenticated,
  logoutLoading,
}) => {
  const handleLogout = async () => {
    await logoutHandler();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full text-gray-900 hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col h-full p-4 bg-white text-gray-900 shadow-lg">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <SheetTitle className="text-xl font-bold text-[#C70039]">
            <Link to="/">Digital CourseAI</Link>
          </SheetTitle>
          <DarkMode />
        </div>

        {/* Navigation Links */}
        <Separator className="mr-2 bg-gray-200" />
        {isAuthenticated ? (
          <nav className="flex flex-col space-y-4 mt-6 text-lg">
            <span className="cursor-pointer hover:bg-black hover:text-white">
              <Link to="/my-learning">My Learning</Link>
            </span>
            <span className="cursor-pointer hover:bg-black hover:text-white">
              <Link to="/profile">Edit Profile</Link>
            </span>
            <SheetClose asChild>
              <p
                onClick={handleLogout}
                className="cursor-pointer hover:bg-black hover:text-white"
              >
                {logoutLoading ? "Logging out..." : "Log out"}
              </p>
            </SheetClose>
          </nav>
        ) : (
          <nav className="flex flex-col space-y-4 mt-6 text-lg">
            <span className="cursor-pointer hover:bg-black hover:text-white">
              <Link to="/login?tab=login">Login</Link>
            </span>
            <span className="cursor-pointer hover:bg-black hover:text-white">
              <Link to="/login?tab=signup">Signup</Link>
            </span>
          </nav>
        )}

        {user?.role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="submit"
                onClick={() => navigate("/admin/dashboard")}
                className="bg-[#C70039] text-white hover:bg-black hover:text-white"
              >
                Dashboard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
