// 封装dao层
// const { pool } = require('./pool');
const { connection } = require('../db/pool');
const { LONG } = require('mysql/lib/protocol/constants/types');
const crypto = require('crypto')
    // 密匙
const SECRET_KEY = 'GxYLoj_0303#' // 密匙是自定的，但需要保存好
const moment = require('moment')


// md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex') // 把输出编程16进制的格式
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}` // 拼接方式是自定的，只要包含密匙即可
    return md5(str)
}


// console.log(md5('ceshimima'));

// 查询所有的数据
let findAllUser = (callback) => {

        let sql = 'select * from user'
        connection.query(sql, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    callback(result)
                        // connection.release()
                        // connection.destroy()
                }
            })
            // }
            // })
    }
    // //test.js
    // let findWeekData = (callback) => {
    //   connection.c
    // }







//查询本周数据
let findWeekData = (callback) => {
    // pool.getConnection((err, connection) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         let sql = 'select * from data'
    //         connection.query(sql, (err, result) => {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 callback(result)
    //                 connection.release()
    //                 connection.destroy()
    //             }
    //         })
    //     }
    // })
    // connection.connect();
    let sql = 'select * from data'
    connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                callback(result)
                    // connection.release()
                    // connection.destroy()
                    // connection.end();


            }
        })
        // connection.end()

}

//修改本周数据
let saveData = (data, callback) => {
    // connection.connect();
    let sql = 'update data set weekOrderCount = ?,weekOrderSum = ?,totalOrder = ?,totalPrice = ?'
    connection.query(sql, [data.weekOrderCount, data.weekOrderSum, data.totalOrder, data.totalPrice], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                result.code = 200
                result.message = '更新成功'
                callback(result)
            }
        })
        // console.log(data);

}

// 根据id查询用户信息
let findById = (id, callback) => {
    // pool.getConnection((err, connection) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    let sql = 'select * from user where id=?'
    connection.query(sql, [id], (err, result) => {
            if (err) {
                console.log(err)
            } else {
                callback(result)
                    // connection.release()
                    // connection.destroy()
            }
        })
        // }
        // })
}

let findByUsername = (username, password, callback) => {

    let sql = 'select * from user where username=?'
    connection.query(sql, [username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            // console.log(md5(password));
            if (result.length === 0) {
                callback({ code: 201, message: '用户不存在' })
            } else {
                if (result[0].password === md5(password)) {
                    callback({ code: 200, message: '登录成功', username: result[0].username })
                } else {
                    callback({ code: 201, message: '密码错误' })
                }
            }
        }
    })
}
let findCartByUsername = (username, callback) => {
    // console.log(username);
    let sql = 'select * from shoppingcart where username=?'
    connection.query(sql, [username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            callback(result)
        }
    })
}


// 新增用户或修改用户
let saveUser = (data, callback) => {
    // pool.getConnection((err, connection) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    if (data.id) {
        // 修改
        let sql = 'update user set username=?,password=? where id=?'
        connection.query(sql, [data.username, data.password, data.id], (err, result) => {
            if (err) {
                console.log(err)
            } else {
                result.code = 200
                result.message = '编辑成功'
                callback(result)
                    // connection.release()
                    // connection.destroy()
            }
        })
    } else {
        let idList = []

        findAllUser((result) => {
            result.forEach(item => {
                idList.push(item.id);
            })
            idList.sort((a, b) => a - b)

            function getNewID() {
                return idList[0] + 1
            }
            let newID = getNewID()
            while (idList.includes(newID)) {
                newID++
            }
            // 保存
            let sql = 'insert into user(id,username,password) values(?,?,?)'
            let sql1 = 'select * from user where username=?'
            let password = md5(data.password)
                // 判断用户名是否存在
            connection.query(sql1, [data.username], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(result.length);
                    if (result.length != 0) {
                        callback({ code: 201, messages: '用户已存在' })
                    } else {
                        // 发起请求
                        connection.query(sql, [newID, data.username, password], (err, result) => {
                            if (err) {
                                console.log(err)
                            } else {
                                result.code = 200
                                result.message = '添加成功'
                                callback(result)
                                    // connection.release()
                                    // connection.destroy()
                            }
                        })
                    }
                }
            })

        })




    }
    // }
    // })
}
let pushShoppingcart = (data, callback) => {
    let sql = 'insert into shoppingcart(username,iid,count) values(?,?,?)'
    let sql1 = 'select * from shoppingcart where username=?'
    let sql2 = 'update shoppingcart set count=? where username=? and iid=?'
    console.log(data);
    // let nowCart = [data.username, data.cart[0].iid]
    // let intersection = (arr1, arr2) => {
    //     return [...new Set(arr1)].filter((item) => {
    //         return arr2.includes(item);
    //     });
    // };
    // let nowCart = [...data.cart]
    //     // console.log(nowCart);
    // connection.query(sql1, [data.username], (err, result) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         result.forEach(item => {
    //             // console.log(Object.values(item));
    //             console.log(intersection(nowCart, Object.values(item)));
    //         });
    //     }
    // })

    //------------------------------------------------------------------
    // connection.query(sql1, [data.username], (err, result) => {
    //     if (err) {
    //         console.log(err);
    //     } else {

    //         //数组查重方法
    //         let intersection = (arr1, arr2) => {
    //             return [...new Set(arr1)].filter((item) => {
    //                 return arr2.includes(item);
    //             });
    //         };
    //         // console.log('---现有的---');
    //         //遍历根据传进来的用户名 查询到的所有购物车记录
    //         result.forEach(item => {
    //             //如果跟现有的有重复
    //             if (intersection(Object.values(item), nowCart).length === 2) {
    //                 let username = intersection(Object.values(item), nowCart)[0]
    //                 let iid = intersection(Object.values(item), nowCart)[1]
    //                     // console.log(username, iid);
    //                     // console.log(item.count);
    //                     //把对应的数量加一
    //                 connection.query(sql2, [item.count + 1, username, iid], (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                     } else {
    //                         return callback({ code: 200, message: '成功添加到后端' })
    //                     }
    //                 })
    //             }



    //         })




    //     }
    // })
    //------------------------------

    // console.log('新的 点一下数量加一');
    // data.cart.forEach(item => {
    //     // console.log(item);

    //     connection.query(sql, [data.username, item.iid, item.count], (err, result) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             callback({ code: 200, message: '添加成功' })
    //         }
    //     })
    // })
}

let saveShoppingcart = (data, callback) => {
    let sql = 'select * from shoppingcart'
    connection.query
}

let addCart = (data, callback) => {
    let sql = 'insert into shoppingcart(username,iid,count) values(?,?,?)'
    let sql1 = 'select * from shoppingcart where username=?'
    let sql2 = 'update shoppingcart set count=? where username=? and iid=? '
    let nowCart = []
    let nowCount = []
        // console.log(data);
        //先插一下对应用户名所有的购物车
    connection.query(sql1, [data.username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            //遍历结果
            console.log(result);
            if (result.length !== 0) {
                result.forEach(item => {
                    // console.log(Object.values(item));
                    nowCart.push(Object.values(item)[1])
                    nowCount.push(Object.values(item)[2])
                })
                console.log(nowCart);
                if (nowCart.indexOf(data.cart[0].iid) !== -1) {
                    index = nowCart.indexOf(data.cart[0].iid)
                        // console.log('有', index);
                    connection.query(sql2, [nowCount[index] + 1, data.username, nowCart[index]], (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            callback({ code: 200, message: '数量+1' })
                        }
                    })
                } else {
                    console.log('没有');
                    connection.query(sql, [data.username, data.cart[0].iid, 1], (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            callback({ coed: 200, message: '添加成功' })
                        }
                    })
                }
            } else {
                // 这个用户没有任何东西
                connection.query(sql, [data.username, data.cart[0].iid, 1], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        callback({ coed: 200, message: '添加成功' })
                    }
                })
            }
        }
    })
}

let updateShoppingCart = (data, callback) => {
    let sql = 'insert into shoppingcart(username,iid,count) values(?,?,?)'
    let sql1 = 'delete from shoppingcart where username = ?'
    connection.query(sql1, [data.username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            data.cart.forEach(item => {
                connection.query(sql, [data.username, item.iid, item.count], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        callback({ code: 200, message: '更新购物车成功' })
                    }
                })
            })

        }
    })
}

let saveAddress = (data, callback) => {
    let sql = 'insert into address(username,tel,name,province,city,county,postalCode) values(?,?,?,?,?,?,?)'
        // console.log(JSON.stringify(data.area));
    connection.query(sql, [data.username, data.tel, data.name, data.province, data.city, data.county, data.postalCode], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            callback({ code: 200, message: '添加成功' })
        }
    })
}


let findAddress = (username, callback) => {
    let sql = 'select * from address where username=?'
    connection.query(sql, [username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            result.address = []
            result.forEach(item => {
                result.address.push(Object.values(item))
            })
            result.code = 200
            callback(result)
        }
    })
}

let saveOrder = (data, callback) => {
    // console.log(data);
    let sql = 'insert into `order`(username,iid,count,create_time,pay,total_price) values(?,?,?,?,?,?)'
    let create_time = moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')
    data.product.forEach((item, index) => {
        connection.query(sql, [data.username, item.iid, item.count, create_time, data.pay === 1 ? '支付宝' : '微信', data.totalPrice], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (index + 1 === data.product.length) {
                    // console.log(result);
                    callback({ code: 200, message: '下单成功' })
                }
            }
        })
    })
}

let getOrderList = (username, callback) => {
    console.log(username);
    let sql = 'select * from `order` where username=?'
    connection.query(sql, [username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            let res = []
            result.forEach(item => {
                res.push(Object.values(item))
            })
            callback(res)
        }
    })
}

// // 根据id删除用户
// let deleteById = (id, callback) => {
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.log(err);
//         } else {
//             let sql = 'delete from user where id = ?'
//             connection.query(sql, [id], (err, result) => {
//                 if (err) {
//                     console.log(err)
//                 } else {
//                     callback(result)
//                     connection.release()
//                     connection.destroy()
//                 }
//             })
//         }
//     })
// }

module.exports = {
    findAllUser,
    findById,
    findByUsername,
    findCartByUsername,
    updateShoppingCart,
    saveUser,
    addCart,
    saveShoppingcart,
    pushShoppingcart,
    // deleteById,
    findWeekData,
    saveData,
    saveAddress,
    findAddress,
    saveOrder,
    getOrderList

}