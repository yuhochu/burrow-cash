import { parseResponse, URLForEndpoint } from "./request";
import getConfig, { defaultNetwork } from "../utils/config";

const config = getConfig(defaultNetwork);

class DataSource {
  static get shared() {
    if (!DataSource.instance) {
      DataSource.instance = new DataSource();
    }
    return DataSource.instance;
  }

  // eslint-disable-next-line class-methods-use-this,default-param-last
  async callAPI(endPoint, method = "GET", queryObject, requestBody, host) {
    const url = URLForEndpoint(endPoint, queryObject, host);
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("pragma", "no-cache");
    headers.append("cache-control", "no-cache");

    const request = {
      headers,
      method,
    };
    if (method !== "GET" && requestBody) {
      request.body = JSON.stringify(requestBody);
    }

    let response;
    try {
      response = await fetch(url, request);
    } catch (err) {
      throw new Error("Failed to connect server");
    }

    try {
      const json = await parseResponse(response);
      return json;
    } catch (err) {
      throw err;
    }
  }

  getLiquidations(account, pageNumber = 1, pageSize = 10) {
    const qryObj = {
      page_number: pageNumber,
      page_size: pageSize,
    };
    return this.callAPI(
      `/burrow/get_liquidation_info/${account}`,
      "GET",
      qryObj,
      null,
      config?.liquidationUrl,
    );
  }

  markLiquidationRead(id, account) {
    return this.callAPI(
      `/burrow/set_liquidation_info/${account}/${id}`,
      "POST",
      null,
      null,
      config?.liquidationUrl,
    );
  }

  getRecords(accountId, pageNumber = 1, pageSize = 10) {
    const qryObj = {
      account_id: accountId,
      page_number: pageNumber,
      page_size: pageSize,
    };
    return this.callAPI(`/get-burrow-records`, "GET", qryObj, null, config?.recordsUrl);
  }

  getTokenDetails(tokenId, period = 1) {
    const qryObj = {
      period,
    };
    return this.callAPI(
      `/burrow/get_token_detail/${tokenId}`,
      "GET",
      qryObj,
      null,
      config?.liquidationUrl,
    );
  }

  getInterestRate(tokenId) {
    return this.callAPI(
      `/burrow/get_token_interest_rate/${tokenId}`,
      "GET",
      null,
      null,
      config?.liquidationUrl,
    );
  }
}

export default DataSource;
