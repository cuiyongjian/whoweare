// console.log('comcontentLoaded')
// var resultImg = document.querySelector('.result-img')
// if (resultImg) {
//   var callback = function (e) {
//     console.log('看是被谁调动的', e)
//     var loadingTag = document.querySelector('.loading-tips')
//     loadingTag.style.display = 'block'
//   }
//   console.log('是否已完成', resultImg.complete)
//   if (resultImg.complete) {
//     callback()
//   }
//   else {
//     console.log('添加img load事件')
//     resultImg.addEventListener('load', callback)
//   }
// }

// 由于dataUrl并不是外部资源，所以会等到dataurl也加载完毕，img loaded，才触发domContentLoaded，所以这里不适合用DomContetnLoaed.
// 然而却又真的没有其他办法，可以在这种情况下检测img的loaded。 而这种情况下，实际上DomContetnLoaded的时候，也就是img loaded的时候。
// 所以就直接用DomContentLoaded来判断状态算了。
document.addEventListener('DOMContentLoaded', function (event) {
  var loadingTag = document.querySelector('.loading-tips')
  loadingTag.style.display = 'none'
})
