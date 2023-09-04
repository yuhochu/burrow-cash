import { Tooltip } from "react-tooltip";
import { styled } from "styled-components";
import { QuestionIcon, WarnIcon } from "./svg";

type ITipType = "warn" | "question" | undefined;
export default function ToolTip({ content, type }: { content: string; type?: ITipType }) {
  return (
    <TipWrap className="cursor-pointer inline-flex mr-2">
      <span
        className="text-base text-white"
        data-tooltip-id="my-tooltip"
        data-tooltip-content={content}
      >
        {type === "warn" ? <WarnIcon /> : <QuestionIcon />}
      </span>
      <Tooltip id="my-tooltip" />
    </TipWrap>
  );
}

const TipWrap = styled.div`
  #my-tooltip.react-tooltip {
    border: 1px solid #4f5178;
    border-radius: 6px;
    padding: 6px 12px;
    background-color: #2e304b !important;
    max-width: 300px;
    z-index: 50;
    font-size: 12px;
    opacity: 1;
    color: rgba(198, 209, 218, 1);
    box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.15);
  }
  .react-tooltip .react-tooltip-arrow {
    display: none;
  }
`;
