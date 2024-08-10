import { fetchWithAuthInternal } from './auth.js';

const requestQueue = [];
let isProcessingQueue = false;

async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const { url, options, resolve, reject } = requestQueue.shift();
    try {
      const response = await fetchWithAuthInternal(url, options);
      resolve(response);
    } catch (error) {
      reject(error);
    }
    // Wait 50ms between each request
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  isProcessingQueue = false;
}

export function enqueueRequest(url, options) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ url, options, resolve, reject });
    processQueue();
  });
}
