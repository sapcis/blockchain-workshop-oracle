const http = require('http');
const btoa = require('btoa');
const fetch = require('node-fetch');

let shipmentID = 'obj777',
    serviceKey = {
        serviceUrl: 'https://hyperledger-fabric.cfapps.eu10.hana.ondemand.com/api/v1',
        oAuth: {
            clientId: 'sb-09a89eaf-5e24-40b4-bef6-7152d1e723d0!b5710|na-420adfc9-f96e-4090-a650-0386988b67e0!b1836',
            clientSecret: 'TG7u1oIN9yqiFru92vLuNmRFFEI=',
            url: 'https://i070933trial.authentication.eu10.hana.ondemand.com',
            identityZone: 'i070933trial'
        }
    },
    accessToken = null,
    funcChaincode = serviceKey.serviceUrl +
        '/chaincodes/6dcd0e92-e811-4d33-8c3f-234aaf65d8d5-demo-perishable-net/latest/' +
        shipmentID,
    body = {
        param: 'temp',
        measure: null
    },
    option = {
        headers: {
            'Authorization': `Basic ${btoa(serviceKey.oAuth.clientId + ':' + serviceKey.oAuth.clientSecret)}`
        }
    },
    count = 1;

const randomInt = (min, max) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
};


fetch(serviceKey.oAuth.url + '/oauth/token?grant_type=client_credentials', option)
    .then(response => response.json())
    .then(json => accessToken = json.access_token)
    .then(() => {
        const port = process.env.PORT || 3000;

        http.createServer((req, res) => {
            console.log(req);
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            option = {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json; charset=utf-8'
                },
            };
            body.measure = randomInt(10, 1000).toString();
            option.body = JSON.stringify(body);
            fetch(funcChaincode, option)
                .then(response => {
                    res.write(`${count}: ${response.status}, ${response.statusText}`);
                    console.log(`${count}: ${response.status}, ${response.statusText}`);
                    count++;
                })
                .catch(err => {
                    res.write(err.message);
                    console.error(err.message)
                });
        }).listen(port, (err) => {
            if (err) {
                return console.log('something bad happened', err)
            }
            console.log(`server is listening on ${port}`)
        });
    });

/*

fetch(serviceKey.oAuth.url + '/oauth/token?grant_type=client_credentials', option)
    .then(response => response.json())
    .then(json => accessToken = json.access_token)
    .then(() => {
        option = {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json; charset=utf-8'
            },
        };

        // fetch(methodUrl, option)
        //     .then(response => console.log(`${response.status}, ${response.statusText}`))
        //     .catch(err => console.error(err.message));

        const timerId = setInterval(() => {
            body.measure = randomInt(10, 1000).toString();
            option.body = JSON.stringify(body);
            console.log(option.body);
            fetch(methodUrl, option)
                .then(response => console.log(`${response.status}, ${response.statusText}`))
                .catch(err => console.error(err.message));
        }, 3000);

        setTimeout(() => {
            clearInterval(timerId);
        }, 12000);
    })
    .catch(err => console.error(err.message));*/
