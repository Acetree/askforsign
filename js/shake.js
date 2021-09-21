"use strict";

$(function () {
   
    testPermission()
    // shake()
    // iosGrantedTips()
})

function testPermission() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("like mac os x") > 0) {
        var reg = /os [\d._]*/gi;
        var verinfo = ua.match(reg);
        var version = (verinfo + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, ".");
        var arr = version.split(".");
        // alert(arr[0] + "." + arr[1] + "." + arr[2])
        if (arr[0] > 12) {
            DeviceMotionEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') {
                    shake() //摇一摇
                } else if (permissionState === 'denied') {
                    
                    alert('Permission is needed. Please click the Authorize button.')
                }
            }).catch((err) => {
                alert('Permission is needed. Please click the Authorize button to permit.')
            });
        } else {
            alert("Your iOS version is too old. iOS 13+ is needed.")
        }
    }
}



function shake() {
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", deviceMotionHandler, false);
    } else {
        alert("Sorry, your browser does not support device motion. Please try Chrome.");
    }
}

var SHAKE_THRESHOLD = 500;
var last_update = 0;
var x, y, z, last_x = 0, last_y = 0, last_z = 0;

function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();
    if ((curTime - last_update) > 10) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
        if (speed > SHAKE_THRESHOLD) {
            alert('shaked');
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}

function iosGrantedTips() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("like mac os x") > 0) {
        var reg = /os [\d._]*/gi;
        var verinfo = ua.match(reg);
        var version = (verinfo + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, ".");
        var arr = version.split(".");
        alert(arr[0] + "." + arr[1] + "." + arr[2])
        if (arr[0] > 12) {
            DeviceMotionEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') {
                    shake() //摇一摇
                } else if (permissionState === 'denied') {
                    // ios13granted();
                    alert('Permission is needed. Please click the authorize button.')
                }
            }).catch((err) => {
                alert('Permission is needed. Please click the authorize button and click permit.')
            });
        } else {
            alert("Your iOS version is too old. iOS 13+ is needed.")
        }
    }
}

function getPermission() {
    if (
        typeof window.DeviceMotionEvent !== 'undefined' &&
        typeof window.DeviceMotionEvent.requestPermission === 'function'
    ) {
        window.DeviceMotionEvent.requestPermission()
            .then(function (state) {
                if ('granted' === state) {
                    shake()
                } else {
                    alert('Permission is needed. Please click the authorize button.')
                }
            })
            .catch(function (err) {
                alert('error: ' + err)
            })
    }
}

// function ios13granted() {
//     if (typeof DeviceMotionEvent.requestPermission === 'function') {
//         DeviceMotionEvent.requestPermission().then(permissionState => {
//             if (permissionState === 'granted') {
//                 shake()
//             } else if (permissionState === 'denied') {
//                 alert('Permission is needed. Please click the authorize button.')
//             }
//         }).catch((error) => {
//             alert("Some unknown errors. Probably you can try Chrome.")
//         })
//     } else {
//         alert("Your iOS device is not supported. Please try another device.")
//     }
// }


