var express = require('express');
var router = express.Router();
var path = require('path')
var debug = require('debug')('whoweare:index');
var gm = require('gm')


var topicType = {
  whoweare: {
    name: '我们是谁',
    tips: '输入对白后，点击立即生成',
    source: 'whoweare.png',
    position: [
      {
        formKey: 'who',
        keyName: '第一行问题',
        defaultValue: '我们是谁？',
        x: 82,
        y: 44
      },
      {
        formKey: 'whoanwser',
        keyName: '第一行答案',
        defaultValue: '甲方！',
        x: 384,
        y: 46
      },
      {
        formKey: 'thenask',
        keyName: '第二行问题',
        defaultValue: '我们要什么？',
        x: 82,
        y: 282
      },
      {
        formKey: 'thenawnser',
        keyName: '第二行答案',
        defaultValue: '不知道！',
        x: 384,
        y: 284
      },
      {
        formKey: 'lastask',
        keyName: '最后一行问题',
        defaultValue: '什么时候要？',
        x: 82,
        y: 512
      },
      {
        formKey: 'lastawnser',
        keyName: '最后一行答案',
        defaultValue: '现在要！',
        x: 384,
        y: 514
      }
    ]
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  var topicList = []
  Object.keys(topicType).forEach(key=>{
    topicList.push({
      id: key,
      name: topicType[key].name
    })
  })
  debug('首页的主题列表', topicList)
  res.render('index', {list: topicList})
});

/* GET home page. */
router.get('/:type', function(req, res, next) {
  // var formKeys = topicType[req,params.type].position.map(item=>{
  //   return item
  // })
  res.render('onetype', {
    title: topicType[req.params.type].name + '生成器',
    tips: topicType[req.params.type].tips,
    positions: topicType[req.params.type].position
  });
});


router.post('/:type', function (req, res, next) {
  // 预检查
  if (!req.params.type) {
    var err = new Error('主题错误');
    err.showMsg = '主题错误'
    next(err);
    return
  }
  if (!req.body) {
    var err = new Error('您需要填入文字');
    err.showMsg = '您需要填入文字'
    next(err);
    return
  }
  // chose pic for the type, and draw the text, and response the result pic
  var type = topicType[req.params.type]
  var sourcePic = path.join(__dirname, '../public/images/', type.source)
  debug('try to read pic', type, sourcePic)
  if (!sourcePic) {
    var err = new Error('服务端配置有误');
    next(err);
    return
  }

  var pic = gm(sourcePic).font(path.join(__dirname, '../public/fonts/simhei.ttf'), 24)
  type.position.forEach(item=>{
    // 对每个坐标写入文字
    debug('写入坐标', item.x, item.y, req.body[item.formKey])
    pic = pic.drawText(item.x, item.y, req.body[item.formKey])
  })

  pic.resize(600).autoOrient().toBuffer('PNG', function (err, buf) {
    // 必须先toBuff当做一个临时文件，再重新读入后append。否则有问题...
    console.log('合并上下两张图并输出结果')
    gm(buf, 'image.png').append(path.join(__dirname, '../public/images/qrcode.png')).resize(400).quality(60).toBuffer('JPG', function (err, buf) {
      if (err) {
        err.showMsg = '服务端合并图片出错'
        next(err)
        return
      }
      var base64Str = buf.toString('base64')
      var datauri = 'data:image/png;base64,' + base64Str;
      debug('dataurl是', datauri)
      res.render('result', {datauri: datauri})
    })

    // .stream('jpg', function (err, stdout, stderr) {
    //   if (err) {
    //     err.showMsg = '服务端合并图片出错'
    //     next(err)
    //     return
    //   }
    //   res.type('jpeg')
    //   stdout.pipe(res)
    // })
  })

  // var qrcode = gm(path.join(__dirname, '../public/images/qr.png')).resize(300, 300).write(path.join(__dirname, '../qrcode.png'), function (err) {
  //   debug('生成qrcode成功', err)
  //   var qrarea = gm(600, 400, "#eeeeee").font(path.join(__dirname, '../public/fonts/simhei.ttf'), 20).gravity('center').drawText(250, 40, "请扫描二维码生成自己的漫画对白").write(path.join(__dirname, '../qrarea.png'), function (err) {
  //     debug('生成qrarea成功', err)
  //     gm(path.join(__dirname, '../qrarea.png')).gravity('center').composite(path.join(__dirname, '../qrcode.png')).geometry('+0+80').write(path.join(__dirname, '../mergeqrcode.png'), function (err) {
  //       debug('生成合并二维码的区域', err)
  //     })
  //   })
  // })
  // gm(path.join(__dirname, '../public/images/whoweare.png')).composite(path.join(__dirname, '../public/images/qrcode.png')).geometry('+0+780').write(path.join(__dirname, '../public/tmp/result.png'), function (err) {
  //   debug('写成成功')
  //   res.send('OK')
  // })
  // pic.autoOrient().stream('png', function (err, stdout, stderr) {
  //   if (err) {
  //     err.showMsg = '服务端生成出错'
  //     next(err)
  //     return
  //   }
  //   res.type('png')
  //   // 图片输出流接入响应流
  //   stdout.pipe(res)
  // });

  // Jimp.read(sourcePic).then(pic=>{
  //   debug('read pic successful')
  //   Jimp.loadFont(path.join(__dirname, '../public/fonts/simhei.fnt')).then(function (font) {
  //     type.position.forEach(item=>{
  //       // 对每个坐标写入对应的文字
  //       pic.print(font, item.x, item.y, req.body[item.formKey]);
  //     })
  //     pic.quality(60)
  //     pic.write(path.join(__dirname, '../test.png'), (realok)=>{
  //       debug(realok)
  //       res.send('OK')
  //     })
  //   }).catch(err=>{
  //     err.showMsg = '字体加载失败'
  //     next(err);
  //     return
  //   });
  // }).catch(err=>{
  //   debug('read pic error', err)
  //   err.showMsg = '服务端读取原始图出错'
  //   next(err);
  //   return
  // })


})

module.exports = router;
