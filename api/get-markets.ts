import getConfig, { defaultNetwork } from "../utils/config";

const config = getConfig(defaultNetwork) as any;
const { centralizationUrl } = config;

export async function get_token_detail(tokenId: string) {
  let response;
  const initResponse = [];
  try {
    response = (await fetch(`${centralizationUrl}/get_token_detail/${tokenId}?period=1`)).json();
  } catch (err) {
    return initResponse;
  }
  return response;
}
