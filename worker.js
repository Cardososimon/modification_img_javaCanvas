"use strict";
let saveArray;
self.addEventListener('message',function(event){
	let tmp=event.data;
	if(typeof tmp ==="string"){
		let array=new Uint8Array(saveArray)
		let val =tmp.split(',')
		imgRGB(0,parseInt(val[0]),array);
		imgRGB(1,parseInt(val[1]),array);
		imgRGB(2,parseInt(val[2]),array);
		self.postMessage(array);
	}
	else{
		saveArray=new Uint8Array(tmp[0])
	}
});

function imgRGB(couleur,valeur,array){
	for(let i=0;i<array.length;i+=4){
		if(array[i+couleur]+valeur>255) array[i+couleur]=255
		else if(array[i+couleur]+valeur<0) array[i+couleur]=0
		else array[i+couleur]=array[i+couleur]+valeur;
	}
}