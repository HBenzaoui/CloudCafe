const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-from');

//Create element and render cafe
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross= document.createElement('div');

    li.setAttribute("data-id", doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent= 'X';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    //Deleting data
    cross.addEventListener('click', (e) =>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    })

}

//Getting data
// db.collection('cafes').orderBy('name').get().then((snapshot) => {
//     snapshot.docs.forEach(element => {
//         renderCafe(element);
//     });
// })

//Saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(form.name.value != '' && form.city.value != ''){
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
        form.name.value = '';
        form.city.value = '';

    } else {
        if (form.name.value == ''){
        form.name.focus();
        } else if(form.city.value == ''){
        form.city.focus();
        }
    }
});

//real-time listner
db.collection('cafes').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if(change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' +change.doc.id + ']');
            cafeList.removeChild(li);
        }
    })
})