import { MdInfoOutline } from "@react-icons/all-files/md/MdInfoOutline";
import { Tooltip } from "react-tooltip";
import { QuestionIcon } from "./svg";

type ITipType = "warn" | "question" | undefined;
export default function ToolTip({ content, type }: { content: string; type?: ITipType }) {
  return (
    <div className="cursor-pointer inline-flex mr-2">
      <span
        className="text-base text-white"
        data-tooltip-id="my-tooltip"
        data-tooltip-content={content}
      >
        {type === "warn" ? (
          <MdInfoOutline
            style={{
              marginLeft: "3px",
              color: "white",
              position: "relative",
              top: "0px",
            }}
          />
        ) : (
          <QuestionIcon />
        )}
      </span>
      <Tooltip id="my-tooltip" />
    </div>
  );
}
