import { Box, useTheme } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styled from "styled-components";

function TermsPage({ content }) {
  const plugins = [remarkGfm];
  const theme = useTheme();
  return (
    <StyledDocument>
      <ReactMarkdown remarkPlugins={plugins}>{content}</ReactMarkdown>
    </StyledDocument>
  );
}

export async function getStaticProps() {
  const content = await fetch(
    "https://raw.githubusercontent.com/burrowfdn/burrow-cash/main/DECLARATION.md",
  ).then((r) => r.text());
  return {
    props: { content },
  };
}

const StyledDocument = styled.div`
  color: "#C0C4E9";
`;
export default TermsPage;
