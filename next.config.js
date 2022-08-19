/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/adaptive",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
]);

module.exports = withTM(nextConfig);
