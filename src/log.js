const outputLog = (text) => {
  console.log(`[GENERATOR] ${text}`);
};

const outputErr = (text) => {
  console.error(`[GENERATOR] ${text}`);
};

export { outputLog, outputErr };
