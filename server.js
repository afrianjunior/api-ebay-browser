const express = require('express'),
      cors = require('cors'),
      axios = require('axios-es6'),
      conf = require('./config'),
      app = express()

/*
*
* WhitelistOption
*
*/

var whiteList = [
  'http://localhost:3000',
  'http://de941f93.ngrok.io/'
]

var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whiteList.indexOf(origin) !== -1;
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
  }
}

/*
*
* API
*
*/

app.get('/product', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  if (req.query.keyword) {
    const keyword = req.query.keyword
    axios.get('https://svcs.ebay.com/services/search/FindingService/v1', {
      params: {
        'SECURITY-APPNAME': conf.SecurityApp,
        'OPERATION-NAME': 'findItemsByKeywords',
        'affiliate': 'Affiliate',
        'itemFilter(0).name': 'FreeShippingOnly',
        'itemFilter(0).value': true,
        'itemFilter(1).name': 'AvailableTo',
        'itemFilter(1).value': 'ID',
        'SERVICE-VERSION': '1.0.0',
        'RESPONSE-DATA-FORMAT': 'JSON',
        'keywords': keyword,
        'paginationInput.entriesPerPage': '5',
        'GLOBAL-ID': 'EBAY-US'
      }
    }).then((response) => {
      var results = {
        data: response.data.findItemsByKeywordsResponse[0].searchResult[0].item
      }
      res.status(200)
      res.json(results)
    })

  } else {
    res.json({
      err: 200,
      msg: 'please insert keyword'
    })
  }
})

app.listen(9090, () => {
  console.log('Running')
})
