var express = require('express');
var messageData = require('../data/message');

var router = express.Router();

function getResponse(msg) {
  let hits = [];

  messageData.chatResponses.forEach((item) => {
    item.contexts.forEach(context => {
      const search = context.toLowerCase()
      if(msg.includes(search))  {
        hits.push({
          position: msg.indexOf(search),
          message: item.message
        });
        return;
      }
    })
  });

  if(hits.length > 0)
    return hits.sort((a, b) => a.position - b.position)[0].message;

  return messageData.defaultMessage;
}

function isValid(data) {
  if(!data.conversation_id || !data.message)
    return false;

  return true;
}

/* POST message . */
router.post('/', function(req, res, next) {

  // validate
  if(!isValid(req.body)){
    res.status(400).json({ message: 'Validation error, payload is not in valid format.' });
    return;
  }

  res.json({
    response_id: req.body.conversation_id,
    response: getResponse(req.body.message.toLowerCase())
  });
});

module.exports = router;
