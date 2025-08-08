import {
  EarthIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import { AtSign } from "lucide-react";
const socialLinks = [
  {
    name: "LinkedIn",
    link: "/",
    icon: <LinkedinIcon />,
  },
  {
    name: "X",
    link: "/",
    icon: <TwitterIcon />,
  },
  {
    name: "Facebook",
    link: "/",
    icon: <FacebookIcon />,
  },
  {
    name: "Website",
    link: "/",
    icon: <EarthIcon />,
  },
];
export default function Footer() {
  return (
    <footer className="relative z-50 bg-white  dark:bg-gray-900 dark:border dark:border-t-gray-700/[0.25]">
      <div className="flex flex-col items-center p-4">
        {/* social links */}
        <div className="mt-3">
          <span className="mb-4 block text-center text-lg font-medium text-[#767E94]">
            Follow Us
          </span>
          <ul className="flex items-center gap-6">
            {socialLinks.map(({ name, icon, link }) => (
              <li key={name}>
                <a
                  href={link}
                  title={name}
                  className="text-gray-500 dark:text-white dark:bg-gray-800 dark:hover:text-[#767e94] hover:text-[#767e94]"
                  target="_blank"
                >
                  {icon}
                </a>
                <span className="sr-only">{name} account</span>
              </li>
            ))}
          </ul>
        </div>

        {/* email */}
        <div className="mt-4 mb-2 flex items-center gap-2 text-xl bg-gradient-to-r from-blue-400 via-violet-600 to-sky-900 bg-clip-text text-transparent dark:text-white">
          <AtSign color="#7D7DFD" />
          <span className="text-lg font-medium">info@email.com</span>
        </div>
      </div>

      {/* about author or app/copyrights */}
      <div className="bg-gray-300 dark:bg-[#2E3447]">
        <div className="px-3 py-3 text-center">
          <span className="text-[#767E94] dark:text-white">
            Coded with 💙 by{" "}
            <a
              href="https://www.linkedin.com/in/abdulbasitprofile/"
              target="_blank"
              className="text-gray-700 dark:text-white "
            >
              Mariam Amr
            </a>
          </span>
        </div>
      </div>
    </footer>
  );

}
