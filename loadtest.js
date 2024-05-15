import http from 'k6/http';
import { check } from 'k6';
import papaparse from './papaparse.min.js';

// Read URLs from the CSV file
let csvData = open('3scale.csv');
let urls = papaparse.parse(csvData).data.filter(row => row[0].trim() !== ''); 

console.log('Parsed URLs:', urls);

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 69420, //Number.parseInt(`${__ENV.RPM}`),
      timeUnit: '1m',
      duration: '40m',
      preAllocatedVUs: 40,
      maxVUs: 100
    },
  },
};

export default function () {
  //const res = http.get('<3scale api staging url from example curl request here>');
  // Iterate over each URL and perform a GET request
  for (let i = 0; i < urls.length; i++) {
    const url = addProtocol(urls[i][0]) + urls[i][1]; // Assuming the URL is in the first column of the CSV
    const res = http.get(url);
    
    // Check if the request was successful
    check(res, {
        'status is 200': (r) => r.status === 200,
    });
  }
}

function addProtocol(url) {
      // Assuming the default protocol is HTTPS
      return `https://${url}`;

}
