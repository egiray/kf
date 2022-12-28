import axios from "axios";
import { Outages } from "./types";
var retry = require('retry');
const SERVER_BASE = "https://api.krakenflex.systems/interview-tests-mock-api/v1";
const API_KEY = process.env.API_KEY;
const SITE_NAME = "norwich-pear-tree";
const DATE = new Date("2022-01-01T00:00:00.000Z");
const headers= { "x-api-key": API_KEY };

// sends filteredData to server (retries 10 times before error)
export const sendData = async (filteredData: Outages): Promise<any> => {
  const operation = retry.operation();
  operation.attempt(async () => {
    try {
      const { data }  = await axios.post(`${SERVER_BASE}/site-outages/${SITE_NAME}`, filteredData, { headers });
      return data
    } catch (e) {
      if (operation.retry(e)) { return; }
    }
  });
}

// Filters out outages before 'DATE' or outages which are not in devices list of siteInfo service
export const filterData = (devices: Outages, outages: Outages): Outages => {
  return outages.reduce((accumulator, currentVal) => {
    if (new Date(currentVal.begin) < DATE) {
      return accumulator;
    }
    const matchedSite = devices.find(({ id }) => id === currentVal.id);
    if (!matchedSite) return accumulator;
    return [...accumulator, { ...currentVal, name: matchedSite.name }];
  }, []);
};

// Fetches devices and siteInfo data and returns them
export const getData = async (): Promise<{ devices: Outages, outages: Outages }> => {
  const { data: { devices } } = await axios.get(`${SERVER_BASE}/site-info/${SITE_NAME}`);
  const { data: outages } = await axios.get(`${SERVER_BASE}/outages`);
  return { devices, outages };
};