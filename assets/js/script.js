
let header = document.getElementById("userInformation").innerHTML;

const btnDoubleMoney = document.getElementById('btnDoubleMoney');
const btnShowMillionaires = document.getElementById('btnShowMillionaires');
const btnSort = document.getElementById('btnSort');
const btnCalculateTotal = document.getElementById('btnCalculateTotal');
const main = document.getElementById('main');

var myUsers ;
const storageUsers = JSON.parse(localStorage.getItem("Myusers" || "[]"));
// CHECK IF LOCALSTORAGE IS EMPTY
if(!window.localStorage.getItem("Myusers")){
    myUsers = [];
}else{
    myUsers = storageUsers;
    myUsers.forEach(currentuser => {
        addToBody(currentuser);
    });
}
// remove loading 
window.onload = () => {
    setTimeout(() => {
        document.getElementById('loadingPage').style.display = "none"
    }, 200)
}
// dark and night mode function
var checkIfEven = 1;
// CHECK THE MODE SELECTED 
function checkEvenOrOdd() {
    checkIfEven = window.localStorage.getItem("check");
    if ((checkIfEven % 2) != 0) {
        document.getElementById("selectCircle").classList.add("night-circle");

        document.body.classList.add("night-mode");

    } else {
        document.getElementById("selectCircle").classList.remove("night-circle");

        document.body.classList.remove("night-mode");
    }
}
// APPLY DARK MODE STYLE ON CLICK THE BUTTON
document.getElementById("select").addEventListener('click', () => {
    checkIfEven++;
    window.localStorage.setItem("check", checkIfEven);
    checkEvenOrOdd();
})

// get last mode selected from local storage
checkEvenOrOdd();




// REMOVE THE MODEL 
let removeModel = () => {
    document.getElementById("modelMessage").classList.remove("transform")
    document.getElementById("theModel").style.display = "none";
}

// show the model 
let showModel = () => {
    document.getElementById("theModel").style.display = "block";
    document.getElementById("modelMessage").classList.add("transform")
}
// CLEAR ALL DATA 
let clearData = () => {
    if (document.getElementById("userInformation").innerHTML != header) {
        document.getElementById("userInformation").innerHTML = header;
        removeModel();
        myUsers = [];
        localStorage.removeItem("Myusers")
    } else {
        alert("There is nothing to delete");
        removeModel();
    }

}
document.getElementById("delete").addEventListener('click', showModel);
document.getElementById("cancelModel").addEventListener('click', removeModel);
document.getElementById("close").addEventListener('click', removeModel);
document.getElementById("deleteAll").addEventListener('click', clearData);

// adding new user 

// ADD ELEMENT CREATED TO BODY
function addToBody(user) {
    let div = document.createElement("div");
    div.innerHTML = `<p>${user.name}</p> <span>${user.wealth} $</span>`
    div.classList.add("content__information__person")
    document.getElementById("userInformation").appendChild(div);
}
// SAVE TO LOCALSTORAGE 
function saveToStorage(){
    localStorage.setItem("Myusers",JSON.stringify(myUsers))
}
// DISPLAY THE ITEMS OF THE ARRAY OF THE USERS
function displayItems(){
    document.getElementById("userInformation").innerHTML=`<h4>person <span>wealth</span></h4>`
    myUsers.forEach(user=>{
        addToBody(user);
    })
}
// CALC TOTAL WEALTH FOR ALL USERS 
function calc(){
    let totalWealth = myUsers.reduce((total, user) => (total += user.wealth), 0);
    return totalWealth;
}
// GET RANDOM USER FROM API AND GIV IT A RANDOM WEALTH
var getTheUser = async () => {
    let response = await (await fetch('https://randomuser.me/api')).json();
    user = {
        name: ` ${response.results[0].name.first} ${response.results[0].name.last}`,
        wealth: Math.floor(Math.random() * 1000000)
    };
    let TheTotalValue = calc() + user.wealth;
    if(document.getElementById("theTotal")){
        document.getElementById("theTotal").innerHTML = TheTotalValue.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " $" ;
    }
    myUsers.push(user);
    saveToStorage();
    addToBody(user);
    setTimeout(()=>{
        document.getElementById('loadingPage').style.display = "none";
    },50)
}
let doubleMoney = async () => {    
    myUsers = myUsers.map(currentuser => {
        return {name: currentuser.name, wealth: currentuser.wealth * 2}
    });
    saveToStorage();
    displayItems()
};
let showMillionaires = async () => {
    myUsers = myUsers.filter(user => user.wealth >= 1000000);
    saveToStorage();
    displayItems()
}

let sort = async () => {
    myUsers = myUsers.sort((user1, user2) => user2.wealth - user1.wealth)
    saveToStorage();
    displayItems();
}

let calculateTotal = async () => {
    removeTotalDiv();
    
    let element = document.createElement('div');
    element.classList.add('total');
    element.innerHTML = `<span>Total Wealth</span> <span id="theTotal" >${calc().toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')} $</span>`;
    document.getElementById("userInformation").appendChild(element);
}
const removeTotalDiv = () => {
    let totalDiv = document.getElementsByClassName('total')[0];
    if (totalDiv != null) {
        totalDiv.remove();
    }
};


// CALL THE FUNCTION AFTER CLICKING THE BUTTON 
document.getElementById("add").onclick = function () {
    document.getElementById('loadingPage').style.display = "flex";
    getTheUser();
}
btnDoubleMoney.addEventListener('click', doubleMoney);
btnShowMillionaires.addEventListener('click', function(){
    var checkVariable ;
    for(let i =0;i<myUsers.length ; i++){
        if(myUsers[i].wealth < 1000000 ){
            checkVariable = 1;
        }else{
            checkVariable = 0;
            break;
        }
    }
    if(checkVariable === 1){
        alert("all the wealth of users are less than million");
    }else{
        showMillionaires()
    }
});
btnSort.addEventListener('click', sort);
btnCalculateTotal.addEventListener('click', calculateTotal);



