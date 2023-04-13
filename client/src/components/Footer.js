import { FaLinkedin, FaGithub, FaUserTie } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="
    fixed bottom-0 right-1/2 translate-x-1/2 w-full
    text-gray-500 bg-white px-4 py-5 max-w-screen-xl mx-auto md:px-8"
    >
      <div className="mt-8 items-center justify-between sm:flex">
        <div className="mt-4 sm:mt-0">&copy; 2023, Alexander Misyura</div>
        <div className="mt-6 sm:mt-0">
          <ul className="flex items-center space-x-4">
            <li className="w-10 h-10 border rounded-full flex items-center justify-center">
              <a
                href="https://github.com/AlexanderMisyura"
                title="github"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub className="text-2xl text-green-300" />
              </a>
            </li>

            <li className="w-10 h-10 border rounded-full flex items-center justify-center">
              <a
                href="https://www.linkedin.com/in/alexander-misyura"
                title="linkedin"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin className="text-2xl text-green-300" />
              </a>
            </li>

            <li className="w-10 h-10 border rounded-full flex items-center justify-center">
              <a
                href="https://alexandermisyura.github.io"
                title="personal portfolio"
                target="_blank"
                rel="noreferrer"
              >
                <FaUserTie className="text-2xl text-green-300" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
