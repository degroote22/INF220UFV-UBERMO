import timeago from "timeago.js";

const br = function(number: number, index: number) {
  return [
    ["agora mesmo", "daqui um pouco"],
    ["há %s seg", "em %s seg"],
    ["há 1 min", "em 1 min"],
    ["há %s min", "em %s min"],
    ["há 1 h", "em 1 h"],
    ["há %s h", "em %s h"],
    ["há 1 d", "em 1 d"],
    ["há %s d", "em %s d"],
    ["há 1 s", "em 1 s"],
    ["há %s s", "em %s s"],
    ["há 1 m", "em 1 mês"],
    ["há %s m", "em %s m"],
    ["há 1 a", "em 1 a"],
    ["há %s a", "em %s a"]
  ][index];
};
// register your locale with timeago
timeago.register("br", br);
// use the locale with timeago instance
const timeagoInstance = timeago();
// timeagoInstance.format('2016-06-12', 'br');

const formatDate = (date: string | null): string => {
  if (date) {
    return timeagoInstance.format(date, "br");
  }
  return "";
};

export default formatDate;
