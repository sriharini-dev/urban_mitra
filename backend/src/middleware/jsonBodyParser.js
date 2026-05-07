const express = require("express");

// Read JSON requests as text first so we can recover from raw control characters
// pasted into string fields from manual API clients.
const readJsonBody = express.text({
  type: ["application/json", "application/*+json"],
  limit: "1mb"
});

function escapeControlCharactersInJsonStrings(rawBody) {
  let sanitizedBody = "";
  let isInsideString = false;
  let isEscaping = false;

  for (let index = 0; index < rawBody.length; index += 1) {
    const character = rawBody[index];

    if (!isInsideString) {
      if (character === "\"") {
        isInsideString = true;
      }

      sanitizedBody += character;
      continue;
    }

    if (isEscaping) {
      sanitizedBody += character;
      isEscaping = false;
      continue;
    }

    if (character === "\\") {
      sanitizedBody += character;
      isEscaping = true;
      continue;
    }

    if (character === "\"") {
      sanitizedBody += character;
      isInsideString = false;
      continue;
    }

    if (character === "\n") {
      sanitizedBody += "\\n";
      continue;
    }

    if (character === "\r") {
      sanitizedBody += "\\r";
      continue;
    }

    if (character === "\t") {
      sanitizedBody += "\\t";
      continue;
    }

    if (character === "\b") {
      sanitizedBody += "\\b";
      continue;
    }

    if (character === "\f") {
      sanitizedBody += "\\f";
      continue;
    }

    const characterCode = character.charCodeAt(0);
    if (characterCode >= 0 && characterCode <= 0x1f) {
      sanitizedBody += `\\u${characterCode.toString(16).padStart(4, "0")}`;
      continue;
    }

    sanitizedBody += character;
  }

  return sanitizedBody;
}

function parseJsonBody(req, res, next) {
  if (!req.is(["application/json", "application/*+json"])) {
    return next();
  }

  if (typeof req.body !== "string") {
    req.body = {};
    return next();
  }

  const rawBody = req.body.trim();
  if (!rawBody) {
    req.body = {};
    return next();
  }

  try {
    req.body = JSON.parse(rawBody);
    return next();
  } catch (parseError) {
    try {
      req.body = JSON.parse(escapeControlCharactersInJsonStrings(rawBody));
      return next();
    } catch (sanitizedParseError) {
      sanitizedParseError.status = 400;
      sanitizedParseError.code = "INVALID_JSON_BODY";
      return next(sanitizedParseError);
    }
  }
}

function handleJsonBodyError(error, req, res, next) {
  if (error && error.code === "INVALID_JSON_BODY") {
    return res.status(400).json({
      success: false,
      message:
        "Request body must be valid JSON. Escape new lines and tabs inside string values, or send the payload with JSON.stringify(...).",
      details: error.message
    });
  }

  return next(error);
}

module.exports = {
  readJsonBody,
  parseJsonBody,
  handleJsonBodyError
};
