document.addEventListener("DOMContentLoaded", function(event){

    let form = document.getElementsByClassName('invoice-form')[0];
    form.addEventListener('focus', function(e){
        if(e.target.tagName.toLowerCase() === 'input' || 'textarea'){
            e.target.classList.add('focused');
        }
    }, true);

    form.addEventListener('blur', function(e){
        if(e.target.tagName.toLowerCase() === 'input' || 'textarea'){
            e.target.classList.remove('focused');
        }
    }, true);

    //-----Rendering invoices-----
    let requestOption = {
        method: 'GET',
        header: {
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    };
    sendRequest('./js/db.json', requestOption, function (xhr) {
        //-----Loader-----
        document.getElementsByClassName('loader')[0].style.display = 'none';
        //-----Rendering invoices-----
        renderInvoices(xhr, true);
    });


//=====Validation=====
    let number = document.getElementById('form-number'),
        dataInv = document.getElementById('form-invoiceData'),
        dataSup = document.getElementById('form-supplyData'),
        comment = document.getElementById('form-comment'),
        re_number = /^[0-9]{3,}$/,
        re_data = /^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/,
        re_comment = /^([а-яА-ЯёЁa-zA-Z]| ){2,}$/;
    //-----number-----
    number.addEventListener('input', function () {
        if(!re_number.test(this.value)){
            this.classList.add('invalid');
            this.classList.remove('focused');
            this.classList.remove('valid');
        } else{
            this.classList.add('valid');
            this.classList.remove('invalid');
        }
    });
    //-----invoice data-----
    dataInv.addEventListener('input', function () {
        if(!re_data.test(this.value)){
            this.classList.add('invalid');
            this.classList.remove('focused');
            this.classList.remove('valid');
        } else{
            this.classList.add('valid');
            this.classList.remove('invalid');
        }
    });
    //-----supply data-----
    dataSup.addEventListener('input', function () {
        if(!re_data.test(this.value)){
            this.classList.add('invalid');
            this.classList.remove('focused');
            this.classList.remove('valid');
        } else{
            this.classList.add('valid');
            this.classList.remove('invalid');
        }
    });
    //-----comment-----
    comment.addEventListener('input', function () {
        console.log(this.value, !re_comment.test(this.value));
        if(!re_comment.test(this.value)){
            this.classList.add('invalid');
            this.classList.remove('focused');
            this.classList.remove('valid');
        } else{
            this.classList.add('valid');
            this.classList.remove('invalid');
        }
    });



});
//End content load

function isValid(form) {
    let elem = {
        number: form.querySelector('input[name="number"]'),
        date_created: form.querySelector('input[name="data_invoice"]'),
        date_supplied: form.querySelector('input[name="data_supply"]'),
        comment: form.querySelector('textarea[name="comment"]')
    };
    for(let prop in elem){
        if (elem[prop].value == false){
            elem[prop].classList.add('invalid');
        }
    }


    return !document.getElementsByClassName('invalid').length;
}
//-----Assembly form-----
function validate(form) {
    if(isValid(form)){
        let elem = [{
            number: +form.querySelector('input[name="number"]').value,
            date_created: reverseDate(form.querySelector('input[name="data_invoice"]').value),
            date_supplied: reverseDate(form.querySelector('input[name="data_supply"]').value),
            comment: form.querySelector('textarea[name="comment"]').value
        }];
        console.log(elem);
        if(document.getElementsByClassName('invoice-form')[0].getAttribute('data-status') == 'edit'){
            saveEdit(elem[0], document.getElementsByClassName('invoice-form')[0].getAttribute('data-elem-count'));
        } else {
            renderInvoices(elem, false);
        }
        //-----reset-----
        form.reset();
        let ArrayValid = form.querySelectorAll('.valid');
        console.log(ArrayValid, Array.from(ArrayValid));
        Array.from(ArrayValid).forEach(function (classValid) {
            classValid.classList.remove('valid');
        });
        showForm(false);
    } else{
        console.warn('Is not valid!');
        }
}
//-----fn sendRequest-----
function sendRequest(route, option, callback) {
    let xhr = new XMLHttpRequest();
    if(route.indexOf('json' + 1)){
        xhr.overrideMimeType("application/json");
    }
    xhr.open(option.method, route, true);
    for(let prop in option.header){
        xhr.setRequestHeader(prop, option.header[prop]);
    }
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            let data = JSON.parse(xhr.responseText);
            console.log(data);
            callback(data);
        }
    };
    xhr.send(null);
}
//-----fn renderInvoices-----
let invoicesListArr = null;
function renderInvoices(array, flag) {
    if(flag) {
        invoicesListArr = array;
    }
    let tableInvoices = '';
    for(let i=0; i<array.length; i++){
        tableInvoices += `<tr>
                              <td>${array[i].date_created}</td>
                              <td>${array[i].number}</td>
                              <td>${array[i].date_supplied}</td>
                              <td>${array[i].comment}</td>
                              <td><button class="buttons" onclick="editInvoices(${i})"><i class="fas fa-pencil-alt"></i></button></td>
                              <td><button class="buttons" onclick="removeInvoice(this)"><i class="fas fa-trash-alt"></i></button></td>
                          </tr>`;
    }
    if(flag){
        document.querySelector('.invoices-table tbody').innerHTML = tableInvoices;
    } else {
        document.querySelector('.invoices-table tbody').insertAdjacentHTML( 'beforeend', tableInvoices );
    }
    // document.querySelector('.invoices-table tbody')[ flag ? 'innerHTML': 'appendChild' ] = tableInvoices;
}
//-----fn reverseDate-----
function reverseDate(string) {
    return string.split('-').reverse().join('-');
}
//-----fn addInvoices-----
function addInvoices() {
    document.getElementsByClassName('invoice-form')[0].dataset.status = 'save';
    showForm(true)
}
//-----fn showForm-----
function showForm(trigger) {
    document.getElementsByClassName('card-body')[0].style.display = trigger ? 'none' : 'block';
    document.getElementsByClassName('invoice-view')[0].style.display = trigger ? 'block' : 'none';
    showInvoices();
}
//-----fn removeInvoice-----
function removeInvoice(elem) {
    elem.closest('tr').remove();
    showInvoices();
}
//-----fn showInvoices-----
function showInvoices() {
    let trigger = document.querySelectorAll('table.invoices-table tbody tr').length;
    document.getElementsByClassName('invoices-table')[0].style.display = trigger ? 'block' : 'none';
    document.getElementsByClassName('dpl')[0].style.display = trigger ? 'block' : 'none';
    document.getElementsByClassName('no-items')[0].style.display = trigger ? 'none' : 'block';

    console.log(document.querySelectorAll('table.invoices-table tbody tr').length);
}
//-----fn reName-----
function reName(class_button, re_name) {
    let elem = document.getElementsByClassName(class_button)[0];
    elem.childNodes[1].value = re_name;
}
//-----fn editInvoices-----
function editInvoices(elem) {
    showForm(true);
    document.getElementsByClassName('invoice-form')[0].dataset.status = 'edit';
    document.getElementsByClassName('invoice-form')[0].dataset.elemCount = elem;
    reName('button', 'Edit');
    let form = document.getElementsByClassName('invoice-form')[0];
    let formInput = {
        number: form.querySelector('input[name="number"]'),
        date_created: form.querySelector('input[name="data_invoice"]'),
        date_supplied: form.querySelector('input[name="data_supply"]'),
        comment: form.querySelector('textarea[name="comment"]')
    };
    for (let prop in formInput){
        formInput[prop].value = invoicesListArr[elem][prop];
    }
}
//-----fn saveEdit-----
function saveEdit(formInput, index) {
    invoicesListArr[index].number = formInput.number;
    invoicesListArr[index].date_created = formInput.date_created;
    invoicesListArr[index].date_supplied = formInput.date_supplied;
    invoicesListArr[index].comment = formInput.comment;
    renderInvoices(invoicesListArr, true);
}