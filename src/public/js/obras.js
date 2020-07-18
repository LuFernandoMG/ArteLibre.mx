$(document).ready(function () {
    $(function () {
        // Multiple images preview in browser
        let k = 0
        let imagesPreview = function (input, placeToInsertImagePreview) {

            if (input.files) {
                let filesAmount = input.files.length;
                for (i = 0; i < filesAmount; i++) {
                    let reader = new FileReader();
                    reader.onload = function (event) {
                        let divImage = 'div#' + k;
                        let imageID = 'image' + k;
                        $($.parseHTML('<div>')).attr('id', k).attr('class', 'col-4 col-md-3 col-lg-2 container-image-nueva').appendTo(placeToInsertImagePreview);
                        $($.parseHTML('<img>')).attr('src', event.target.result).attr('id', imageID).attr('onClick', 'eliminar(this.id)').attr('class', 'imagen-galeria-input btn').appendTo(divImage);
                        k++
                    }
                    reader.readAsDataURL(input.files[i]);
                }
            }

        };

        $('#gallery-photo-add').on('change', function () {
            imagesPreview(this, 'div.gallery');
        });
    });
});

function eliminar(e) {
    let node = document.getElementById(e);
    let parent = document.getElementById(node.parentNode.id);

    let gallery = document.getElementById('gallery');

    gallery.removeChild(parent);
}

function check() {
    let check = document.getElementById('gridCheck');

    if (check.checked == true) {
        document.querySelector('#label-check').innerText = 'Tu obra se subastará';
    } else {
        document.querySelector('#label-check').innerText = '¿Deseas subastar tu obra?';
    }
}

function checkdos() {
    let check = document.getElementById('gridCheck2');

    if (check.checked == true) {
        document.querySelector('#label-check2').innerText = 'Se habilitó la venta de multiples copias';
    } else {
        document.querySelector('#label-check2').innerText = '¿Venderás varias copias?';
    }
}

function checktres() {
    let check = document.getElementById('gridCheck3');
    let check4 = document.getElementById('check4');
    let check2 = document.getElementById('check2');
    let check1 = document.getElementById('check1');

    if (check.checked == true) {
        document.querySelector('#label-check3').innerText = 'Ya se vendió el original de la obra';
        check4.style.display = 'block';
        check2.style.display = 'none';
        check1.style.display = 'none';
    } else {
        document.querySelector('#label-check3').innerText = '¿El original de la obra ya se vendió?';
        check2.style.display = 'block';
        check1.style.display = 'block';
        check4.style.display = 'none';
    }
}

function checkcuatro() {
    let check = document.getElementById('gridCheck4');

    if (check.checked == true) {
        document.querySelector('#label-check4').innerText = 'Se habilitó la venta para giclée';
    } else {
        document.querySelector('#label-check4').innerText = '¿Venderás giclée de esta obra?';
    }
}

check()
checkdos()
checktres()
checkcuatro()

// Funciona <3

const precioA = document.getElementById('precioA');
const precioB = document.getElementById('precioB');
const precioC = document.getElementById('precioC');
const precioF = document.getElementById('precioF');

precioA.addEventListener('keyup', function () {
    let digitadoA = precioA.value;

    let pA = parseFloat(digitadoA);

    let pB = ((pA / .85) * .15).toFixed(2);
    let pC = (((pA / .85) * 0.036) + 3).toFixed(2);
    let pF = (parseFloat(pA) + parseFloat(pB) + parseFloat(pC)).toFixed(2);

    precioB.setAttribute('value', pB);
    precioC.setAttribute('value', pC);
    precioF.setAttribute('value', pF);
    precioB.value = pB;
    precioC.value = pC;
    precioF.value = pF;
});

precioB.addEventListener('keyup', function () {
    let digitadoB = precioB.value;

    let pB = parseFloat(digitadoB);

    let pA = ((pB / .15) * .85).toFixed(2);
    let pC = (((pB / .15) * 0.036) + 3).toFixed(2);
    let pF = (parseFloat(pA) + parseFloat(pB) + parseFloat(pC)).toFixed(2);

    precioA.setAttribute('value', pA);
    precioC.setAttribute('value', pC);
    precioF.setAttribute('value', pF);
    precioA.value = pA;
    precioC.value = pC;
    precioF.value = pF;
});

precioC.addEventListener('keyup', function () {
    let digitadoC = precioC.value;

    let pC = parseFloat(digitadoC)

    let pA = (((pC - 3) / 0.036) * .85).toFixed(2);
    let pB = (((pC - 3) / 0.036) * .15).toFixed(2);
    let pF = (parseFloat(pA) + parseFloat(pB) + parseFloat(pC)).toFixed(2);

    precioA.setAttribute('value', pA);
    precioB.setAttribute('value', pB);
    precioF.setAttribute('value', pF);
    precioB.value = pB;
    precioA.value = pA;
    precioF.value = pF;
});

precioF.addEventListener('keyup', function () {
    let digitadoF = precioF.value;

    let pF = parseFloat(digitadoF);

    let pA = (((pF - 3) / 1.036) * .85).toFixed(2);
    let pB = (((pF - 3) / 1.036) * .15).toFixed(2);
    let pC = ((((pF - 3) / 1.036) * .036) + 3).toFixed(2);

    precioA.setAttribute('value', pA);
    precioC.setAttribute('value', pC);
    precioB.setAttribute('value', pB);
    precioB.value = pB;
    precioC.value = pC;
    precioA.value = pA;
});