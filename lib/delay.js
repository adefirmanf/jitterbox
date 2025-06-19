const delay = (ms) => {
  const safeMs = Math.max(1, Math.floor(ms));
  return new Promise((resolve) => setTimeout(resolve, safeMs));
}

module.exports = delay
