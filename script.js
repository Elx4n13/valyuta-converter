window.addEventListener('load', e => getInfo(e));

const form = document.forms[0];

const numberMask = IMask(
    document.querySelector('input[name=to]'), {
        mask: Number,
        radix: '.',
        mapToRadix: [',']
    });
const numberMaskk = IMask(
    document.querySelector('input[name=from]'), {
        mask: Number,
        radix: '.',
        mapToRadix: [',']
    });
form.addEventListener('input', e => getData(e));
async function getData(e) {
    const data = getFormData();
    const toValue = document.querySelector('input[name=to]');
    const fromValue = document.querySelector('input[name=from]');
    if (e.target.name !== 'to') {

        const valyutaa = await fetch(`https://api.exchangerate.host/latest?base=${data['value-left']}&symbols=${data['value-right']}`).then(response => response.json());
        const rate = valyutaa.rates[`${data['value-right']}`];


        if (data.from != '' && data.from != '.') {
            data.to = (data.from * rate).toFixed(4)
        } else {
            data.to = '';
            data.from = ''
            fromValue.value = ''
        }
        toValue.value = data.to;

    } else {
        const valyutaa = await fetch(`https://api.exchangerate.host/latest?base=${data['value-right']}&symbols=${data['value-left']}`).then(response => response.json());
        const rate = valyutaa.rates[`${data['value-left']}`]
        if (data.to != '' && data.to != '.') {
            data.from = (data.to * rate).toFixed(4)
        } else {
            data.to = ''
            data.from = '';
            toValue.value = ''
        }
        fromValue.value = data.from;
    }
}

function getFormData() {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((v, k) => data[k] = v);
    return data
}


const valyutaName = document.querySelectorAll('.valyuta-name')
valyutaName.forEach(t => t.addEventListener('click', getInfo))

async function getInfo() {
    const data = getFormData();
    const valyutaaLeft = await fetch(`https://api.exchangerate.host/latest?base=${data['value-left']}&symbols=${data['value-right']}`).then(response => response.json());
    const rateLeft = valyutaaLeft.rates[`${data['value-right']}`];
    const leftText = document.querySelector('.left-text')
    leftText.innerHTML = `1 ${data['value-left']} = ${rateLeft.toFixed(4)} ${data['value-right']}`
    const valyutaaRight = await fetch(`https://api.exchangerate.host/latest?base=${data['value-right']}&symbols=${data['value-left']}`).then(response => response.json());
    const rateRight = valyutaaRight.rates[`${data['value-left']}`];
    const rightText = document.querySelector('.right-text')
    rightText.innerHTML = `1 ${data['value-right']} = ${rateRight.toFixed(4)} ${data['value-left']}`
}