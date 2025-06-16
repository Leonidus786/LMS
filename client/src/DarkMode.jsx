import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const DarkMode = () => {
  const { setTheme, theme } = useTheme();

  console.log("Current theme in DarkMode:", theme); // Debug log

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group w-10 h-10 flex items-center justify-center bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039] rounded-full"
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] text-white rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:group-hover:text-[#FF5C8D]" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] text-white rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:group-hover:text-[#FF5C8D]" />
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[120px] bg-[#C70039] text-white max-h-[300px] overflow-y-auto">
        <DropdownMenuLabel className="text-white">Theme</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-black dark:hover:text-[#C70039] focus:bg-black focus:text-white"
          onSelect={() => {
            console.log("Selected Light theme"); // Debug log
            setTheme("light");
          }}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-black dark:hover:text-[#C70039] focus:bg-black focus:text-white"
          onSelect={() => {
            console.log("Selected Dark theme"); // Debug log
            setTheme("dark");
          }}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-black dark:hover:text-[#C70039] focus:bg-black focus:text-white"
          onSelect={() => {
            console.log("Selected System theme"); // Debug log
            setTheme("system");
          }}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DarkMode;
