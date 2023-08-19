import NextImage from "next/image";
import styled from "styled-components";

type Props = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  style?: object;
};

const CustomImage = ({ src, alt, width, height, className, style }: Props) => {
  return (
    <StyledImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      quality={80}
    />
  );
};

const StyledImage = styled(NextImage)`
  //object-fit: contain;
  //height: unset;
  //max-width: 100%;
`;

export default CustomImage;
