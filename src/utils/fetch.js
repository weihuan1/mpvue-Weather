//  使用Promise 封装微信request服务
export default function fetch (options = {}) {
  const {methods = 'GET', params = {}, showError = true, url = ''} = options
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: params,
      methods,
      header: {
        'content-type': 'application/json'
      },
      success (res) {
        if (showError) {
          if (res.statusCode < 200 || res.statusCode > 300) {
            reject(res.data || {})
          }
          // if (Number(res.data.status) !== 0) {
          //   reject(res.data || {})
          // }
        }
        resolve(res.data || {})
      },
      complete (res) {
        // TODO
      }
    })
  })
}
