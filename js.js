/* Triangle calculator */

//добавить описание
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

        if (sidesHasErrors(usedSides, sides)) {
          printError('Длина одной из сторон больше, чем сумма двух других!');
          break;
        }

        getAngles(usedSides, usedAngles, angles);
        getPerimeter(usedSides);
        getArea(usedSides, usedAngles);

        break;

      case 2:
        let usedAngle = Object.keys(usedAngles)[0];
        let usedAngleNumber = angles.indexOf(usedAngle);
        let oppositeSide = sides[usedAngleNumber];

        if (usedSides.hasOwnProperty(oppositeSide)) {

          printError('Угол рядом с неизвестной стороной');

        } else {

          getThirdSide(usedSides, usedAngles);
          getAngles(usedSides, usedAngles, angles, usedAngle);

        }

        getPerimeter(usedSides);
        getArea(usedSides, usedAngles);

        break;
      case 1:

        if (anglesHasErrors(usedAngles)) {
          printError('Введено некорректное значение угла!');
          break;
        }

        let sumUsedAngles = 0;
        for (let angle in usedAngles) {
          sumUsedAngles += usedAngles[angle];
        }

        if (sumUsedAngles <= 180) {

          let inputThirdAngle = document.querySelector('.angle:not(.used)');
          let thirdAngle = inputThirdAngle.id;

          usedAngles[thirdAngle] = 180 - sumUsedAngles;
          printValue(inputThirdAngle, usedAngles[thirdAngle]);

          let usedSide = Object.keys(usedSides)[0];
          let usedSideNumber = sides.indexOf(usedSide);

          for (let i = 0; i < sides.length; i++) {
            if (sides[i] != usedSide) {
              usedSides[sides[i]] = usedSides[usedSide] * Math.sin(usedAngles[angles[i]] * (Math.PI / 180)) / Math.sin(usedAngles[angles[usedSideNumber]] * (Math.PI / 180));
              printValue(document.getElementById(sides[i]), usedSides[sides[i]]);
            }
          }

          getPerimeter(usedSides);
          getArea(usedSides, usedAngles);

        } else {
          printError('Сумма двух углов больше 180°!');
        }
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

function sidesHasErrors(usedSides, sides) {
  for (let i = 0; i < sides.length; i++) {
    let a = Object.values(usedSides).slice(i - 2)[0];
    let b = Object.values(usedSides).slice(i - 1)[0];
    let c = Object.values(usedSides)[i];

    if (a > b + c) {
      return true;
    }
  }

  return false;
}

function anglesHasErrors(usedAngles) {
  for (let angle in usedAngles) {
    if (usedAngles[angle] <= 0 || usedAngles[angle] >= 180) {
      return true;
    }
  }

  return false;
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
  let inputPerimeter = document.getElementById('perimeter');

  let perimeter = 0;
  for (let value of Object.values(usedSides)) {
    perimeter += value;
  }

  printValue(inputPerimeter, perimeter);
}

function getArea(usedSides, usedAngles) {
  let inputArea = document.getElementById('area');

  let area = usedSides['side_a'] * usedSides['side_b'] * Math.sin(usedAngles['angle_c'] * (Math.PI / 180)) / 2;

  printValue(inputArea, area);
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
