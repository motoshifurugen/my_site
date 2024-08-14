import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const GithubLinkButton = () => {
  return (
    <Link
      className="mt-8 md:mt-0 mr-auto animate-fade-in-up"
      href="https://github.com/motoshifurugen/my_site"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="group flex items-center border border-gray-300 rounded px-4 py-2 hover:bg-main-black hover:text-main-white">
        <FontAwesomeIcon
          icon={faGithub}
          className="mr-2 group-hover:bg-main-black group-hover:text-main-white"
        />
        <span className="noto-sans-jp text-lg md:text-base group-hover:bg-main-black group-hover:text-main-white">
          ソースコード
        </span>
      </div>
    </Link>
  );
};

export default GithubLinkButton;
