// Import the http module to make HTTP requests. From this point, you can use `http` methods to make HTTP requests.
import http from 'k6/http';

// Import the sleep function to introduce delays. From this point, you can use the `sleep` function to introduce delays in your test script.
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 1 },    // Ramp up to 1 virtual user for 10 seconds
    { duration: '20s', target: 10 },   // Ramp up to 10 virtual users for 20 seconds
    { duration: '30s', target: 100 },  // Ramp up to 100 virtual users for 30 seconds
    { duration: '40s', target: 1000 }, // Ramp up to 1000 virtual users for 40 seconds
    { duration: '10s', target: 1000 }, // Keep 1000 virtual users for 10 seconds
    { duration: '10s', target: 0 },    // Ramp down to 0 users for 10 seconds
  ],
};

// The default exported function is gonna be picked up by k6 as the entry point for the test script. It will be executed repeatedly in "iterations" for the whole duration of the test.
export default function () {
  // Make a GET request to the target URL
  http.get('http://localhost:3000/cart');

  // Sleep for 1 second to simulate real-world usage
  sleep(0.5);
}