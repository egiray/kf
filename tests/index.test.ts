import { getData, filterData } from "../src/app";
import { outagesMock, siteInfoMock } from "./mockData";
import { Outages } from "../src/types";
import axios from "axios";
jest.mock("axios");
const SERVER_BASE = "https://api.krakenflex.systems/interview-tests-mock-api/v1";
const SITE_NAME = "norwich-pear-tree";
const DATE = new Date("2022-01-01T00:00:00.000Z");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// mocking axios with static data
mockedAxios.get.mockImplementation((url: string) => {
  switch (url) {
    case `${SERVER_BASE}/site-info/${SITE_NAME}`:
      return Promise.resolve({ data: siteInfoMock });
    case `${SERVER_BASE}/outages`:
      return Promise.resolve({ data: outagesMock });
    default:
      return Promise.reject(new Error("not found"));
  }
});

let devices: Outages, outages: Outages, filteredData: Outages;

beforeAll(async () => {
  ({ devices, outages } = await getData())
  filteredData = filterData(devices, outages);
});

test("getData", async () => {
  expect(mockedAxios.get).toHaveBeenCalled();
  expect(devices.length).toEqual(2);
  expect(outages.length).toEqual(6);
});

test("filterData", async () => {
  expect(filteredData.length).toEqual(3);
  expect(filteredData.find((outage) => new Date(outage.begin) < DATE)).toBeUndefined();
  expect(filteredData.find((outage) => !outage.name)).toBeUndefined();
});