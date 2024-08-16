// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

function strToJson(payload) {
  return JSON.parse(payload);
}

function jsonToStr(jsonString) {
  return JSON.stringify(jsonString);
}

function hex2str(hex) {
  return ethers.toUtf8String(hex);
}

function str2hex(str) {
  return ethers.hexlify(ethers.toUtf8Bytes(str));
}

async function createNotice(decoded_payload, json = false) {
  const advance_req = await postRequest("notice", decoded_payload, true)
  const response = await advance_req.json();
  console.log(
    `Received notice status ${advance_req.status} with body `, 
    JSON.stringify(response)
  );
  return response; 
}

async function createReport(decoded_payload, json=false) {
  const report_req = await postRequest("report", decoded_payload, json)
  console.log("Received report status " + report_req.status);
}

async function postRequest(endpoint, decoded_payload, json) {
  let payload
  if (json) {
    payload = str2hex(jsonToStr(decoded_payload))
  } else {
    payload = str2hex(decoded_payload)
  }
  const req = await fetch(rollup_server + "/" + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });
  return req
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const payload = data["payload"];
  const metadata = data["metadata"];
  const sender = metadata["msg_sender"].toLowerCase();

  const input = hex2str(payload)
  let body
  try {
    body = strToJson(input)
  } catch (error) {
    await createReport("data sent is not json format")
    return "reject"
  }

  if (!body.message || !body.target) {
    await createReport("missing params message or target")
    return "reject"
  }

  await createNotice(body, true)
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
