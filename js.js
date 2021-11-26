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
        if (usedSides.side_a < usedSides.side_b + usedSides.side_c &&
          usedSides.side_b < usedSides.side_a + usedSides.side_c &&
          usedSides.side_c < usedSides.side_a + usedSides.side_b) {

          usedAngles.angle_a = (Math.acos((Math.pow(usedSides.side_b, 2) + Math.pow(usedSides.side_c, 2) - Math.pow(usedSides.side_a, 2)) / (2 * usedSides.side_b * usedSides.side_c)) * 180) / Math.PI;
          printValue(document.getElementById('angle_a'), usedAngles.angle_a);

          usedAngles.angle_b = (Math.acos((Math.pow(usedSides.side_a, 2) + Math.pow(usedSides.side_c, 2) - Math.pow(usedSides.side_b, 2)) / (2 * usedSides.side_a * usedSides.side_c)) * 180) / Math.PI;
          printValue(document.getElementById('angle_b'), usedAngles.angle_b);

          usedAngles.angle_c = 180 - (usedAngles.angle_a + usedAngles.angle_b);
          printValue(document.getElementById('angle_c'), usedAngles.angle_c);
          
          // for(let angle of angles) {
            // usedAngles[angle]=(Math.acos((Math.pow(usedSides.side_b, 2) + Math.pow(usedSides.side_c, 2) - Math.pow(usedSides.side_a, 2)) / (2 * usedSides.side_b * usedSides.side_c)) * 180) / Math.PI;
          // }

          getPerimeter(usedSides);
          getArea(usedSides, usedAngles);

        } else {
          cleanUnusedFields();
          alert('Длина одной из сторон больше, чем сумма двух других!!!');
        }
        break;

        // case 2:

        // break;
      case 1:
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

        }
        break;
      default:
        // document.getElementById('perimeter').value = 'Enter the value of at least one side!';
        // document.getElementById('perimeter').nextElementSibling.classList.add('active');
      }



    } else {

      // Enable all fields
      inputParameters.forEach(parameter => parameter.disabled = false);
      cleanUnusedFields();

    }

  }

};

function getPerimeter(sides) {
  let inputPerimeter = document.getElementById('perimeter');

  let perimeter = 0;
  for (let value of Object.values(sides)) {
    perimeter += value;
  }

  printValue(inputPerimeter, perimeter);
}

function getArea(sides, angles) {
  let inputArea = document.getElementById('area');
  
  let area = sides['side_a'] * sides['side_b'] * Math.sin(angles['angle_c'] * (Math.PI / 180)) / 2;

  printValue(inputArea, area);
}

function printValue(field, value) {
  field.value = +value.toFixed(2);
  field.nextElementSibling.classList.add('active');
}

function cleanUnusedFields() {
  document.querySelectorAll('input:not(.used)').forEach(input => input.value = '');
  document.querySelectorAll('input:not(.used)').forEach(input => input.nextElementSibling.classList.remove('active'));
}
