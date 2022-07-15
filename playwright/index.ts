import { executeList } from "./compose";

// 24 hours
const INTERVAL = 1000 * 60 * 60 * 24;
setInterval(executeList, INTERVAL);
