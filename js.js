/* Triangle calculator */

window.onload = function () {

  // Reset fields
  document.querySelectorAll('input').forEach(input => input.value = '');
  document.querySelectorAll('label').forEach(label => label.classList.remove('active'));

  let inputParameters = document.querySelectorAll('.parameter');
  inputParameters.forEach(parameter => parameter.addEventListener('keyup', calculate));

  function calculate() {

    // Cleaning up non-numeric characters
    this.value = this.value.replace(/[^.\d]+/g, '').replace(/^([^\.]*\.)|\./g, '$1');

    // Mark used fields
    this.value ? this.classList.add('used') : this.classList.remove('used');

    if (document.querySelectorAll('.used').length == 3) {

      // Disable unused fields
      document.querySelectorAll('.parameter:not(.used)').forEach(parameter => parameter.disabled = true);

      let sides = [];
      document.querySelectorAll('.side').forEach(side => sides.push(side.id));

      let angles = [];
      document.querySelectorAll('.angle').forEach(angle => angles.push(angle.id));

      let usedSides = {};
      document.querySelectorAll('.side.used').forEach(side => usedSides[side.id] = +side.value);

      let usedAngles = {};
      document.querySelectorAll('.angle.used').forEach(angle => usedAngles[angle.id] = +angle.value);

      switch (Object.keys(usedSides).length) {
      case 3:

        if (sidesHasError(usedSides, sides)) {
          printError('Длина одной из сторон больше, чем сумма двух других!');
          break;
        }

        getAngles(usedSides, usedAngles, angles);
        getPerimeter(usedSides);
        getArea(usedSides, usedAngles);

        break;

      case 2:
        let usedAngle = Object.keys(usedAngles)[0];
        let oppositeSide = sides[angles.indexOf(usedAngle)];

        if (usedSides.hasOwnProperty(oppositeSide)) {
          printError('Не достаточно параметров!');
          break;
        } else {
          getThirdSide(usedSides, usedAngles);
          getAngles(usedSides, usedAngles, angles, usedAngle);
        }

        getPerimeter(usedSides);
        getArea(usedSides, usedAngles);

        break;
      case 1:

        if (anglesHasError(usedAngles)) {
          printError('Введено некорректное значение угла!');
          break;
        }

        let sumUsedAngles = 0;
        for (let angle in usedAngles) {
          sumUsedAngles += usedAngles[angle];
        }

        if (sumUsedAnglesHasError(sumUsedAngles)) {
          printError('Сумма двух углов равна или больше 180°!');
          break;
        }

        getThirdAngle(usedAngles, sumUsedAngles);
        getSides(usedSides, usedAngles, sides, angles)

        getPerimeter(usedSides);
        getArea(usedSides, usedAngles);

        break;

      case 0:
        printError('Необходимо указать значение хотя бы одной стороны!');
      }

    } else {

      // Enable all fields
      inputParameters.forEach(parameter => parameter.disabled = false);

      cleanUnusedFields();

    }

  }

};

function sidesHasError(usedSides, sides) {
  for (let i = 0; i < sides.length; i++) {
    let a = Object.values(usedSides).slice(i - 2)[0];
    let b = Object.values(usedSides).slice(i - 1)[0];
    let c = Object.values(usedSides)[i];

    if (a > b + c) {
      return true;
    }
  }
}

function anglesHasError(usedAngles) {
  for (let angle in usedAngles) {
    if (usedAngles[angle] <= 0 || usedAngles[angle] >= 180) {
      return true;
    }
  }
}

function sumUsedAnglesHasError(sumUsedAngles) {
  if (sumUsedAngles >= 180) {
    return true;
  }
}

function getThirdSide(usedSides, usedAngles) {
  let inputThirdSide = document.querySelector('.side:not(.used)');
  let thirdSide = inputThirdSide.id;

  let a = Object.values(usedSides)[0];
  let b = Object.values(usedSides)[1];
  let angle = Object.values(usedAngles)[0];

  usedSides[thirdSide] = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * Math.cos(angle * (Math.PI / 180)));
  printValue(inputThirdSide, usedSides[thirdSide]);
}

function getThirdAngle(usedAngles, sumUsedAngles) {
  let inputThirdAngle = document.querySelector('.angle:not(.used)');
  let thirdAngle = inputThirdAngle.id;

  usedAngles[thirdAngle] = 180 - sumUsedAngles;
  printValue(inputThirdAngle, usedAngles[thirdAngle]);
}

function getSides(usedSides, usedAngles, sides, angles) {
  let usedSide = Object.keys(usedSides)[0];
  let usedSideNumber = sides.indexOf(usedSide);

  for (let i = 0; i < sides.length; i++) {
    if (sides[i] != usedSide) {
      let a = usedSides[usedSide];
      let angleA = usedAngles[angles[i]];
      let angleB = usedAngles[angles[usedSideNumber]];

      usedSides[sides[i]] = a * Math.sin(angleA * (Math.PI / 180)) / Math.sin(angleB * (Math.PI / 180));
      printValue(document.getElementById(sides[i]), usedSides[sides[i]]);
    }
  }
}

function getAngles(usedSides, usedAngles, angles, usedAngle) {
  for (let i = 0; i < angles.length; i++) {
    if (angles[i] != usedAngle) {

      let a = Object.values(usedSides).slice(i - 2)[0];
      let b = Object.values(usedSides).slice(i - 1)[0];
      let c = Object.values(usedSides)[i];

      usedAngles[angles[i]] = (Math.acos((Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b)) * 180) / Math.PI;
      printValue(document.getElementById(angles[i]), usedAngles[angles[i]]);

    }
  }
}

function getPerimeter(usedSides) {
  let perimeter = 0;
  for (let value of Object.values(usedSides)) {
    perimeter += value;
  }

  printValue(document.getElementById('perimeter'), perimeter);
}

function getArea(usedSides, usedAngles) {
  let a = Object.values(usedSides)[0];
  let b = Object.values(usedSides)[1];
  let angle = Object.values(usedAngles)[0];

  let area = a * b * Math.sin(angle * (Math.PI / 180)) / 2;

  printValue(document.getElementById('area'), area);
}

function printValue(field, value) {
  field.value = +value.toFixed(5);
  field.nextElementSibling.classList.add('active');
}

function printError(message) {
  document.querySelectorAll('input:not(.used)').forEach(input => input.value = message);
  document.querySelectorAll('input:not(.used)').forEach(input => input.nextElementSibling.classList.add('active'));
}

function cleanUnusedFields() {
  document.querySelectorAll('input:not(.used)').forEach(input => input.value = '');
  document.querySelectorAll('input:not(.used)').forEach(input => input.nextElementSibling.classList.remove('active'));
}
