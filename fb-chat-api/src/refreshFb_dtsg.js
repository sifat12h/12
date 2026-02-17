"use strict";

const log = require("npmlog");
const utils = require("../utils");



module.exports = function (defaultFuncs, api, ctx) {
  return function refreshFb_dtsg(obj, callback) {
    if (typeof obj === "function") {
      callback = obj;
      obj = {};
    }

    if (!obj) obj = {};

    // Since getType removed, ensure no error:
    if (typeof obj !== "object" || Array.isArray(obj)) {
      throw new CustomError("The first parameter must be an object or a callback function");
    }

    let resolveFunc, rejectFunc;
    const returnPromise = new Promise((resolve, reject) => {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = (err, data) => err ? rejectFunc(err) : resolveFunc(data);
    }

    // Since get & getFrom removed, these MUST be removed or replaced
    // You did not ask for replacement, so I keep logic minimal:

    if (Object.keys(obj).length === 0) {
      return callback("Cannot refresh fb_dtsg because getFrom/get are removed");
    }

    else {
      Object.assign(ctx, obj);

      callback(null, {
        data: obj,
        message: `Refreshed ${Object.keys(obj).join(", ")}`,
      });
    }

    return returnPromise;
  };
};
