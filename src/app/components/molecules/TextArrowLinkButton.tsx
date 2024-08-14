// ProfileLink.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import nextConfig from "../../../../next.config.mjs";

const BASE_PATH = nextConfig.basePath || "";

interface TextArrowLinkButtonProps {
  text: string;
  href: string;
}

const TextArrowLinkButton: React.FC<TextArrowLinkButtonProps> = ({
  text,
  href,
}) => {
  return (
    <>
      <a href={`${BASE_PATH}${href}`} className="group flex items-center mt-6">
        <h3>{text}</h3>

        {/* テキストの右につける矢印 */}
        <button
          className="
            relative align-middle transition-all
            w-8 max-w-[32px]
            h-8 max-h-[32px]
            text-xs
            border border-main-black border-opacity-20 rounded-full
            ml-5
            group-hover:bg-main-white"
          type="button"
        >
          <span>
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </button>
      </a>
    </>
  );
};

export default TextArrowLinkButton;
