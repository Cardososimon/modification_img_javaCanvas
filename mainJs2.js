"use strict";
let worker = new Worker('worker.js');

document.getElementById('btImg').addEventListener('click',function(event){
	let img = document.getElementById('file').files[0];
	let promise =loadFileRerader(img);

	promise.then(function(image){
		let newpromise=loadimage(image);
		return newpromise;
	}).then(function(buffer){
			worker.postMessage([buffer]);
			changeValue();
		}).catch();
});

worker.addEventListener('message',function(event){
	let uint8clamperarray=new Uint8ClampedArray(event.data);
	let imagedata= new ImageData(uint8clamperarray,300,300);
	imagedata_to_image(imagedata);
});

function imagedata_to_image(imagedata) {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
}
function changeValue(){
	document.querySelectorAll('.color').forEach(element =>{
		element.addEventListener('change',()=>{
			let rouge=document.getElementById('rouge').value;
			let vert=document.getElementById('vert').value;
			let bleu=document.getElementById('bleu').value;
			worker.postMessage(rouge+","+vert+","+bleu);
		})
	})

}

function loadFileRerader(img ){
	let fileReader = new FileReader();
	fileReader.readAsDataURL(img);
	let promise = new Promise(function (resolve,reject){
		fileReader.addEventListener("load", function (event) {
        	let image = new Image();
        	image.height=300;
        	image.width=300;
        	image.src = this.result;
        	resolve(image);
        });
        fileReader.addEventListener('error',function(event){
        	reject(new Error("can't read to dataurl"));
        });
	});
	return promise;
}
function loadimage(image){
	let promise = new Promise(function (resolve,reject){
		image.addEventListener("load",function(event){
       	let canvas=document.getElementById('canvas').getContext('2d');
        	canvas.drawImage(image, 0, 0, 300, 300);
        	let buffer= canvas.getImageData(0, 0, 300, 300).data.buffer;
        	resolve(buffer);
        });
        image.addEventListener("error",function(event){
        	reject(new Error("je charge pas l'image dans le canvas"));
        });  
	});
	return promise;
}