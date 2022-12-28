import { getData, filterData, sendData } from "./app";

(async () => {
  const { devices, outages } = await getData()
  const filteredData = filterData(devices, outages)
  await sendData(filteredData);
  console.log("done");
})();