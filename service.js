const http = require('http');
const url = require('url');
const querystring = require('querystring');
const moment = require('moment')

const { findAllUser, findById, findByUsername, getOrderList, saveOrder, findCartByUsername, saveAddress, findAddress, pushShoppingcart, updateShoppingCart, saveUser, deleteById, findWeekData, saveData, saveShoppingcart, addCart } = require('./db/mall.js');
const json = require('body-parser/lib/types/json');





// let bodyParser = require('body-parser')

// let urlencodedParser = bodyParser.urlencoded({ extended: false })

// let current_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
let server = http.createServer((req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {
        'Content-Type': 'text/plain;charset=uft-8;',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'XMLHttpRequest'


    })
    if (req.method === 'GET') {
        // 请求的地址 path_
        var path_ = url.parse(req.url).pathname
            // 前端发送给给后端的数据
        var params = querystring.parse(url.parse(req.url).query)

        switch (path_) {
            case '/user/findAllUser':
                findAllUser((result) => {
                    // 将从数据库里面查询出来的数据返回给前端
                    res.end(JSON.stringify(result))
                })
                break;
            case '/user/findByUsername':
                findByUsername(params.username, params.password, (result) => {
                    res.end(JSON.stringify(result))
                })
                break;
            case '/user/findById':
                // 将前端传递过来的id作为参数发送给findById
                // console.log(url.parse(req.url));
                findById(params.id, (result) => {
                    // 将从数据库里面查询出来的数据返回给前端
                    res.end(JSON.stringify(result))
                })
                break;
            case '/user/deleteById':
                // 将前端传递过来的id作为参数发送给findById
                deleteById(params.id, (result) => {
                    // 将从数据库里面查询出来的数据返回给前端
                    res.end(JSON.stringify(result))
                })
                break;
                //本周数据
            case '/ldc/findWeekData':
                console.log(url.parse(req.url));
                console.log(moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') + '    查询数据');
                findWeekData((result) => {
                    res.end(JSON.stringify(result))
                        // console.log(result);
                    res.end()


                })
                break;
            case '/cart/findCart':
                findCartByUsername(params.username, (result) => {
                    res.end(JSON.stringify(result))
                })
                break;
            case '/address':
                findAddress(params.username, (result) => {
                    res.end(JSON.stringify(result))
                })
                break;
            case '/order/get':
                getOrderList(params.username, (result) => {
                    res.end(JSON.stringify(result))
                })
                break;
            default:
                break;
        }
    }

    if (req.method === 'POST') {
        // 请求的地址 path_
        var path_ = url.parse(req.url).pathname
        let paramsData = ''
        let buffer = Buffer.from([])
        switch (path_) {
            case '/user/saveOrUpdate':
                console.log('请求到');
                req.on('data', (data) => {
                    buffer += data
                    saveUser(JSON.parse(buffer), (result) => {
                        res.end(JSON.stringify(result))
                    })
                })
                req.on('end', () => {})
                break;


                // req.on('data', (chunk) => {
                //     paramsData += chunk
                //     paramsData = querystring.parse(paramsData)
                //     console.log(paramsData);
                // })

            case '/ldc/saveData':
                console.log(moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') + '    保存数据---->' + '\n');
                console.log('----------');
                // console.log();
                req.on('data', (chunk) => {
                    paramsData += chunk
                    paramsData = querystring.parse(paramsData)
                    console.log(paramsData);
                    console.log('\n' + '----------');
                    saveData(paramsData, result => {
                        res.end(JSON.stringify(result))
                    })
                });
                req.on('end', () => {})
                break;
                // console.log(postData);

            case '/cart/saveCart':
                req.on('data', (data) => {
                    buffer += data
                        // console.log(JSON.parse(buffer));
                        // saveShoppingcart(querystring.parse(buffer.toString()), (result) => {
                        //     res.end(JSON.stringify(result))
                        // })
                        // saveShoppingcart(JSON.parse(buffer)), (result) => {
                        //     res.end(JSON.stringify(result))
                        // })
                    pushShoppingcart(JSON.parse(buffer), result => {
                        res.end(JSON.stringify(result))
                    })
                })
                req.on('end', () => {})
                break;
            case '/cart/update':
                req.on('data', (data) => {
                    buffer += data
                    updateShoppingCart(JSON.parse(buffer), result => {
                        res.end(JSON.stringify(result))
                    })
                })
                req.on('end', () => {})
                break;
            case '/cart/addCart':
                req.on('data', (data) => {
                    buffer += data
                    addCart(JSON.parse(buffer), result => {
                        res.end(JSON.stringify(result))
                    })
                })
                req.on('end', () => {})
                break;
            case '/address/add':
                req.on('data', (data) => {
                    buffer += data
                    saveAddress(JSON.parse(buffer), result => {
                        res.end(JSON.stringify(result))
                    })
                })
                req.on('end', () => {})
                break;
            case '/order/save':
                req.on('data', (data) => {
                    buffer += data
                    saveOrder(JSON.parse(buffer), result => {
                        res.end(JSON.stringify(result))
                    })
                })
                req.on('end', () => {})
                break;
        }

    }
})

server.listen(8092, () => {
    console.log('启动成功')
})