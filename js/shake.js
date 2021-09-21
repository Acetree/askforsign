"use strict";

$(function(){
    shake()//运动事件监听
    iosGrantedTips()//ios权限授予提示
})

function shake(){
    //运动事件监听
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion',deviceMotionHandler,false);
    }
}



//获取加速度信息
//通过监听上一步获取到的x, y, z 值在一定时间范围内的变化率，进行设备是否有进行晃动的判断。
//而为了防止正常移动的误判，需要给该变化率设置一个合适的临界值。
var SHAKE_THRESHOLD = 200;
var last_update = 0;
var x, y, z, last_x = 0, last_y = 0, last_z = 0;

function deviceMotionHandler(eventData) {
    var acceleration =eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();
    if ((curTime-last_update)> 10) {
        var diffTime = curTime -last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;
        if (speed > SHAKE_THRESHOLD) {
            alert('shaked');
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}

/* 此处以上代码安卓手机均可正常实现摇一摇，以下代码针对ios手机做授权处理 */

function iosGrantedTips(){
    var ua = navigator.userAgent.toLowerCase(); //判断移动端设备，区分android，iphone，ipad和其它
    if(ua.indexOf("like mac os x") > 0){ //判断苹果设备
        // 正则判断手机系统版本
        var reg = /os [\d._]*/gi ;
        var verinfo = ua.match(reg) ;
        var version = (verinfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");
        var arr=version.split(".");
        alert(arr[0]+"."+arr[1]+"."+arr[2]) //获取手机系统版本
        if (arr[0]>12) {  
            DeviceMotionEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') { //已授权
                    shake() //摇一摇
                } else if(permissionState === 'denied'){// 打开的链接不是https开头
                    ios13granted();
                    alert("当前IOS系统拒绝访问动作与方向。请退出微信，重新进入活动页面获取权限。")
                }
            }).catch((err)=>{
                alert("用户未允许权限")
                //======这里可以防止重复授权，需要改动，因为获取权限需要点击事件才能触发，所以这里可以改成某个提示框===//
                console.log("由于IOS系统需要手动获取访问动作与方向的权限，为了保证摇一摇正常运行，请在访问提示中点击允许！")
              
            });
        }else{  //13.3以前的版本
            alert("苹果系统13以前的版本")
        }
    }
}

function getPermission() {
    if (
      typeof window.DeviceMotionEvent !== 'undefined' &&
      typeof window.DeviceMotionEvent.requestPermission === 'function'
    ) {
      window.DeviceMotionEvent.requestPermission()
        .then(function(state) {
          if ('granted' === state) {
            //用户同意授权
            startListen()
          } else {
            //用户拒绝授权
            alert('摇一摇需要授权设备运动权限,请重启应用后,再次进行授权!')
          }
        })
        .catch(function(err) {
          alert('error: ' + err)
        })
    }
  }

function ios13granted() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') {
                shake() //摇一摇
            } else if(permissionState === 'denied'){// 打开的链接不是https开头
                alert("当前IOS系统拒绝访问动作与方向。请退出微信，重新进入活动页面获取权限。")
            }
        }).catch((error) => {
            alert("请求设备方向或动作访问需要用户手势来提示")
        })
    } else {
        // 处理常规的非iOS 13+设备
        alert("处理常规的非iOS 13+设备")
    }
}


function startListen() {
    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", deviceMotionHandler, false);
    } else {
      alert("该浏览器不支持摇一摇功能");
    }
  }