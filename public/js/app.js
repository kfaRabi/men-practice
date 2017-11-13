function hideMessage(){
	document.getElementById("error-message").style.display = "none";
}

let card = document.getElementById("hide-message");
if(card){
	card.addEventListener("click", () => hideMessage());
}