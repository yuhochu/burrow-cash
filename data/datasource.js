import { parseResponse, URLForEndpoint } from "./request";

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
    const headers = {
      "Content-Type": "application/json",
    };
    const request = {
      headers,
      method,
      cache: "no-store",
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
      process.env.NEXT_PUBLIC_LIQUIDATION_API_HOST,
    );
  }

  markLiquidationRead(id) {
    return this.callAPI(
      `/set_liquidation_info-records/${id}`,
      "GET",
      null,
      null,
      process.env.NEXT_PUBLIC_LIQUIDATION_API_HOST,
    );
  }

  getRecords(accountId, pageNumber = 1, pageSize = 10) {
    const qryObj = {
      account_id: accountId,
      page_number: pageNumber,
      page_size: pageSize,
    };
    return this.callAPI(
      `/get-burrow-records`,
      "GET",
      qryObj,
      null,
      process.env.NEXT_PUBLIC_RECORDS_API_HOST,
    );
  }
}

export default DataSource;
