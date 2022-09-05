"use strict;";

// const fgR = '\033[1;31m%s\x1b[0m'; // Red
// const fgG = '\033[1;32m%s\x1b[0m'; // Green
// const fgY = '\033[1;33m%s\x1b[0m'; // Yellow
// const fgB = '\033[1;34m%s\x1b[0m'; // Blue
// const fgM = '\033[1;35m%s\x1b[0m'; // Magenta
// const fgC = '\033[1;36m%s\x1b[0m'; // Cyan
// const fgW = '\033[1;37m%s\x1b[0m'; // White

// const bgR = '\033[0;41m\033[0;31m%s\033[0m'; // Red
// const bgR = '\033[0;41m\033[1;37m%s\033[0;31m%s\033[0m'; // Red
// const bgG = '\033[0;42m\033[1;37m%s\033[0;31m%s\033[0m'; // Green
// const bgY = '\033[0;43m\033[1;30m%s\033[0;31m%s\033[0m'; // Yellow
// const bgB = '\033[0;44m\033[1;37m%s\033[0;31m%s\033[0m'; // Blue
// const bgM = '\033[0;45m\033[1;37m%s\033[0;31m%s\033[0m'; // Magenta
// const bgC = '\033[0;46m\033[1;30m%s\033[0;31m%s\033[0m'; // Cyan
// const bgW = '\033[0;47m\033[1;30m%s\033[0;31m%s\033[0m'; // White

// console.log(fgG, '\u2714', ' Check Mark ');
// console.log(fgR, '\u2716', ' Cross Mark ');

// console.log(fgG, 'Error', ' Path: ');
// console.log(bgR, 'Error', ' Path: ');

// const { term } = require('./code/js/terminalColors.js');
// console.log(term.fgR)

// const { term: t } = require('./code/js/terminalColors.js');
// console.log(t.fgR)

// console.log(term.check, 'Check Mark')
// console.log(term.cross, 'Cross Mark')

// console.log(term.error, 'Path: ');
// console.log(term.brief, 'Brief: ');
// console.log(term.notes, 'Notes: ');
// console.log(term.alert, 'Alert: ');
// console.log(term.power, 'Power: ');

// Terminal Colors
exports.bash = {
  // Foreground Color
  fgR: "\033[1;31m%s\x1b[0m", // Red
  fgG: "\033[1;32m%s\x1b[0m", // Green
  fgY: "\033[1;33m%s\x1b[0m", // Yellow
  fgB: "\033[1;34m%s\x1b[0m", // Blue
  fgM: "\033[1;35m%s\x1b[0m", // Magenta
  fgC: "\033[1;36m%s\x1b[0m", // Cyan
  fgW: "\033[1;37m%s\x1b[0m", // White

  // Background Color
  bgR: "\033[0;41m\033[1;37m%s\033[0m", // Red
  bgG: "\033[0;42m\033[1;37m%s\033[0m", // Green
  bgY: "\033[0;43m\033[1;30m%s\033[0m", // Yellow
  bgB: "\033[0;44m\033[1;37m%s\033[0m", // Blue
  bgM: "\033[0;45m\033[1;37m%s\033[0m", // Magenta
  bgC: "\033[0;46m\033[1;30m%s\033[0m", // Cyan
  bgW: "\033[0;47m\033[1;30m%s\033[0m", // White

  check: "\033[1;32m\u2714\x1b[0m ", // Green Check Mark
  cross: "\033[1;31m\u2716\x1b[0m ", // Red Cross Mark
  error: "\033[0;41m\033[1;37m Error \033[0m \033[0;31m%s\033[0m", // Red
  brief: "\033[0;42m\033[1;37m Brief \033[0m \033[0;32m%s\033[0m", // Red
  notes: "\033[0;46m\033[2;30m Notes \033[0m \033[0;36m%s\033[0m", // Red
  alert: "\033[0;43m\033[2;30m Alert \033[0m \033[0;33m%s\033[0m", // Red
  power: "\033[0;44m\033[2;30m Power \033[0m \033[0;34m%s\033[0m", // Red
};
