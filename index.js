app.get("/api/v1/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;

  
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  
  if (mode && token) {
    // Verify the token
    if (mode === "subscribe" && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});


app.post("/api/v1/webhook", (req, res) => {
  let body = req.body;

  if (body.object) {
    console.log(JSON.stringify(body, null, 2)); 

    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from; // phone number of sender
      const msgBody = message.text?.body;
      console.log(`Received message from ${from}: ${msgBody}`);
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});