import React from "react";

export interface BaseProps {
  children?: string | React.ReactNode;
  className?: string;
}

type modalData = {
  [key: string]: any;
};
export type modalProps = {
  name: string;
  data?: modalData | null;
};
