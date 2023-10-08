import getConfig, { defaultNetwork } from "../utils/config";

const config = getConfig(defaultNetwork) as any;
const { liquidationUrl } = config;

export async function get_token_detail(tokenId: string) {
  let response;
  const initResponse = [];
  try {
    response = (
      await fetch(`${liquidationUrl}/burrow/get_token_detail/${tokenId}?period=1`)
    ).json();
  } catch (err) {
    return initResponse;
  }
  return response;
}
