function loading(callback){
    if (document.querySelector(".loading")) return;
    const div = document.createElement("div");
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    const span3 = document.createElement("span");
    div.classList.add("loading");
    document.body.appendChild(div);
    div.appendChild(span);
    div.appendChild(span2);
    div.appendChild(span3);
    setTimeout(() => hideloading(callback), 2000 );
    function hideloading(callback){
        const classes = document.getElementsByClassName("loading");
        if(classes.length){
            classes[0].remove()
        }
        if (typeof callback === "function") {
            callback();
        }
    }
}