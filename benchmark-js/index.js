const $globalCode = document.querySelector("#global");
const $sendButton = document.querySelector(".send-button");
const $bars = document.querySelectorAll(".bar");
const $percentages = document.querySelectorAll(".percentage");

const COLORS = ["red", "orange", "yellow", "green", "purple"];

async function runTestCases() {
  const globalCode = $globalCode.value;
  const $testCases = document.querySelectorAll(".test-case");

  $bars.forEach((bar) => {
    bar.setAttribute("height", 0);
  });
  $percentages.forEach((percentage) => {
    percentage.textContent = "0%";
  });
  async function runTest({ code, data }) {
    const worker = new Worker("worker.js");
    worker.postMessage({ code, data, duration: 1000 });

    const { resolve, promise } = Promise.withResolvers();
    worker.onmessage = (event) => {
      resolve(event.data);
    };
    return promise;
  }

  const promises = Array.from($testCases).map(async (testCase) => {
    const $code = testCase.querySelector(".code");
    const $ops = testCase.querySelector(".ops");

    const codeValue = $code.value;
    $ops.textContent = "Calculating...";

    const result = await runTest({ code: codeValue, data: globalCode });
    $ops.textContent = `${result.toLocaleString()} ops/s`;

    return result;
  });

  const results = await Promise.all(promises);

  const maxOps = Math.max(...results);

  const sortedResults = results
    .map((result, index) => ({
      result,
      index,
    }))
    .sort((a, b) => a.result - b.result);

  results.forEach((result, index) => {
    const bar = $bars[index];
    const percentage = $percentages[index];
    const indexColor = sortedResults.findIndex((x) => x.index === index);
    const color = COLORS[indexColor];

    const height = (result / maxOps) * 300;
    bar.setAttribute("height", height);
    bar.setAttribute("fill", color);
    const percentageValue = Math.round((result / maxOps) * 100);
    percentage.textContent = `${percentageValue}%`;
  });
}

// run test cases on init
runTestCases();

$sendButton.addEventListener("click", () => {
  runTestCases();
});
