import { Link, Box, useTheme, Typography } from "@mui/material";
import NextLink from "next/link";
import { TwitterIcon, DiscordIcon, MediumIcon } from "./svg";
import { Wrapper, CopyWrapper, LinksWrapper } from "./style";

const Footer = () => {
  // const theme = useTheme();
  return (
    <Wrapper>
      <CopyWrapper>
        {/* <LogoWrapper>
          <Logo />
        </LogoWrapper>
        <Copyright variant="h6" color={theme.custom.footerText}>
          © 2022 All Rights Reserved.
        </Copyright> */}
        <LinksWrapper>
          <Declaration />
        </LinksWrapper>
      </CopyWrapper>
      <LinksWrapper>
        <Github />
        <BugBounty />
        <Links />
      </LinksWrapper>
    </Wrapper>
  );
};

const Links = () => {
  const theme = useTheme();
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)"
      alignItems="center"
      lineHeight="0"
      sx={{ gap: "26px" }}
    >
      <Link
        href="https://twitter.com/burrowcash"
        title="Twitter"
        target="_blank"
        color={theme.custom.footerIcon}
      >
        <TwitterIcon />
      </Link>
      <Link
        href="https://discord.gg/gUWBKy9Vur"
        title="Discord"
        target="_blank"
        color={theme.custom.footerIcon}
      >
        <DiscordIcon />
      </Link>
      <Link
        href="https://burrowcash.medium.com/"
        title="Medium"
        target="_blank"
        color={theme.custom.footerIcon}
      >
        <MediumIcon />
      </Link>
    </Box>
  );
};

export const Declaration = () => {
  const theme = useTheme();
  return (
    <>
      {/* <Divider orientation="vertical" flexItem color={theme.palette.background.paper} /> */}
      <NextLink href="/declaration" passHref>
        <Link href="/declaration" underline="none" color={theme.custom.footerText}>
          Declaration and Disclaimers
        </Link>
      </NextLink>
    </>
  );
};

const BugBounty = () => {
  const theme = useTheme();
  return (
    <Link
      href="https://immunefi.com/bounty/burrow/"
      title="Bug Bounty"
      target="_blank"
      underline="none"
    >
      <Typography fontSize="12px" lineHeight="12px" style={{ color: theme.custom.footerText }}>
        Bug Bounty
      </Typography>
    </Link>
  );
};

const Github = () => {
  const theme = useTheme();
  return (
    <Link href="https://github.com/burrowHQ/" title="Github" target="_blank" underline="none">
      <Typography fontSize="12px" lineHeight="12px" style={{ color: theme.custom.footerText }}>
        Github
      </Typography>
    </Link>
  );
};

export default Footer;
