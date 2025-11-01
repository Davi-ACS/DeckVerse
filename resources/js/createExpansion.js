const dia = document.getElementById('release_day');
const mes = document.getElementById('release_month');
const ano = document.getElementById('release_year');

mes.addEventListener('input', () => {
    const month = parseInt(mes.value);
    let maxDays;

    switch (month) {
        case 2:
            if ((ano.value % 4 === 0 && ano.value % 100 !== 0) || (ano.value % 400 === 0)) {
                maxDays = 29;
            } else {
                maxDays = 28;
            }
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            maxDays = 30;
            break;
        default:
            maxDays = 31;
    }
    dia.max = maxDays;
    if (parseInt(dia.value) > maxDays) {
        dia.value = maxDays;
    }
});

ano.addEventListener('input', () => {
    const month = parseInt(mes.value);
    let maxDays;

    switch (month) {
        case 2:
            if ((ano.value % 4 === 0 && ano.value % 100 !== 0) || (ano.value % 400 === 0)) {
                maxDays = 29;
            } else {
                maxDays = 28;
            }
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            maxDays = 30;
            break;
        default:
            maxDays = 31;
    }
    dia.max = maxDays;
    if (parseInt(dia.value) > maxDays) {
        dia.value = maxDays;
    }
});
